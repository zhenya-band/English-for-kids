export default function changeCardMode(cards, mode) {
  if (mode) {
    cards.forEach((card) => {
      card.classList.add('play');
      card.classList.remove('deactivated');
    });
  } else {
    cards.forEach((card) => {
      card.classList.remove('play');
      card.classList.remove('deactivated');
    });
  }
}