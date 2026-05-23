import Permission from "../modules/permission/permission.model.js";
import { PERMISSIONS } from "../constants/permissions.js";
import {logger} from "../config/logger.js";

/**
 * Seeds all system permissions into the database.
 * Permissions are defined in constants/permissions.js and
 * grouped by module (e.g. product, order, user, etc.)
 *
 * Uses upsert (updateOne with upsert:true) so re-running is safe.
 */
export const seedPermissions = async () => {
  try {
    logger.info("🔐 Seeding permissions...");

    // Flatten PERMISSIONS constant into an array of objects
    // Expected shape of PERMISSIONS:
    // {
    //   PRODUCT: { CREATE: "product:create", READ: "product:read", ... },
    //   ORDER:   { READ: "order:read", UPDATE: "order:update", ... },
    //   ...
    // }
    const permissionDocs = [];

    for (const [module, actions] of Object.entries(PERMISSIONS)) {
      for (const [action, key] of Object.entries(actions)) {
        permissionDocs.push({
          key,                              // e.g. "product:create"
          module: module.toLowerCase(),     // e.g. "product"
          action: action.toLowerCase(),     // e.g. "create"
          description: `${action.charAt(0) + action.slice(1).toLowerCase()} ${module.toLowerCase()}`,
        });
      }
    }

    // Upsert each permission so existing data is preserved
    const ops = permissionDocs.map((perm) => ({
      updateOne: {
        filter: { key: perm.key },
        update: { $setOnInsert: perm },
        upsert: true,
      },
    }));

    const result = await Permission.bulkWrite(ops);

    logger.info(
      `✅ Permissions seeded — ${result.upsertedCount} new, ${result.matchedCount} existing.`
    );
  } catch (err) {
    logger.error("❌ Failed to seed permissions:", err);
    throw err;
  }
};