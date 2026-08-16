(() => {
  "use strict";

  const selectors = [...document.querySelectorAll("[data-language-selector]")];

  if (!selectors.length) return;

  const closeSelector = (selector, restoreFocus = false) => {
    if (!selector.classList.contains("is-open")) return;

    const trigger = selector.querySelector(".language-selector-trigger");
    selector.classList.remove("is-open");
    trigger?.setAttribute("aria-expanded", "false");

    if (restoreFocus) trigger?.focus();
  };

  const closeAllSelectors = (exceptSelector = null) => {
    selectors.forEach((selector) => {
      if (selector !== exceptSelector) closeSelector(selector);
    });
  };

  selectors.forEach((selector) => {
    const trigger = selector.querySelector(".language-selector-trigger");

    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const shouldOpen = !selector.classList.contains("is-open");
      closeAllSelectors(selector);

      if (!shouldOpen) {
        closeSelector(selector);
        return;
      }

      const openMobileMenuButton = selector
        .closest(".w-nav")
        ?.querySelector(".menu-button.w--open");

      openMobileMenuButton?.click();
      selector.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    });
  });

  document.querySelectorAll(".menu-button").forEach((menuButton) => {
    menuButton.addEventListener("click", () => closeAllSelectors());
  });

  document.addEventListener("click", (event) => {
    selectors.forEach((selector) => {
      if (!selector.contains(event.target)) closeSelector(selector);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const openSelector = selectors.find((selector) =>
      selector.classList.contains("is-open"),
    );

    if (openSelector) closeSelector(openSelector, true);
  });
})();
