// utility/scroll-reset.js

export const NAV_MARKER_KEY = "nav:link";

/** 内部リンク遷移する直前に呼ぶ（Leave演出の前に） */
export function markInternalNav() {
  try { sessionStorage.setItem(NAV_MARKER_KEY, "1"); } catch (_) {}
}

/** 内部リンクマーカーを消す（必要な場合のみ） */
export function clearNavMarker() {
  try { sessionStorage.removeItem(NAV_MARKER_KEY); } catch (_) {}
}

/** リロード / 直接アクセス / BFCache 復元の判定（内部遷移はfalse） */
export function navTypeIsReloadish() {
  try {
    const n = performance.getEntriesByType?.("navigation")?.[0];
    if (n?.type === "reload") return true;
  } catch (_) {}
  try {
    const t = performance.navigation?.type; // deprecated fallback
    if (t === 1) return true; // reload
  } catch (_) {}

  // 内部リンクで来ていれば「リロード系ではない」
  const marker = sessionStorage.getItem(NAV_MARKER_KEY);
  if (marker === "1") {
    clearNavMarker();
    return false;
  }
  return true; // 直打ち / 手動リロード想定
}

/** スクロールを即座に最上部へ（iOS対策含む） */
export function forceScrollTopNow() {
  const prev = document.documentElement.style.scrollBehavior;
  try { history.scrollRestoration = "manual"; } catch (_) {}
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      try { history.scrollRestoration = "auto"; } catch (_) {}
      document.documentElement.style.scrollBehavior = prev;
    }, 0);
  });
}

/**
 * KVが画面内にいる状態でのリロード／BFCache復帰時に、上端へ強制スクロール。
 * - どのページでも同じコードで使えるように抽象化。
 * @param {Object} opts
 * @param {Element|null} [opts.kvSection]  直接Elementを渡す場合
 * @param {string} [opts.kvSelector=".js-kv"]  セレクタで探す場合
 * @param {boolean} [opts.once=true]  1回きりで良いならtrue
 */
export function setupScrollTopOnReload(opts = {}) {
  const {
    kvSection = null,
    kvSelector = ".js-kv",
    once = true,
  } = opts;

  const resolveKv = () => kvSection || document.querySelector(kvSelector);
  const handler = (e) => {
    const kv = resolveKv();
    if (!kv) return;

    const isBFCache = e.persisted === true;
    const isReloadish = navTypeIsReloadish() || isBFCache;
    if (!isReloadish) return;

    const r = kv.getBoundingClientRect();
    const kvInView = r.top < window.innerHeight && r.bottom > 0;
    if (kvInView) forceScrollTopNow();
  };

  window.addEventListener("pageshow", handler, { once });
}