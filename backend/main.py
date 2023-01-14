from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.appRoutes import router, eventRepository

app = FastAPI()

@app.on_event("shutdown")
def shutdown_db_client():
    eventRepository.disconnectDB()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)