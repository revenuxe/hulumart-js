# Used-items e-commerce conversion plan

## Outcome

Convert Zapiboo from event decoration bookings into a used-items store while
keeping the current UI language: typography, gradients, cards, navigation,
responsive layouts, cart and account shell. Only event/balloon content,
workflows and images change.

## Non-negotiable rules

- Keep existing `bookings`, booking items, vendor data and balloon data as
  historical, read-only data; do not repurpose them for retail orders.
- Every new purchase uses separate `orders`, `order_items`, payment and
  fulfilment records.
- A one-off used item always has stock quantity `1`, displays “Only 1
  available”, and has no quantity increment above one.
- Preserve an order-item snapshot of title, images, condition, warranty,
  contents and price so later product edits cannot alter past orders.
- Remove every active balloon palette, event date/venue, decorator quote and
  decoration add-on control. Deprecate their database fields in the first
  release rather than deleting historic data.
- Payments are verified server-side through gateway webhooks; a browser can
  never set an order to paid.

## Customer-facing design

| Surface | New behaviour |
| --- | --- |
| Home and categories | Retain the current hierarchy, but use used-item categories and imagery. Offer category, condition, price, brand, age, warranty and availability filters. |
| Listing card | Photo, title, selling/compare price, condition badge, age/use summary, warranty badge, availability and delivery/pickup badge. Show Sold when stock is zero. |
| Product detail | Keep the gallery and attractive section layout. Add price, stock-aware quantity, condition summary, detailed condition report, specifications, age/use, warranty, included, not included, FAQs, shipping, returns and seller/store details. |
| Cart and checkout | Replace event date/time and venue collection with delivery address, shipping method, order review, payment and confirmation. Recheck stock server-side before creating an order. |
| Account | Rename Bookings to Orders. Show order/payment/fulfilment states, tracking, receipt/invoice and allowed cancellation/return actions. |

## Used-item listing fields

| Section | Fields |
| --- | --- |
| Basics | Name, slug, category, subcategory, brand, model, SKU, status, tags and description. |
| Price | Selling price, optional compare-at price, tax rule and optional admin-only cost. |
| Inventory | Stock quantity, reserved quantity, low-stock threshold, fulfilment modes, weight and package dimensions. |
| Condition | Grade (`like_new`, `excellent`, `good`, `fair`), purchase/manufacture date, computed age, usage intensity, reason for selling, tests, repairs, defects and limitations. |
| Warranty | Status (`none`, `seller`, `manufacturer`, `extended`), provider, coverage, end date, transferable flag and document/proof. |
| Contents | Included, not included, gallery and condition-specific photos. |
| Customer content | Specifications, FAQs, delivery terms, returns policy, SEO title/description and social image. |

### Description analysis assistant

The listing form gets an assisted “Analyse description” action. A server-side
service extracts proposed age, brand/model, condition, defects, contents,
missing accessories, warranty signals, specs, tags and FAQs from a raw seller
description. The result is only a draft: show each suggestion with confidence
and source text, require admin review before save, retain the original text,
and record the reviewer/version. Never generate or publish warranty/condition
claims without approval.

## Data architecture

### Catalogue and inventory

- Extend `products` with the used-item fields above; use database enums/check
  constraints for condition and warranty status and JSONB for specifications
  and detailed condition findings.
- Create immutable `inventory_movements`: `receipt`, `adjustment`,
  `reservation`, `release`, `sale`, `return`, `damage`; each includes
  delta, reason, actor, referenced record and timestamp.
- Stop all writes to `balloon_options`, `balloon_palette_id` and decoration
  content links. Remove them from generated types and UI after a backup/export.
- Use a product-media table later if image-level annotations/alt text are
  required; initially the existing image array can remain.

### Orders, payment and fulfilment

- Add `orders`: public number, user, address snapshot, subtotal/discount/
  shipping/tax/total, currency, order status, payment status, note,
  timestamps and an idempotency key.
- Add `order_items`: product reference plus immutable product, SKU, image,
  condition/warranty, unit-price, quantity and line-total snapshots.
- Add `payments`, `refunds`, `fulfilments`, `fulfilment_events` and
  `order_status_events`. Store provider IDs, amounts, errors and auditable
  transitions.
- Create a database RPC or server transaction that locks stock, verifies
  availability, creates an order/items and reservations. Release reservations
  after failed/expired payment; convert them to `sale` after a verified
  webhook. This is essential to prevent two buyers purchasing one used item.
- RLS: customers only read their own orders; admins manage operations;
  gateway webhook handlers use the server-only service role after signature
  verification. Public clients cannot mutate payments, fulfilment or stock.

## Admin information architecture

Keep the existing Admin Console shell but replace its navigation with:

