# OpenSauce Schedule Extraction

This repository was intended to use Playwright to fetch the schedule from https://opensauce.com/agenda/ for Friday, Saturday, and Sunday.

Initially the environment was missing several system packages required by the Playwright browsers. After installing those dependencies and running `playwright install`, Chromium downloaded correctly. Because the site's certificate is not recognized the scraper launches the browser with `ignore_https_errors=True`.

The script now visits `https://opensauce.com/agenda/` and clicks through the Friday, Saturday and Sunday tabs to extract the full agenda. The resulting data is saved to `opensauce_schedule.json` in structured form.
