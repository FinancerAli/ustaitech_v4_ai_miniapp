from pydantic import BaseModel
from typing import Optional, List

# Product (Service) Schemas
class ProductCreate(BaseModel):
    name: str
    description: str
    price: int
    category_id: Optional[int] = None
    image_file_id: Optional[str] = None
    delivery_content: Optional[str] = None
    stock: Optional[int] = 0
    description_ru: Optional[str] = None
    stars_price: Optional[int] = 0
    supports_stars: Optional[int] = 0

class ProductUpdate(BaseModel):
    name: str
    description: str
    price: int
    description_ru: Optional[str] = None
    stars_price: Optional[int] = 0
    supports_stars: Optional[int] = 0
    category_id: Optional[int] = None

class ProductResponse(ProductCreate):
    id: int
    active: int

# Promo (Hero Banner) Schemas
class PromoCreate(BaseModel):
    title: str
    text: str
    image_file_id: Optional[str] = None
    url: Optional[str] = None

class PromoUpdate(PromoCreate):
    pass

class PromoResponse(PromoCreate):
    id: int

# Coupon (PromoCode) Schemas
class CouponCreate(BaseModel):
    code: str
    discount_percent: int
    max_uses: int
    max_per_user: Optional[int] = 1
    service_id: Optional[int] = None

class CouponResponse(CouponCreate):
    id: int
    used_count: int
    is_active: int
