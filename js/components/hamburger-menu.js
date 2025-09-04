export const initHamburgerMenu = () => {
  const menu = document.querySelector('.js-hamburger-menu');
  const btn = document.querySelector('.js-hamburger-menu-button');
  const header = document.querySelector('.js-header');

  if (!btn || !menu) return;

  const openMenu = () => {
    btn.textContent = 'CLOSE';
    header.classList.add('is-modal-open');
    menu.show();
  }

  const closeMenu = () => {
    btn.textContent = 'MENU';
    header.classList.remove('is-modal-open');
    menu.close();
  }

  btn.addEventListener('click', () => {
    const isOpen = menu.open;
    isOpen ? closeMenu() : openMenu();
  });
};