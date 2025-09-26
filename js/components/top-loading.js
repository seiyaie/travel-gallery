
import { setupScrollTopOnReload } from "../utility/scroll-reset.js";

export const initTopLoading = () => {
    const loading = document.querySelector(".js-loading");
    const counter = document.querySelector(".js-counter");
    const bg = document.querySelector(".js-bg img");
    const kv = document.querySelector(".js-kv-title-wrapper");

    if (!loading || !counter) return;

    setupScrollTopOnReload({ kvSelector: ".js-kv", once: true });

    // ===== 背景・タイトル初期状態 =====
    gsap.set(bg, { scale: 1.15 });
    gsap.set(kv, { y: 50, opacity: 0 });

    // ===== 次の演出は一旦停止状態で用意しておく =====
    const tl = gsap.timeline({ paused: true });
    tl.to(counter, { duration: 0.25, opacity: 0 })
      .to(
        loading,
        { delay: 0.1, duration: 0.6, yPercent: 100, ease: "power3.inOut" },
        ">+0.1"
      )
      .to(
        bg,
        { scale: 1, ease: "power3.inOut", duration: 1 },
        "<"
      )
      .to(
        kv,
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.inOut" },
        "<"
      );


    let obj = { value: 0 };

    function randomIncrement() {
        const nextValue = obj.value + Math.floor(Math.random() * 10) + 1;

        gsap.to(obj, {
            value: Math.min(nextValue, 100),
            duration: 0.1,
            ease: "power1.out",
            onUpdate: () => {
                counter.textContent = Math.floor(obj.value) + "%";
            },
            onComplete: () => {
                if (obj.value < 100) {
                    // 次のインクリメントまでの待ち時間も少しランダムに
                    const wait = Math.random() * 0.1 + 0.05; //
                    gsap.delayedCall(wait, randomIncrement);
                } else {
                    // 100%に達したら念のため表示を100%に固定してから次へ
                    counter.textContent = "100%";
                    tl.play(); 
                }
            },
        });
    }

    randomIncrement();
};
