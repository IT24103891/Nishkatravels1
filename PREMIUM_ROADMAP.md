# Nishaka Private Tours — Premium roadmap

Audit date · 21 November 2026

The product should help an international visitor discover places, judge whether a private-driver itinerary is realistic, and send Nishaka a draft he can quote. The official tourism site is a reference for destination coverage. Nishaka’s experience centers on personal itinerary decisions and direct enquiries.

## Current implementation

| Area | Status | Evidence and remaining gap |
| --- | --- | --- |
| Homepage and navigation | Complete and working | Localized navigation, mobile disclosure, destination stories and calls to action are in place. |
| Scroll animation and Sigiriya hero | Complete and working | Motion powers reveals and parallax. The hero has Colombo time, a timeline, animated sun and moon, stars and reduced-motion handling. |
| Discovery map and destination cards | Complete and working | MapLibre and an island fallback connect nine curated cards to the saved planner. Discovery prevents duplicate additions and lets visitors choose a day. |
| Day-by-day builder and local saving | Complete and working | Stops can be reordered, moved and removed. Drafts are restored across locale navigation on the same browser. Separate browsers have separate drafts. |
| Travel style quiz | Complete and working | Recommendations merge into the draft with stable IDs. Dates, vehicle and budget inputs are retained. |
| Feasibility assistant | Partially implemented | Flags crowded days and uses actual provider durations when available. Reorder and replacement suggestions use map geometry and have no comparative road verification. |
| Road routing | Requires external configuration | The server route uses OpenRouteService. The audited environment has no configured key. The public endpoint has waypoint validation and a timeout. It lacks application-level quota controls and persistent caching. |
| Illustrative budget and vehicle selection | Complete and working | Editable sample rates, totals and car/van choice exist. Capacity checks depend on approved specs. |
| Vehicle media and business evidence | Partially implemented | The van has an actual exterior image. The private car model and image, both vehicles’ confirmed capacities, interior media and footage are missing. The review is pending publication approval. |
| Five languages | Complete and working | English, Japanese, Simplified Chinese, Hindi and Tamil routes and matching message dictionaries are present. A native-language editorial review remains valuable. |
| WhatsApp enquiry | Requires external configuration | Contact and planner generate bilingual messages with an English summary. The audited environment has no business destination number, so live handoff is disabled. |
| Destination pages | Missing | Discovery cards link to related tours. There are no standalone localized destination pages or destination sitemap entries. |
| SEO, accessibility and performance | Partially implemented | Localized metadata, sitemap generation, structured data, accessible navigation and optimized images are present. With no public site URL, robots disallows indexing and the sitemap is empty. Device-level performance and manual accessibility coverage remain open. |

## Ranked improvements

| Rank | Improvement | Customer value | Complexity | Dependency |
| --- | --- | --- | --- | --- |
| 1 | Enable and verify WhatsApp handoff and production indexing | Very high | Low | Confirmed business number and public domain |
| 2 | Enable real road checks and protect routing quota | Very high | Medium | Server-side routing key and quota policy |
| 3 | Publish authenticated vehicle and review evidence | High | Low to medium | Approved assets, specifications and review permission |
| 4 | Publish localized destination pages with planner links | High | Medium to high | Approved destination copy and permitted media |
| 5 | Compare suggested itinerary changes using routed durations | Medium to high | Medium to high | Reliable route checks and request budget |
| 6 | Improve mobile and accessibility regressions identified in QA | High | Medium | Device and assistive-technology checks |

## Phases

1. **Launch readiness.** Verify WhatsApp end to end with owned test data, set the production URL and verify crawl directives and localized canonicals. Configure road routing with separate staging credentials and quota protection. Publish supplied trust assets as they are approved.
2. **Destination-to-planner journey.** Build localized pages from the nine discovery destinations with focused editorial copy, source credits, metadata, sitemap entries and one action to continue planning with the destination selected. Verify draft persistence through any new navigation.
3. **Planning confidence.** Compare current and proposed driving routes on demand where the provider can calculate both. Keep geographic suggestions available when routing is unavailable. Test keyboard, screen reader, reduced-motion, low-bandwidth and mobile behavior across the homepage and planner. Use findings to prioritize measured performance changes.

## Next three tasks for approval

1. Configure the confirmed WhatsApp number and live HTTPS domain. Verify the complete itinerary and English summary on the handoff, and check the production sitemap and robots response.
2. Configure OpenRouteService server-side and add request limits or caching before exposing it to public traffic. Verify valid routes, timeouts, provider errors, and rechecks after itinerary edits.
3. Collect and publish actual car and van exterior and interior media, verified capacities and approved review material. Keep availability and pricing language tied to business confirmation.
