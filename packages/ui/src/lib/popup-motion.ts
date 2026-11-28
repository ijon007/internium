/** Composite-only enter/exit motion for Base UI popups (dropdown, select, popover).
 *
 * Uses CSS transitions with data-starting-style / data-ending-style so close can
 * be interrupted mid-open. Exit is faster (100ms) than enter (150ms).
 * Do not use tw-animate-css animate-out here: its default fill-mode is none, so
 * the menu snaps back visible after the exit keyframes finish.
 */
export const popupMotion =
  "origin-(--transform-origin) transition-[opacity,scale] duration-150 ease-out-strong data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100 motion-reduce:transition-opacity motion-reduce:duration-100 motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100";
