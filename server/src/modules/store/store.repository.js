import Store from "./store.model.js";


// ── Create ────────────────────────────────────────────────────────────────────

export const createStore = async (data) => {
  const store = new Store(data);
  return store.save();
};

// ── Read ──────────────────────────────────────────────────────────────────────

export const findStoreById = async (id, options = {}) => {
  const query = Store.findById(id);
  if (options.withBankDetails) query.select("+bankDetails.accountNumber +bankDetails.ifscCode +bankDetails.upiId");
  if (options.populate) query.populate(options.populate);
  return query.lean(options.lean ?? true);
};

export const findStoreBySlug = async (slug) => {
  return Store.findBySlug(slug).lean();
};

export const findStoreByOwner = async (ownerId) => {
  return Store.findOne({ owner: ownerId }).lean();
};

export const findDefaultStore = async () => {
  return Store.findDefault().lean();
};

export const findAllStores = async ({ filter = {}, sort = { createdAt: -1 }, page = 1, limit = 20, populate } = {}) => {
  const skip = (page - 1) * limit;
  const query = Store.find(filter).sort(sort).skip(skip).limit(limit);
  if (populate) query.populate(populate);
  const [stores, total] = await Promise.all([query.lean(), Store.countDocuments(filter)]);
  return { stores, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// ── Update ────────────────────────────────────────────────────────────────────

export const updateStoreById = async (id, updateData) => {
  return Store.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).lean();
};

export const incrementStoreMeta = async (id, metaFields) => {
  const inc = {};
  for (const [key, val] of Object.entries(metaFields)) {
    inc[`meta.${key}`] = val;
  }
  return Store.findByIdAndUpdate(id, { $inc: inc }, { new: true }).lean();
};

export const updateAverageRating = async (id, averageRating, totalReviews) => {
  return Store.findByIdAndUpdate(
    id,
    { $set: { "meta.averageRating": averageRating, "meta.totalReviews": totalReviews } },
    { new: true }
  ).lean();
};

// ── Status & Verification ─────────────────────────────────────────────────────

export const verifyStoreById = async (id, adminId) => {
  const store = await Store.findById(id);
  if (!store) return null;
  return store.verify(adminId);
};

export const rejectStoreById = async (id, reason) => {
  const store = await Store.findById(id);
  if (!store) return null;
  return store.reject(reason);
};

export const toggleStoreActive = async (id, isActive) => {
  return Store.findByIdAndUpdate(id, { $set: { isActive } }, { new: true }).lean();
};

// ── Soft Delete ───────────────────────────────────────────────────────────────

export const softDeleteStore = async (id) => {
  const store = await Store.findById(id);
  if (!store) return null;
  return store.softDelete();
};

// ── Members ───────────────────────────────────────────────────────────────────

export const addMember = async (storeId, { userId, roleId }) => {
  return Store.findByIdAndUpdate(
    storeId,
    { $push: { members: { user: userId, role: roleId, addedAt: new Date() } } },
    { new: true }
  ).lean();
};

export const removeMember = async (storeId, userId) => {
  return Store.findByIdAndUpdate(
    storeId,
    { $pull: { members: { user: userId } } },
    { new: true }
  ).lean();
};

// ── Checks ────────────────────────────────────────────────────────────────────

export const isSlugTaken = async (slug, excludeId = null) => {
  const query = { slug: slug.toLowerCase() };
  if (excludeId) query._id = { $ne: excludeId };
  const found = await Store.findOne(query).select("_id").lean();
  return !!found;
};
