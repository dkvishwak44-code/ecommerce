import BaseApi from "@/utils/baseApi";

// ── Permission API ────────────────────────────────────────────────────────────
class PermissionApi extends BaseApi {
  constructor() {
    super("/permissions");
  }

  // GET /api/admin/v1/permissions
  getAll(params = {}) {
    return this.get(params, {}, { cache: true, cacheTTL: 60000 });
  }

  // GET /api/admin/v1/permissions/:id
  getOne(id) {
    return this.getById(id, {}, { cache: true, cacheTTL: 60000 });
  }

  // POST /api/admin/v1/permissions
  create(data) {
    return this.post(data);
  }

  // PATCH /api/admin/v1/permissions/:id
  update(id, data) {
    return this.patch(id, data);
  }

  // DELETE /api/admin/v1/permissions/:id
  remove(id) {
    return this.delete(id);
  }
}


export const permissionApi = new PermissionApi();