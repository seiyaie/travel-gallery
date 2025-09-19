export const initPageTransition = () => {
    document.addEventListener("DOMContentLoaded", () => {
        const overlay = document.querySelector(".js-page-overlay");
        const bg = document.querySelector(".js-bg-wrapper");
        const kv = document.querySelector(".js-kv-title-wrapper");
        const kvSection = document.querySelector(".js-kv");
        const ease = "power3.inOut";

        // ===== Enter（次ページ表示時） =====
        gsap.set(bg, { scale: 1.15 });
        gsap.set(kv, { y: 50, opacity: 0 });
        gsap.timeline().to(overlay, { yPercent: 100, duration: 0.6, ease }, 0).to(bg, { scale: 1, duration: 0.8, ease }, 0).to(kv, { y: 0, opacity: 1, duration: 0.8, ease }, 0);

        // ===== Leave（リンククリック時） =====
        document.addEventListener("click", (e) => {
            const a = e.target.closest("a");
            if (!a) return;

            const href = a.getAttribute("href") || "";
            const isNewTab = a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
            if (isNewTab || !href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

            const url = new URL(href, location.href);
            if (url.origin !== location.origin) return;

            // 内部リンク遷移のマーカー（フォールバック用）
            try {
                sessionStorage.setItem("nav:link", "1");
            } catch (_) {}

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

        // ===== リロード時だけ：KVが見えていたらトップへ戻す =====
        function getNavigationType() {
            try {
                const nav = performance.getEntriesByType?.("navigation")?.[0];
                if (nav?.type) return nav.type; // "navigate" | "reload" | "back_forward" ...
            } catch (_) {}
            try {
                const t = performance.navigation?.type; // 0:navigate 1:reload 2:back_forward
                if (t === 1) return "reload";
                if (t === 2) return "back_forward";
                if (t === 0) return "navigate";
            } catch (_) {}
            // フォールバック：内部リンク遷移ならマーカーが立っている
            const marker = sessionStorage.getItem("nav:link");
            if (marker === "1") {
                sessionStorage.removeItem("nav:link");
                return "navigate";
            }
            return "reload-or-direct";
        }

        window.addEventListener(
            "pageshow",
            () => {
                const navType = getNavigationType();
                // 内部リンク遷移は何もしない
                if (navType !== "reload" && navType !== "reload-or-direct") return;
                if (!kvSection) return;

                // 復元後の現在位置で KV が画面内に入っているかチェック
                const r = kvSection.getBoundingClientRect();
                const kvInView = r.top < window.innerHeight && r.bottom > 0;
                if (!kvInView) return;

                // 一瞬だけ手動復元にしてトップへ → すぐ戻す（smooth対策でscrollBehaviorも一時OFF）
                const prevBehavior = document.documentElement.style.scrollBehavior;
                try {
                    history.scrollRestoration = "manual";
                } catch (_) {}
                document.documentElement.style.scrollBehavior = "auto";
                window.scrollTo(0, 0);
                requestAnimationFrame(() => {
                    try {
                        history.scrollRestoration = "auto";
                    } catch (_) {}
                    document.documentElement.style.scrollBehavior = prevBehavior;
                });
            },
            { once: true }
        );
    });
};
