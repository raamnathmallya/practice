from fastapi import FastAPI
from .routers import auth, events

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(events.router, prefix="/events", tags=["events"])

@app.get("/")
def read_root():
    return {"message": "Psst.. Backend is running!"}
