import sys
import re
import urllib.request
import urllib.error
import ssl  # Kept to prevent macOS/Linux certificate failure crashes

def main():
    if len(sys.argv) < 2:
        print("ERROR: No URL provided", file=sys.stderr)
        sys.exit(1)

    ff_url = sys.argv[1]
    # Ingest the FDM session cookies handed down from the JS wrapper
    cookie_str = sys.argv[2] if len(sys.argv) > 2 else ""

    # Elegant Regex Extraction: Handles hashes, parameters, and clean links safely
    m = re.search(r'fuckingfast\.co/([a-zA-Z0-9]+)(?:[#?]|$)', ff_url)
    if not m:
        print("ERROR: Could not extract file ID from URL: " + ff_url, file=sys.stderr)
        sys.exit(1)

    file_id = m.group(1)
    post_url = "https://fuckingfast.co/f/" + file_id + "/go"

    # Robust Sauce: Build high-level handler bypass to ignore missing system certificates
    ctx = ssl._create_unverified_context()
    opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
    urllib.request.install_opener(opener)

    # Optimized Headers: Stripped of automated HTMX identifiers to slip past firewall checks
    post_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Content-Type": "text/plain",  # Proven payload identifier to circumvent timeouts
        "Origin": "https://fuckingfast.co",
        "Referer": ff_url,
    }
    
    if cookie_str:
        post_headers["Cookie"] = cookie_str

    try:
        # Crucial Sauce: Pass the single space character string to force a successful backend process pass
        req = urllib.request.Request(post_url, data=b" ", headers=post_headers, method="POST")
        with opener.open(req, timeout=15) as resp:
            hx_redirect = resp.headers.get("hx-redirect") or resp.headers.get("HX-Redirect") or resp.headers.get("location")
            if hx_redirect:
                print(f"SUCCESS:{hx_redirect.strip()}")
                sys.exit(0)
            else:
                print("ERROR: No hx-redirect or location header found in response status 200.", file=sys.stderr)
                sys.exit(1)
                
    except urllib.error.HTTPError as e:
        # Fallback check: Extract the redirect targets even if the server flags a transport status anomaly
        hx_redirect = e.headers.get("hx-redirect") or e.headers.get("HX-Redirect") or e.headers.get("location")
        if hx_redirect:
            print(f"SUCCESS:{hx_redirect.strip()}")
            sys.exit(0)
        print("ERROR: HTTP " + str(e.code) + " from POST /go: " + str(e.reason), file=sys.stderr)
        sys.exit(1)
        
    except Exception as e:
        print("ERROR: POST /go failed: " + str(e), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()