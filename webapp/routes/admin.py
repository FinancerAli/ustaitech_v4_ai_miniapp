from fastapi import APIRouter, HTTPException
from webapp.schemas.admin import ProductCreate, ProductUpdate, PromoCreate, PromoUpdate, CouponCreate
import database

router = APIRouter(prefix="/admin", tags=["admin"])

# --- Products (Services) ---
@router.post("/services")
async def create_service(item: ProductCreate):
    sid = await database.add_service(
        name=item.name,
        description=item.description,
        price=item.price,
        category_id=item.category_id,
        image_file_id=item.image_file_id,
        delivery_content=item.delivery_content,
        stock=item.stock,
        description_ru=item.description_ru,
        stars_price=item.stars_price,
        supports_stars=item.supports_stars
    )
    return {"id": sid, "status": "created"}

@router.put("/services/{service_id}")
async def update_service_api(service_id: int, item: ProductUpdate):
    await database.update_service(
        service_id=service_id,
        name=item.name,
        description=item.description,
        price=item.price,
        description_ru=item.description_ru,
        stars_price=item.stars_price,
        supports_stars=item.supports_stars
    )
    if item.category_id is not None:
        await database.update_service_category(service_id, item.category_id)
    return {"id": service_id, "status": "updated"}

@router.delete("/services/{service_id}")
async def delete_service_api(service_id: int):
    await database.delete_service(service_id)
    return {"id": service_id, "status": "deleted"}

@router.put("/services/{service_id}/toggle")
async def toggle_service_api(service_id: int):
    await database.toggle_service(service_id)
    return {"id": service_id, "status": "toggled"}


# --- Promos (Hero Banner) ---
@router.post("/promos")
async def create_promo(item: PromoCreate):
    await database.add_promo(title=item.title, text=item.text, image_file_id=item.image_file_id, url=item.url)
    return {"status": "created"}

@router.put("/promos/{promo_id}")
async def update_promo_api(promo_id: int, item: PromoUpdate):
    await database.update_promo(promo_id, title=item.title, text=item.text, image_file_id=item.image_file_id, url=item.url)
    return {"id": promo_id, "status": "updated"}

@router.delete("/promos/{promo_id}")
async def delete_promo_api(promo_id: int):
    await database.delete_promo(promo_id)
    return {"id": promo_id, "status": "deleted"}

@router.get("/promos")
async def list_promos():
    return await database.get_promos()


# --- Coupons ---
@router.post("/coupons")
async def create_coupon(c: CouponCreate):
    cid = await database.add_coupon(c.code, c.discount_percent, c.max_uses, c.service_id, c.max_per_user)
    return {"id": cid, "status": "created"}

@router.put("/coupons/{coupon_id}")
async def update_coupon_api(coupon_id: int, c: CouponCreate):
    await database.update_coupon(coupon_id, c.code, c.discount_percent, c.max_uses, c.max_per_user, c.service_id)
    return {"id": coupon_id, "status": "updated"}

@router.delete("/coupons/{coupon_id}")
async def delete_coupon_api(coupon_id: int):
    await database.delete_coupon(coupon_id)
    return {"id": coupon_id, "status": "deleted"}

@router.get("/coupons")
async def list_coupons():
    return await database.get_all_coupons()
