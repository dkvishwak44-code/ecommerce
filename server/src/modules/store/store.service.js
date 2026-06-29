import slugify from "slugify";
import * as storeRepo from "./store.repository.js";
import { AppError } from "../../utils/AppError.js";
import { STORE_STATUS } from "../../constants/status.js";
import { ROLES } from "../../constants/roles.js";
import Role from "../role/role.model.js";
import User from "../user/user.model.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

const generateUniqueSlug = async (name, excludeId = null) => {
  let slug = slugify(name, { lower: true, strict: true, trim: true });
  let isTaken = await storeRepo.isSlugTaken(slug, excludeId);
  if (isTaken) {
    slug = `${slug}-${Date.now()}`;
  }
  return slug;
};

// ── Create Store ──────────────────────────────────────────────────────────────

export const createStore = async (ownerId, data) => {
  const existingStore = await storeRepo.findStoreByOwner(ownerId);
  if (existingStore) {
    throw new AppError("You already have a store registered.", 409);
  }

  const slug = await generateUniqueSlug(data.name);

  const store = await storeRepo.createStore({
    ...data,
    slug,
    owner: ownerId,
    status: STORE_STATUS.PENDING,
  });

  return store;
};

// ── Get Store by ID ───────────────────────────────────────────────────────────

export const getStoreById = async (id, options = {}) => {
  const store = await storeRepo.findStoreById(id, options);
  if (!store) throw new AppError("Store not found.", 404);
  return store;
};

// ── Get Store by Slug ─────────────────────────────────────────────────────────

export const getStoreBySlug = async (slug) => {
  const store = await storeRepo.findStoreBySlug(slug);
  if (!store) throw new AppError("Store not found.", 404);
  return store;
};

// ── Get My Store (owner) ──────────────────────────────────────────────────────

export const getMyStore = async (ownerId) => {
  const store = await storeRepo.findStoreByOwner(ownerId);
  if (!store) throw new AppError("You don't have a store yet.", 404);
  return store;
};

// ── List All Stores (admin) ───────────────────────────────────────────────────

export const listAllStores = async ({ status, isActive, page = 1, limit = 20 } = {}) => {
  const filter = {};
  if (status) filter.status = status;
  if (isActive !== undefined) filter.isActive = isActive === "true" || isActive === true;

  return storeRepo.findAllStores({ filter, page: Number(page), limit: Number(limit) });
};

export const createStoreByAdmin = async (data = {}, adminId = null) => {
  const ownerPayload = data.ownerDetails || data.storeOwner || data.ownerUser || (
    data.owner && typeof data.owner === "object" ? data.owner : null
  );
  let ownerId = ownerPayload ? null : data.owner || data.ownerId;

  if (ownerPayload) {
    ownerId = await createStoreOwner(ownerPayload, adminId);
  }

  if (!ownerId) {
    throw new AppError("Store owner is required.", 400);
  }

  const existingStore = await storeRepo.findStoreByOwner(ownerId);
  if (existingStore) {
    throw new AppError("This owner already has a store registered.", 409);
  }

  const slug = await generateUniqueSlug(data.name);

  const {
    owner,
    ownerDetails,
    ownerUser,
    storeOwner,
    ownerId: _ownerId,
    status = STORE_STATUS.PENDING,
    isVerified,
    verifiedAt,
    verifiedBy,
    ...storeData
  } = data;

  const store = await storeRepo.createStore({
    ...storeData,
    slug,
    owner: ownerId,
    status,
    isVerified: isVerified ?? status === STORE_STATUS.VERIFIED,
    verifiedAt: verifiedAt ?? (status === STORE_STATUS.VERIFIED ? new Date() : null),
    verifiedBy: verifiedBy ?? (status === STORE_STATUS.VERIFIED ? adminId : null),
  });

  if (ownerPayload) {
    await User.findByIdAndUpdate(ownerId, { $set: { store: store._id } });
  }

  return store;
};

const createStoreOwner = async (ownerPayload, adminId) => {
  const {
    id,
    _id,
    name,
    email,
    password,
    mobile,
    phone,
    roleId,
  } = ownerPayload;

  if (!name || !email || !password || !(mobile || phone)) {
    throw new AppError("Owner name, email, password, and mobile are required.", 400);
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError("A user with this email already exists.", 409);
  }

  const sellerRole = roleId
    ? await Role.findById(roleId).select("_id name").lean()
    : await Role.findOne({ name: ROLES.SELLER, isActive: true }).select("_id name").lean();

  if (!sellerRole) {
    throw new AppError("Seller role not found. Please seed roles first.", 500);
  }

  const user = await User.create({
    ...((id || _id) ? { _id: id || _id } : {}),
    name,
    email,
    phone: mobile || phone,
    password,
    role: sellerRole._id,
    roleName: ROLES.SELLER,
    createdBy: adminId,
    isVerified: true,
    isEmailVerified: true,
  });

  return user._id;
};

// ── Update Store ──────────────────────────────────────────────────────────────

