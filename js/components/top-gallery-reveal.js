// components/top-gallery-reveal.js

export const initTopGalleryReveal = () => {
    ScrollTrigger.batch(".js-top-gallery-item", {
        scroller: "body",
        trigger: ".js-top-gallery-item",
        start: "top 70%",
        onEnter: (batch) => {
            gsap.to(batch, {
                clipPath: "inset(0 0 0% 0)",
                webkitClipPath: "inset(0 0 0% 0)",
                duration: 0.4,
                ease: "linear",
                stagger: { each: 0.2, from: "start" },
            });
        },
    });
};
