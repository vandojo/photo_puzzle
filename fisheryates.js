const fisherYates = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let randInt = Math.floor(Math.random() * (i + 1));

    let temp = arr[i];
    arr[i] = arr[randInt];
    arr[randInt] = temp;
  }

  return arr;
};
