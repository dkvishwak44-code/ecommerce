import slugify from "slugify";
import Product from "../product.model.js";
import Store from "../../store/store.model.js";
import { AppError } from "../../../utils/AppError.js";
import { auditLog } from "../../../utils/auditLogger.js";
import { deleteManyFromCloudinary } from "../../../utils/cloudinary.js";

const isPlatformAdmin = (req) =>
  req.user?.roleName === "superadmin" ||
  req.user?.roleName === "admin" ||
  req.authUser?.isSuperAdmin;

const getUserId = (req) => req.user?.id || req.authUser?._id;

const getAssignedStoreId = (req) =>
  req.user?.storeId || req.authUser?.store?._id || req.authUser?.store;

const generateSlug = (name) =>
  slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

const resolveStore = async (storeId) => {
  if (!storeId) {
    throw new AppError("Store ID is required.", 400);
  }

  const store = await Store.findById(storeId).select("_id owner").lean();
  if (!store) {
    throw new AppError("Store not found.", 404);
  }

  return store;
};

const assertCanUseStore = (req, storeId) => {
  if (isPlatformAdmin(req)) return;

  const assignedStoreId = getAssignedStoreId(req);
  if (!assignedStoreId || assignedStoreId.toString() !== storeId.toString()) {
    throw new AppError("You do not have access to this store.", 403);
  }
};

const buildListQuery = (req) => {
  const query = {};

  if (req.query.storeId) query.storeId = req.query.storeId;
  if (req.query.categoryId) query.categoryId = req.query.categoryId;
  if (req.query.sellerId) query.sellerId = req.query.sellerId;
  if (req.query.status) query.status = req.query.status;
  if (req.query.isPublished !== undefined) {
    query.isPublished = req.query.isPublished === "true";
  }
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  if (!isPlatformAdmin(req)) {
    const assignedStoreId = getAssignedStoreId(req);
    if (!assignedStoreId) {
      throw new AppError("No store assigned to your account.", 403);
    }
    query.storeId = assignedStoreId;
  }

  return query;
};

// export const createProduct = async (req) => {
//   const payload = req.body;
//   const store = await resolveStore(payload.storeId);
//   assertCanUseStore(req, store._id);

//   const exists = await Product.findOne({ sku: payload.sku }).select("_id").lean();
//   if (exists) {
//     throw new AppError("SKU already exists.", 409);
//   }

//   const createdBy = getUserId(req);
//   const sellerId = isPlatformAdmin(req)
//     ? payload.sellerId || store.owner
//     : createdBy;

//   const product = await Product.create({
//     ...payload,
//     slug: generateSlug(payload.name),
//     storeId: store._id,
//     sellerId,
//     createdBy,
//   });

//   auditLog({
//     action: "CREATE",
//     entity: "PRODUCT",
//     entityId: product._id,
//     req,
//     changes: { after: product },
//   });

//   return product;
// };


export const createProduct = async (req) => {
  const payload = req.body;
  const store = await resolveStore(payload.storeId);
  assertCanUseStore(req, store._id);

  const exists = await Product.findOne({ sku: payload.sku }).select("_id").lean();
  if (exists) throw new AppError("SKU already exists.", 409);

  // ── Cloudinary uploaded files ──────────────────────────────
  const images = req.files?.map((file) => ({
    url:       file.path,      // cloudinary secure_url
    public_id: file.filename,  // cloudinary public_id
  })) ?? [];

  const thumbnail = images.length > 0 ? images[0] : null;
  // ──────────────────────────────────────────────────────────

  const createdBy = getUserId(req);
  const sellerId  = isPlatformAdmin(req)
    ? payload.sellerId || store.owner
    : createdBy;

  const product = await Product.create({
    ...payload,
    slug:      generateSlug(payload.name),
    storeId:   store._id,
    sellerId,
    createdBy,
    images,      // ← add
    thumbnail,   // ← add
  });

  auditLog({ action: "CREATE", entity: "PRODUCT", entityId: product._id, req, changes: { after: product } });
  return product;
};

