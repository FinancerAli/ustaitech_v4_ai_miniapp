from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from webapp.routes.catalog import router as catalog_router
from webapp.routes.profile import router as profile_router
from webapp.routes.orders import router as orders_router

app = FastAPI(
    title="UstAiTech Mini App API",
    version="0.1.0",
)

# CORS for Mini App frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catalog_router, prefix='/api')
app.include_router(profile_router, prefix='/api')
app.include_router(orders_router, prefix='/api')


@app.get("/health")
async def health():
    return {
        "ok": True,
        "service": "ust_ai_tech_miniapp_api",
    }
