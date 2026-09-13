# Confirmed Surplus Waitlist

A local interactive product demo: collect interest first, count physical surplus near closing, confirm once, then automatically offer and reassign only bags that exist. Sunrise Bakery in Bellevue is the fictional store using the product.

## Run locally

Requires Node.js 22 (verified with 22.14.0) and npm. No API keys or environment variables are needed.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Vite binds to loopback only and requires port 3000 to be free. Stop an existing copy before starting another. Production verification: `npm run build`; serve that build using `npm run preview` after stopping the development server. `npm run lint` checks TypeScript; `npm test` runs the state-model regression suite.

## Architecture

- `src/App.tsx`: product shell and Consumer/Merchant role previews.
- `src/model.ts`: pure reducer for the collecting → allocating → closed evening, physical bags, queue, deadlines, pickup checks and results.
- `src/useNight.ts`: clock integration and versioned localStorage persistence (`sunrise-night-v1`).
- `src/components/Consumer.tsx`: join, waiting, timed offer, reservation ticket and outcomes.
- `src/components/Merchant.tsx`: one count confirmation, inventory transitions, pickup verification and results.
- `src/components/DemoControls.tsx`: clearly separate presenter scenarios and simulated guest/time actions.
- `src/index.css`: warm paper/forest green/serif system, desktop and tablet layouts, restrained state motion and reduced-motion rules.
- `src/model.test.ts`: inventory, fairness, clock, persistence and payment invariants.

All business state is local to a browser origin. There is no server, authentication, real payment, messaging, POS integration, or AI. The role switch is a presentation tool, not access control. Open only one interactive tab per origin; multiple tabs are not synchronized. Browser refresh preserves the evening and reconciles elapsed offer deadlines. Presenter controls can pause time or restore a known scenario.

## Policy being demonstrated

- Join before the count. Interest is not a promise or reservation. One offer and at most one bag per person per evening.
- Staff physically count and pack 0–12 bags, then confirm once. Inventory cannot be edited after confirmation.
- Each completed evening without an offer earns one priority credit. Each credit moves effective join time 30 minutes earlier, up to three credits. Ties use actual join time, then a stable guest ID. Credits reset when an offer arrives. Leaving, declining, expiry and no-show earn none.
- Each offer lasts five minutes. Decline/expiry releases the same bag to the next eligible guest. New offers stop after 7:45 PM, leaving five minutes to respond and ten to arrive before closing.
- Pickup is 7:30–8:00 PM. A reservation earns no revenue. Verifying a pickup records $5 received (simulation). Invalid, duplicate or late verification cannot record a sale.
- At 8 PM, uncollected reservations become no-shows. Unclaimed and missed-pickup bags remain with the store and earn no revenue.
- The main story deliberately seeds Alex with three previous unsuccessful waits. “First evening” starts with zero history. “Restore main story” restores the seed; “Next evening” preserves earned/spent history.

These are proposed policies, not validated operational guarantees. Demand, arrival times, repeat no-shows, identity enforcement, profitability and staff workload require real-world testing. No revenue beyond simulated food payments is claimed.

## 60–90 second demo

1. Restore “The main story.” Consumer: Alex joins. Point out that no bag is promised.
2. Use the subtle “Move to the closing count” link. Merchant: confirm three physically counted bags once.
3. Demo controls → “Another guest declines.” The drawer closes; Bag 01 visibly moves from Guest 01 to Guest 03.
4. Consumer → “Accept & reserve.” Alex gets the Bag 02 pickup ticket, with $5 due at handover.
5. Demo controls → “Another guest accepts” twice → “Open pickup.” Three reservations, still $0 received.
6. Verify `4821` and `7303`. The corresponding bags, pickup total and $10 received update together.
7. Demo controls → “Close tonight.” Show 3 confirmed, 3 claimed, 2 collected, 1 no-show, $10 received and 67% sell-through. One bag remains unsold.

The point: the store never guessed inventory in advance. One actual count starts distribution, while staff retain the real work of packing and handover.

## Local preservation

Original prototype: `preserve/original-main` at `b1d9b71`. Pre-finish working version: `preserve/before-product-finish` at `a1df803`. Product finishing work stays on `finish/confirmed-surplus`. No push or deployment is part of this task.
