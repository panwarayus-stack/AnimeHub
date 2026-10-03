#!/usr/bin/env python3
"""
Downloads Solo Leveling Season 1 Zip from Google Drive,
extracts all 12 episodes into /root/anime/solo-leveling/season1/,
and creates links in public/anime/solo-leveling/season1/.
"""
import urllib.request
import urllib.parse
import http.cookiejar
import re
import os
import sys
import zipfile
import shutil
import json
import time

FILE_ID = "14Oo0_LyWFvDeZTsR9KeMVGhwDu6Zb3YV"
TARGET_DIR = "/app/applet/public/anime/solo-leveling/season1"
DOWNLOAD_DIR = "/app/applet/downloads"
ZIP_PATH = os.path.join(DOWNLOAD_DIR, "solo_leveling_s01.zip")
STATUS_FILE = "/app/applet/downloads/download_status.json"

os.makedirs(TARGET_DIR, exist_ok=True)
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def write_status(stage, progress=0, total=0, speed="", message=""):
    try:
        with open(STATUS_FILE, "w") as f:
            json.dump({
                "stage": stage,
                "progress": progress,
                "total": total,
                "percent": round((progress / total * 100), 1) if total > 0 else 0,
                "speed": speed,
                "message": message,
                "updated_at": time.time()
            }, f)
    except Exception as e:
        print("Error writing status:", e)

def get_download_url(file_id):
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    init_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    req = opener.open(init_url)
    html = req.read().decode('utf-8', errors='ignore')

    match = re.search(r'action="([^"]+)"[^>]*method="get"', html)
    inputs = dict(re.findall(r'<input[^>]+name="([^"]+)"[^>]+value="([^"]*)"', html))

    if match and inputs:
        dl_url = match.group(1) + '?' + urllib.parse.urlencode(inputs)
        return opener, dl_url
    
    # Direct download link fallback
    return opener, f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"

def download_file(opener, dl_url, dest_path):
    print(f"Starting download to {dest_path}...")
    req = urllib.request.Request(dl_url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
    })
    
    # Check if existing partial file exists for resume
    downloaded = 0
    if os.path.exists(dest_path):
        downloaded = os.path.getsize(dest_path)
    
    head_resp = opener.open(req)
    total_length = int(head_resp.headers.get('Content-Length', 0))
    print(f"Total file size: {total_length} bytes ({total_length / (1024*1024*1024):.2f} GB)")

    write_status("downloading", 0, total_length, message=f"Starting download ({total_length / (1024*1024*1024):.2f} GB)...")

    # If partial file matches total length, skip download
    if downloaded == total_length and total_length > 0:
        print("File already downloaded completely!")
        write_status("downloaded", total_length, total_length, message="Download complete.")
        return

    # Download in 8MB chunks
    start_time = time.time()
    last_report_time = start_time
    bytes_since_report = 0
    
    with open(dest_path, "wb") as out_file:
        resp = opener.open(req)
        while True:
            chunk = resp.read(8 * 1024 * 1024)
            if not chunk:
                break
            out_file.write(chunk)
            downloaded += len(chunk)
            bytes_since_report += len(chunk)
            
            now = time.time()
            if now - last_report_time >= 3.0:
                elapsed = now - last_report_time
                mb_per_sec = (bytes_since_report / (1024 * 1024)) / elapsed
                speed_str = f"{mb_per_sec:.1f} MB/s"
                percent = (downloaded / total_length) * 100 if total_length else 0
                print(f"Downloaded: {downloaded / (1024*1024):.1f} MB / {total_length / (1024*1024):.1f} MB ({percent:.1f}%) at {speed_str}")
                write_status("downloading", downloaded, total_length, speed=speed_str, message=f"{percent:.1f}% ({downloaded / (1024*1024*1024):.2f}GB / {total_length / (1024*1024*1024):.2f}GB)")
                last_report_time = now
                bytes_since_report = 0

    print(f"Download complete! Saved to {dest_path}")
    write_status("downloaded", total_length, total_length, message="Download finished successfully.")

def extract_zip(zip_path, target_dir):
    print(f"Extracting {zip_path} to {target_dir}...")
    write_status("extracting", message="Extracting episode files...")
    
    with zipfile.ZipFile(zip_path, 'r') as zf:
        members = zf.infolist()
        total_files = len(members)
        print(f"Found {total_files} files inside zip.")
        
        extracted_episodes = []
        for idx, member in enumerate(members):
            filename = os.path.basename(member.filename)
            if not filename or filename.startswith('.') or not filename.lower().endswith(('.mkv', '.mp4', '.webm')):
                continue
            
            print(f"Extracting [{idx+1}/{total_files}]: {filename}...")
            zf.extract(member, target_dir)
            
            # Destination path in target_dir
            extracted_path = os.path.join(target_dir, member.filename)
            flat_target_path = os.path.join(target_dir, filename)
            
            if extracted_path != flat_target_path and os.path.exists(extracted_path):
                shutil.move(extracted_path, flat_target_path)
            
            extracted_episodes.append({
                "filename": filename,
                "localPath": flat_target_path,
                "streamUrl": f"/anime/solo-leveling/season1/{urllib.parse.quote(filename)}",
                "sizeBytes": os.path.getsize(flat_target_path) if os.path.exists(flat_target_path) else member.file_size
            })
            
            write_status("extracting", idx + 1, total_files, message=f"Extracted {filename}")

    # Sort episodes by name
    extracted_episodes.sort(key=lambda x: x["filename"])
    
    with open(os.path.join(target_dir, "episodes.json"), "w") as f:
        json.dump(extracted_episodes, f, indent=2)
        
    print(f"Successfully extracted {len(extracted_episodes)} episodes!")
    write_status("ready", total_files, total_files, message=f"Ready! {len(extracted_episodes)} episodes extracted.")
    return extracted_episodes

if __name__ == "__main__":
    try:
        write_status("initializing", message="Connecting to Google Drive...")
        opener, dl_url = get_download_url(FILE_ID)
        download_file(opener, dl_url, ZIP_PATH)
        extract_zip(ZIP_PATH, TARGET_DIR)
        print("ALL OPERATIONS FINISHED SUCCESSFULLY!")
    except Exception as e:
        print("Error during execution:", e)
        write_status("error", message=str(e))
        sys.exit(1)
