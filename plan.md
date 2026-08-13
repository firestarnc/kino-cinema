## Plan: Elapsed Slot Unavailability (WAT)

Ensure same-day past/in-progress slots are never bookable by evaluating slot start times against current Nigeria time (WAT), then render those slots as disabled with strikethrough in the booking UI while preserving existing booked/blocked logic.

**Steps**
1. Confirm and document slot cutoff rule in code comments and shared helpers: slot becomes unavailable at slot start time for the selected date in WAT (depends on policy decisions already confirmed).
2. Add a timezone-safe helper in /Users/user/Desktop/kino-cinema/src/lib/private-booking.ts to compute current WAT date/time and determine whether a slot has elapsed for a given selected date (blocks step 3 and step 4).
3. Extend availability response shaping in /Users/user/Desktop/kino-cinema/src/app/api/bookings/availability/route.ts to include an additional set/list for elapsed slots for the queried date using the helper (parallel with step 4 if frontend computes elapsed slots locally; otherwise depends on step 2).
4. Update slot state resolution in /Users/user/Desktop/kino-cinema/src/components/film-detail/PrivateBookingPanel.tsx so each slot’s disabled state is derived from: booked OR blocked OR elapsed, and add strikethrough styling for elapsed slots (depends on step 2; optionally step 3).
5. Preserve UX clarity by distinguishing labels: keep existing Currently Unavailable for booked/blocked and add explicit Elapsed indicator for past/in-progress slots (depends on step 4).
6. Add targeted unit or integration coverage around WAT edge cases (same-day morning, boundary at slot start minute, cross-day midnight) for helper logic and rendering behavior (depends on step 2 and step 4).
7. Run validation checks (lint/tests) and perform a manual timezone simulation to verify that at 2:00 PM WAT, 9:00-12:00 and 12:00-15:00 are disabled with strikethrough while future slots remain selectable (depends on all prior steps).

**Relevant files**
- /Users/user/Desktop/kino-cinema/src/lib/private-booking.ts - reuse existing timezone constants and add slot-elapsed helper logic near date utility functions.
- /Users/user/Desktop/kino-cinema/src/app/api/bookings/availability/route.ts - optionally return elapsed slot IDs in addition to taken/blocked slots for consistent server-derived state.
- /Users/user/Desktop/kino-cinema/src/components/film-detail/PrivateBookingPanel.tsx - apply final availability composition and strikethrough/disabled rendering state.
- /Users/user/Desktop/kino-cinema/src/lib/private-booking-db.ts - unchanged logic; referenced to ensure booked/blocked behavior remains intact.

**Verification**
1. Run lint and existing tests for booking modules.
2. Add/execute helper tests for WAT slot boundary logic.
3. Manual check in booking UI with selected date=today and mocked/current WAT afternoon time.
4. Manual regression check with a future date to confirm no false strikethrough.
5. Manual regression check for already booked slot priority (still unavailable even if not elapsed).

**Decisions**
- Confirmed: elapsed slots must be disabled and visually struck through.
- Confirmed: unavailability starts at slot start time (for example, 12:00-15:00 is not bookable at 14:00).
- In scope: booking availability UX/state logic for same-day slots in WAT.
- Out of scope: changing package definitions, slot catalog, payment flow, or database schema.

**Further Considerations**
1. Prefer server-authoritative elapsed slot computation to avoid client clock drift; keep optional client fallback only for immediate visual responsiveness.
2. Introduce a single shared status enum for slot state (available/booked/blocked/elapsed) to prevent scattered conditional logic in UI.
