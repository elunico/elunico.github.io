class Life {
  constructor(cols, rows, circularBoard) {
    this.cols = cols;
    this.rows = rows;
    this.board = [];
    this.circular = circularBoard;
    this.clear()
  }

  clear() {
    for (let i = 0; i < this.cols; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.rows; j++) {
        this.board[i][j] = 0;
      }
    }
  }

  setState(data) {
    if (data.length != this.cols || typeof data != 'object') {
      throw `length of state data must be array of ${this.cols} arrays`;
    }
    if (typeof data[0] != 'object' || data[0].length != this.rows) {
      throw `length of an element of state data must be array of length ${this.rows}`;
    }
    this.board = data;
  }

  biofy(c, r) {
    if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) {
      return
    }
    this.board[c][r] = 1;
  }

  kill(c, r) {
    if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) {
      return
    }
    this.board[c][r] = 0;
  }

  toggle(c, r) {
    if (this.get(c, r)) {
      this.kill(c, r);
    } else {
      this.biofy(c, r);
    }
  }

  step() {
    this.board = this.nextGen();
  }

  nextGen() {
    let next = []
    for (let i = 0; i < this.cols; i++) {
      next[i] = [];
    }
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        let me = this.board[c][r];
        // check 8 neighbors
        let n1 = this.get(c, r - 1);
        let n2 = this.get(c, r + 1);
        let n3 = this.get(c - 1, r);
        let n4 = this.get(c - 1, r - 1);
        let n5 = this.get(c - 1, r + 1);
        let n6 = this.get(c + 1, r);
        let n7 = this.get(c + 1, r - 1);
        let n8 = this.get(c + 1, r + 1);
        let sum = n1 + n2 + n3 + n4 + n5 + n6 + n7 + n8;
        if ((sum == 2 && me == 1) || sum == 3) {
          next[c][r] = 1;
        } else {
          next[c][r] = 0;
        }
      }
    }
    return next;
  }

  _wrapped_get(c, r) {
    if (c < 0) {
      c = this.cols + c;
    }
    if (c >= this.cols) {
      c = c - this.cols;
    }
    if (r < 0) {
      r = this.rows + r;
    }
    if (r >= this.rows) {
      r = r - this.rows;
    }
    return this.board[c][r];
  }

  _wall_get(c, r) {
    if (c < 0 || c >= this.cols) {
      return 0;
    }
    if (r < 0 || r >= this.rows) {
      return 0;
    }
    return this.board[c][r];
  }

  get(c, r) {
    if (this.circular) {
      return this._wrapped_get(c, r);
    } else {
      return this._wall_get(c, r);
    }
  }
}
