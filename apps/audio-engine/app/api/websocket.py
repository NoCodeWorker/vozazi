from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import structlog

logger = structlog.get_logger()

router = APIRouter()


@router.websocket("/realtime")
async def websocket_realtime(websocket: WebSocket):
    """WebSocket endpoint for real-time audio streaming."""
    await websocket.accept()
    logger.info("WebSocket connection established")
    
    try:
        while True:
            data = await websocket.receive_text()
            # TODO: Process real-time audio data
            await websocket.send_text({"status": "received", "data": data})
    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
