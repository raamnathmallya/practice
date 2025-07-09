from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import os
import time
import threading

from scraper import scrape_magnet_links
from tmdb_api import get_popular_movies, get_monthly_releases

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', handlers=[logging.FileHandler("logs/backend.log"), logging.StreamHandler()])
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# In-memory store for ongoing downloads
ongoing_downloads = {}

# Simulated download function
def simulate_download(download_id, movie_title, quality, file_path):
    logger.info(f"Starting simulated download for {movie_title} ({quality}).")
    progress = 0
    while progress < 100:
        time.sleep(1)  # Simulate download time
        progress += 10
        if progress > 100: # Cap at 100
            progress = 100
        ongoing_downloads[download_id]["progress"] = progress
        logger.info(f"Download {download_id} progress: {progress}%")

    ongoing_downloads[download_id]["status"] = "completed"
    # Simulate file creation
    with open(file_path, "w") as f:
        f.write(f"Simulated movie content for {movie_title} ({quality})")
    logger.info(f"Simulated download complete for {movie_title} ({quality}). File: {file_path}")

    # Remove from ongoing_downloads after a short delay to allow frontend to fetch final status
    time.sleep(5)
    del ongoing_downloads[download_id]

@app.get("/")
async def read_root():
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to Watch-Party Backend!"}

# Scraper API
@app.get("/api/v1/scrape")
async def scrape_movie(title: str):
    logger.info(f"Scrape request received for title: {title}")
    sources = scrape_magnet_links(title)
    return {"title": title, "sources": sources}

# TMDB API Endpoints
@app.get("/api/v1/movies/popular")
async def get_popular():
    movies = get_popular_movies()
    return {"movies": movies}

@app.get("/api/v1/movies/monthly-releases")
async def get_monthly():
    movies = get_monthly_releases()
    return {"movies": movies}

# Simulated Download API
@app.post("/api/v1/downloads")
async def start_download(magnet_link: str, quality: str):
    # Basic attempt to extract movie title from magnet link for simulation
    # In a real app, you'd parse the magnet link or fetch from TMDB based on info hash
    movie_title = "Unknown Movie" # Default
    if "dn=" in magnet_link:
        try:
            movie_title = magnet_link.split("dn=")[1].split("&")[0]
            movie_title = requests.utils.unquote(movie_title).replace('.', ' ').strip()
        except Exception as e:
            logger.warning(f"Could not extract title from magnet link: {e}")

    download_id = f"{movie_title}-{quality}"
    if download_id in ongoing_downloads:
        raise HTTPException(status_code=400, detail="Download already in progress.")

    media_dir = "../media"
    os.makedirs(media_dir, exist_ok=True)
    file_name = f"{movie_title.replace(' ', '_')}_{quality}.mp4"
    file_path = os.path.join(media_dir, file_name)

    ongoing_downloads[download_id] = {
        "movie_title": movie_title,
        "quality": quality,
        "progress": 0,
        "status": "downloading",
        "file_path": file_path,
        "magnet_link": magnet_link # Store magnet link for potential future use
    }

    # Start simulated download in a new thread
    threading.Thread(target=simulate_download, args=(download_id, movie_title, quality, file_path)).start()

    logger.info(f"Download initiated for {movie_title} ({quality}).")
    return {"message": "Download initiated", "download_id": download_id}

@app.get("/api/v1/downloads/status")
async def get_download_status():
    completed_movies = []
    # Scan media directory for completed files
    media_dir = "../media"
    if os.path.exists(media_dir):
        for filename in os.listdir(media_dir):
            if filename.endswith(".mp4"):
                # Extract movie_title and quality from filename
                parts = filename.replace(".mp4", "").split('_')
                quality = parts[-1]
                movie_title = " ".join(parts[:-1])
                completed_movies.append({
                    "movie_title": movie_title.replace('_', ' '),
                    "quality": quality,
                    "file_path": os.path.join(media_dir, filename),
                    "status": "completed"
                })

    return {
        "downloading": list(ongoing_downloads.values()),
        "completed": completed_movies
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)