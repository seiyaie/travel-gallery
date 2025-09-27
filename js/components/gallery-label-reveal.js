// components/gallery-label-reveal.js

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

    const setupOne = (item) => {
        const labels = getLabels(item);
        if (!labels.length) return;
        setInitial(labels);

        // --- PC: hover イベント ---
        item.addEventListener("mouseenter", () => playIn(item, labels));
        item.addEventListener("mouseleave", () => playOut(item, labels));

        // --- スマホ: ScrollTrigger ---
        ScrollTrigger.create({
            trigger: item,
            start: "top 70%",
            end: "bottom 30%",
            markers: true,
            onEnter: () => playIn(item, labels),
            onEnterBack: () => playIn(item, labels),
            onLeave: () => playOut(item, labels),
            onLeaveBack: () => playOut(item, labels),
        });
    };

    items.forEach(setupOne);

    // ★ refresh のたびに初期位置を入れ直す（画像ロードで高さが変わったケースに強い）
    const onRefresh = () => {
        items.forEach((item) => {
            const labels = getLabels(item);
            if (labels.length) setInitial(labels);
        });
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
};
