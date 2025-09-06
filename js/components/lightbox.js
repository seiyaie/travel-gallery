export const initLightbox = () => {
    // querySelector（既存）
    const lightbox = document.querySelector(".js-lightbox");
    const thumbnails = document.querySelectorAll(".js-gallery-item button");
    const lightboxImgWrapper = document.querySelector(".js-lightbox-img-wrapper");
    const lightboxImg = document.querySelector(".js-lightbox-img-wrapper img");
    const imgName = document.querySelector(".js-lightbox-img-name p");
    const closeBtn = document.querySelector(".js-lightbox-close-btn");
    const closeBtnText = document.querySelector(".js-lightbox-close-btn-text");
    const lightboxCaption = document.querySelector(".js-lightbox-caption");
    const lightboxBg = document.querySelector(".js-lightbox-bg");

    // ===== Timeline（1本だけ：順再生=開く／逆再生=閉じる） =====
    let isAnimating = false;

    // if (!lightbox) return;
    if (!lightbox || !lightboxImgWrapper || !lightboxImg || !imgName || !closeBtn || !closeBtnText || !lightboxCaption || !lightboxBg) return;

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
            // 逆再生が終わってからdialogをclose
            lightbox.close();
            document.body.classList.remove("is-modal-open");
        },
    });

    // クリップパスを「開いた形」へ
    tl.to(lightbox, {
        duration: 0.6,
        clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
        onStart: () => {
            // 再生開始時に操作可、スクロール固定
            document.body.classList.add("is-modal-open");
        },
    });

    // 画像枠もワイプ
    tl.to(
        [lightboxImgWrapper, lightboxCaption],
        {
            duration: 1,
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
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
    tl.reverse(0);

    // ===== 開く処理 =====
    function openLightbox({ src, title, caption }) {
        if (isAnimating) return;

        // 中身セット（表示前）
        lightboxImg.src = src || "";
        imgName.textContent = title || "";
        lightboxCaption.textContent = caption || "";

        // dialogを開いてからTL再生
        lightbox.showModal();
        tl.timeScale(1).play(0);
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
