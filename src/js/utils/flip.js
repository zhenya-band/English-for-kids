export default function flip(card) {
  card.classList.add('flipped');
  card.addEventListener('mouseleave', () => {
    card.classList.remove('flipped');
  })
}