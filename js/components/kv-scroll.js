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

    // スタイル初期化
    gsap.set(overlay, { opacity: 0.5 });


    const ctx = gsap.context(() => {
        // 1) オーバーレイをスクロールに応じて濃く
        gsap.to(overlay, {
            opacity: 0.9, // 好みで0.7〜0.95など
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
                scroller: 'body',
                trigger: kv,
                start: "top top",
                end: "bottom 20%",
                scrub: true,
                pin: true,
            },
            stagger: {
                amount: 1,
                from: "random",
            },
        });
    });

    return () => ctx.revert();
};
