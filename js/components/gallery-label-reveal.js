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
        ease: "back.inOut(4)",
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

/** このアイテム専用の ScrollTrigger を一度だけ作成 */
function createTriggerFor(item) {
    // 二重作成ガード（既に作っていればスキップ or killして作り直す）
    if (item._st) return item._st;

    const labels = getLabels(item);
    if (!labels.length) return null;

    setInitial(labels);

    // hover はポインタ対応端末のみ
    if (window.matchMedia("(hover: hover)").matches) {
        item.addEventListener("mouseenter", () => playIn(item, labels));
        item.addEventListener("mouseleave", () => playOut(item, labels));
    }

    // ScrollTrigger
    item._st = ScrollTrigger.create({
        trigger: item,
        start: "top 70%",
        end: "bottom 30%",
        onToggle: (self) => (self.isActive ? playIn(item, labels) : playOut(item, labels)),
    });

    return item._st;
}

export const initGalleryLabelReveal = () => {
    const items = gsap.utils.toArray(".js-gallery-item");

    items.forEach((item) => {
        const img = item.querySelector("img");


        // 既に読み込み済み（キャッシュ含む）→ 即作成（必要に応じてdecodeでさらに確実に）
        if (img.complete && img.naturalWidth > 0) {
            (async () => {
                try {
                    await img.decode();
                } catch (_) {}
                createTriggerFor(item);
            })();
            return;
        }

        // lazy等で後からロード → ロード/エラーどちらでも作成（必ず once）
        const done = async () => {
            img.removeEventListener("load", done);
            img.removeEventListener("error", done);
            createTriggerFor(item);
        };
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
    });

    // refresh のたびに「ラベルの初期位置だけ」入れ直す
    const onRefresh = () => {
        items.forEach((item) => {
            const st = item._st;
            if (!st || st.isActive) return;
            const labels = getLabels(item);
            if (labels.length) setInitial(labels);
        });
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);
};
