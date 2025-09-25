// export const initKvScroll = () => {
//     const overlay = document.querySelector(".js-body-overlay");
//     const kv = document.querySelector(".js-kv");
//     const titleWrapper = document.querySelector(".js-kv-title-wrapper");

//     // 必要な要素がなければ何もしない（他ページでも安全）
//     if (!overlay || !kv || !titleWrapper) return;
//     const titleElement = document.querySelectorAll(".js-split");

//     titleElement.forEach((el) => {
//         const titleTexts = el.textContent.split("");
//         el.textContent = "";
//         let outputTexts = "";
//         titleTexts.forEach((letter) => {
//             if (letter === " ") {
//                 outputTexts += " ";
//             } else {
//                 outputTexts += letter === "" ? "" : `<span class="c-kv-split js-kv-split">${letter}</span>`;
//             }
//             el.innerHTML = outputTexts;
//         });
//     });

//     // スタイル初期化
//     gsap.set(overlay, { opacity: 0.5 });

//     const ctx = gsap.context(() => {
//         // 1) オーバーレイをスクロールに応じて濃く
//         gsap.to(overlay, {
//             opacity: 0.9, // 好みで0.7〜0.95など
//             ease: "none",
//             scrollTrigger: {
//                 trigger: kv,
//                 start: "top top",
//                 end: "bottom top",
//                 scrub: true,
//             },
//         });
//         gsap.to(".js-kv-split", {
//             opacity: 0,
//             scaleX: 0.4,
//             y: -20,
//             ease: "power3.in",
//             scrollTrigger: {
//                 trigger: kv,
//                 start: "top top",
//                 end: "bottom 20%",
//                 scrub: true,
//                 pin: true,
//                 markers: true,
//             },
//             stagger: {
//                 amount: 1,
//                 from: "random",
//             },
//         });
//     });

//     return () => ctx.revert();
// };


export const initKvScroll = () => {
    const overlay = document.querySelector(".js-body-overlay");
    const kv = document.querySelector(".js-kv");
    const titleWrapper = document.querySelector(".js-kv-title-wrapper");
    if (!overlay || !kv || !titleWrapper) return;

    // 文字分割（既存のまま）
    document.querySelectorAll(".js-split").forEach((el) => {
        const chars = el.textContent.split("");
        el.textContent = "";
        el.innerHTML = chars.map((ch) => (ch === " " ? " " : `<span class="c-kv-split js-kv-split">${ch}</span>`)).join("");
    });

    gsap.set(overlay, { opacity: 0.5 });

    const ctx = gsap.context(() => {
        // メディアクエリごとの分岐
        const mm = gsap.matchMedia();

        // 動作を止めたい人向け（低減動作）
        mm.add("(prefers-reduced-motion: reduce)", () => {
            // アニメを即時適用するだけに
            gsap.set(".js-kv-split", { opacity: 1, clearProps: "all" });
            // Overlay のSTだけ薄く
            ScrollTrigger.create({
                trigger: kv,
                start: "top top",
                end: "bottom top",
                scrub: true,
                onUpdate: (self) => gsap.set(overlay, { opacity: 0.5 + 0.4 * self.progress }),
            });
        });

        // モバイル（pointer:coarse を優先。タブレット含む）
        mm.add("(pointer: coarse)", () => {
            // overlay は共通
            gsap.to(overlay, {
                opacity: 0.9,
                ease: "none",
                scrollTrigger: {
                    trigger: kv,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            // ★ モバイルは pin を使わない
            gsap.to(".js-kv-split", {
                opacity: 0,
                scaleX: 0.4,
                y: -20,
                ease: "power3.in",
                scrollTrigger: {
                    trigger: kv,
                    start: "top top",
                    end: "bottom 70%",
                    scrub: true,
                },
                stagger: { amount: 1, from: "random" },
            });
        });

        // デスクトップ（またはポインタ精密）だけ pin 有効化
        mm.add("(pointer: fine)", () => {
            gsap.to(overlay, {
                opacity: 0.9,
                ease: "none",
                scrollTrigger: {
                    trigger: kv,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            gsap.to(".js-kv-split", {
                opacity: 0,
                scaleX: 0.4,
                y: -20,
                ease: "power3.in",
                scrollTrigger: {
                    id: "kvPin",
                    trigger: kv,
                    start: "top top",
                    end: "bottom 20%",
                    scrub: true,
                    pin: true,
                },
                stagger: { amount: 1, from: "random" },
            });
        });

        // すべての ST 生成後に1フレーム遅らせて再計測
        requestAnimationFrame(() => ScrollTrigger.refresh());

        // クリーンアップ
        return () => mm.revert();
    });

    return () => ctx.revert();
};
