gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

function initImagesOnPathScroll() {
  const wrap = document.querySelector('[data-motionpath="wrap"]');
  const path = wrap.querySelector('[data-motionpath="path"]');
  const items = wrap.querySelectorAll('[data-motionpath="item"]');
  const itemDetails = wrap.querySelectorAll('[data-motionpath="item-details"]');

  // Set z-index on items, to make sure the 1st item is on top
  gsap.set(items, {
    zIndex: (i, target, all) => all.length - i,
  });

  // if there’s an old timeline, grab its progress, reset it, then kill it
  const oldTl = initImagesOnPathScroll.tl;
  let progress = 0;

  if (oldTl) {
    progress = oldTl.progress();
    oldTl.progress(0).kill();
  }

  // create a new timeline + ScrollTrigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
    defaults: {
      ease: "none",
      stagger: 0.3, // Define the space between each item
    },
  });

  tl.to(items, {
    duration: 1,
    motionPath: { path, align: path, curviness: 2, alignOrigin: [0.5, 0.5] },
  })
    .fromTo(items, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0)
    .fromTo(items, { filter: "blur(1.5em)" }, { filter: "blur(0em)", duration: 0.5 }, 0)
    .fromTo(itemDetails, { autoAlpha: 0, yPercent: 25 }, { autoAlpha: 1, yPercent: 0, duration: 0.1 }, 0.5)
    .fromTo(items, { scale: 0.4 }, { scale: 1, duration: 0.65 }, 0)
    .to(items, { autoAlpha: 0, filter: "blur(1em)", duration: 0.15 }, 0.85)
    .to(itemDetails, { autoAlpha: 0, duration: 0.05 }, 0.9);

  // jump back to previous spot and refresh
  tl.progress(progress);
  ScrollTrigger.refresh();

  // store it on the function so we can grab it next time
  initImagesOnPathScroll.tl = tl;

  // on first run bind a single debounced resize listener
  if (!initImagesOnPathScroll.resizeHandler) {
    initImagesOnPathScroll.resizeHandler = debounce(() => {
      initImagesOnPathScroll();
    }, 200);
    window.addEventListener("resize", initImagesOnPathScroll.resizeHandler);
  }

  return tl;
}

function debounce(fn, delay = 200) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

// Initialize Follow SVG Path on Scroll
document.addEventListener("DOMContentLoaded", () => {
  initImagesOnPathScroll();
});
