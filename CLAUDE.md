# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Real-time bus monitoring application for Rio de Janeiro (BRT and SPPO lines). Displays moving vehicle markers on a Leaflet map with filtering capabilities. Data is sourced from `dados.mobilidade.rio` GPS APIs.

## Development Commands

- `npm run dev` - Start Vite dev server (localhost:5173)
- `npm run build` - Production build to `dist/`
- `npm run lint` - ESLint with `--max-warnings 0`

## Architecture

### Data Flow
```
GPSProvider (getGPS.jsx)
  └─> Fetches every 60s from /api/brt and /api/sppo
      └─> API endpoints (api/brt.js, api/sppo.js) proxy dados.mobilidade.rio
          └─> MovingMarkerProvider (getMovingMarkers.jsx)
              └─> Filters by Rio polygon boundary, removes duplicates
                  └─> App.jsx renders MapContainer with markers
```

### Context Providers (nested in main.jsx)
1. **GPSProvider** - Fetches raw GPS data, provides `realtimeBrt` and `realtimeSPPO`
2. **MovingMarkerProvider** - Filters data by geographic polygon (Rio de Janeiro boundary), deduplicates, provides `tracked` and `trackedSPPO`

### Key Components
- `MovingMarkersBRT.jsx` / `MovingMarkerSPPO.jsx` - Animated bus markers on map
- `table/` and `tableBRT/` - Filter tables for selecting bus lines
- `polygon/holes.js` - WKT polygon defining Rio de Janeiro boundary for filtering

### Geographic Filtering
- BRT buses filtered by: polygon boundary + lat/long bounds + codigo prefix (90, E90, 70)
- SPPO buses filtered by: polygon boundary + lat/long bounds + ordem prefix (B51, C51)
- Coordinates use @turf/turf for point-in-polygon checks

## Deployment

### Vercel (dev/testing)
- `vercel.json` rewrites all routes to `index.html` for SPA routing
- API routes in `api/` directory become serverless functions

### Kubernetes Production
- Multi-stage Dockerfile: node:18-alpine build → nginx:stable-alpine serve
- Push to `main` or `devops` branches triggers `.github/workflows/cd-prod.yaml`
- Kustomize in `k8s/prod/` manages image tags
- Deployed to GKE with 6 replicas, TLS via cert-manager

## API Endpoints (Proxy Functions)

- `GET /api/brt` - Proxies `https://dados.mobilidade.rio/gps/brt`
- `GET /api/sppo?dataInicial=...&dataFinal=...` - Proxies SPPO GPS with date range query params
- Both return `Access-Control-Allow-Origin: *`

## Notes

- Map tiles: CartoDB Voyager via CartoCDN
- SPPO uses comma-separated lat/long strings, BRT uses floats
- Date formatting for SPPO API: `yyyy-MM-dd+HH:mm:ss` (date-fns format)
