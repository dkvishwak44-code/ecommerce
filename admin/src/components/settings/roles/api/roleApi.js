import BaseApi from "@/utils/baseApi";

// ── Role API ──────────────────────────────────────────────────────────────────
class RoleApi extends BaseApi {
  constructor() {
    super("/roles");
  }

  // GET /api/admin/v1/roles
  getAll(params = {}) {
    return this.get(params, {}, { cache: true, cacheTTL: 60000 });
  }

  // GET /api/admin/v1/roles/:id
  getOne(id) {
    return this.getById(id, {}, { cache: true, cacheTTL: 60000 });
  }

  // POST /api/admin/v1/roles
  create(data) {
    return this.post(data);
  }

  // PATCH /api/admin/v1/roles/:id
  update(id, data) {
    return this.patch(id, data);
  }

  // DELETE /api/admin/v1/roles/:id
  remove(id) {
    return this.delete(id);
  }

  // PATCH /api/admin/v1/roles/:id/permissions
  // Assign permissions array to a role
  assignPermissions(id, permissionIds) {
    return this.patchTo(`/${id}/permissions`, { permissionIds });
  }

  // DELETE /api/admin/v1/roles/:id/permissions
  // Remove permissions from a role
  revokePermissions(id, permissionIds) {
    return this.deleteTo(`/${id}/permissions`, { data: { permissionIds } });
  }
}

export const roleApi       = new RoleApi();