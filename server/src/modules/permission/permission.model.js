import mongoose from "mongoose";
import { ALL_PERMISSIONS } from "../../constants/permissions.js";

const { Schema } = mongoose;

const permissionSchema = new Schema(
  {
    key: {
      type: String,
      required: [true, "Permission key is required."],
      unique: true,
      lowercase: true,
      trim: true,
      enum: ALL_PERMISSIONS,
      index: true,
    },

    module: {
      type: String,
      required: [true, "Permission module is required."],
      lowercase: true,
      trim: true,
      index: true,
    },

    action: {
      type: String,
      required: [true, "Permission action is required."],
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [250, "Permission description cannot exceed 250 characters."],
      default: null,
    },

    isSystem: {
      type: Boolean,
      default: true,
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

permissionSchema.index({ module: 1, action: 1 }, { unique: true });
permissionSchema.index({ module: 1, isActive: 1 });

permissionSchema.pre("validate", function (next) {
  if (this.key) {
    this.key = this.key.toLowerCase().trim();
  }

  if (!this.module && this.key?.includes(".")) {
    this.module = this.key.split(".")[0];
  }

  if (!this.action && this.key?.includes(".")) {
    this.action = this.key.split(".").slice(1).join(".");
  }

  next();
});

permissionSchema.statics.findActive = function () {
  return this.find({ isActive: true }).sort({ module: 1, action: 1 });
};

permissionSchema.statics.findByModule = function (module) {
  return this.find({
    module: String(module).toLowerCase(),
    isActive: true,
  }).sort({ action: 1 });
};

permissionSchema.statics.findByKeys = function (keys = []) {
  const normalizedKeys = keys.map((key) => String(key).toLowerCase().trim());
  return this.find({ key: { $in: normalizedKeys }, isActive: true });
};

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
