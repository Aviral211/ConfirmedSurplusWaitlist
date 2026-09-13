# Confirmed Surplus Waitlist: design and behavior

## Product hierarchy

Confirmed Surplus Waitlist is the software. Sunrise Bakery, Bellevue, is its fictional demo store. Keep the product identity in the shared header, role preview in the center, and simulated time on the right. Store context belongs inside each workspace. No extra admin, onboarding, location switcher or dashboard is necessary.

Consumer first visit: warm bakery image and an open join column. Waiting: place in the transparent queue, no promise, a quiet demo-only count handoff. Offer and reservation: remove the photo and fairness material, preserve a compact store column and bag identity, and make the decision or pickup ticket primary.

Merchant: physical count and one confirmation. Once confirmed, replace the count with physical bag rows. Distinguish automatic allocation from pickup work. Every bag keeps its identifier across guests. Show the previous offer outcome and the new guest together. Never imply that confirmation means every bag will sell.

## Visual system

Warm paper #f7f5ef, forest green #244539, ink #292d28, muted #686b62, rules #d9ddd3, gentle green #e9eee5. Georgia identity/headings and Segoe UI/system sans controls. Modest corners, fine rules, open spacing, no gradients, glow, decorative charts or nested cards. Icons are from Lucide. Bakery photo is illustrative.

Primary desktop/laptop layouts: 1280–1440 wide. Merchant tablet: 1024 wide. This finishing pass does not develop or validate mobile layouts; inherited mobile rules remain.

## Motion contract

- Role change: 200ms entrance, no delay before controls work.
- Count adjustment: short number transition at its real value.
- Confirm and reassign: persistent bag number; changed recipient/status enters and briefly highlights. Progress segments represent offer, reservation and collection.
- Offer: distinct green decision surface with live countdown. No constantly pulsing urgency.
- Accept: pickup ticket enters in the same action column.
- Pickup: receipt, bag state, collected count and received amount update from the same reducer action. No invented animated totals.
- Results: actual final numbers and physical bag outcomes, with the detailed activity history collapsed by default.
- Drawer: short entry; no interaction waits for animation. Ordinary dismissal restores trigger focus without scrolling. Scene-changing actions return to the new heading at the top.
- prefers-reduced-motion removes animation and transitions while preserving all behavior.

## Invariants

Keep the existing pure reducer, browser persistence and collecting → allocating → closed architecture. A confirmation creates actual inventory once. Allocation never adds a bag. A guest receives at most one offer per evening. A decline or expiry can move only that same bag. No new offers after7:45 PM. Five minutes to respond and ten minutes to arrive; pickup7:30–8:00 PM.

Priority uses deterministic effective join time:30 minutes per completed night without an offer, capped at3 credits. Tie-break actual join time, then stable ID. Credits reset on receiving an offer. Leaving, decline, expiry and missed pickup earn nothing. Next evening retains history; main-story reset explicitly restores seeded history.

Reservations are unpaid. Only a valid pickup records $5 received. Invalid, duplicate and closed-window codes cannot create another pickup/payment. No-shows and unclaimed bags remain unsold. Browser-local state and presenter role controls are explicitly a simulation, not production authentication or notifications.

## Review and evidence

The finishing pass addresses stale priority display, wrong next-day weekday, inaccurate automation status, misleading reset copy, non-urgent offer content, weak offer prominence, sprawling results history and missing joined-state demo guidance. Independent product and visual critics reviewed the rendered result. Their material findings were pre-window pickup wording, completed-pickup action wording, and scene-changing drawer focus/scroll. These were fixed before final QA.

Browser screenshots, critic notes, reduced-motion results and the final QA report are maintained outside the repository in the parent work/product-finish directory. The model suite covers conservation, chronological deadlines, cutoff, fairness, persistence, code verification, clock precision and the3claimed/2collected/$10 outcome. See README for the demo sequence and candid limits.
