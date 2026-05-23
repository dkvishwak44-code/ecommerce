import mongoose from "mongoose";
import { SYSTEM_ROLES } from "../../constants/roles.js";

const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required."],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [2, "Role name must be at least 2 characters."],
      maxlength: [60, "Role name cannot exceed 60 characters."],
      index: true,
    },

    displayName: {
      type: String,
      required: [true, "Role display name is required."],
      trim: true,
      minlength: [2, "Role display name must be at least 2 characters."],
      maxlength: [80, "Role display name cannot exceed 80 characters."],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Role description cannot exceed 300 characters."],
      default: null,
    },

    permissions: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Permission",
        },
      ],
      default: [],
    },

    isSystem: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

roleSchema.index({ name: 1, isActive: 1 });
roleSchema.index({ isSystem: 1, isActive: 1 });

roleSchema.pre("validate", function (next) {
  if (this.name) {
    this.name = this.name.toLowerCase().trim();
  }

  if (SYSTEM_ROLES.includes(this.name)) {
    this.isSystem = true;
  }

  if (Array.isArray(this.permissions)) {
    const uniquePermissionIds = new Map(
      this.permissions.map((permission) => [permission.toString(), permission])
    );
    this.permissions = [...uniquePermissionIds.values()];
  }

  next();
});

roleSchema.virtual("permissionCount").get(function () {
  return this.permissions?.length ?? 0;
});

roleSchema.statics.findActive = function () {
  return this.find({ isActive: true }).sort({ isSystem: -1, name: 1 });
};

roleSchema.statics.findSystemRoles = function () {
  return this.find({ name: { $in: SYSTEM_ROLES }, isSystem: true }).sort({
    name: 1,
  });
};

roleSchema.statics.findWithPermissions = function (name) {
  return this.findOne({ name: String(name).toLowerCase().trim(), isActive: true })
    .populate("permissions", "key module action description")
    .lean();
};

roleSchema.methods.hasPermission = function (permissionKey) {
  const key = String(permissionKey).toLowerCase().trim();

  return this.permissions.some((permission) => {
    if (typeof permission === "string") return permission === key;
    if (permission?.key) return permission.key === key;
    return false;
  });
};

const Role = mongoose.model("Role", roleSchema);

export default Role;
