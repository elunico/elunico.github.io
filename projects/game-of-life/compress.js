const MIN_RUN = 6;

function compress_bin_arr(arr, min_run = 6) {
  if (arr.length === 0) return '';
  if (arr.length === 1) return String(arr[0]);
  let prev = arr[0];
  let run = 1;
  let s = '';
  let i;
  for (i = 1; i < arr.length; i++) {
    if (arr[i] == prev) {
      run++;
    } else {
      if (run < min_run) {
        for (let i = 0; i < run; i++) {
          s += prev;
        }
      } else {
        s += `@${run}${prev == 0 ? 'a': 'b'}`;
      }
      prev = arr[i];
      run = 1;
    }
  }
  s += run === 1 ? prev : `@${run}${prev == 0 ? 'a': 'b'}`;
  return s;
}

function decompress_bin_arr(str) {
  let result = [];
  for (let i = 0; i < str.length; i++) {
    let c = str[i];
    if (c == '@') {
      let num = '';
      let w = i + 1;
      while (w < str.length && str[w] != 'a' && str[w] != 'b') {
        num += str[w++];
      }
      let count = Number(num);
      value = str[w] == 'a' ? 0 : 1;
      for (let j = 0; j < count; j++)
        result.push(value);
      i = w; // do NOT pass the a/b part because the for loop is going to i++
    } else {
      result.push(Number(str[i]));
    }
  }
  return result;
}

function compress_board(board) {
  return board.map((v, i) => compress_bin_arr(v, MIN_RUN)).join('\n');
}

function decompress_board(str) {
  let cols = str.split('\n');
  let board = []
  for (let col of cols) {
    if (col)
      board.push(decompress_bin_arr(col));
  }
  return board;
}
