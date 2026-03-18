from fastapi import APIRouter

router = APIRouter()

# Import all API modules
from . import health
from . import audio
from . import websocket
from . import mcp
