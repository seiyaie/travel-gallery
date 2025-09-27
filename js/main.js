// main.js

import { switchViewport } from "./utility/switch-viewport.js";
import { refreshOnLazyImages } from "./utility/refresh-on-lazy.js";
import { initLightbox } from "./components/lightbox.js";
import { initDropdownMenu } from "./components/dropdown-menu.js";
import { initKvScroll } from "./components/kv-scroll.js";
import { initTopGalleryReveal } from "./components/top-gallery-reveal.js";
import { initPageTransition } from "./components/page-transition.js";
import { initGalleryLabelReveal } from "./components/gallery-label-reveal.js";
import { initHamburgerMenu } from "./components/hamburger-menu.js";
import { initAboutReveal } from "./components/about-reveal.js";
import { initScrollArrow } from "./components/scroll-arrow.js";
import { initTopLoading } from "./components/top-loading.js";
import { initDescReveal } from "./components/description-reveal.js";

switchViewport();
window.addEventListener("resize", switchViewport);
initTopLoading();
initPageTransition();
initLightbox();
initDropdownMenu();
initKvScroll();
initTopGalleryReveal();
initGalleryLabelReveal();
initDescReveal();
initHamburgerMenu();
initAboutReveal();
initScrollArrow();

