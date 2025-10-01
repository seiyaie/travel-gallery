// components/top-loading.js

import { setupScrollTopOnReload, markInternalNav } from "../utility/scroll-reset.js";
import { disableScroll, enableScroll } from "../utility/scroll-lock.js";

export const initTopLoading = () => {
    const loading = document.querySelector(".js-loading");
    const counter = document.querySelector(".js-counter");
    const bg = document.querySelector(".js-bg img");
    const kv = document.querySelector(".js-kv-title-wrapper");
    const ease = "power3.inOut";

    setupScrollTopOnReload({ kvSelector: ".js-kv", once: false });

    if (!loading || !counter) return;

    // ===== 背景・タイトル初期状態 =====
    gsap.set(bg, { scale: 1.15 });
    gsap.set(kv, { y: 50, opacity: 0 });

    // bodyスクロール止め
    disableScroll();

    // ===== 次の演出は一旦停止状態で用意しておく =====
    const tl = gsap.timeline({ paused: true });
    tl.to(counter, { duration: 0.25, opacity: 0 })
        .to(loading, { delay: 0.1, duration: 0.6, yPercent: 100, ease }, ">+0.1")
        .to(bg, { scale: 1, ease, duration: 1 }, "<")
        .to(
            kv,
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease,
                onComplete: () => {
                    enableScroll();
                },
            },
            "<"
        );

    // === Leave ===
    let isAnimating = false;
    document.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (!a) return;

        const href = a.getAttribute("href") || "";
        const isNewTab = a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

        // 新規タブ / アンカー / tel/mailto / 外部 は除外
        if (isNewTab || !href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return;

        e.preventDefault();

        if (isAnimating) return;
        isAnimating = true;

        // 内部遷移マーク（復帰時に“リロード扱い”にしないため）
        markInternalNav();

        gsap.to(loading, {
            yPercent: 0,
            duration: 0.5,
            ease,
            onComplete: () => {
                window.location.href = url.href;
            },
        });
    });

    let obj = { value: 0 };

    function randomIncrement() {
        const nextValue = obj.value + Math.floor(Math.random() * 10) + 1;

        gsap.to(obj, {
            value: Math.min(nextValue, 100),
            duration: 0.05,
            ease: "power1.out",
            onUpdate: () => {
                counter.textContent = Math.floor(obj.value) + "%";
            },
            onComplete: async () => {
                if (obj.value < 100) {
                    // 次のインクリメントまでの待ち時間も少しランダムに
                    const wait = Math.random() * 0.1 + 0.02; //
                    gsap.delayedCall(wait, randomIncrement);
                } else {
                    // 100%に達したら念のため表示を100%に固定してから次へ
                    counter.textContent = "100%";
                    try {
                        await bg.decode();
                    } catch (_) {}
                    tl.play();
                }
            },
        });
    }

    randomIncrement();
};
