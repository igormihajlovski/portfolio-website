(() => {
  "use strict";

  const LABEL_GUTTER_X = 20;
  const LABEL_GUTTER_Y = 32;

  // Exact axis bounds of a circular arc, including any extrema between its ends.
  function sweptBounds(x, y, sweep) {
    const radius = Math.hypot(x, y);
    const from = Math.atan2(y, x);
    const to = from + sweep;
    const endX = x * Math.cos(sweep) - y * Math.sin(sweep);
    const endY = x * Math.sin(sweep) + y * Math.cos(sweep);
    const bounds = { minX: Math.min(x, endX), maxX: Math.max(x, endX), minY: Math.min(y, endY), maxY: Math.max(y, endY) };
    for (let quadrant = Math.ceil(from / (Math.PI / 2)); quadrant <= Math.floor(to / (Math.PI / 2)); quadrant += 1) {
      const angle = quadrant * Math.PI / 2;
      bounds.minX = Math.min(bounds.minX, radius * Math.cos(angle));
      bounds.maxX = Math.max(bounds.maxX, radius * Math.cos(angle));
      bounds.minY = Math.min(bounds.minY, radius * Math.sin(angle));
      bounds.maxY = Math.max(bounds.maxY, radius * Math.sin(angle));
    }
    return bounds;
  }

  // Choose a single offset from the planet for the complete activation, not a
  // new nearest position each frame. Swept bounds include the complete 52px
  // focus targets and all intermediate orbital positions in that interval.
  function findLabelPosition(positions, tool, size, portraitRadius, width, height, sweep = 0) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const limitX = size / 2 + LABEL_GUTTER_X - halfWidth - 4;
    const limitY = size / 2 + LABEL_GUTTER_Y - halfHeight - 4;
    const movement = sweptBounds(tool.x, tool.y, sweep);
    const left = -limitX - movement.minX;
    const right = limitX - movement.maxX;
    const top = -limitY - movement.minY;
    const bottom = limitY - movement.maxY;
    const clampX = (value) => Math.max(left, Math.min(right, value));
    const clampY = (value) => Math.max(top, Math.min(bottom, value));
    const obstacles = positions.map((planet) => {
      const relative = sweptBounds(tool.x - planet.x, tool.y - planet.y, sweep);
      return {
        left: -halfWidth - 30 - relative.maxX,
        right: halfWidth + 30 - relative.minX,
        top: -halfHeight - 30 - relative.maxY,
        bottom: halfHeight + 30 - relative.minY,
      };
    });
    const portraitX = -(movement.minX + movement.maxX) / 2;
    const portraitY = -(movement.minY + movement.maxY) / 2;
    const portraitHalfWidth = halfWidth + (movement.maxX - movement.minX) / 2;
    const portraitHalfHeight = halfHeight + (movement.maxY - movement.minY) / 2;
    const clear = (x, y) => {
      if (x < left || x > right || y < top || y > bottom) return false;
      if (obstacles.some((obstacle) => x > obstacle.left && x < obstacle.right && y > obstacle.top && y < obstacle.bottom)) return false;
      const nearestX = Math.max(0, Math.abs(x - portraitX) - portraitHalfWidth);
      const nearestY = Math.max(0, Math.abs(y - portraitY) - portraitHalfHeight);
      return Math.hypot(nearestX, nearestY) >= portraitRadius + 4;
    };
    const angle = Math.atan2(tool.y, tool.x);
    let best = null;
    let bestScore = Infinity;
    const consider = (x, y) => {
      const score = x * x + y * y;
      if (score >= bestScore || !clear(x, y)) return;
      bestScore = score;
      best = { x: x - halfWidth, y: y - halfHeight };
    };
    // Prefer an adjacent placement, flipping around the tool as space requires.
    for (let step = 0; step < 16; step += 1) {
      const theta = angle + (step * Math.PI) / 8;
      const dx = Math.cos(theta);
      const dy = Math.sin(theta);
      const distance = Math.min(
        (halfWidth + 34) / Math.abs(dx),
        (halfHeight + 34) / Math.abs(dy),
      );
      consider(clampX(dx * distance), clampY(dy * distance));
    }
    // Nearby gaps can fall between those rays. Check the obstacle boundaries
    // rather than moving the caption to a distant empty part of the stage.
    const xs = [clampX(0), left, right];
    const ys = [clampY(0), top, bottom];
    obstacles.forEach((obstacle) => {
      xs.push(clampX(obstacle.left - 0.05), clampX(obstacle.right + 0.05));
      ys.push(clampY(obstacle.top - 0.05), clampY(obstacle.bottom + 0.05));
    });
    for (const x of xs) {
      for (const y of ys) consider(x, y);
      const dx = Math.max(0, Math.abs(x - portraitX) - portraitHalfWidth);
      if (dx < portraitRadius + 4.05) {
        const y = portraitHalfHeight + Math.sqrt((portraitRadius + 4.05) ** 2 - dx ** 2);
        consider(x, portraitY + y);
        consider(x, portraitY - y);
      }
    }
    for (const y of ys) {
      const dy = Math.max(0, Math.abs(y - portraitY) - portraitHalfHeight);
      if (dy < portraitRadius + 4.05) {
        const x = portraitHalfWidth + Math.sqrt((portraitRadius + 4.05) ** 2 - dy ** 2);
        consider(portraitX + x, y);
        consider(portraitX - x, y);
      }
    }
    if (best) return best;
    // Compact-stage fallback: choose the nearest clear rectangle, never cover a
    // target or hide the mandatory automatic label to accommodate a tight pose.
    for (let x = left; x <= right; x += 4) {
      for (let y = top; y <= bottom; y += 4) consider(x, y);
    }
    return best;
  }

  document.querySelectorAll("[data-solar-system-lite]").forEach((root) => {
    if (root.hasAttribute("data-ready")) return;

    const stage = root.querySelector("[data-solar-stage]");
    const controls = root.querySelector("[data-solar-controls]");
    const toggle = root.querySelector("[data-solar-toggle]");
    const toggleLabel = root.querySelector("[data-solar-toggle-label]");
    const pulse = root.querySelector("[data-solar-pulse]");
    const beam = root.querySelector("[data-solar-beam]");
    const toolLabel = root.querySelector("[data-solar-tool-label]");
    const orbits = Array.from(root.querySelectorAll("[data-solar-orbit]"));
    const tools = Array.from(root.querySelectorAll("[data-solar-planet]")).map(
      (button) => ({
        button,
        id: button.dataset.solarPlanet,
        name: button.getAttribute("aria-label"),
        radius: Number(button.dataset.orbitRadius),
        ring: Number(button.dataset.orbitRing),
        phase: (Number(button.dataset.orbitStep) * Math.PI * 2) / 7,
      }),
    );

    if (!stage || !controls || !toggle || !toggleLabel || !pulse || !beam || !toolLabel || tools.length !== 7) return;

    const trailDots = Array.from({ length: 8 }, () => {
      const dot = document.createElement("span");
      dot.className = "solar-system-lite__trail-dot";
      beam.appendChild(dot);
      return dot;
    });

    // Shared angle preserves every pair distance throughout a 120-second orbit.
    // For stage S in [280,520], portrait radius P=min(40,24*S/280),
    // inner radius=P+42, outer radius=S/2-32, with two evenly spaced rings.
    // Each radius is piecewise linear in S. Minimizing each of the 21 pair
    // distance quadratics on both intervals proves >=3.003px clearance between
    // circumscribed 52px focus envelopes, >=5.230px to the portrait, and >=6px
    // to stage edges, for every stage size and every shared rotation angle.
    const REVOLUTION_MS = 120000;
    const SLOT_MS = 4200;
    const PULSE_START_MS = 400;
    const PULSE_DURATION_MS = 1000;
    const PULSE_FADE_MS = 220;
    const ACTIVE_END_MS = 3000;
    const LABEL_SWEEP = ((ACTIVE_END_MS - PULSE_START_MS - PULSE_DURATION_MS) / REVOLUTION_MS) * Math.PI * 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let userPaused = false;
    let reducedMotionOptIn = false;
    let visible = !("IntersectionObserver" in window);
    let hasSpace = false;
    let hovered = null;
    let focused = null;
    let selected = null;
    let touching = null;
    let dismissed = false;
    let active = null;
    let scale = 1;
    let portraitRadius = 24;
    let stageSize = 280;
    let labelSize = null;
    let labelPlacement = null;
    let elapsed = 0;
    let lastTimestamp = null;
    let frame = null;
    let measuredSize = -1;
    let resizeFrame = null;

    const requested = () => !userPaused && (!reduceMotion.matches || reducedMotionOptIn);
    // Keyboard focus owns the label until blur, even when a pointer stays over another tool.
    const inspection = () => focused || hovered || selected || touching;
    const canRun = () =>
      requested() && visible && !document.hidden && hasSpace && !inspection();

    function activate(tool) {
      if (active !== tool) {
        if (active) active.button.classList.remove("is-active");
        active = tool;
        toolLabel.hidden = !tool;
        labelSize = null;
        labelPlacement = null;
        if (tool) {
          tool.button.classList.add("is-active");
          root.dataset.activeTool = tool.id;
          toolLabel.textContent = tool.name;
        } else {
          delete root.dataset.activeTool;
        }
      }
      if (!tool) return;
      // Read only on activation/font changes; frame updates use computed positions.
      if (!labelSize) {
        labelSize = { width: toolLabel.offsetWidth + 1, height: toolLabel.offsetHeight + 1 };
        labelPlacement = findLabelPosition(tools, tool, stageSize, portraitRadius, labelSize.width, labelSize.height, LABEL_SWEEP);
      }
      toolLabel.hidden = !labelPlacement;
      if (labelPlacement) toolLabel.style.transform = `translate(${tool.x + labelPlacement.x}px, ${tool.y + labelPlacement.y}px)`;
    }

    function render(running) {
      const angle = (elapsed / REVOLUTION_MS) * Math.PI * 2;
      tools.forEach((tool) => {
        const theta = angle + tool.phase;
        const x = tool.radius * Math.cos(theta);
        const y = tool.radius * Math.sin(theta);
        tool.x = x;
        tool.y = y;
        // Only transforms change per frame. Buttons and logos stay upright.
        tool.button.style.transform = `translate(${x - 22}px, ${y - 22}px)`;
      });

      pulse.hidden = true;
      beam.hidden = true;
      const inspected = inspection();
      if (inspected) {
        activate(dismissed ? null : inspected);
        return;
      }
      if (!running) {
        activate(null);
        return;
      }

      // DOM order is Figma, Webflow, VS Code, Pages CMS, GitHub, Make, Supabase.
      const tool = tools[Math.floor(elapsed / SLOT_MS) % tools.length];
      const localTime = elapsed % SLOT_MS;
      const arrival = PULSE_START_MS + PULSE_DURATION_MS;
      activate(localTime >= arrival && localTime < ACTIVE_END_MS ? tool : null);

      if (localTime >= PULSE_START_MS && localTime < arrival + PULSE_FADE_MS) {
        const progress = Math.min(1, (localTime - PULSE_START_MS) / PULSE_DURATION_MS);
        const planetRadius = Math.min(36, 28 * scale) / 2;
        const start = portraitRadius + 2;
        const end = tool.radius - planetRadius;
        const radius = start + (end - start) * progress;
        const theta = angle + tool.phase;
        const opacity = Math.min(1, progress * 6, (arrival + PULSE_FADE_MS - localTime) / PULSE_FADE_MS);
        // A short train of separate particles follows the head. Fixed 8px gaps
        // keep the small inner-orbit pulse dotted instead of merging into a line.
        trailDots.forEach((dot, index) => {
          const dotRadius = radius - (index + 1) * 8;
          dot.hidden = dotRadius < start;
          if (dot.hidden) return;
          dot.style.transform = `translate(${dotRadius * Math.cos(theta) - 2}px, ${dotRadius * Math.sin(theta) - 2}px)`;
          dot.style.opacity = String(0.65 * opacity * (1 - (index + 1) / (trailDots.length + 1)));
        });
        beam.hidden = false;
        pulse.style.transform = `translate(${radius * Math.cos(theta) - 4}px, ${radius * Math.sin(theta) - 4}px)`;
        pulse.style.opacity = String(0.85 * opacity);
        pulse.hidden = false;
      }
    }

    function animate(timestamp) {
      frame = null;
      if (!canRun()) {
        // Keep the control and pulse state synchronized if a media/visibility
        // change is observed by this frame before its change event arrives.
        reconcile();
        return;
      }
      if (lastTimestamp !== null) elapsed += timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      render(true);
      frame = window.requestAnimationFrame(animate);
    }

    function reconcile() {
      const running = canRun();
      root.dataset.motion = running ? "running" : "paused";
      const paused = !requested();
      toggle.setAttribute("aria-pressed", String(paused));
      toggleLabel.textContent = paused ? root.dataset.playLabel : root.dataset.pauseLabel;

      if (running) {
        if (frame === null) {
          lastTimestamp = null;
          frame = window.requestAnimationFrame(animate);
        }
      } else {
        if (frame !== null) window.cancelAnimationFrame(frame);
        frame = null;
        lastTimestamp = null;
      }
      render(running);
    }

    function measure() {
      const size = Math.max(0, Math.min(520, root.getBoundingClientRect().width));
      if (Math.abs(size - measuredSize) < 0.01) return;
      measuredSize = size;
      stageSize = size;
      labelSize = null;
      scale = size / 280;
      portraitRadius = Math.min(80, Math.max(48, 48 * scale)) / 2;
      const innerRadius = portraitRadius + 42;
      const outerRadius = size / 2 - 32;
      const radii = Array.from({ length: 4 }, (_, ring) =>
        innerRadius + ((outerRadius - innerRadius) * ring) / 3,
      );
      tools.forEach((tool) => { tool.radius = radii[tool.ring - 1]; });
      orbits.forEach((orbit, ring) => {
        orbit.style.setProperty("--solar-orbit-size", `${radii[ring] * 2}px`);
      });
      stage.style.width = `${size}px`;
      stage.style.height = `${size}px`;
      root.style.setProperty("--solar-scale", String(scale));
      root.style.setProperty("--solar-portrait-size", `${portraitRadius * 2}px`);
      hasSpace = size >= 280 - 0.01;
      reconcile();
    }

    function updateSelection() {
      tools.forEach((tool) => tool.button.setAttribute("aria-pressed", String(tool === selected)));
      reconcile();
    }

    tools.forEach((tool) => {
      tool.button.style.left = "50%";
      tool.button.style.top = "50%";
      tool.button.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "touch") return;
        hovered = tool;
        dismissed = false;
        reconcile();
      });
      tool.button.addEventListener("focus", () => {
        // Touch/mouse selection is handled by click; keyboard focus is temporary.
        if (tool.button.matches(":focus-visible")) focused = tool;
        dismissed = false;
        reconcile();
      });
      tool.button.addEventListener("blur", () => {
        if (focused === tool) focused = null;
        reconcile();
      });
      tool.button.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "touch") return;
        touching = tool;
        dismissed = false;
        reconcile();
      });
      ["pointerup", "pointercancel"].forEach((eventName) => {
        tool.button.addEventListener(eventName, () => {
          if (touching === tool) touching = null;
          reconcile();
        });
      });
      tool.button.addEventListener("click", () => {
        selected = selected === tool ? null : tool;
        dismissed = false;
        updateSelection();
      });
    });

    // Keep hover content reachable while crossing the visual to its name strip.
    // Leaving the component ends inspection; entering another planet switches it.
    root.addEventListener("pointerleave", () => {
      hovered = null;
      reconcile();
    });

    toolLabel.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch" || !active) return;
      hovered = active;
      dismissed = false;
      reconcile();
    });

    toggle.addEventListener("click", () => {
      if (requested()) {
        userPaused = true;
      } else {
        userPaused = false;
        // Reduced motion stays static by default; Play is an explicit opt-in.
        reducedMotionOptIn = true;
        hovered = null;
        focused = null;
        selected = null;
        touching = null;
        dismissed = false;
      }
      updateSelection();
    });

    document.addEventListener("pointerdown", (event) => {
      if (root.contains(event.target)) return;
      selected = null;
      touching = null;
      dismissed = false;
      updateSelection();
    });
    root.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      selected = null;
      dismissed = true;
      updateSelection();
    });
    document.addEventListener("visibilitychange", reconcile);
    reduceMotion.addEventListener("change", () => {
      reducedMotionOptIn = false;
      reconcile();
    });

    toggle.hidden = false;
    root.setAttribute("data-ready", "");
    measure();
    if (document.fonts) document.fonts.ready.then(() => {
      labelSize = null;
      render(canRun());
    });

    if ("ResizeObserver" in window) {
      // Height follows the stage and wrapped labels in normal flow. Observe
      // width only, and write on the next frame to avoid resize delivery loops.
      const resizeObserver = new ResizeObserver((entries) => {
        const size = Math.max(0, Math.min(520, entries[0].contentRect.width));
        if (Math.abs(size - measuredSize) < 0.01 || resizeFrame !== null) return;
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = null;
          measure();
        });
      });
      resizeObserver.observe(root);
    } else {
      window.addEventListener("resize", measure, { passive: true });
    }
    if ("IntersectionObserver" in window) {
      const intersectionObserver = new IntersectionObserver((entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        reconcile();
      });
      intersectionObserver.observe(root);
    }
  });
})();
