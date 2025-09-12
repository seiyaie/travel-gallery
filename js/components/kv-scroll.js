// gsap.registerPlugin(ScrollTrigger);

export const initKvScroll = () => {
    const overlay = document.querySelector(".js-body-overlay");
    const kv = document.querySelector(".js-kv");
    const titleWrapper = document.querySelector(".js-kv-title-wrapper");

    // 必要な要素がなければ何もしない（他ページでも安全）
    if (!overlay || !kv || !titleWrapper) return;

    const titleElement = document.querySelectorAll(".js-split");

    titleElement.forEach((el) => {
        const titleTexts = el.textContent.split("");
        el.textContent = "";
        let outputTexts = "";
        titleTexts.forEach((letter) => {
            if (letter === " ") {
                outputTexts += " ";
            } else {
                outputTexts += letter === "" ? "" : `<span class="c-kv-split js-kv-split">${letter}</span>`;
            }
            el.innerHTML = outputTexts;
        });
    });

    // スタイル初期化（CSSで設定済みでも念のため）
    gsap.set(overlay, { opacity: 0.5 });
    gsap.set(titleWrapper, { opacity: 1, y: 0 });

    // ctxでスコープ管理（将来クリーンアップしやすい）
    const ctx = gsap.context(() => {
        // 1) オーバーレイをスクロールに応じて濃く
        gsap.to(overlay, {
            opacity: 0.9, // 好みで0.7〜0.95など
            ease: "none",
            scrollTrigger: {
                trigger: kv,
                start: "top top",
                end: "bottom center",
                scrub: true,
            },
        });

        // 2) タイトルをふんわり消す（少し上へ）
        // gsap.to(titleWrapper, {
        //     opacity: 0,
        //     // y: -40,
        //     ease: "power2.out",
        //     scrollTrigger: {
        //         trigger: kv,
        //         start: "top top",
        //         end: "bottom center",
        //         scrub: true,
        //     },
        // });
        gsap.to(".js-kv-split", 0.5, {
            opacity: 0,
            scaleX: 0.4,
            y: -25,
            ease: "power3.in",
            scrollTrigger: {
                scroller: 'body',
                trigger: kv,
                start: "top top",
                end: "bottom top",
                scrub: true,
                pin: true,
                markers: true,
            },
            stagger: {
                amount: 1,
                from: "random",
            },
        });
        // gsap.from(".c-split", {
        //   opacity: 0,
        //   y: 20,
        //   ease: "power2.out",
        //   stagger: 0.05,  // 1文字ずつ順番に
        // });
    });

    // SPA化等で破棄したい時に使える
    return () => ctx.revert();
};
