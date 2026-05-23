import User       from "../modules/user/user.model.js";
import Role       from "../modules/role/role.model.js";
import Permission from "../modules/permission/permission.model.js";
import { ROLES }  from "../constants/roles.js";
import { env }    from "../config/env.js";
import { logger } from "../config/logger.js";

/**
 * Creates the default Super Admin user with ALL permissions.
 *
 * Safe to re-run — skips user creation if already exists
 * but ALWAYS syncs permissions on every boot.
 *
 * Boot order:
 *   seedPermissions() → createSuperAdmin()
 *   (roles already exist in DB)
 */
export const createSuperAdmin = async () => {
  try {
    logger.info("👤 Checking super admin...");

    const { SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = env;

    // ── 1. Validate env ───────────────────────────────────────────────────────
    if (!SUPER_ADMIN_EMAIL) {
      throw new Error("SUPER_ADMIN_EMAIL must be set in .env");
    }
    if (!SUPER_ADMIN_PASSWORD) {
      throw new Error("SUPER_ADMIN_PASSWORD must be set in .env");
    }

    // ── 2. Resolve superadmin role from existing DB ───────────────────────────
    const superAdminRole = await Role.findOne({ name: ROLES.SUPERADMIN });
    if (!superAdminRole) {
      throw new Error(
        `Superadmin role not found in DB. ` +
        `Looking for name: "${ROLES.SUPERADMIN}". ` +
        `Check your roles collection — name must match exactly.`
      );
    }
    logger.info(`✅ Found role: "${superAdminRole.name}" (${superAdminRole._id})`);

    // ── 3. Fetch ALL active permissions ───────────────────────────────────────
    const allPermissions = await Permission.find({ isActive: true }).lean();
    if (!allPermissions.length) {
      logger.warn("⚠️  No permissions found — run seedPermissions() first.");
    }

    const allPermissionIds = allPermissions.map((p) => p._id);
    logger.info(`🔑 Found ${allPermissionIds.length} permissions to assign.`);

    // ── 4. Assign ALL permissions to superadmin role (idempotent) ─────────────
    await Role.findByIdAndUpdate(
      superAdminRole._id,
      {
        $set: {
          permissions:  allPermissionIds,
          isActive:     true,
        },
      },
      { new: true }
    );
    logger.info(`🔑 Permissions synced to role "${superAdminRole.name}".`);

    // ── 5. Check if superadmin user already exists ────────────────────────────
    const existing = await User.findOne({
      email: SUPER_ADMIN_EMAIL.toLowerCase(),
    });

    if (existing) {
      logger.info(`ℹ️  Super admin already exists (${existing.email}) — permissions synced.`);
      return existing;
    }

    // ── 6. Create superadmin user ─────────────────────────────────────────────
    const superAdmin = await User.create({
      name:            SUPER_ADMIN_NAME || "Super Admin",
      email:           SUPER_ADMIN_EMAIL,
      password:        SUPER_ADMIN_PASSWORD, // hashed by pre-save hook
      role:            superAdminRole._id,
      roleName:        superAdminRole.name,
      isActive:        true,
      isVerified:      true,
      isEmailVerified: true,   // no OTP needed for seeded admin
      isSuperAdmin:    true,
      isFirstLogin:    false,  // env credentials — no force-change
      status:          "active",
      avatar:          null,
      phone:           null,
    });

    logger.info(`✅ Super admin created — ${superAdmin.email}`);
    logger.info(`🔑 Role    : "${superAdminRole.name}"`);
    logger.info(`🔑 Permissions assigned: ${allPermissionIds.length}`);

    return superAdmin;

  } catch (err) {
    logger.error(`❌ Failed to create super admin: ${err.message}`);
    throw err;
  }
};