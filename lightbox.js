// components/lightbox.js
import { disableScroll, enableScroll } from "../utility/scroll-lock.js";

export const initLightbox = () => {
    // querySelector
    const lightbox = document.querySelector(".js-lightbox");
    const thumbnails = document.querySelectorAll(".js-gallery-item button");
    const lightboxImgWrapper = document.querySelector(".js-lightbox-img-wrapper");
    const lightboxImg = document.querySelector(".js-lightbox-img-wrapper img");
    const imgName = document.querySelector(".js-lightbox-img-name p");
    const closeBtn = document.querySelector(".js-lightbox-close-btn");
    const closeBtnText = document.querySelector(".js-lightbox-close-btn-text");
    const lightboxCaption = document.querySelector(".js-lightbox-caption");
    const lightboxCaptionText = document.querySelector(".js-lightbox-caption p");
    const lightboxBg = document.querySelector(".js-lightbox-bg");

    // ===== Timeline（1本だけ：順再生=開く／逆再生=閉じる） =====
    let isAnimating = false;

    if (!lightbox || !lightboxImgWrapper || !lightboxImg || !imgName || !closeBtn || !closeBtnText || !lightboxCaption || !lightboxBg) return;

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
            // 逆再生が終わってからdialogをclose
            lightbox.close();
            gsap.set(lightbox, {
                clipPath: "inset(100% 0 0 0)",
                webkitClipPath: "inset(100% 0 0 0)",
            });

            gsap.set([lightboxImgWrapper, lightboxCaption], {
                clipPath: "inset(100% 0 0 0)",
                webkitClipPath: "inset(100% 0 0 0)",
            });

            gsap.set([imgName, closeBtnText], {
                top: 25,
            });

            enableScroll();
        },
    });

    // クリップパスを「開いた形」へ
    tl.to(lightbox, {
        duration: 0.6,
        clipPath: "inset(0% 0 0 0)",
        webkitClipPath: "inset(0% 0 0 0)",
    });

    // 画像枠もワイプ
    tl.to(
        [lightboxImgWrapper, lightboxCaption],
        {
            duration: 1,
            clipPath: "inset(0% 0 0 0)",
            webkitClipPath: "inset(0% 0 0 0)",
            stagger: {
                amount: 0.1,
            },
        },
        "<+0.3"
    );

    // ラベル／キャプション：上にスライド＋フェード
    tl.to(
        [imgName, closeBtnText],
        {
            duration: 1,
            top: 0,
        },
        "<+0.3"
    );

    // アニメーション初期化
    tl.pause(0);

    // ===== 開く処理 =====
    // function openLightbox({ src, title, caption }) {
    //     if (isAnimating) return;

    //     // 中身セット（表示前）
    //     lightboxImg.src = src || "";
    //     imgName.textContent = title || "";
    //     lightboxCaptionText.textContent = caption || "";

    //     // dialogを開いてからTL再生
    //     lightbox.showModal();
    //     disableScroll();
    //     requestAnimationFrame(() => {
    //         tl.timeScale(1).play(0);
    //     });
    // }

    function openLightbox({ src, title, caption }) {
        if (isAnimating) return;

        lightboxImg.src = src || "";
        imgName.textContent = title || "";
        lightboxCaptionText.textContent = caption || "";

        lightbox.showModal();

        // showModal後に初期状態を明示的にセット
        gsap.set(lightbox, {
            clipPath: "inset(100% 0 0 0)",
            webkitClipPath: "inset(100% 0 0 0)",
        });

        gsap.set([lightboxImgWrapper, lightboxCaption], {
            clipPath: "inset(100% 0 0 0)",
            webkitClipPath: "inset(100% 0 0 0)",
        });

        gsap.set([imgName, closeBtnText], {
            top: 25,
        });

        // 強制的に再レイアウト
        lightbox.offsetHeight;

        requestAnimationFrame(() => {
            tl.invalidate().restart();
        });
    }

    // ===== 閉じる処理 =====
    function closeLightbox() {
        if (isAnimating) return;
        tl.timeScale(1).reverse();
    }

    // ===== サムネクリック =====
    thumbnails.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();

            const clickedImg = item.querySelector("img");
            if (!clickedImg) return;

            const src = clickedImg.currentSrc || clickedImg.getAttribute("src") || "";
            const title = item.dataset.title || "";
            const caption = item.dataset.caption || "";
            openLightbox({ src, title, caption });
        });
    });

    // ===== 閉じるトリガ =====
    closeBtn.addEventListener("click", closeLightbox);

    // 背景クリックで閉じる
    lightboxBg.addEventListener("click", (e) => {
        const isInteractiveElement = e.target.closest("p, img, button");
        if (!isInteractiveElement) closeLightbox();
    });

    // Escで閉じる
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.open) closeLightbox();
    });
};
