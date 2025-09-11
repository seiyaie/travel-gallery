export const initHamburgerMenu = () => {
    const menu = document.querySelector(".js-hamburger-menu");
    const openBtn = document.querySelector(".js-hamburger-open-button");
    const closeBtn = document.querySelector(".js-hamburger-close-button");
    const bg = menu.querySelector(".js-hamburger-bg");
    const items = Array.from(menu.querySelectorAll(".c-hamburger-country-item a"));

    if (!openBtn || !closeBtn || !menu || !bg) return;

    //  状態管理
    let isAnimating = false;
    let currentActive = null; // ScrollTriggerで選ばれたitem
    let hoverTarget = null; // hover中のitem
    let bgTween = null;

    const getUrl = (item) => item?.parentElement?.dataset.bg || "";

    // 背景ズームアウトアニメーション
    function showBgZoomOut(url) {
        if (!url) return;
        if (bgTween) bgTween.kill(); // 途中のアニメがあったら止める

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

        items.forEach((item) => {
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
        },
        onComplete: () => {
            isAnimating = false;
        },
        onReverseComplete: () => {
            isAnimating = false;
            menu.close();
            // メニュー閉じたらスクロールトリガー削除
            ScrollTrigger.getAll().forEach((st) => {
                if (st.vars.scroller === menu) st.kill();
            });
            items.forEach((item) => gsap.set(item, { clearProps: "all" }));
            gsap.set(menu, { clearProps: "clipPath,opacity" });
        },
    });

    // menuをしたから上に開く
    tl.to(menu, { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.7 })
    // itemsをスライドアップ
    .to(items,
        {
            y: 0,
            duration: 0.4,
            ease: "power3.out",
            onComplete: () => {
                initItemScrollTriggers(); // アニメーション終了後スクロールトリガー作成
                ScrollTrigger.refresh();
                refreshBackground();
                refreshOpacities();
            },
        },
        ">+0.03"
    );

    // メニュー開く関数
    const openMenu = () => {
        if (isAnimating || menu.open) return;
        menu.show();
        // const initial = lastActive || items[0];
        // const firstUrl = getUrl(initial);
        // gsap.set(bg, { opacity: 0, backgroundImage: `url(${firstUrl})`, scale: 1.2 });
        // menuとitems初期値にセット
        gsap.set(menu, { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", opacity: 1 });
        gsap.set(items, { y: "100%", opacity: 0.4 });
        // タイムライン再生
        tl.play(0);
    };

    // メニュー閉じる関数
    const closeMenu = () => {
        if (isAnimating || !menu.open) return;
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
        if (!e.target.closest(".c-hamburger-country-item", ".header-logo", "c-hamburger-bottom-item")) {
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
