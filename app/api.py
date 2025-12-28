""" Controller API for communication throughout the application """

from concurrent.futures import ThreadPoolExecutor
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import health, calculation
from config.documentation import DESCRIPTION, APP_VERSION
from config.logging_config import create_logger


""" Logging Function """

Logger = create_logger()
Logger.info("=> Logging initialized.")


""" Multithreading Option """

executor = ThreadPoolExecutor(1)
Logger.info("=> Thread Pool established.")


""" API """

app = FastAPI(
    title="React+FastAPI",
    version=APP_VERSION,
    contact={
        "name": "Yannick Ciomer",
        "email": ""
    },
    summary="React Frontend with a FastAPI for handling the Facility Location Problem.",
    description=DESCRIPTION
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)

app.include_router(health.router)
app.include_router(calculation.router)


""" Testing """

if __name__ == "__main__":
    # Terminal: uvicorn app.api:app --reload --host 0.0.0.0 --port 8001
    Logger.info("=> Running React+FastAPI.")
    uvicorn.run("api:app", reload=True, port=8001)
