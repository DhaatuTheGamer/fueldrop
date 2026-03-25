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
