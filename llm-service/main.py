import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse

load_dotenv(dotenv_path="../.env")

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"{os.environ.get("FRONTEND_ADRESS")}"],
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.post("/fetch")
def run_agent():
    print("Hello from llm-service!")