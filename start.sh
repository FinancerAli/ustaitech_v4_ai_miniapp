#!/bin/bash
# Start Telegram bot in the background
python bot.py &

# Start FastAPI app in the foreground
uvicorn webapp.app:app --host 0.0.0.0 --port ${PORT:-10000}
