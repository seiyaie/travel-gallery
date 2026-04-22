// utility/scroll-reset.js

export const disableScroll = () => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
};

export const enableScroll = () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
};