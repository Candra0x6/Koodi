Partial prerendering + streaming shells
Pages render a static shell at build/deploy time and then stream dynamic data in. That lets the site show a usable UI immediately while data hydrates.
Pre-rendered routes (generateStaticParams)
Many routes are statically generated so they can be served instantly from the edge/CDN instead of hitting the DB on every request.
Query caching on the server
Database queries are wrapped with an in-app cache utility (unstable_cache) with explicit revalidate TTLs (example: subcategory products cached for 2 hours). That avoids repeated DB hits for hot queries.
Edge / CDN caching for APIs
API responses set Cache-Control headers (examples: search cached for 10 minutes; image-prefetch results cached for an hour) so repeated client requests are served from cache/CDN.
Server-side DB access that’s optimized for serverless
The app uses a serverless-friendly DB client (Drizzle over a Neon serverless Postgres client) designed for low-latency, pooled/HTTP-style connections in serverless environments.
Selective image loading and prefetching
The UI uses Next/Image with eager loading for the first N images and lazy for the rest, plus a client-side prefetchImages flow that fetches and parses image URLs ahead of navigation (fetch with low priority). Images themselves are stored on Vercel Blob and served via the edge/CDN.
Link prefetching and client preloads
Links set prefetch where appropriate so the browser or platform fetches data/assets before navigation.
Efficient server components usage
Because many components run on the server, HTML is rendered with data before sending to the client, reducing round-trips and JS runtime work on the client.
Evidence from the codebase (what implements each piece)

README and code mention Next.js 15, partial prerendering and server actions.
getProductsForSubcategory uses unstable_cache with a revalidate TTL.
API routes set Cache-Control headers (search: max-age=600; prefetch-images: max-age=3600).
generateStaticParams is used to pre-generate collection routes.
Prefetch-images endpoint fetches and parses the page to return image src/srcset and is used by a client prefetchImages function (priority: "low").
First N product images are rendered with loading="eager" while others are lazy-loaded.
DB layer uses drizzle + a Neon serverless client (neon-http), which is tuned for serverless deployments.