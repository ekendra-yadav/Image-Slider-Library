class ImageSlider {
  constructor(root) {
    // Get the slider elements from the HTML.
    this.root = root;
    this.track = root.querySelector("[data-track]");
    this.previousButton = root.querySelector("[data-previous]");
    this.nextButton = root.querySelector("[data-next]");

    // The dots and image counter are located in the slider section.
    this.dotsContainer = root.closest(".slider-section").querySelector("[data-dots]");
    this.counter = root.closest(".slider-section").querySelector("[data-counter]");

    // Store the original slides and set the slider's starting position.
    this.originalSlides = Array.from(this.track.children);
    this.slideCount = this.originalSlides.length;
    this.currentIndex = 0;
    this.position = 1; // The first original slide comes after the cloned last slide.
    this.isAnimating = false;

    // Disable navigation if there is only one image to display.
    if (this.slideCount < 2) {
      this.previousButton.disabled = true;
      this.nextButton.disabled = true;
      return;
    }

    // Prepare the slider and connect its controls.
    this.createClones();
    this.createDots();
    this.updateTrack(false);
    this.updateStatus();
    this.bindEvents();
  }

  createClones() {
    // Copies of the first and last slides make the slider loop smoothly.
    const firstClone = this.originalSlides[0].cloneNode(true);
    const lastClone = this.originalSlides[this.slideCount - 1].cloneNode(true);

    // Mark the copies so they can be identified and hidden from screen readers.
    firstClone.dataset.clone = "first";
    lastClone.dataset.clone = "last";
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    // Place the last slide at the beginning and the first slide at the end.
    this.track.insertBefore(lastClone, this.originalSlides[0]);
    this.track.appendChild(firstClone);
  }

  createDots() {
    // Clear any existing dots before creating one for each original image.
    this.dotsContainer.replaceChildren();

    this.originalSlides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Show image ${index + 1}`);

      // Clicking a dot takes the slider to its corresponding image.
      dot.addEventListener("click", () => this.goTo(index));
      this.dotsContainer.appendChild(dot);
    });

    // Keep a reference to the newly created buttons for later updates.
    this.dots = Array.from(this.dotsContainer.children);
  }

  updateTrack(animate = true) {
    // Animate movement between images, except when resetting a loop position.
    this.track.style.transition = animate
      ? "transform 560ms cubic-bezier(0.22, 0.75, 0.25, 1)"
      : "none";

    // Move the track horizontally to show the selected slide.
    this.track.style.transform = `translateX(-${this.position * 100}%)`;
  }

  goTo(index) {
    // Ignore clicks while the slider is moving or if the index is invalid.
    if (this.isAnimating || index < 0 || index >= this.slideCount) return;

    const difference = index - this.currentIndex;

    // Do nothing if the selected image is already visible.
    if (difference === 0) return;

    // Move directly to the selected image and update the current index.
    this.position += difference;
    this.currentIndex = index;
    this.isAnimating = true;
    this.updateTrack(true);
    this.updateStatus();
  }

  next() {
    // Prevent another movement from starting before the current one finishes.
    if (this.isAnimating) return;

    this.position += 1;
    this.currentIndex = (this.currentIndex + 1) % this.slideCount;
    this.isAnimating = true;
    this.updateTrack(true);
    this.updateStatus();
  }

  previous() {
    // Move one slide backward, returning to the last image when necessary.
    if (this.isAnimating) return;

    this.position -= 1;
    this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
    this.isAnimating = true;
    this.updateTrack(true);
    this.updateStatus();
  }

  updateStatus() {
    // Highlight the dot for the currently displayed original image.
    this.dots.forEach((dot, index) => {
      const active = index === this.currentIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", String(active));
    });

    // Keep the image counter in sync with the selected slide.
    this.counter.textContent = `Image ${this.currentIndex + 1} of ${this.slideCount}`;
  }

  bindEvents() {
    // Connect the arrow buttons to the navigation methods.
    this.previousButton.addEventListener("click", () => this.previous());
    this.nextButton.addEventListener("click", () => this.next());

    // Once the movement finishes, reset the position if a cloned slide is shown.
    this.track.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") return;

      if (this.position === 0) {
        // Jump to the matching original last slide without animation.
        this.position = this.slideCount;
        this.updateTrack(false);
      } else if (this.position === this.slideCount + 1) {
        // Jump back to the original first slide without a visible interruption.
        this.position = 1;
        this.updateTrack(false);
      }

      this.isAnimating = false;
    });

    // Allow users to move between images with the left and right arrow keys.
    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowRight") this.next();
      if (event.key === "ArrowLeft") this.previous();
    });
  }
}

// Create a slider instance for every slider element found in the HTML.
document.querySelectorAll("[data-slider]").forEach((sliderElement) => {
  new ImageSlider(sliderElement);
});