# Image Slider Library

A responsive, infinitely looping image slider built with semantic HTML, custom CSS, and vanilla JavaScript.

## Features
- Previous and Next controls on the viewing window.
- Dots generated from the number of original slides.
- Horizontal track animation using `transform: translateX()` and CSS transitions.
- Infinite looping using cloned boundary slides and `transitionend` normalization.
- Responsive sizing and image cropping with `object-fit: cover`.
- Keyboard navigation using the left and right arrow keys.
- Accessible labels, active-dot state, live counter, and reduced-motion support.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser. Internet access is required for the sample Unsplash images.
3. Click arrows and dots, test both boundaries, resize the browser, and try keyboard arrows.

## Deploy with GitHub Pages
1. Create a public GitHub repository named `image-slider-library`.
2. Upload `index.html`, `style.css`, `slider.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under build/deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Wait for the deployment to complete and copy the published URL into your report.

## Project files
- `index.html` — semantic page structure and sample slides.
- `style.css` — responsive layout, visual styles, and transition states.
- `slider.js` — slide indexing, dynamic dots, events, and infinite-loop behavior.