"""Resolve a local Chromium browser without platform-specific paths."""
import os
import shutil

def launch_browser(playwright):
    requested = os.environ.get('VCX_BROWSER')
    executable = requested or next((shutil.which(name) for name in ['microsoft-edge', 'chromium', 'chromium-browser', 'google-chrome'] if shutil.which(name)), None)
    return playwright.chromium.launch(**({'executable_path': executable} if executable else {}), headless=True)
