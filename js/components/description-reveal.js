// components/description-reveal.js

export const initDescReveal = () => {
    const description = document.querySelectorAll(".js-description-item");

    description.forEach((item) => {
        gsap.from(item, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: "power4.out",
            scrollTrigger: {
                trigger: item,
                start: "top 70%",
            },
        });
    });
};
