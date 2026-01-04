function initHorizontalScrolling() {
  const mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: "(max-width:479px)",
      isMobileLandscape: "(max-width:767px)",
      isTablet: "(max-width:991px)",
      isDesktop: "(min-width:992px)",
    },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions;

      const ctx = gsap.context(() => {
        const wrappers = document.querySelectorAll("[data-horizontal-scroll-wrap]");
        if (!wrappers.length) return;

        wrappers.forEach((wrap) => {
          // optional disable logic per breakpoint
          const disable = wrap.getAttribute("data-horizontal-scroll-disable");
          if (
            (disable === "mobile" && isMobile) ||
            (disable === "mobileLandscape" && isMobileLandscape) ||
            (disable === "tablet" && isTablet)
          ) {
            return; // skip this wrapper on specified breakpoint
          }

          const panels = gsap.utils.toArray("[data-horizontal-scroll-panel]", wrap);
          if (panels.length < 2) return;

          gsap.to(panels, {
            x: () => -(wrap.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top top",
              end: () => "+=" + (wrap.scrollWidth - window.innerWidth),
              scrub: true,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      return () => ctx.revert(); // cleanup
    }
  );
}

// Initialize Horizontal Scrolling Sections
document.addEventListener("DOMContentLoaded", () => {
  initHorizontalScrolling();
});
