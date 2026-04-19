"""
MiniApp Order routes — receipt upload and order creation for the Mini App.
"""
from __future__ import annotations

import os
import uuid
import logging
from pathlib import Path

import aiohttp
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from config import BOT_TOKEN, ADMIN_IDS
from webapp.auth import get_current_user
import database as db

router = APIRouter(prefix="/orders", tags=["miniapp-orders"])
logger = logging.getLogger(__name__)

RECEIPT_DIR = Path("receipts")
RECEIPT_DIR.mkdir(exist_ok=True)


async def _send_receipt_to_admins(
    order_id: int,
    user_id: int,
    username: str,
    service_name: str,
    final_price: int,
    note: str,
    receipt_path: str,
):
    """Send receipt photo to all admin users via Telegram Bot API (direct HTTP)."""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"

    for admin_id in ADMIN_IDS:
        try:
            caption = (
                f"🔔 <b>Yangi buyurtma #{order_id} (MiniApp)</b>\n\n"
                f"👤 @{username} (<code>{user_id}</code>)\n"
                f"🛒 {service_name}\n"
                f"💰 {final_price:,} so'm\n"
                f"📝 {note or '—'}"
            )

            # Inline keyboard for admin actions
            keyboard = {
                "inline_keyboard": [
                    [
                        {"text": "✅ Tasdiqlash", "callback_data": f"confirm:{order_id}"},
                        {"text": "❌ Rad etish", "callback_data": f"reject:{order_id}"},
                    ],
                    [
                        {"text": "📎 Mijozga nima yuborasiz?", "callback_data": f"indiv:{order_id}"},
                    ],
                ]
            }

            import json
            async with aiohttp.ClientSession() as session:
                with open(receipt_path, "rb") as photo_file:
                    form = aiohttp.FormData()
                    form.add_field("chat_id", str(admin_id))
                    form.add_field("photo", photo_file, filename="receipt.jpg")
                    form.add_field("caption", caption)
                    form.add_field("parse_mode", "HTML")
                    form.add_field("reply_markup", json.dumps(keyboard))

                    resp = await session.post(url, data=form)
                    result = await resp.json()
                    if not result.get("ok"):
                        logger.warning(f"Failed to send receipt to admin {admin_id}: {result}")

        except Exception as e:
            logger.error(f"Error sending receipt to admin {admin_id}: {e}")


@router.post("/create")
async def create_miniapp_order(
    service_id: int = Form(...),
    payment_method: str = Form("manual"),
    note: str = Form(""),
    user: dict = Depends(get_current_user),
):
    """Create an order from the Mini App."""
    user_id = user["id"]
    username = user.get("username", "nomalum")

    # Get service info
    service = await db.get_service(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # Normalize service dict
    from handlers.user import normalize_service
    s = normalize_service(service)

    if s["stock"] == 0:
        raise HTTPException(status_code=400, detail="Out of stock")

    price = s["price"]
    final_price = price

    order_id = await db.create_order(
        user_id=user_id,
        service_id=service_id,
        service_name=s["name"],
        price=price,
        note=note,
        discount=0,
        final_price=final_price,
        coupon_code=None,
        bonus_used=0,
        quantity=1,
    )
    await db.decrease_stock(service_id, amount=1)

    return {
        "order_id": order_id,
        "service_name": s["name"],
        "final_price": final_price,
        "status": "pending",
    }


@router.post("/{order_id}/receipt")
async def upload_receipt(
    order_id: int,
    receipt: UploadFile = File(...),
    user: dict = Depends(get_current_user),
):
    """Upload payment receipt for an existing order."""
    user_id = user["id"]
    username = user.get("username", "nomalum")

    # Verify order belongs to this user
    order = await db.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not your order")

    # Validate file type
    if not receipt.content_type or not receipt.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted")

    # Save receipt temporarily
    ext = receipt.filename.split(".")[-1] if "." in (receipt.filename or "") else "jpg"
    filename = f"{order_id}_{uuid.uuid4().hex[:8]}.{ext}"
    receipt_path = RECEIPT_DIR / filename

    content = await receipt.read()
    if len(content) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    with open(receipt_path, "wb") as f:
        f.write(content)

    # Send to admin Telegram group
    await _send_receipt_to_admins(
        order_id=order_id,
        user_id=user_id,
        username=username,
        service_name=order["service_name"],
        final_price=order["final_price"],
        note=order.get("note", ""),
        receipt_path=str(receipt_path),
    )

    # Clean up file after sending (admin guruhda Telegramda saqlanadi)
    try:
        os.remove(receipt_path)
    except OSError:
        pass

    return {
        "ok": True,
        "order_id": order_id,
        "message": "Receipt sent to admin for review",
    }
