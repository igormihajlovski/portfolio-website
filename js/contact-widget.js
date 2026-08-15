(() => {
  "use strict";

  const initializeContactWidgets = () => {
    document.querySelectorAll("[data-contact-widget]").forEach((widget) => {
      const trigger = widget.querySelector(".contact-widget-trigger");
      const panel = widget.querySelector(".contact-widget-panel");

      if (!trigger || !panel) return;

      const openLabel = trigger.dataset.openLabel;
      const closeLabel = trigger.dataset.closeLabel;

      if (!openLabel || !closeLabel) return;

      const isOpen = () => !panel.hidden;

      const openWidget = () => {
        panel.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        trigger.setAttribute("aria-label", closeLabel);
      };

      const closeWidget = (restoreFocus = false) => {
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-label", openLabel);

        if (restoreFocus) trigger.focus();

        panel.hidden = true;
      };

      trigger.addEventListener("click", () => {
        if (isOpen()) {
          closeWidget();
        } else {
          openWidget();
        }
      });

      panel.addEventListener("click", (event) => {
        if (event.target.closest(".contact-widget-action")) {
          closeWidget(true);
        }
      });

      document.addEventListener("click", (event) => {
        if (isOpen() && !widget.contains(event.target)) closeWidget();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen()) closeWidget(true);
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeContactWidgets);
  } else {
    initializeContactWidgets();
  }
})();
