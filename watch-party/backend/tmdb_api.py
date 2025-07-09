import requests
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

TMDB_API_KEY = "7ff7c360f0c27335e0c308e54c7d16a8" # TODO: Make this configurable
TMDB_BASE_URL = "https://api.themoviedb.org/3"

def get_popular_movies():
    logger.info("Fetching popular movies from TMDB.")
    url = f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}&language=en-US&page=1"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()['results']
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching popular movies from TMDB: {e}")
        return []

def get_monthly_releases():
    logger.info("Fetching monthly releases from TMDB.")
    today = datetime.now()
    year = today.year
    month = today.month
    
    # TMDb uses YYYY-MM-DD format for dates
    start_date = f"{year}-{month:02d}-01"
    end_date = f"{year}-{month:02d}-{today.day:02d}"

    url = f"{TMDB_BASE_URL}/discover/movie?api_key={TMDB_API_KEY}&language=en-US&sort_by=primary_release_date.desc&primary_release_date.gte={start_date}&primary_release_date.lte={end_date}&page=1"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()['results']
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching monthly releases from TMDB: {e}")
        return []
