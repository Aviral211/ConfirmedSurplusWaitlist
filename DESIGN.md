# Sunrise / confirmed surplus

## Product architecture
One fictional September 9, 2026 evening at Sunrise Bakery, Bellevue. Consumer and Merchant are role previews over the same local transaction state, not authenticated accounts. Never promise a bag before a counted confirmation. One bag per customer. Joining closes when the merchant confirms.

Keep state in a pure reducer: collecting -> allocating -> closed. Every confirmed bag is available, offered, reserved, picked up, or remaining. Offers have absolute simulated deadlines, reconciled chronologically across time jumps and reloads. Five-minute response + ten-minute arrival buffer; no new offers after 7:45 PM. Pickup closes at 8 PM. No-shows remain unsold; demo pay-at-pickup avoids invented refunds.

Priority = join time minus 30 minutes per previous eligible night without an offer (maximum three). Tie-break actual join time then stable ID. Prior history is snapshotted for tonight. Credit resets on receiving an offer. Leaving, declining, expiry, and no-show do not earn credit. Earn only once when a night closes with no offer. Next-night action retains history; reset restores deterministic seeds.

## Visual system and accepted concepts
Selected autonomously as requested: work/design/consumer-concept.png and merchant-concept.png in the parent workspace. Built-in Image Gen references, 1536 x 1024. Consumer: photo on left, open state/action column on right. Merchant: count + confirm, sparse contextual sidebar; after confirmation replace count with operational rows and activity. Results use meaningful numbers and a single proportional pickup strip, not analytics charts.

Color lock: warm paper #f7f5ef, evergreen #244539, ink #292d28, muted #686b62, rules #d9ddd3, gentle green surface #e9eee5, caution #8a4d27. No gradients/shadows. White reserved for image/paper ticket if needed.
Typography: Georgia serif identity/headings, system sans UI. Body 16/1.55, secondary 14/1.5, heading 48-56/1.05 desktop, 36/1.08 mobile; labels sentence case, never dense uppercase microcopy. Controls inherit font; min 44px targets. Eight-point spacing 8/16/24/32/48/64. Buttons radius 7px; image radius 2px; no nested cards. Icons lucide 20px, 1.7 stroke. Sun identity is code-native line geometry.
Desktop max content 1180px, 48px gutters, consumer 54/46 split with 56px gap. Merchant 1120px, 60/40 split with simple divider. At <=760px single column, image becomes 16:7 at top, action immediately below; merchant grid stacks. At <=420px 20px gutters. Reduced-motion respected. Focus rings visible; state headings focus only after user navigation, live region for discrete status changes (not clock).

## Copy / intentional concept refinements
Keep brand Sunrise, Consumer/Merchant tabs, Good things, still to come., Nothing promised. Nothing charged., Join tonight’s waitlist, A fairer place in line, How priority works, A good end to the day., How many bags are ready?, Confirm N bags, and Demo controls.
Correct concept copy 'you’ll be first to hear' to 'you may receive a timed offer' to avoid guaranteed priority. Photo labeled illustrative. Merchant pickup copy says staff verify handover, rather than implying automatic physical tracking. Controls remain code-native. Add dietary/allergen caution because contents vary. Live/terminal states extend the same open layout with bounded copy and honest outcomes. Header date/clock reflect the simulated night. Mobile prioritizes state over decorative photo after joining.

## Baseline audit
1. Join: functional visual toggle but seeded queue never changes; cramped small text, no bakery identity.
2. Merchant: fixed quantity; multiple redundant boxes and badges.
3. Distribution: hardcoded first three, consumer sees other people's names.
4. Offer: timer resets on navigation; imperative parent update inside state setter.
5. Pickup: hardcoded code and fake paid status, no actual reservation.
6. Reassignment: static fabricated acceptances; no remaining inventory.
Captured current original UI in parent work/before-*.png. Source inspected in full. Preserve original at branch preserve/original-main (b1d9b71).

## Scope / validation
Local React/TypeScript only. No backend, auth, payments, emails, AI or deployment. Consumer shows only own history/code and anonymous counts; merchant operational guest IDs, never fairness history. Prototype role switch is not access control. Unit tests cover allocation conservation, deadlines, cutoff, history, invalid commands, chronological jumps and results. Browser checks cover all primary/edge scenarios, responsive layouts and console health; independent critics review actual output.
