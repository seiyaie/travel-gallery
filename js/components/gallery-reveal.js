gsap.registerPlugin(ScrollTrigger);


export const initGalleryReveal = () => {
  // const scroller = opts.scroller || null; // ロコスク使うなら渡す
  const items = gsap.utils.toArray(".js-gallery-item");
  if (!items.length) return;

  items.forEach((item) => {
    let img = item.querySelector('img');
    gsap.fromTo(
      img,
      {clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"},
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "linear",
        duration: 0.4,
        scrollTrigger: {
          trigger: item,
          start: "top center",
          end: "bottom top",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};