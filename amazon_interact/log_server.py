"""
Fragrance Lab — combined static file server + search logger
============================================================
Run from the amazon_interact folder:

    python log_server.py

Then open:  http://localhost:8000/fragrance-lab.html

Every time a user clicks "Find Me a Fragrance" a row is appended to
search_log.csv in the same folder.

Columns
-------
id                  Auto-incrementing primary key (starts at 1)
timestamp           Local datetime of the search (YYYY-MM-DD HH:MM:SS)
ip_address          Client IP address (LAN IP for network users)
respondent_sex      M / F (or blank if skipped)
respondent_age      Numeric age (or blank if skipped)
fragrance_gender    masculine / feminine / unisex
top_note            Selected top note
middle_note         Selected middle note
base_note           Selected base note
time_on_page_sec    Seconds elapsed from page load to clicking Find Me a Fragrance
"""

import csv
import json
import os
import threading
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handles each request in a separate thread."""
    daemon_threads = True

LOG_FILE   = "search_log.csv"
LOG_FIELDS = [
    "id", "timestamp", "ip_address",
    "respondent_sex", "respondent_age",
    "fragrance_gender", "top_note", "middle_note", "base_note",
    "time_on_page_sec",
]
PORT = 8000

# Thread lock so concurrent requests don't corrupt the CSV
_lock = threading.Lock()


def next_id() -> int:
    """Return the next primary-key value by counting existing data rows."""
    if not os.path.exists(LOG_FILE):
        return 1
    with open(LOG_FILE, newline="", encoding="utf-8") as f:
        # header is line 1, so line count == next id
        return max(1, sum(1 for _ in f))


def append_row(data: dict, ip: str) -> int:
    """Append one row to search_log.csv, creating the file/header if needed."""
    with _lock:
        write_header = not os.path.exists(LOG_FILE) or os.path.getsize(LOG_FILE) == 0
        pk = next_id()
        row = {
            "id":                pk,
            "timestamp":         datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ip_address":        ip,
            "respondent_sex":    data.get("respondent_sex",   ""),
            "respondent_age":    data.get("respondent_age",   ""),
            "fragrance_gender":  data.get("fragrance_gender", ""),
            "top_note":          data.get("top_note",         ""),
            "middle_note":       data.get("middle_note",      ""),
            "base_note":         data.get("base_note",        ""),
            "time_on_page_sec":  data.get("time_on_page_sec", ""),
        }
        with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=LOG_FIELDS)
            if write_header:
                writer.writeheader()
            writer.writerow(row)
        return pk


def read_log() -> list:
    """Return all rows from search_log.csv as a list of dicts."""
    if not os.path.exists(LOG_FILE) or os.path.getsize(LOG_FILE) == 0:
        return []
    with _lock:
        with open(LOG_FILE, newline="", encoding="utf-8") as f:
            return list(csv.DictReader(f))


class FragranceHandler(SimpleHTTPRequestHandler):
    """Serves static files for everything except POST /log and GET /data."""

    def do_GET(self):
        if self.path == "/data":
            rows = read_log()
            resp = json.dumps(rows).encode()
            self.send_response(200)
            self.send_header("Content-Type",   "application/json")
            self.send_header("Content-Length", str(len(resp)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(resp)
        else:
            super().do_GET()

    def do_POST(self):
        if self.path != "/log":
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        body   = self.rfile.read(length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
            return

        # IP is read directly from the TCP connection — reliable and unfakeable
        # from the browser side. For users behind a home router this will be
        # their LAN IP (e.g. 192.168.x.x); for internet deployments use the
        # X-Forwarded-For header instead.
        ip = self.client_address[0]

        pk = append_row(data, ip)
        print(f"[LOG] Row {pk} | IP: {ip} | time: {data.get('time_on_page_sec', '?')}s | {data}")

        resp = json.dumps({"ok": True, "id": pk}).encode()
        self.send_response(200)
        self.send_header("Content-Type",   "application/json")
        self.send_header("Content-Length", str(len(resp)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(resp)

    def do_OPTIONS(self):
        """Allow preflight CORS requests (not usually needed for localhost)."""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin",  "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def log_message(self, fmt, *args):
        # Suppress verbose GET noise; POST lines are printed above
        if self.command == "POST":
            super().log_message(fmt, *args)


if __name__ == "__main__":
    server = ThreadedHTTPServer(("", PORT), FragranceHandler)
    print(f"Fragrance Lab server running at http://localhost:{PORT}/fragrance-lab.html")
    print(f"Search data will be saved to: {os.path.abspath(LOG_FILE)}")
    print("Press Ctrl+C to stop.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
