// very early（できれば他の初期化より前）に一度呼ぶ
export function reserveGalleryItemSpace() {
  document.querySelectorAll(".js-gallery-item img[width][height]").forEach((img) => {
    const w = +img.getAttribute("width");
    const h = +img.getAttribute("height");
    if (w > 0 && h > 0) {
      // 親カードに正確な比率を付与（3/4でも4/3でもOK、将来の比率にも対応）
      const card = img.closest(".js-gallery-item");
      card?.style.setProperty("aspect-ratio", `${w} / ${h}`);

      // ついでに orientation クラスが欲しければ付けられる
      card?.classList.toggle("is-landscape", w > h);
      card?.classList.toggle("is-portrait",  h > w);
    }
  });
}
reserveGalleryItemSpace();