gsap.registerPlugin(ScrollTrigger);

function initStackingCardsParallax() {
  const cards = document.querySelectorAll("[data-stacking-cards-item]");

  if (cards.length < 2) return;

  cards.forEach((card, i) => {
    // Skip over the first section
    if (i === 0) return;

    // When current section is in view, target the PREVIOUS one
    const previousCard = cards[i - 1];
    if (!previousCard) return;

    // Find any element inside the previous card
    const previousCardImage = previousCard.querySelector("[data-stacking-cards-img]");

    let tl = gsap.timeline({
      defaults: {
        ease: "none",
        duration: 1,
      },
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(previousCard, { yPercent: 0 }, { yPercent: 50 }).fromTo(
      previousCardImage,
      { rotate: 0, yPercent: 0 },
      { rotate: -5, yPercent: -25 },
      "<"
    );
  });
}

// Initialize Stacking Cards Parallax
document.addEventListener("DOMContentLoaded", () => {
  initStackingCardsParallax();
});
