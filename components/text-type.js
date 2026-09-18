(() => {
class TextType {
  constructor(element, options = {}) {
    this.element = element;
    this.texts = options.texts?.length ? options.texts : [options.text || ""];
    this.typingSpeed = options.typingSpeed || 68;
    this.deletingSpeed = options.deletingSpeed || 34;
    this.pauseDuration = options.pauseDuration || 1800;
    this.initialDelay = options.initialDelay || 350;
    this.cursorCharacter = options.cursorCharacter || "|";
    this.currentText = 0;
    this.currentCharacter = 0;
    this.deleting = false;
    this.timeout = null;
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    this.render();
    if (this.reducedMotion) {
      this.content.textContent = this.texts[0];
      return;
    }
    this.timeout = window.setTimeout(() => this.tick(), this.initialDelay);
  }

  render() {
    this.element.classList.add("text-type");
    this.content = document.createElement("span");
    this.content.className = "text-type__content";
    this.cursor = document.createElement("span");
    this.cursor.className = "text-type__cursor";
    this.cursor.setAttribute("aria-hidden", "true");
    this.cursor.textContent = this.cursorCharacter;
    this.element.replaceChildren(this.content, this.cursor);
  }

  tick() {
    const text = this.texts[this.currentText] || "";

    if (!this.deleting) {
      this.content.textContent = text.slice(0, this.currentCharacter + 1);
      this.currentCharacter += 1;
      if (this.currentCharacter >= text.length) {
        this.deleting = true;
        this.timeout = window.setTimeout(() => this.tick(), this.pauseDuration);
        return;
      }
      this.timeout = window.setTimeout(() => this.tick(), this.typingSpeed);
      return;
    }

    this.content.textContent = text.slice(0, Math.max(this.currentCharacter - 1, 0));
    this.currentCharacter -= 1;
    if (this.currentCharacter <= 0) {
      this.deleting = false;
      this.currentText = (this.currentText + 1) % this.texts.length;
      this.currentCharacter = 0;
    }
    this.timeout = window.setTimeout(() => this.tick(), this.deletingSpeed);
  }
}

window.TextType = TextType;
})();
