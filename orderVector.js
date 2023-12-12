export function unsetPhoneEmail(deliveryman, n) {
  for (let i = 0; i < n; i++) {
    if (deliveryman[i].createdBy && deliveryman[i].createdBy.private) {
      deliveryman[i].createdBy.phone = null;
      deliveryman[i].createdBy.email = null;
    }
  }
  return deliveryman;
}

export class Filter {
  constructor(query, schema) {
    this.query = query;
    this.hasFilter = false;
    this.schema = schema;
    this.queryObj = {};
    //numeric case
  }

  /**
   * @param {object} array
   */
  set populateSetter(array) {
    return (this.populateObject = array);
  }
  set queryObjSetter(val) {
    return (this.queryObj = val);
  }
  async filter() {
    for (let key in this.query) {
      if (this.query[key] && key !== "id") {
        this.setHasFilter(key);
        if (this.enumBoolean(key)) {
          this.enumUseCase(key);
        }
        if (this.numericBoolean(key)) {
          await this.handleNumericRequest(this.query[key], key);
        }
        if (isNaN(this.query[key])) {
          this.queryObj[key] = {
            $regex: this.query[key],
            $options: "i",
          };
        }
      }
    }
  }

  setHasFilter(key) {
    if (key === "page" || key === "limit") return null;
    else this.hasFilter = true;
  }

  numericBoolean(key) {
    if (
      !isNaN(+this.query[key]) &&
      +this.query[key] > 0 &&
      key !== "page" &&
      key !== "limit"
    )
      return true;
    else false;
  }
  enumBoolean(key) {
    if (key === "preferState") return true;
    else false;
  }

  enumUseCase(key) {
    this.queryObj[key] = this.query[key];
  }

  async responseNormalCase() {
    let page = Number(this.query.page) || 1;
    let limit = Number(this.query.limit) || 10;
    let skip = (page - 1) * limit;
    let totalDoc = await this.schema.countDocuments(this.queryObj);
    let numOfPage = Math.ceil(totalDoc / limit);
    let result = this.schema
      .find(this.queryObj)
      .skip(skip)
      .limit(limit)
      .sort("-createdAt")
      .select("-__v ")
      .populate(this.populateObject);

    this.totalDocuments = totalDoc;
    this.nP = numOfPage;
    this.documents = await result;
  }

  //Para fechar e resolver esse problema do populate

  async handleNumericRequest(v, k) {
    let docArr = [];
    let a = [];
    let j = 0;
    let allDocs = await this.schema
      .find(this.queryObj)
      .populate(this.populateObject);
    let n = allDocs.length;
    for (let i = 0; i < n; i++) {
      let m = allDocs[i][k] / +v;
      if (m >= 1 && 2 >= m) {
        a[j] = allDocs[i];
        j++;
      } else if (m > 2 && m < 10) {
        a[j] = allDocs[i];
        j++;
      }
    }
    docArr = this.orderTopArray(a, a.length, k);
    // let p = this.query.page > 1 ? +this.query.page * +this.query.limit : 0;
    n = a.length;
    this.nP = Math.ceil(a.length / +this.query.limit);
    this.totalDocuments = n;
    this.documents = docArr;
  }

  orderTopArray(a, n, k) {
    let i = 0;
    let j = 0;
    let m = 0;
    let r = [];
    for (i = 0; i < n; i++) {
      m = i;
      for (j = i + 1; j < n; j++) {
        if (a[j][k] < a[m][k]) {
          m = j;
        }
      }
      r[i] = a[m];
      a[m] = a[i];
    }
    return r;
  }

  async formatEmphasis() {
    let a = [];
    let u = 0;
    let n = this.documents.length;
    let documentEmphasis;
    while (u < n) {
      if (this.documents[u].createdBy != null)
        if (this.query.id === this.documents[u].createdBy._id.toString()) {
          documentEmphasis = this.documents[u];
          a[n - 1] = this.documents[u];
        }

      if (u == n - 1 && !documentEmphasis) {
        documentEmphasis = await this.schema.findOne({
          createdBy: this.query.id,
        });
      }
      u++;
    }
    if (!documentEmphasis) return this.documents;
    for (let i = 0; i < n; i++) {
      if (i == 0) a[i] = documentEmphasis;
      else if (i != 0 && a[i] == null) a[i] = arr[i - 1];
    }
    this.documents = a;
  }
}
