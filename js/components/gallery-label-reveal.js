gsap.registerPlugin(ScrollTrigger);

const dateLabel = ".js-gallery-item-date";
const nameLabel = ".js-gallery-item-name";

function getLabels(item) {
    return [item.querySelector(dateLabel), item.querySelector(nameLabel)].filter(Boolean);
}

function setInitial(labels) {
    gsap.set(labels, {
        yPercent: (i, el) => (el.matches(dateLabel) ? -200 : 200),
        xPercent: -50,
    });
}

function playIn(item, labels) {
    gsap.to(item, {
        scale: 1.05,
        opacity: 1,
        duration: 0.3,
        ease: "sine.out",
        overwrite: "auto",
    });
    gsap.to(labels, {
        yPercent: 0,
        duration: 0.5,
        ease: "back.inOut",
        overwrite: "auto",
    });
}

function playOut(item, labels) {
    gsap.to(item, {
        scale: 1,
        opacity: 0.7,
        duration: 0.3,
        ease: "sine.out",
        overwrite: "auto",
    });
    gsap.to(labels, {
        yPercent: (i, el) => (el.matches(dateLabel) ? -200 : 200),
        duration: 0.3,
        ease: "power2.in",
        stagger: 0.02,
        overwrite: "auto",
    });
}

export const initGalleryLabelReveal = () => {
    const items = gsap.utils.toArray(".js-gallery-item");

    items.forEach((item) => {
        const labels = getLabels(item);
        if (!labels.length) return;

        // 初期位置
        setInitial(labels);

        // --- PC: hover イベント ---
        item.addEventListener("mouseenter", () => playIn(item, labels));
        item.addEventListener("mouseleave", () => playOut(item, labels));

        // --- スマホ: ScrollTrigger ---
        ScrollTrigger.create({
            trigger: item,
            start: "top center",
            end: "bottom center",
            onEnter: () => playIn(item, labels),
            onEnterBack: () => playIn(item, labels),
            onLeave: () => playOut(item, labels),
            onLeaveBack: () => playOut(item, labels),
        });
    });

    // const lazyImgs = Array.from(document.querySelectorAll(".js-gallery-item img["));
    // if (lazyImgs.length === 0) {
    //     ScrollTrigger.refresh();
    // } else {
    //     let pending = lazyImgs.length;
    //     const done = () => {
    //         if (--pending <= 0) ScrollTrigger.refresh();
    //     };
    //     lazyImgs.forEach((img) => {
    //         if (img.complete) {
    //             done();
    //         } else {
    //             img.addEventListener("load", done, { once: true });
    //             img.addEventListener("error", done, { once: true });
    //         }
    //     });
    // }
};
