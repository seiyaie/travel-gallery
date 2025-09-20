export const initScrollArrow = () => {
    const indicator = document.querySelector(".js-indicator");
    const arrow = document.querySelector(".js-arrow");

    gsap.fromTo(
        arrow,
        {
            y: -20,
        },
        {
            y: 20,
            duration: 1.2,
            repeat: -1,
            ease: "power.in",
        }
    );

    ScrollTrigger.create({
        trigger: indicator,
        scroller: "body",
        start: "top top",
        onEnter: () =>
            gsap.to(indicator, {
                autoAlpha: 0,
                y: 16,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto",
            }),
        onLeaveBack: () =>
            gsap.to(indicator, {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto",
            }),
    });
};