export const updateStore = async (storeId, ownerId, updateData, isAdmin = false) => {
  const store = await storeRepo.findStoreById(storeId);
  if (!store) throw new AppError("Store not found.", 404);

  if (!isAdmin && store.owner.toString() !== ownerId.toString()) {
    throw new AppError("You are not authorized to update this store.", 403);
  }

  // Regenerate slug if name changed
  if (updateData.name && updateData.name !== store.name) {
    updateData.slug = await generateUniqueSlug(updateData.name, storeId);
  }

  // Admins can't accidentally update sensitive status fields here
  const { status, isVerified, verifiedAt, verifiedBy, isDefault, ...safeUpdate } = updateData;

  return storeRepo.updateStoreById(storeId, safeUpdate);
};

export const updateStoreByAdmin = async (storeId, updateData, adminId = null) => {
  const store = await storeRepo.findStoreById(storeId);
  if (!store) throw new AppError("Store not found.", 404);

  if (updateData.name && updateData.name !== store.name) {
    updateData.slug = await generateUniqueSlug(updateData.name, storeId);
  }

  const { owner, ownerId, verifiedBy, verifiedAt, ...safeUpdate } = updateData;

  if (safeUpdate.status === STORE_STATUS.VERIFIED) {
    safeUpdate.isVerified = true;
    safeUpdate.verifiedAt = store.verifiedAt || new Date();
    safeUpdate.verifiedBy = store.verifiedBy || adminId;
    safeUpdate.rejectionReason = null;
  }

  if (safeUpdate.status === STORE_STATUS.REJECTED) {
    safeUpdate.isVerified = false;
    safeUpdate.verifiedAt = null;
  }

  return storeRepo.updateStoreById(storeId, safeUpdate);
};

// ── Update Bank Details (sensitive) ──────────────────────────────────────────

export const updateBankDetails = async (storeId, ownerId, bankDetails) => {
  const store = await storeRepo.findStoreById(storeId, { lean: false });
  if (!store) throw new AppError("Store not found.", 404);
  if (store.owner.toString() !== ownerId.toString()) {
    throw new AppError("Not authorized.", 403);
  }
  return storeRepo.updateStoreById(storeId, { bankDetails });
};

// ── Verify Store (admin) ──────────────────────────────────────────────────────

export const verifyStore = async (storeId, adminId) => {
  const store = await storeRepo.findStoreById(storeId);
  if (!store) throw new AppError("Store not found.", 404);
  if (store.status === STORE_STATUS.VERIFIED) {
    throw new AppError("Store is already verified.", 400);
  }
  return storeRepo.verifyStoreById(storeId, adminId);
};

// ── Reject Store (admin) ──────────────────────────────────────────────────────

export const rejectStore = async (storeId, reason) => {
  const store = await storeRepo.findStoreById(storeId);
  if (!store) throw new AppError("Store not found.", 404);
  if (store.status === STORE_STATUS.REJECTED) {
    throw new AppError("Store is already rejected.", 400);
  }
  return storeRepo.rejectStoreById(storeId, reason);
};

// ── Toggle Active (admin or owner) ───────────────────────────────────────────

export const toggleStoreActive = async (storeId, isActive) => {
  const store = await storeRepo.findStoreById(storeId);
  if (!store) throw new AppError("Store not found.", 404);
  return storeRepo.toggleStoreActive(storeId, isActive);
};

// ── Add Member ────────────────────────────────────────────────────────────────

export const addMember = async (storeId, ownerId, { userId, roleId }) => {
  const store = await storeRepo.findStoreById(storeId);
  if (!store) throw new AppError("Store not found.", 404);

  if (store.owner.toString() !== ownerId.toString()) {
    throw new AppError("Only the store owner can add members.", 403);
  }

  const alreadyMember = store.members?.some((m) => m.user.toString() === userId);
  if (alreadyMember) throw new AppError("User is already a member.", 409);

  return storeRepo.addMember(storeId, { userId, roleId });
};

// ── Remove Member ─────────────────────────────────────────────────────────────

export const removeMember = async (storeId, ownerId, userId) => {
  const store = await storeRepo.findStoreById(storeId);
  if (!store) throw new AppError("Store not found.", 404);

  if (store.owner.toString() !== ownerId.toString()) {
    throw new AppError("Only the store owner can remove members.", 403);
  }

  return storeRepo.removeMember(storeId, userId);
};

// ── Soft Delete ───────────────────────────────────────────────────────────────

export const deleteStore = async (storeId, requesterId, isAdmin = false) => {
  const store = await storeRepo.findStoreById(storeId);
  if (!store) throw new AppError("Store not found.", 404);

  if (!isAdmin && store.owner.toString() !== requesterId.toString()) {
    throw new AppError("Not authorized to delete this store.", 403);
  }

  if (store.isDefault) {
    throw new AppError("Default platform store cannot be deleted.", 403);
  }

  return storeRepo.softDeleteStore(storeId);
};

// ── Update Meta (internal use by other services) ──────────────────────────────

export const incrementMeta = async (storeId, metaFields) => {
  return storeRepo.incrementStoreMeta(storeId, metaFields);
};

export const updateRating = async (storeId, averageRating, totalReviews) => {
  return storeRepo.updateAverageRating(storeId, averageRating, totalReviews);
};
