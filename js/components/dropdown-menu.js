// components/dropdown-menu.js

export const initDropdownMenu = () => {
    // query selectors
    const btn = document.querySelector(".js-dropdown-btn");
    const submenu = document.querySelector(".js-dropdown-submenu");
    const items = document.querySelectorAll(".js-dropdown-item");

    if (!btn || !submenu || !items.length) return;

    const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
        onStart: () => {
            submenu.classList.add("is-active");
            btn.classList.add("is-active");
        },
        onReverseComplete: () => {
            submenu.classList.remove("is-active");
            btn.classList.remove("is-active");
        },
    });

    tl.fromTo(items, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.1, stagger: 0.05 });

    btn.addEventListener("click", () => {
        if (tl.isActive()) return;
        const isOpen = submenu.classList.contains("is-active");
        if (!isOpen) {
            tl.play(0);
        } else {
            tl.reverse();
        }
    });

    // submenu外クリックで閉じる処理
    document.addEventListener("click", (e) => {
        const isInsideDropdown = e.target.closest(".js-dropdown-btn") || e.target.closest(".js-dropdown-submenu");
        if (!isInsideDropdown && submenu.classList.contains("is-active")) {
            tl.reverse();
        }
    });

    // Escキータイプで閉じる処理
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && submenu.classList.contains("is-active")) {
            tl.reverse();
        }
    });
};
