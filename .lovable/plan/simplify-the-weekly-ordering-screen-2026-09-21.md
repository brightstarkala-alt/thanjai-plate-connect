# Simplify the weekly ordering screen

## Changes
- Replace the busy customer page with one clear order flow: choose dates, choose box quantities, review.
- Allow selecting several delivery dates within the displayed current week.
- Keep unavailable dates disabled and clearly show how many dates are selected.
- Remove promotional and placeholder panels that distract from ordering.
- Keep the admin preview accessible but secondary.
- Verify the date selection and quantity controls on mobile and desktop.

## Technical details
- Generate the current Monday–Sunday range in the customer interface.
- Store selected dates as a list and toggle each available date independently.
- Keep all ordering data temporary until the connected backend stage.
