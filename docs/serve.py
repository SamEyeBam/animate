"""Serve the animation app with direct preset URLs (no dependencies)."""

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        url = urlsplit(self.path)
        target = Path(self.translate_path(url.path))
        # Only single-segment routes are preset names; missing assets stay 404s.
        name = url.path.strip('/')
        if name and '/' not in name and not target.exists():
            if url.path.endswith('/'):
                self.send_response(307)
                self.send_header('Location', url.path.rstrip('/') + ('?' + url.query if url.query else ''))
                self.end_headers()
                return None
            self.path = '/index.html'
        return super().send_head()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=5501)
    args = parser.parse_args()
    server = ThreadingHTTPServer(('localhost', args.port), Handler)
    print(f'Animation app: http://localhost:{args.port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
