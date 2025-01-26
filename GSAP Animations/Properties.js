document.addEventListener('DOMContentLoaded', () => {

gsap.set('[gsap-animate]', { autoAlpha: 1 });
// Set initial transform origin
gsap.set('#projects-underline', {
  transformOrigin: "left"
});

let loadTl = gsap.timeline();
loadTl.from("#projects-underline", {
    scaleX: 0, // Instead of width: 0
    duration: 1,
    ease: "power2.out",
  })
  .from("#projects-title", {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: "power2.out"
  }, "<0.3")
  .set('[gsap-animate-secondary]', {
    autoAlpha: 1,
  }, "<")
  .from(".filter_results_wrap, .projects_topbar_wrap, .filter_tags_wrap", {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: "power2.out"
  }, "<0.2");

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    console.log('CMS Filter initialized');
    const [filterInstance] = filterInstances;
    let animations = [];
    let isResetting = false;

    // Check once at initialization
    const xOffset = window.innerWidth <= 768 ? 50 : 100;

    function initProjectAnimations() {
      // Kill existing animations
      animations.forEach(anim => {
        if (anim.scrollTrigger) anim.scrollTrigger.kill();
        anim.kill();
      });
      animations = [];

      const projects = gsap.utils.toArray(".project_wrap");

      // If it's a reset, set items immediately to final state
      if (isResetting) {
        gsap.set(projects, { opacity: 1, x: 0 });
        isResetting = false;
        return;
      }

      // Force visible state first
      gsap.set(projects, { opacity: 1, x: 0 });

      projects.forEach((project) => {
        const anim = gsap.fromTo(project,
        {
          opacity: 0,
          x: xOffset
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: project,
            start: "top 95%",
            toggleActions: "play none none none"
          }
        });
        animations.push(anim);
      });
    }

    // Initial animation setup
    initProjectAnimations();

    // Listen for filter render events
    filterInstance.listInstance.on('renderitems', (renderedItems) => {
      // Check if this is a reset (all items visible)
      if (renderedItems.length === gsap.utils.toArray(".project_wrap").length) {
        isResetting = true;
      }

      setTimeout(() => {
        initProjectAnimations();
      }, 100);
    });
  },
]);
// Global menu toggle handler
document.querySelector('.nav_button').addEventListener('click', () => {
  ScrollTrigger.getAll().forEach(st => st.disable());
  setTimeout(() => {
    ScrollTrigger.getAll().forEach(st => st.enable());
  }, 200);
});
});