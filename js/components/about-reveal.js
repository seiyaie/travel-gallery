export const initAboutReveal = () => {
    const root = document.querySelector(".about");
    if (!root) return;

    const mm = gsap.matchMedia();

    // ====== SP: 個別にフェードアップ ======
    mm.add("(max-width: 767px)", () => {
        const items = gsap.utils.toArray(".js-about-trigger");
        items.forEach((el) => {
            gsap.set(el, { opacity: 0, y: 24 });
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    markers: true,
                },
            });
        });
    });
    // ====== PC: 画像と説明を同時に表示 ======
    mm.add("(min-width: 768px)", () => {
        const aboutMe = document.querySelector(".js-about-me");
        if (aboutMe) {
            gsap.set(aboutMe, { opacity: 0, y: 24 });
            gsap.to(aboutMe, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: aboutMe,
                    start: "top 70%",
                },
            });
        }

        // js-about-me 外にある .js-about-trigger だけ個別取得
        const rest = gsap.utils.toArray(".js-about-trigger").filter((el) => !el.closest(".js-about-me")); // ← .about-me 内は除外
        console.log(rest);

        rest.forEach((el) => {
            gsap.set(el, { opacity: 0, y: 24 });
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                },
            });
        });
    });
};
