## 2024-03-18 - Missing ARIA labels in icon-only buttons
**Learning:** Found several icon-only buttons in the application lacking ARIA labels, creating accessibility issues for screen reader users. The application frequently uses Lucide React icons within `<button>` tags without any text content, particularly in close buttons (like 'X' icons in modals) and action toggles (like the SOS toggle or profile picture upload). This makes it difficult for visually impaired users to understand what action a button performs.
**Action:** When creating new components with icon-only buttons, ensure an `aria-label` attribute is always included to provide context to assistive technologies.

## 2024-03-20 - Dynamic ARIA labels on Toggle Buttons
**Learning:** Found toggle buttons (like the dark mode toggle) that lacked ARIA labels. When components have internal state representing visual changes, providing static `aria-label` attributes isn't enough; the label must be dynamic to describe the *next* state or current state clearly to screen reader users.
**Action:** When implementing toggles or switches, ensure `aria-label` utilizes the component's state to provide context-sensitive reading (e.g., `aria-label={isActive ? 'Deactivate' : 'Activate'}`).

## 2024-05-15 - ARIA Labels on Interactive Rating Widgets
**Learning:** Found that custom interactive widgets (like a star rating component built with icon buttons) lacked both proper descriptive `aria-label` attributes and keyboard focus styling (`focus-visible`). This makes it difficult for screen reader users to understand what the button represents and hard for keyboard users to see which star is currently focused.
**Action:** Always provide descriptive `aria-label`s (e.g., `aria-label={\`Rate \${star} star\${star > 1 ? 's' : ''}\`}`) and `focus-visible` styles on custom interactive input elements.
## 2026-03-25 - Adding ARIA labels to icon buttons
**Learning:** Found several icon-only buttons in the application lacking ARIA labels, creating accessibility issues for screen reader users. Added ARIA labels for buttons in FuelCart and MapPicker.
**Action:** When creating new components with icon-only buttons, ensure an `aria-label` attribute is always included to provide context to assistive technologies.

## 2026-03-28 - Focus Visible Styles for Quick Actions and Primary CTAs
**Learning:** Found that secondary quick-action buttons (like the quick amount/quantity selectors in the OrderFuel component) and primary calls to actions (like 'Continue to Checkout' or 'Add to Cart') lacked explicit keyboard focus styling. Because they use a brutalist design system with complex borders and shadow changes on hover, the default browser focus ring is often insufficient or entirely overwritten, making keyboard navigation confusing.
**Action:** Always provide explicit `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none` (and `focus-visible:ring-offset-2` when appropriate to separate the ring from the border) on all interactive buttons, especially those that act as primary user flows or quick selection helpers, to ensure they remain accessible to keyboard users.

## 2026-03-30 - Focus Visible Styles for Back Buttons
**Learning:** Found that the 'Go back' buttons (often represented by a left arrow icon) across various components (Favorites, OrderFuel, About, BulkOrder, Profile, Legal, Checkout, Garage) lacked explicit keyboard focus styling. While some components like Settings and OrderHistory had them (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm`), many did not, making keyboard navigation inconsistent and confusing.
**Action:** Consistently apply explicit `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm` to all navigation icon buttons like 'Go back' to ensure they remain accessible to keyboard users.

## 2026-04-01 - Focus Visible Styles for Modal and Utility Icon Buttons
**Learning:** Found that secondary utility icon buttons (like 'X' to close modals, 'Trash' to delete list items, or 'Edit' pens) often lack explicit `focus-visible` styling, just like primary buttons. Because these are often transparent or use subtle hover effects, native browser focus rings can be hard to see or disabled entirely, making it very difficult for keyboard users to navigate complex interactive elements (like carts or lists).
**Action:** Consistently apply explicit `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm` (matching the button's border radius) to all utility icon buttons, especially those that trigger destructive actions or close overlays.
## 2024-03-20 - Accessible Custom Checkboxes in Brutalist Design
**Learning:** Custom checkboxes built with `<button>` elements (like in `SafetyChecklist`) need explicit semantic roles (`role="checkbox"`), state attributes (`aria-checked`), and distinct keyboard focus styles (`focus-visible:ring-primary focus-visible:ring-offset-2`) to be accessible, especially against thick brutalist borders.
**Action:** Always verify that interactive elements disguised as standard controls have full ARIA state management and use the application's standard focus rings to ensure keyboard navigability.

## 2024-05-18 - Missing ARIA Labels on Primary Inputs
**Learning:** Found that primary input fields in forms (like Mobile Number, OTP in `Login.tsx`, and amount/quantity in `OrderFuel.tsx`) lacked programmatic association with their visible labels, which is a critical accessibility issue.
**Action:** When adding or reviewing input fields, ensure they always have an explicit `aria-label` or are associated with an `<label htmlFor="...">` element, especially when dynamic labels (like "Enter amount in rupees" vs "Enter volume in liters") are needed.
