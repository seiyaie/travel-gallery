gsap.registerPlugin(ScrollTrigger);

export const initTopGalleryReveal = () => {
    ScrollTrigger.batch(".js-top-gallery-item", {
        start: "top 80%",
        onEnter: (batch) => {
            gsap.to(batch, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.4,
                ease: "linear",
                stagger: { each: 0.2, from: "start" },
            });
        },
    });
    // ScrollTrigger.batch(".js-top-gallery-item", {
    //     start: "top bottom",
    //     onLeaveBack: (batch) => {
    //         gsap.set(batch, {
    //             clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    //         });
    //     },
    // });
};
