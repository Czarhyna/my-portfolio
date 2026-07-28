// Grows each project modal from its trigger card's on-screen position
// to fullscreen, using getBoundingClientRect + a two-frame position swap.
document.querySelectorAll('[data-modal-trigger]').forEach((card) => {
  card.addEventListener('click', () => {
    const modal = document.getElementById(card.getAttribute('popovertarget'));
    if (!modal) {
      console.error('No modal found for trigger:', card);
      return;
    }

    const rect = card.getBoundingClientRect();

    // Set starting position/size to exactly match the clicked card,
    // before the popover has finished opening
    modal.style.top = `${rect.top}px`;
    modal.style.left = `${rect.left}px`;
    modal.style.width = `${rect.width}px`;
    modal.style.height = `${rect.height}px`;
    modal.classList.remove('is-fullscreen');

    // Wait one frame so the browser paints the starting position first,
    // then add the fullscreen class — the transition animates the jump
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add('is-fullscreen');
      });
    });
  });
});