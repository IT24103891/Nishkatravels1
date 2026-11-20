# Nishaka Private Tours

A Next.js App Router website for private tours and transport in Sri Lanka. Tour durations, routes and inclusions are illustrative.

## Local preview

Requires Node.js 20.9 or later.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Visit http://localhost:3000. Use an international WhatsApp number with digits only, including the country code, in `NEXT_PUBLIC_WHATSAPP_NUMBER`. Leave it blank to keep live WhatsApp actions disabled. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS site origin when available. Canonicals and sitemap entries use that origin. Crawling is disabled while the origin is blank. Restart development or redeploy after changes.

```powershell
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

## Update content and photos

- Business and social links are in `src/lib/business.ts`.
- Sample tours, destinations, FAQs and the pending testimonial are in `src/data`.
- Photo paths and alt text are in `src/data/photos.ts`. The destination visuals are generated illustrations. Replace the local images under `public/images` and update their descriptive alt text and the photo credits when replacing assets.
- Before launch, confirm the business WhatsApp number, domain, seating and luggage capacity, any documented vehicle features and guide credentials. Provide clean, approved portrait and vehicle photos, approved review text and guest images with publication permission. Confirm the itineraries and inclusions you intend to offer.

## Deploy to Vercel

Push the project to a Git repository and import it into Vercel using the Next.js preset. Add the two environment variables in the Vercel project settings for the appropriate environments. Connect the production domain and redeploy after setting its URL. Open the deployed Contact page and send an enquiry only when you are ready to contact the configured account. Check the production sitemap, robots file and canonical tags.


## Trip planner

Visit `/trip-planner` to build and save a draft in the current browser. OpenFreeMap provides the default basemap without an API key. The island overview uses public-domain Natural Earth data and stays available if the detailed tiles or WebGL cannot load.

To enable optional road routing, set the server-only `OPENROUTESERVICE_API_KEY` in `.env.local` or the Vercel project environment, then restart development or redeploy. The browser sends only curated stop IDs to the same-origin routing endpoint. Only confirmed provider geometry is drawn, and drive times are estimates without traffic or breaks. Review the routing provider quota before making the route endpoint public.

Sample USD rates and the daily driving warning threshold are editable in `src/data/planner.ts`. The planner uses the same WhatsApp number as the existing contact form.

## Website languages

The site supports English, Japanese, Simplified Chinese, Hindi, and Tamil with next-intl. English is the default for unprefixed URLs. The language selector keeps the current path, query parameters and section links. Planner drafts share the same browser storage key across all five languages.

Translation dictionaries live in `messages/`. Look up a phrase in `messages/en.json` and edit its corresponding entry in each locale file. Keep ICU variables such as `{day, number}` intact. The site's translation dictionaries are bundled locally. The localized sitemap uses `NEXT_PUBLIC_SITE_URL` for absolute links.

## Private transport and vehicle media

Edit `src/data/vehicles.ts` to maintain the illustrative daily USD rate for each ride. Set capacity fields only after confirming the number of passengers (excluding the driver) and standard suitcases. Older planner drafts default to the van and keep any edited transport rate. Visitors can edit and save separate rates for each ride.

Place approved exterior, interior and scenic-driving videos, posters and WebVTT captions under `public/videos/vehicles/van/` or `public/videos/vehicles/car/`. See `public/videos/vehicles/README.md` for the asset names and configuration. The vehicle pages currently use the existing van photo and a clearly marked photo placeholder for the car.

## Sigiriya hero atmosphere

The homepage uses one Sigiriya illustration with moving celestial bodies and layered lighting. Auto follows Asia/Colombo time and calculates local sunrise and sunset with SunCalc. The timeline saves a manually chosen time in the browser. Play previews the full day in about 20 seconds. Visitors using reduced motion or low-powered devices can scrub through still scenes.

## Sri Lanka Discovery Map

The discovery map is part of the trip planner at /en/trip-planner#planner-map and is available in each site language. It uses the same locally saved itinerary as the day editor. Quick map editing retains direct map edits and the additional planner stops.

The default vector style uses OpenFreeMap with OpenStreetMap and OpenMapTiles attribution. No tile key is required. To use another provider, set NEXT_PUBLIC_MAP_STYLE_URL to a public MapLibre style URL with attribution on its sources and follow that provider's terms and usage limits. Keep private credentials server-side. If detailed tiles or WebGL are unavailable, the island overview and destination picker keep working. OPENROUTESERVICE_API_KEY enables the existing on-demand road routing. Without it, the map shows markers and the itinerary remains editable.
