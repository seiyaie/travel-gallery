// utility/refresh-on-lazy.js

export function refreshOnLazyImages(selector = ".c-gallery img[loading='lazy']") {
  const imgs = Array.from(document.querySelectorAll(selector)).filter(img => !img.complete);
  if (!imgs.length) return;

  let timer = null;
  let pending = false;
  let scrolling = false;

  const schedule = () => {
    pending = true;
    if (timer) clearTimeout(timer);
    // ロードが連続しても 200ms でまとめ打ち
    timer = setTimeout(() => {
      if (scrolling) return;           // スクロール中は実行しない
      ScrollTrigger.refresh();
      pending = false;
    }, 200);
  };

  // スクロール中は refresh を保留。止まったら一発だけ実行
  ScrollTrigger.addEventListener("scrollStart", () => (scrolling = true));
  ScrollTrigger.addEventListener("scrollEnd", () => {
    scrolling = false;
    if (pending) {
      if (timer) { clearTimeout(timer); timer = null; }
      ScrollTrigger.refresh();
      pending = false;
    }
  });

  imgs.forEach((img) => {
    img.addEventListener("load", schedule,  { once: true });
    img.addEventListener("error", schedule, { once: true });
  });
}