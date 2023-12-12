import { dates } from "../globalHandlers";

let state = [];
let sM = 0;
//f = documents which need to be filter
//v = input value
//vn = input name that need's to match with f value to be filtered
export function orderNumVectors(f, v, vn, isDate) {
  if (v === "") return state;
  let n = f.length;
  let u = 0;
  let l = 0;
  let g = 0;
  let s = 0;
  let a = [];
  let b = [];
  let t = [];
  //dV & dF represent the date formate
  //dV = input date
  //dF = item (f) date
  let dV;
  let dF;
  let si = [];
  for (let i = 0; i < n; i++) {
    if (sM == 0) state[i] = { ...f[i] };

    if (isDate) {
      dF = formatDate(f, null, i, vn, u);
      dV = formatDate(f, v, i, vn, u);
    } else {
      dF = f[i][vn];
      dV = v;
    }
    u = 0;
    //if both values = 1 that logic target's the item (f)
    if (dF / dV == 1) {
      //target value
      si[s] = { ...f[i] };
      s++;
    } else if (dF / dV < 1) {
      //lim bottom
      b[l] = { ...f[i] };
      l++;
    } else if (dF / dV > 1) {
      //lim top
      t[g] = { ...f[i] };
      g++;
    }
  }
  //this combined with lim top result in all values sorted
  t = calcTopLim(t, vn, isDate);

  a = format(si, t);
  sM++;
  return response(a, b);
}
//sort  the closest value compared to input on the top limit arr
/* f < u if that condition hit the same amount as n - 1 that means
the i corresponds to the position who has the lowest value */

function formatDate(f, v, i, vn, u) {
  let fm = "";
  let j = f[i][vn];
  let k = j.length;
  let y = 0;
  if (v == null) {
    while (u < k) {
      if (j[u] === "T") y = u;
      u++;
    }
    u = 0;
    while (u < y) {
      fm += j[u];
      u++;
    }
  }
  console.log(fm);
  let r = dates(fm);
  if (v != null) r = dates(v);
  return r;
}

function calcTopLim(t, vn, is) {
  let n = t.length;
  let a = [];
  //arr z is the guy who receive repeated values on top lim
  let z = [];
  let g = 0;
  for (let i = 0; i < n; i++) {
    let nv = 0;
    let k = 0;
    let f;
    if (is) f = dates(t[i][vn]);
    else f = t[i][vn];
    while (k < n) {
      let u;
      if (is) u = dates(t[k][vn]);
      else u = t[k][vn];
      if (f < u) nv++;
      k++;
    }
    let r = n - 1;
    if (a[r - nv]) {
      z[g] = a[r - nv];
      g++;
    }
    if (nv == n) {
      a[r] = t[i];
    } else if (nv < n) {
      a[r - nv] = t[i];
    }
  }
  //formatting the arr
  g = 0;
  let e = 0;
  if (z.length) {
    while (g < a.length) {
      if (a[g] == null) {
        a[g] = z[e];
        e++;
      }
      g++;
    }
  }
  return a;
}

//inserting the target item in arr
function format(f, t) {
  let tar = t.length;
  let it = f.length;
  let n = tar > it ? tar : it;
  tar < it && n - 1;
  let m = tar > it ? it : tar;
  let o = 0;
  let a = [];
  while (o < n) {
    // console.log(f[o]);
    if (typeof f[o] !== "undefined") a[o] = f[o];
    if (typeof t[o] !== "undefined") a[m + o] = t[o];
    o++;
  }
  console.log(a);
  // console.log(a, f);
  return a;
}

//format array basically insert the bottom lim on top of top lim
function response(a, b) {
  let n = a.length;
  let m = b.length;
  let lt = n + m;
  let z = [];
  for (let i = 0; i < lt; i++) {
    if (n < i + 1) z[i] = b[i - n];
    else z[i] = a[i];
  }
  return z;
}

/*   t[i]/t[k] = 0.985646 * 10 ** 2  98%    */
//      let x = ((f / u) * 10 ** 2) / n;
//let y = f / u;
//&& f !== u
//   if (f / u != 1) {
// console.log(y);
// console.log(t[i].collectDate, t[k].collectDate);
// console.log(x);
// console.log(f > u);
////////
// a[c + 1] = a[c];
