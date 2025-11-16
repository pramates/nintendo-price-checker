# Nintendo Switch Price Checker - Example Project

This is a complete example project that implements:
- Backend (Node.js + Express) with SQLite
- Worker script to fetch prices (from unofficial Nintendo endpoints)
- Frontend (Next.js) basic UI
- Dockerfile and docker-compose to run services

**Notes**
- Nintendo endpoints used are unofficial; you may need to adjust parsing if Nintendo changes responses.
- This project is a starting point. You should test and adapt for production use (rate limiting, error handling, legal).
