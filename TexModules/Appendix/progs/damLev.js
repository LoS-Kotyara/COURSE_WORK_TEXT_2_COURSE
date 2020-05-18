const prepare = (steps, length) => {
  const relative = length == 0 ? 0 : steps / (length - 1);
  return {
    steps: steps,
    relative: relative,
    similarity: 1 - relative,
  };
};

const damerauLevenshtein = (str1, str2) => {
  const str1_length = str1.length;
  const str2_length = str2.length;
  const matrix = [];
  const limit = (str2_length > str1_length ? str2_length : str1_length) + 1;
  if (Math.abs(str1_length - str2_length) > limit) {
    return prepare(limit, limit);
  } else if (str1_length === 0) {
    return prepare(str2_length, limit);
  } else if (str2_length === 0) {
    return prepare(str1_length, limit);
  }
  for (let i = 0; i < limit; i++) {
    matrix[i] = [i];
    matrix[i].length = limit;
  }
  for (let i = 0; i < limit; i++) {
    matrix[0][i] = i;
  }

  for (let i = 1; i <= str1_length; ++i) {
    let str1_i = str1[i - 1];
    for (let j = 1; j <= str2_length; ++j) {
      let str2_j = str2[j - 1];
      let cost = str1_i == str2_j ? 0 : 1;
      let temp = 0;

      let min = matrix[i - 1][j] + 1; // del
      if ((temp = matrix[i][j - 1] + 1) < min) min = temp; // ins
      if ((temp = matrix[i - 1][j - 1] + cost) < min) min = temp; // sub
      matrix[i][j] =
        i > 1 &&
        j > 1 &&
        str1_i === str2[j - 2] &&
        str1[i - 2] === str2_j &&
        (temp = matrix[i - 2][j - 2] + 1) < min
          ? temp
          : min; // trans.
    }
  }
  return prepare(matrix[str1_length][str2_length], limit);
};