export const getAllProducts = async (req) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const query = buildListQuery(req);

  const [products, total] = await Promise.all([
    Product.find(query)
      // .populate("categoryId")
      // .populate("sellerId", "name email")
      .populate("storeId", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (req) => {
  const product = await Product.findById(req.params.id)
    // .populate("categoryId")
    // .populate("sellerId", "name email")
    .populate("storeId", "name")
    .populate("createdBy", "name email");

  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  assertCanUseStore(req, product.storeId._id || product.storeId);
  return product;
};

// export const updateProduct = async (req) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) {
//     throw new AppError("Product not found.", 404);
//   }

//   assertCanUseStore(req, product.storeId);

//   const oldData = product.toObject();
//   const updates = { ...req.body };
//   delete updates.createdBy;

//   if (updates.sku && updates.sku !== product.sku) {
//     const exists = await Product.findOne({ sku: updates.sku, _id: { $ne: product._id } })
//       .select("_id")
//       .lean();
//     if (exists) {
//       throw new AppError("SKU already exists.", 409);
//     }
//   }

//   if (updates.storeId) {
//     const store = await resolveStore(updates.storeId);
//     assertCanUseStore(req, store._id);
//     updates.storeId = store._id;
//     if (isPlatformAdmin(req) && !updates.sellerId) {
//       updates.sellerId = store.owner;
//     }
//   }

//   if (!isPlatformAdmin(req)) {
//     delete updates.sellerId;
//     delete updates.storeId;
//   }

//   if (updates.name) {
//     updates.slug = generateSlug(updates.name);
//   }

//   Object.assign(product, updates);
//   await product.save();

//   auditLog({
//     action: "UPDATE",
//     entity: "PRODUCT",
//     entityId: product._id,
//     req,
//     changes: {
//       before: oldData,
//       after: product,
//     },
//   });

//   return product;
// };

export const updateProduct = async (req) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found.", 404);

  assertCanUseStore(req, product.storeId);

  const oldData  = product.toObject();
  const updates  = { ...req.body };
  delete updates.createdBy;

  // ── Cloudinary: naye images aaye hain ──────────────────────
  if (req.files?.length > 0) {
    // Purane images delete karo cloudinary se
    const oldPublicIds = product.images
      ?.map((img) => img.public_id)
      .filter(Boolean) ?? [];

    if (oldPublicIds.length > 0) {
      await deleteManyFromCloudinary(oldPublicIds);
    }

    // Naye images set karo
    updates.images    = req.files.map((file) => ({
      url:       file.path,
      public_id: file.filename,
    }));
    updates.thumbnail = updates.images[0];
  }
  // ──────────────────────────────────────────────────────────

  if (updates.sku && updates.sku !== product.sku) {
    const exists = await Product.findOne({ sku: updates.sku, _id: { $ne: product._id } })
      .select("_id").lean();
    if (exists) throw new AppError("SKU already exists.", 409);
  }

  if (updates.storeId) {
    const store = await resolveStore(updates.storeId);
    assertCanUseStore(req, store._id);
    updates.storeId = store._id;
    if (isPlatformAdmin(req) && !updates.sellerId) {
      updates.sellerId = store.owner;
    }
  }

  if (!isPlatformAdmin(req)) {
    delete updates.sellerId;
    delete updates.storeId;
  }

  if (updates.name) updates.slug = generateSlug(updates.name);

  Object.assign(product, updates);
  await product.save();

  auditLog({ action: "UPDATE", entity: "PRODUCT", entityId: product._id, req, changes: { before: oldData, after: product } });
  return product;
};

// export const deleteProduct = async (req) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) {
//     throw new AppError("Product not found.", 404);
//   }

//   assertCanUseStore(req, product.storeId);
//   await product.deleteOne();

//   auditLog({
//     action: "DELETE",
//     entity: "PRODUCT",
//     entityId: product._id,
//     req,
//     changes: { before: product },
//   });

//   return {
//     message: "Product deleted successfully.",
//   };
// };
export const deleteProduct = async (req) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found.", 404);

  assertCanUseStore(req, product.storeId);

  // ── Cloudinary: sab images delete karo ────────────────────
  const publicIds = [
    ...(product.images?.map((img) => img.public_id) ?? []),
    product.thumbnail?.public_id,
  ].filter(Boolean);

  if (publicIds.length > 0) {
    await deleteManyFromCloudinary(publicIds);
  }
  // ──────────────────────────────────────────────────────────

  await product.deleteOne();

  auditLog({ action: "DELETE", entity: "PRODUCT", entityId: product._id, req, changes: { before: product } });
  return { message: "Product deleted successfully." };
};