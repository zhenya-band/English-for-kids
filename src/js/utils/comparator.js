const comparator = (index, order, collator) => (a, b) => order * collator.compare(
  a.children[index].innerHTML,
  b.children[index].innerHTML
);

export default comparator;
