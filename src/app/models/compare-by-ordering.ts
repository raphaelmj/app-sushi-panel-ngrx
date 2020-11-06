export function compareByOrdering<T extends { ordering: number }>(c1: T, c2: T) {

  const compare = c1.ordering - c2.ordering;

  if (compare > 0) {
    return 1;
  }
  else if (compare < 0) {
    return -1;
  }
  else return 0;

}
