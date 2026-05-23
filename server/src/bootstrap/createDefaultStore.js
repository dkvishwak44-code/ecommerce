import Store from "../modules/store/store.model.js";
import User from "../modules/user/user.model.js";
import Settings from "../modules/settings/settings.model.js";
import { env } from "../config/env.js";
import { slugify } from "../utils/slugify.js";
import {logger} from "../config/logger.js";

/**
 * Creates the default company / platform store.
 *
 * This store acts as the "parent" company on the platform. It is:
 *   - Owned by the super admin user
 *   - Marked as the default store (isDefault: true)
 *   - Used as the fallback for platform-level settings
 *
 * Configuration is read from environment variables:
 *   DEFAULT_STORE_NAME        — company name      (default: "Platform HQ")
 *   DEFAULT_STORE_EMAIL       — contact email     (defaults to SUPER_ADMIN_EMAIL)
 *   DEFAULT_STORE_PHONE       — contact phone     (optional)
 *   DEFAULT_STORE_CURRENCY    — ISO currency code (default: "INR")
 *   DEFAULT_STORE_COUNTRY     — country           (default: "India")
 *   DEFAULT_STORE_DESCRIPTION — short description (optional)
 *
 * Safe to re-run — skips creation if the default store already exists.
 */
export const createDefaultStore = async () => {
  try {
    logger.info("🏢 Creating default company store...");

    // Resolve super admin (must exist at this point)
    const superAdmin = await User.findOne({ isSuperAdmin: true });
    if (!superAdmin) {
      throw new Error(
        "Super admin not found. Ensure createSuperAdmin() ran before createDefaultStore()."
      );
    }

    // Skip if default store already exists
    const existing = await Store.findOne({ isDefault: true });
    if (existing) {
      logger.info(`ℹ️  Default store already exists — "${existing.name}" — skipping.`);
      return existing;
    }

    const {
      DEFAULT_STORE_NAME = "Platform HQ",
      DEFAULT_STORE_EMAIL,
      DEFAULT_STORE_PHONE,
      DEFAULT_STORE_CURRENCY = "INR",
      DEFAULT_STORE_COUNTRY = "India",
      DEFAULT_STORE_DESCRIPTION = "Default company store managed by the platform super admin.",
      SUPER_ADMIN_EMAIL,
    } = env;

    const storeName = DEFAULT_STORE_NAME;
    const storeSlug = slugify(storeName);

    // ── Create Store ──────────────────────────────────────────────────────────
    const store = await Store.create({
      name: storeName,
      slug: storeSlug,
      description: DEFAULT_STORE_DESCRIPTION,
      email: DEFAULT_STORE_EMAIL || SUPER_ADMIN_EMAIL,
      phone: DEFAULT_STORE_PHONE || null,
      owner: superAdmin._id,
      currency: DEFAULT_STORE_CURRENCY,
      country: DEFAULT_STORE_COUNTRY,
      isActive: true,
      isDefault: true,         // marks this as the platform's own store
      isVerified: true,
      logo: null,
      address: {
        line1: null,
        city: null,
        state: null,
        postalCode: null,
        country: DEFAULT_STORE_COUNTRY,
      },
      socialLinks: {},
      meta: {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
      },
    });

    // Link store back to super admin profile
    await User.findByIdAndUpdate(superAdmin._id, { store: store._id });

    // ── Bootstrap Global Settings ─────────────────────────────────────────────
    // Create a settings document scoped to this store if one doesn't exist
    const settingsExist = await Settings.findOne({ store: store._id });
    if (!settingsExist) {
      await Settings.create({
        store: store._id,
        currency: DEFAULT_STORE_CURRENCY,
        taxRate: 0,                    // configure per-country as needed
        shippingFee: 0,
        freeShippingThreshold: 0,
        allowGuestCheckout: true,
        maintenanceMode: false,
        orderPrefix: "ORD",
        invoicePrefix: "INV",
        supportEmail: DEFAULT_STORE_EMAIL || SUPER_ADMIN_EMAIL,
        notificationsEnabled: true,
        analyticsEnabled: true,
      });
      logger.info("⚙️  Default settings document created.");
    }

    logger.info(`✅ Default store created — "${store.name}" (slug: ${store.slug})`);
    return store;
  } catch (err) {
    logger.error("❌ Failed to create default store:", err);
    throw err;
  }
};