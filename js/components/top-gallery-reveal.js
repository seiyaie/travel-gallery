export const initTopGalleryReveal = () => {
    ScrollTrigger.batch(".js-top-gallery-item", {
        scroller: 'body',
        trigger: '.js-top-gallery-item',
        start: "center 80%",
        onEnter: (batch) => {
            gsap.to(batch, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.4,
                ease: "linear",
                stagger: { each: 0.2, from: "start" },
            });
        },
    });
};
