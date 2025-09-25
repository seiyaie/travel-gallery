/**
 * ビューポートの設定を切り替え
 * 画面の幅が380px未満の場合：ビューポートを380pxに固定
 * それ以上の場合：デバイスの幅に基づいてビューポートを設定
 */
export const switchViewport = () => {
    // ビューポート要素を取得
    const viewportMeta = document.querySelector('meta[name="viewport"]');

    // 条件に基づいて適用するビューポートの設定を決定
    const viewportContent = window.outerWidth > 380 ? "width=device-width, initial-scale=1" : "width=380";

    // ビューポート要素が存在しない場合はreturn
    if (!viewportMeta) return;

    // 現在のビューポートの設定が目的の設定と異なる場合にのみ、新しい設定を適用します。
    if (viewportMeta.getAttribute("content") !== viewportContent) {
        viewportMeta.setAttribute("content", viewportContent);
    }
};
