// src/utils/base-api.js

import api from "./api";

class BaseApi {
  constructor(basePath = "") {
    this.basePath = basePath;
  }

  url(path = "") {
    return `${this.basePath}${path}`;
  }

  get(params = {}, config = {}) {
    return api.get(this.url(""), {
      params,
      ...config,
    });
  }

  getById(id, config = {}) {
    return api.get(this.url(`/${id}`), config);
  }

  post(data, config = {}) {
    return api.post(this.url(""), data, config);
  }

  put(id, data, config = {}) {
    return api.put(this.url(`/${id}`), data, config);
  }

  patch(id, data, config = {}) {
    return api.patch(this.url(`/${id}`), data, config);
  }

  delete(id, config = {}) {
    return api.delete(this.url(`/${id}`), config);
  }
}

export default BaseApi;