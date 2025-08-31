

gsap.registerPlugin(ScrollTrigger);

export const initKvScroll = () => {
  const overlay = document.querySelector(".js-body-overlay");
  const kv = document.querySelector(".js-kv");
  const titleWrapper = document.querySelector(".js-kv-title-wrapper");

  // 必要な要素がなければ何もしない（他ページでも安全）
  if (!overlay || !kv || !titleWrapper) return;

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
        end: "bottom top",
        scrub: true,
      },
    });

    // 2) タイトルをふんわり消す（少し上へ）
    gsap.to(titleWrapper, {
      opacity: 0,
      // y: -40,
      ease: "power2.out",
      scrollTrigger: {
        trigger: kv,
        start: "top top",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  // SPA化等で破棄したい時に使える
  return () => ctx.revert();
};