export const initPageTransition = () => {
    document.addEventListener("DOMContentLoaded", () => {
        const overlay = document.querySelector(".js-page-overlay");
        const bg = document.querySelector(".js-bg-wrapper");
        const kv = document.querySelector(".js-kv-title-wrapper");
        const ease = "power3.inOut";

        // ===== Enter（次ページ表示時） =====
        // ページ内容を少し拡大した状態にしておく
        gsap.set(bg, { scale: 1.15 });
        gsap.set(kv, { y: 50, opacity: 0 });
        // 黒背景を下に引きながら app をズームアウト
        gsap.timeline().to(overlay, { yPercent: 100, duration: 0.6, ease }, 0).to(bg, { scale: 1, duration: 0.8, ease }, 0).to(kv, { y: 0, opacity: 1 });

        // ===== Leave（リンククリック時） =====
        document.addEventListener("click", (e) => {
            const a = e.target.closest("a");
            if (!a) return;

            const url = new URL(a.getAttribute("href", 2) || "", location.href);
            const isSameOrigin = url.origin === location.origin;
            const isNewTab = a.target === "_blank" || e.metaKey || e.ctrlKey;
            if (!isSameOrigin || isNewTab) return;

            e.preventDefault();

            gsap.to(overlay, {
                yPercent: 0,
                duration: 0.5,
                ease,
                onComplete: () => {
                    window.location.href = url.href;
                },
            });
        });
    });
};
