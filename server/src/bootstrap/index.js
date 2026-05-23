import { seedPermissions } from "./seedPermissions.js";
import { seedRoles } from "./seedRoles.js";
import { createSuperAdmin } from "./createSuperAdmin.js";
import { createDefaultStore } from "./createDefaultStore.js";
import {logger} from "../config/logger.js";

export const runBootstrap = async () => {
  try {
    logger.info(" Starting bootstrap process...");

    // Step 1: Seed all permissions
    await seedPermissions();

    // Step 2: Seed default roles (superadmin, admin, seller)
    await seedRoles();

    // Step 3: Create super admin user
    await createSuperAdmin();

    // Step 4: Create default company/store
    await createDefaultStore();

    logger.info("✅ Bootstrap completed successfully.");
  } catch (err) {
    logger.error("❌ Bootstrap failed:", err);
    throw err;
  }
};