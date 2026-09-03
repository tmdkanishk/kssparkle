# Backend phase (optional) — Meta CAPI / TikTok Events API / Catalog

Mobile SDK tracking is complete without backend changes. Coordinate with the OpenCart / backend team for:

1. **Meta Conversions API (CAPI)** — fire `Purchase` (and optionally other events) from the server on order completion, using the same `order_id` / `product_id` as the app for deduplication.
2. **TikTok Events API** — same pattern for server-side purchase confirmation (especially WebView payments: Tamara, Tabby, PayPal).
3. **Meta Commerce catalog feed** — product feed where catalog Product ID = OpenCart `product_id` (must match app `item_id` / `content_ids`).
4. **Webhook reliability** — payment provider webhooks (Tamara/Tabby/Moyasar) should mark orders paid and trigger server-side conversion events.

Shared identifiers (do not invent new IDs on the server):

- Product ID: OpenCart `product_id`
- Order ID: OpenCart `order_id`
- Currency: `SAR` (or active store currency code)
- Value: order grand total (numeric)

Until this phase ships, rely on the mobile SDK + purchase dedup in `purchaseDedup.js`.
