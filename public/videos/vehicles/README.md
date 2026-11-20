# Vehicle footage

Place approved local assets in `van/` and `car/`. Each ride supports `exterior`, `interior`, and `scenic-driving` clips.

For each clip, add an MP4 (H.264 recommended), a WebM, or both. Also add a real poster JPG/WebP, and a WebVTT caption track. Suggested names are `exterior.mp4`, `exterior.webm`, `exterior-poster.jpg`, and `exterior.en.vtt`. Use `.ja.vtt`, `.zh.vtt`, `.hi.vtt`, and `.ta.vtt` for translated tracks.

Wire each approved asset into `src/data/vehicles.ts` using a URL such as `/videos/vehicles/van/exterior.mp4`. Supply poster alt text, plus translations for it in the site dictionaries. Keep the unused clip slots empty. Use `footage: "actual"` for verified vehicle footage or `footage: "concept"` for AI-generated exterior or scenery. Interior entries accept verified footage only. Set `decorative: true` only when a silent looping preview is appropriate. Video controls remain available to visitors.

