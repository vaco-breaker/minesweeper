export const createAroundArray = (y, x, arrayLength) => {
  const aroundArray = [
    [y - 1, x - 1],
    [y - 1, x],
    [y - 1, x + 1],
    [y, x - 1],
    [y, x + 1],
    [y + 1, x - 1],
    [y + 1, x],
    [y + 1, x + 1],
  ];

  return aroundArray.filter(
    (coordinate) =>
      0 <= coordinate[0] &&
      coordinate[0] < arrayLength &&
      0 <= coordinate[1] &&
      coordinate[1] < arrayLength,
  );
};

export const createCrossDirectionArray = (y, x) => {
  const aroundArray = [
    [y - 1, x],
    [y, x - 1],
    [y, x + 1],
    [y + 1, x],
  ];

  return aroundArray;
};
