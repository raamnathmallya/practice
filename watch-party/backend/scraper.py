import requests
from bs4 import BeautifulSoup
import logging
from pyYify import Yify

logger = logging.getLogger(__name__)

def scrape_1337x(movie_title: str):
    base_url = "https://1337x.to"
    search_url = f"{base_url}/search/{movie_title}/1/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    sources = []

    try:
        logger.info(f"Scraping 1337x for: {movie_title}")
        response = requests.get(search_url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find torrent list
        # This selector might need adjustment if 1337x changes its HTML structure
        torrent_rows = soup.select('tbody tr')

        for row in torrent_rows:
            title_element = row.select_one('.name a:nth-child(2)')
            if not title_element:
                continue

            title = title_element.get_text(strip=True)
            detail_page_link = base_url + title_element['href']

            # Extract quality from title (simple heuristic)
            quality = "Unknown"
            if "2160p" in title.lower() or "4k" in title.lower():
                quality = "4K"
            elif "1080p" in title.lower():
                quality = "1080p"
            elif "720p" in title.lower():
                quality = "720p"
            elif "480p" in title.lower():
                quality = "480p"

            # Fetch magnet link from detail page
            try:
                detail_response = requests.get(detail_page_link, headers=headers, timeout=10)
                detail_response.raise_for_status()
                detail_soup = BeautifulSoup(detail_response.text, 'html.parser')
                magnet_link_element = detail_soup.select_one('.magnet a')
                if magnet_link_element and 'href' in magnet_link_element.attrs:
                    magnet_link = magnet_link_element['href']
                    sources.append({
                        "title": title,
                        "quality": quality,
                        "magnet": magnet_link,
                        "source": "1337x"
                    })
            except requests.exceptions.RequestException as e:
                logger.warning(f"Could not fetch detail page for {title} from 1337x: {e}")
            except Exception as e:
                logger.warning(f"Error parsing detail page for {title} from 1337x: {e}")

    except requests.exceptions.RequestException as e:
        logger.error(f"Error accessing 1337x: {e}")
    except Exception as e:
        logger.error(f"Error scraping 1337x: {e}")
    
    return sources

def scrape_yts_with_pyyify(movie_title: str):
    logger.info(f"Scraping YTS with pyYify for: {movie_title}")
    sources = []
    try:
        yify = Yify()
        movies = yify.search_movie(movie_title)
        if movies:
            for movie in movies:
                # pyYify returns torrents for each movie
                for torrent in movie['torrents']:
                    sources.append({
                        "title": movie['title'],
                        "quality": torrent['quality'],
                        "magnet": torrent['magnet'],
                        "source": "YTS (pyYify)"
                    })
    except Exception as e:
        logger.error(f"Error scraping YTS with pyYify: {e}")
    return sources

def scrape_magnet_links(movie_title: str):
    all_sources = []
    
    # Try pyYify first for YTS
    yts_pyyify_sources = scrape_yts_with_pyyify(movie_title)
    if yts_pyyify_sources:
        all_sources.extend(yts_pyyify_sources)
    
    # If pyYify didn't return anything, try 1337x as a fallback
    if not all_sources:
        all_sources.extend(scrape_1337x(movie_title))
    
    return all_sources
