let state = [];
let fR = 0;
export function orderVector(f, v, vn) {
  let a = [];
  if (v === "") return state;
  let l = [];
  let n = f.length;
  let h = 0;
  let j = 0;
  let sl = v.length;
  let s = sl - 1;

  for (let i = 0; i < n; i++) {
    let p = 0;
    if (fR == 0) state[i] = { ...f[i] };
    if (!f[i]) return;
    j = f[i][vn].length;
    while (p < j) {
      a[p] = f[i][vn][p].toLowerCase();
      if (p == j - 1) {
        l[i] = a;
        a = [];
      }
      p++;
    }
  }

  fR++;
  a = [];
  j = l.length;

  for (let i = 0; i < j; i++) {
    let p = 0;
    let m = l[i].length;
    while (p < m) {
      //find duplicate letters
      if (v[s] === l[i][p]) {
        if (l[i][s] === l[i][s + 1]) {
          l[i][s + 2] = " ";
          return;
        }
      }

      if (v[s] === l[i][p] && v[sl - 2] !== v[s]) {
        if (v[0] === l[i][0]) {
          a[h] = f[i];
          f[i] = null;
          h++;
        } else {
          // console.log(l[i]);
        }
      }
      p++;
    }
  }

  h = 0;

  for (let i = 0; i < n; i++) {
    if (f[i] != null) {
      a[a.length] = f[i];
    }
  }

  f = [];
  return a;
}

// [  1,  2,  3,
// 1,'x','y','h'
// 2,'x','y','h'
// 3,'x','y','h'
// 4,'x','y','h']
