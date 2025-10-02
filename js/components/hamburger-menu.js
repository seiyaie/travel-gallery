// components/hamburger-menu.js
import { disableScroll, enableScroll } from "../utility/scroll-lock.js";
export const initHamburgerMenu = () => {
    const menu = document.querySelector(".js-hamburger-menu");
    const openBtn = document.querySelector(".js-hamburger-open-button");
    const closeBtn = document.querySelector(".js-hamburger-close-button");
    const bg = menu.querySelector(".js-hamburger-bg");
    const scrollItems = Array.from(menu.querySelectorAll(".js-hamburger-item a"));
    const hoverItems = Array.from(menu.querySelectorAll(".js-hamburger-bottom-item a"));
    const items = [...scrollItems, ...hoverItems];

    if (!openBtn || !closeBtn || !menu || !bg) return;

    //  状態管理
    let isAnimating = false;
    let currentActive = null; // ScrollTriggerで選ばれたitem
    let hoverTarget = null; // hover中のitem
    let bgTween = null;

    const getUrl = (item) => item?.closest("[data-bg]")?.dataset.bg || "";

    // 追加：小さなロードヘルパ & キャッシュ
    const imgCache = new Map();
    function loadImage(url) {
        if (!url) return Promise.resolve();
        if (imgCache.get(url) === true) return Promise.resolve();
        const img = new Image();
        img.src = url;
        const p = (
            img.decode
                ? img.decode()
                : new Promise((res) => {
                      if (img.complete) return res();
                      img.addEventListener("load", res, { once: true });
                      img.addEventListener("error", res, { once: true }); // エラーでも先に進む
                  })
        ).then(() => {
            imgCache.set(url, true);
        });
        return p;
    }

    // 背景ズームアウトアニメーション
    async function showBgZoomOut(url) {
        if (!url) return;
        if (bgTween) bgTween.kill(); // 途中のアニメがあったら止める

        await loadImage(url); // ←ここが重要（初回でも確実に見える）

        // 背景初期状態にセット
        gsap.set(bg, { backgroundImage: `url(${url})`, opacity: 0, scale: 1.2 });

        // ズームアウト＋フェードインアニメーション
        bgTween = gsap.to(bg, {
            opacity: 0.4,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
            onComplete: () => {
                bgTween = null;
            },
        });
    }

    // itemsのopacityを一括更新。
    function refreshOpacities() {
        items.forEach((item) => {
            const isMain = hoverTarget ? item === hoverTarget : item === currentActive;
            gsap.to(item, { opacity: isMain ? 1 : 0.4, duration: 0.2, overwrite: "auto" });
        });
    }

    // 選択されているitemに応じた背景にする処理
    function refreshBackground() {
        const target = hoverTarget || currentActive;
        const url = getUrl(target);
        if (url) showBgZoomOut(url);
    }

    // ScrollTriggerで選択されたitemの処理
    function activateItem(item) {
        if (!item || currentActive === item) return;
        currentActive = item;
        // hover中のitemがある場合は処理中止
        if (!hoverTarget) {
            refreshOpacities();
            refreshBackground();
        }
    }

    // ScrollTrigger: centerにあるitemを選択
    function initItemScrollTriggers() {
        // 既存スクロールトリガー削除
        ScrollTrigger.getAll().forEach((st) => {
            if (st.vars.scroller === menu) st.kill();
        });

        scrollItems.forEach((item) => {
            ScrollTrigger.create({
                scroller: menu,
                trigger: item,
                start: "top center",
                end: "bottom center",
                onEnter: () => activateItem(item),
                onEnterBack: () => activateItem(item),
            });
        });
    }

    // アニメーションタイムライン
    const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.inOut" },
        onStart: () => {
            isAnimating = true;
            disableScroll();
        },
        onComplete: () => {
            isAnimating = false;
        },
        onReverseComplete: () => {
            isAnimating = false;
            enableScroll();
            // メニュー閉じたらスクロールトリガー削除
            ScrollTrigger.getAll().forEach((st) => {
                if (st.vars.scroller === menu) st.kill();
            });
            items.forEach((item) => gsap.set(item, { clearProps: "all" }));
            gsap.set(menu, { clearProps: "clipPath,opacity" });
            menu.close();
        },
    });

    // menuをしたから上に開く
    tl.to(menu, { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.7 })
        // itemsをスライドアップ
        .to(
            items,
            {
                y: 0,
                duration: 0.4,
                ease: "power3.out",
                onComplete: async () => {
                    initItemScrollTriggers();
                    ScrollTrigger.refresh();

                    if (!currentActive) currentActive = scrollItems[0] || null;

                    await (async () => {
                        const url = getUrl(currentActive);
                        if (url) await showBgZoomOut(url);
                    })();

                    refreshOpacities();
                },
            },
            ">+0.03"
        );

    // 修正：openMenu 内で「最初に表示する項目」を決めて先にプリロード
    const openMenu = async () => {
        if (isAnimating || menu.open) return;
        menu.show();
        gsap.set(menu, { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", opacity: 1 });
        gsap.set(items, { y: "100%", opacity: 0.4 });

        // disableScroll();
        // 1) 最初のアクティブを決める（例：先頭項目）
        currentActive = scrollItems[0] || null;
        closeBtn.focus();

        // 2) その背景を先に読み込んでおく（初回チラつき防止）
        const firstUrl = getUrl(currentActive);
        await loadImage(firstUrl);
        // 3) open/closeのUI状態
        closeBtn.classList.remove("is-active");
        openBtn.classList.add("is-active");

        // 4) タイムライン再生
        tl.play(0);
    };

    // メニュー閉じる関数
    const closeMenu = () => {
        if (isAnimating || !menu.open) return;
        // enableScroll();
        openBtn.classList.remove("is-active");
        closeBtn.classList.add("is-active");
        // タイムライン逆再生
        tl.reverse();
        // 背景ズームイン、フェードアウト
        gsap.to(bg, { opacity: 0, scale: 1.05, duration: 0.2, overwrite: "auto" });
        hoverTarget = null;
    };

    // openBtnクリックで開く
    openBtn.addEventListener("click", openMenu);

    // closeボタンクリックで閉じる
    closeBtn.addEventListener("click", closeMenu);

    // escキーで閉じる
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (!menu.open) return;
            e.preventDefault();
            closeMenu();
        }
    });

    // 背景クリックで閉じる
    menu.addEventListener("click", (e) => {
        if (!e.target.closest(".js-hamburger-item, .js-header-logo, .js-hamburger-bottom-item")) {
            closeMenu();
        }
    });

    // item のhoverアニメーション
    items.forEach((item) => {
        const url = getUrl(item);

        // hover時
        item.addEventListener("mouseenter", () => {
            if (item === currentActive) return; // すでにscrollTriggerで選ばれている場合は何もしない
            hoverTarget = item;
            refreshOpacities();
            if (url) showBgZoomOut(url);
        });

        // hover外れた時
        item.addEventListener("mouseleave", () => {
            if (hoverTarget === item) {
                hoverTarget = null;
                refreshOpacities();
                refreshBackground();
            }
        });

        // Tab移動時
        item.addEventListener("focusin", () => {
            if (item === currentActive) return;
            hoverTarget = item;
            refreshOpacities();
            if (url) showBgZoomOut(url);
        });
        item.addEventListener("focusout", () => {
            if (hoverTarget === item) {
                hoverTarget = null;
                refreshOpacities();
                refreshBackground();
            }
        });
    });
};
