/*
 * Merch Magic — product pricing
 * =============================
 *
 * Add an entry per product to switch its page from quote-only to the live
 * quantity/price configurator. A product with no entry here keeps the current
 * behaviour exactly, so it is safe to fill this in a few products at a time.
 *
 * The key is the product slug — the filename without .html, and the same value
 * as window.__PRODUCT__.id on that page (e.g. mugs.html -> "mugs").
 *
 * `unit` is the price PER PIECE in GBP at that quantity, excluding VAT.
 * List tiers smallest first. Buying at or above a tier's qty uses that tier's
 * unit price, so the totals shown are:
 *
 *     qty 25  at unit 3.20  ->  £80.00   (£3.20/pc)
 *     qty 100 at unit 2.40  ->  £240.00  (£2.40/pc)
 *
 * Optional per-product fields:
 *   minQty   - lowest orderable quantity (default 1, matching "no minimum")
 *   leadDays - [min, max] working days to delivery (default [5, 7])
 *
 * Example — delete the comment markers and use your real figures:
 *
 * "mugs": {
 *   tiers: [
 *     { qty: 10,  unit: 4.95 },
 *     { qty: 25,  unit: 4.20 },
 *     { qty: 50,  unit: 3.75 },
 *     { qty: 100, unit: 3.30 },
 *     { qty: 250, unit: 2.95 }
 *   ]
 * },
 */
window.MM_PRICING = {
  // no products priced yet — every page stays quote-only until you add entries
};
