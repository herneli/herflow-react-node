import requestApi from "./api";
// import { renewToken } from "./tokens";

const httpClient = {
  call(url, options) {
    // TODO: Test without tokens
    //return renewToken().then(() => requestApi(url, options));
    return requestApi(url, options);
  },

  get(url, options) {
    return this.call(url, {
      ...options,
      method: "get"
    });
  },

  post(url, options) {
    return this.call(url, {
      ...options,
      method: "post"
    });
  },

  put(url, options) {
    return this.call(url, {
      ...options,
      method: "put"
    });
  },

  del(url, options) {
    return this.call(url, {
      ...options,
      method: "delete"
    });
  },

  file(url, options) {
    return this.call(url, {
      ...options,
      type: "application/zip",
      encoding: null
    });
  }
};

export default httpClient;
