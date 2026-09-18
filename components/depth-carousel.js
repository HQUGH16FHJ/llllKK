class DepthCarousel {
  constructor(element, options = {}) {
    this.element = element;
    this.items = options.items || [];
    this.cardWidth = options.cardWidth || 300;
    this.cardHeight = options.cardHeight || 380;
    this.radius = options.radius || 16;
    this.depth = options.depth || 220;
    this.spread = options.spread || 90;
    this.tilt = options.tilt || 22;
    this.tiltDirection = options.tiltDirection || "right";
    this.visibleCards = options.visibleCards || 4;
    this.falloff = options.falloff || 0.2;
    this.blur = options.blur ?? 6;
    this.duration = options.duration || 700;
    this.autoplay = Boolean(options.autoplay);
    this.autoplayDelay = options.autoplayDelay || 3200;
    this.loop = options.loop !== false;
    this.onSelect = options.onSelect;
    this.position = 0;
    this.focusIndex = 0;
    this.scale = 1;
    this.drag = null;
    this.frame = null;
    this.autoplayTimer = null;
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.render();
    this.bind();
    this.layout();
    if (this.autoplay && !this.reducedMotion) {
      this.startAutoplay();
    }
  }

  render() {
    this.element.className = "depth-carousel";
    this.element.tabIndex = 0;
    this.element.setAttribute("role", "group");
    this.element.setAttribute("aria-roledescription", "carousel");
    this.element.style.setProperty("--dc-perspective", "1400px");

    const stage = document.createElement("div");
    stage.className = "depth-carousel__stage";
    this.cards = [];

    this.items.forEach((item, index) => {
      const card = document.createElement("button");
      const image = document.createElement("img");
      const tint = document.createElement("span");
      const caption = document.createElement("span");
      const date = document.createElement("small");
      const title = document.createElement("strong");

      card.type = "button";
      card.className = "depth-carousel__card";
      card.style.width = `${this.cardWidth}px`;
      card.style.height = `${this.cardHeight}px`;
      card.style.borderRadius = `${this.radius}px`;
      card.setAttribute("aria-label", item.alt || `照片 ${index + 1}`);
      card.addEventListener("click", () => {
        if (this.drag?.moved) {
          return;
        }
        this.setFocus(index);
        this.onSelect?.(index, item);
      });

      image.className = "depth-carousel__img";
      image.src = item.image;
      image.alt = item.alt || "";
      image.draggable = false;
      image.addEventListener("error", () => {
        const fallback = item.fallback || item.image.replace("/photos/", "/");
        if (fallback !== item.image && image.dataset.fallbackUsed !== "true") {
          image.dataset.fallbackUsed = "true";
          image.src = fallback;
        }
      });

      tint.className = "depth-carousel__tint";
      tint.style.background = "#05060a";
      caption.className = "depth-carousel__caption";
      date.textContent = item.date || "";
      title.textContent = item.caption || "";
      caption.append(date, title);
      card.append(image, tint, caption);
      stage.append(card);
      this.cards.push({ card, tint });
    });

    const prev = this.createArrow("prev");
    const next = this.createArrow("next");
    const dots = document.createElement("div");
    dots.className = "depth-carousel__dots";
    this.dots = this.items.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "depth-carousel__dot";
      dot.setAttribute("aria-label", `查看第 ${index + 1} 张照片`);
      dot.addEventListener("click", () => this.setFocus(index));
      dots.append(dot);
      return dot;
    });

    this.element.replaceChildren(stage, prev, next, dots);
  }

  createArrow(direction) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `depth-carousel__arrow depth-carousel__arrow--${direction}`;
    button.setAttribute(
      "aria-label",
      direction === "prev" ? "上一张照片" : "下一张照片",
    );
    button.innerHTML =
      direction === "prev"
        ? '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    button.addEventListener("click", () =>
      this.setFocus(this.focusIndex + (direction === "prev" ? -1 : 1)),
    );
    return button;
  }

  bind() {
    this.resizeObserver = new ResizeObserver(() => {
      const width = this.element.clientWidth;
      const needed = this.cardWidth + Math.abs(this.spread) * 2 + 120;
      this.scale = Math.min(Math.max(width / needed, 0.4), 1);
      this.layout(this.position);
    });
    this.resizeObserver.observe(this.element);

    this.element.addEventListener("pointerdown", (event) => {
      if (
        event.target.closest(
          ".depth-carousel__arrow, .depth-carousel__dot",
        )
      ) {
        return;
      }
      this.drag = {
        x: event.clientX,
        start: this.position,
        moved: false,
      };
    });

    this.element.addEventListener("pointermove", (event) => {
      if (!this.drag) {
        return;
      }
      const delta = event.clientX - this.drag.x;
      if (!this.drag.moved && Math.abs(delta) > 5) {
        this.drag.moved = true;
      }
      if (!this.drag.moved) {
        return;
      }
      const step = Math.max(this.cardWidth * 0.56 * this.scale, 40);
      this.position = this.drag.start - delta / step;
      this.layout(this.position);
    });

    const endDrag = () => {
      if (!this.drag) {
        return;
      }
      if (this.drag.moved) {
        this.setFocus(Math.round(this.position));
      }
      this.drag = null;
    };

    this.element.addEventListener("pointerup", endDrag);
    this.element.addEventListener("pointercancel", endDrag);

    this.element.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        this.setFocus(this.focusIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        this.setFocus(this.focusIndex + 1);
      }
    });

    this.element.addEventListener("mouseenter", () => this.stopAutoplay());
    this.element.addEventListener("mouseleave", () => {
      if (this.autoplay) {
        this.startAutoplay();
      }
    });
  }

  normalizeIndex(index) {
    const count = this.items.length;
    if (!count) {
      return 0;
    }
    if (!this.loop) {
      return Math.min(Math.max(index, 0), count - 1);
    }
    return ((index % count) + count) % count;
  }

  setFocus(index, animate = true) {
    const count = this.items.length;
    if (!count) {
      return;
    }
    const targetIndex = this.normalizeIndex(index);
    let target = targetIndex;

    if (this.loop && count > 1) {
      let delta = targetIndex - this.position;
      delta = ((delta % count) + count) % count;
      if (delta > count / 2) {
        delta -= count;
      }
      target = this.position + delta;
    }

    if (!animate || this.reducedMotion) {
      this.position = target;
      this.layout(target);
    } else {
      this.animateTo(target);
    }
    this.focusIndex = targetIndex;
    this.updateDots();
  }

  animateTo(target) {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
    const start = this.position;
    const started = performance.now();
    const duration = this.duration;

    const step = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.position = start + (target - start) * eased;
      this.layout(this.position);
      if (progress < 1) {
        this.frame = requestAnimationFrame(step);
      } else {
        this.position = this.normalizeIndex(target);
        this.layout(this.position);
      }
    };
    this.frame = requestAnimationFrame(step);
  }

  layout(position = this.position) {
    const count = this.items.length;
    if (!count) {
      return;
    }
    const direction = this.tiltDirection === "left" ? -1 : 1;

    this.cards.forEach(({ card, tint }, index) => {
      let distance = index - position;
      if (this.loop && count > 1) {
        distance = ((distance % count) + count) % count;
        if (distance > count / 2) {
          distance -= count;
        }
      }

      const back = Math.max(distance, 0);
      const shown = Math.abs(distance) <= this.visibleCards + 0.5;
      const translateZ = -this.depth * distance;
      const translateX = direction * this.spread * distance;
      const rotateY = direction * this.tilt * Math.min(Math.max(distance, 0), 1);
      const opacity = distance < 0 ? Math.max(0, 1 + distance) : 1;
      const brightness = Math.max(0.15, 1 - back * this.falloff);
      const blurPx =
        this.blur > 0
          ? Math.min(
              this.blur,
              (back / Math.max(1, this.visibleCards)) * this.blur,
            )
          : 0;

      card.style.transform = `translate(-50%, -50%) scale(${this.scale}) translateX(${translateX.toFixed(2)}px) translateZ(${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(3)}deg)`;
      card.style.opacity = shown ? opacity.toFixed(3) : "0";
      card.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
      card.style.zIndex = String(Math.round(2000 - distance * 20));
      card.style.pointerEvents =
        shown && opacity > 0.05 ? "auto" : "none";
      tint.style.opacity = Math.min(
        Math.max(back * this.falloff * 1.25, 0),
        0.86,
      );
    });
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === this.focusIndex);
    });
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayTimer = window.setInterval(
      () => this.setFocus(this.focusIndex + 1),
      this.autoplayDelay,
    );
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      window.clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  destroy() {
    this.stopAutoplay();
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
  }
}

window.DepthCarousel = DepthCarousel;
