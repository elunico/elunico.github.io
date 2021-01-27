
function compress_bin_arr(arr) {
  let prev = arr[0];
  let run = 1;
  let s = '';
  let i;
  for (i = 1; i < arr.length; i++) {
    if (arr[i] == prev) {
      run++;
    } else {
      s += `${prev}:${run};`
      prev = arr[i];
      run = 1;
    }
  }
  s += `${prev}:${run};`
  prev = arr[i];
  run = 1;
  return s;
}

function decompress_bin_arr(str) {
  let comps = str.split(';');
  let result = [];
  for (let comp of comps) {
    let [value, count] = comp.split(':');
    value = Number(value);
    count = Number(count);
    for (let i = 0; i < count; i++) {
      result.push(value);
    }
  }
  return result;
}

// These functions are no longer being used
// The entire board is placed into a single bin_arr (binary array) before
// being [de]compressed by [de]compress_bin_arr
// 
// function decompress_board(str) {
//   let board = [];
//   for (let col of str.split('\n')) {
//     board.push(decompress_bin_arr(col));
//   }
//   return board;
// }
//
// function compress_board(board) {
//   return board.map(col => compress_bin_arr(col)).join("\n");
// }