| Area | Capabilities |
| --- | --- |
| Overview | Sales, paid/unpaid orders, fulfilment queue, inventory value, low/out-of-stock listings, returns and activity. |
| Catalogue | Categories, used-item listings, media, reusable FAQs/policies, SEO and draft/review/publish workflow. |
| Inventory | Available/reserved/sold values, alerts, movement ledger, stock receipt and adjustments with reasons. |
| Orders | Search/filter by order/customer/status/payment/fulfilment/date; order detail, timeline, notes, invoice and address snapshot. |
| Payments | Reconciliation, pending/failed/refunded records, gateway references, errors and controlled refunds. |
| Fulfilment | Pick/pack queue, tracking, shipment/pickup, delivery exceptions, returns and refunds. |
| Customers | Existing users plus order history, addresses, support notes and lifetime value. |
| Settings | Store details, tax, shipping zones/rates, payment methods, policies, staff roles and notification templates. |

Refactor the current product form into: Basics; Price & inventory; Condition &
warranty; Media & contents; Customer information. Delete balloon palette,
custom-balloon, decoration-content and event add-on controls. Add a publish
review that flags missing photos, condition report, stock, age, warranty and
contents information.

## Current-code migration map

| Current feature | Replacement |
| --- | --- |
| Products/category pages | Same route concepts, now render used-item metadata, filters and stock. |
| Product detail and `cart-store` | Stock-capped cart; remove balloon selection and add-on data shape. |
| Booking checkout | Address + shipping + payment checkout; remove event/venue/customisation steps. |
| `/bookings` | `/orders` and receipt/invoice pages. Keep historic bookings separately until retention is decided. |
| Admin Bookings | Orders, Payments, Fulfilment and Inventory sections. |
| Admin Decorations/Add-ons | Remove from active navigation and replace with Inventory and Payments. |
| Vendor dashboard | Keep out of this release. It supports decor fulfilment, not marketplace sellers/payouts. |

## Delivery sequence

### 0. Business and content decisions

Freeze event catalogue edits; export current catalogue, bookings, images and
balloon content. Approve used-item categories, grading rubric, warranty and
returns rules, shipping model, tax treatment and payment gateway. Audit all
event/balloon strings, images, seeds, routes and tests.

### 1. Secure data foundation

Ship forward migrations for product fields, inventory ledger, orders,
payments, fulfilment, events, indexes and RLS. Regenerate Supabase types and
seed realistic used items. Test stock-one concurrent checkout, payment failure
and customer/admin isolation.

Acceptance: no unprivileged request can alter paid/shipped/inventory state;
two reservations cannot sell the same stock-one item.

### 2. Catalogue administration

Build the revised listing form, directory columns/filters, image flow, stock
actions and reviewed description analysis. Remove balloon/decor screens and
navigation.

Acceptance: an admin can publish a complete used item, adjust stock with a
reason and see its inventory history.

### 3. Storefront

Replace all public event copy/images, show condition/age/warranty/stock,
introduce filters, and enforce stock-aware cart controls.

Acceptance: a customer understands the actual item condition and cannot add
more units than available.

### 4. Checkout, orders and payment

Build address/shipping checkout, server-created order/reservation, gateway
adapter + signed webhook, confirmation, customer orders and invoices. Preserve
historic event bookings on an archive route if they must remain accessible.

Acceptance: successful and failed payment paths work end-to-end without any
browser-controlled payment state.

### 5. Operations

Build order queue/detail, reconciliation/refunds, pick-pack-ship/tracking,
inventory alerts/adjustments, returns and dashboard metrics. Add granular
staff roles before delegated fulfilment work.

Acceptance: staff can fulfil, refund and audit an order, payment and inventory
change end-to-end.

### 6. Release hardening

Replace SEO/sitemap/structured data with `Product`/`Offer`, update emails/SMS,
test mobile/accessibility/RLS/webhooks, and monitor payment failures, stock
drift and oversell attempts.

## Verification coverage

- Unit: stock cap, totals, condition/warranty display and state transitions.
- Integration: RLS, atomic reservation/release, duplicate webhooks, refunds
  and immutable order snapshots.
- E2E: stock-one purchase, sold-out cart, multi-unit purchase, failed payment,
  admin listing/adjustment, fulfilment, refund and customer tracking.
- Visual: homepage, grid, detail, cart, checkout and admin pages on desktop
  and mobile to ensure the present UI concept remains recognisable.

## Decisions required before coding

1. Single-store used-goods shop or multi-seller marketplace? (The current
   vendor model is not suitable for marketplace ownership/payouts.)
2. Payment gateway, launch countries/currencies and tax/invoice requirements?
3. Shipping, pickup or both; and who defines shipping prices?
4. Exact condition grades, warranty responsibility and return window?
5. Must existing customers retain access to historic event bookings?

