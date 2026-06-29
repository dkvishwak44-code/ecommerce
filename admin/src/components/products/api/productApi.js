import BaseApi from "@/utils/baseApi";

class ProductApi extends BaseApi {
  constructor() {
    super("/products");
  }

  // ── GET all products (with filters/pagination) ────────────────────────────
  // GET /api/admin/v1/products?page=1&limit=10&status=active
  getAll(params = {}) {
    return this.get(params);
  }

  // ── GET single product by ID ──────────────────────────────────────────────
  // GET /api/admin/v1/products/:id
  getOne(id) {
    return this.getById(id, {}, { cache: true, cacheTTL: 60000 });
  }

  // ── CREATE product ────────────────────────────────────────────────────────
  // POST /api/admin/v1/products
  create(data) {
    return this.post(data);
  }

  // ── UPDATE product (partial) ──────────────────────────────────────────────
  // PATCH /api/admin/v1/products/:id
  update(id, data) {
    return this.patch(id, data);
  }

  // ── DELETE product ────────────────────────────────────────────────────────
  // DELETE /api/admin/v1/products/:id
  remove(id) {
    return this.delete(id);
  }

  // ── UPLOAD product images ─────────────────────────────────────────────────
  // POST /api/admin/v1/products/:id/images
  uploadImages(id, formData) {
    return this.upload(`/${id}/images`, formData);
  }

  // ── TOGGLE featured ───────────────────────────────────────────────────────
  // PATCH /api/admin/v1/products/:id/featured
  toggleFeatured(id, isFeatured) {
    return this.patchTo(`/${id}/featured`, { isFeatured });
  }

  // ── TOGGLE publish ────────────────────────────────────────────────────────
  // PATCH /api/admin/v1/products/:id/publish
  togglePublish(id, isPublished) {
    return this.patchTo(`/${id}/publish`, { isPublished });
  }
}

export const productApi = new ProductApi();