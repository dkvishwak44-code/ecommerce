/**
 * MESSAGES
 *
 * Centralised response messages used across controllers and services.
 * Keeps API responses consistent and makes copy changes easy.
 *
 * Usage:
 *   import { MESSAGES } from "../constants/messages.js";
 *   MESSAGES.AUTH.LOGIN_SUCCESS  →  "Logged in successfully."
 */

export const MESSAGES = {
  // ── Generic ────────────────────────────────────────────────────────────────
  GENERIC: {
    SUCCESS: "Operation completed successfully.",
    CREATED: "Resource created successfully.",
    UPDATED: "Resource updated successfully.",
    DELETED: "Resource deleted successfully.",
    NOT_FOUND: "Resource not found.",
    BAD_REQUEST: "Invalid request. Please check your input.",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    FORBIDDEN: "Access denied.",
    CONFLICT: "A resource with this information already exists.",
    SERVER_ERROR: "An unexpected error occurred. Please try again later.",
    VALIDATION_ERROR: "Validation failed. Please check the provided data.",
    TOO_MANY_REQUESTS: "Too many requests. Please slow down.",
  },

  // ── Auth ───────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN_SUCCESS: "Logged in successfully.",
    LOGIN_FAILED: "Invalid email or password.",
    LOGOUT_SUCCESS: "Logged out successfully.",
    REGISTER_SUCCESS: "Account created successfully. Please verify your email.",
    TOKEN_REFRESHED: "Access token refreshed.",
    TOKEN_INVALID: "Invalid or expired token.",
    TOKEN_MISSING: "Authentication token is missing.",
    OTP_SENT: "OTP sent to your registered email.",
    OTP_VERIFIED: "OTP verified successfully.",
    OTP_INVALID: "Invalid or expired OTP.",
    OTP_RESENT: "A new OTP has been sent to your email.",
    PASSWORD_CHANGED: "Password changed successfully.",
    PASSWORD_RESET_LINK_SENT: "Password reset link sent to your email.",
    PASSWORD_RESET_SUCCESS: "Password reset successfully.",
    ACCOUNT_NOT_VERIFIED: "Please verify your email before logging in.",
    ACCOUNT_INACTIVE: "Your account has been deactivated. Contact support.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
  },

  // ── User ───────────────────────────────────────────────────────────────────
  USER: {
    CREATED: "User created successfully.",
    UPDATED: "User updated successfully.",
    DELETED: "User deleted successfully.",
    NOT_FOUND: "User not found.",
    FETCHED: "User fetched successfully.",
    LIST_FETCHED: "Users fetched successfully.",
    ACTIVATED: "User activated successfully.",
    DEACTIVATED: "User deactivated successfully.",
    ROLE_CHANGED: "User role updated successfully.",
    PASSWORD_RESET: "User password reset successfully.",
    EMAIL_EXISTS: "A user with this email already exists.",
  },

  // ── Role ───────────────────────────────────────────────────────────────────
  ROLE: {
    CREATED: "Role created successfully.",
    UPDATED: "Role updated successfully.",
    DELETED: "Role deleted successfully.",
    NOT_FOUND: "Role not found.",
    FETCHED: "Role fetched successfully.",
    LIST_FETCHED: "Roles fetched successfully.",
    SYSTEM_ROLE: "System roles cannot be modified or deleted.",
    NAME_EXISTS: "A role with this name already exists.",
    PERMISSIONS_UPDATED: "Role permissions updated successfully.",
  },

  // ── Permission ─────────────────────────────────────────────────────────────
  PERMISSION: {
    FETCHED: "Permission fetched successfully.",
    LIST_FETCHED: "Permissions fetched successfully.",
    DENIED: "You do not have permission to perform this action.",
  },

  // ── Store ──────────────────────────────────────────────────────────────────
  STORE: {
    CREATED: "Store created successfully.",
    UPDATED: "Store updated successfully.",
    DELETED: "Store deleted successfully.",
    NOT_FOUND: "Store not found.",
    FETCHED: "Store fetched successfully.",
    LIST_FETCHED: "Stores fetched successfully.",
    ACTIVATED: "Store activated successfully.",
    DEACTIVATED: "Store deactivated successfully.",
    VERIFIED: "Store verified successfully.",
    SLUG_EXISTS: "A store with this name/slug already exists.",
    DEFAULT_STORE: "The default store cannot be deleted.",
  },

  // ── Product ────────────────────────────────────────────────────────────────
  PRODUCT: {
    CREATED: "Product created successfully.",
    UPDATED: "Product updated successfully.",
    DELETED: "Product deleted successfully.",
    NOT_FOUND: "Product not found.",
    FETCHED: "Product fetched successfully.",
    LIST_FETCHED: "Products fetched successfully.",
    PUBLISHED: "Product published successfully.",
    UNPUBLISHED: "Product unpublished successfully.",
    OUT_OF_STOCK: "Product is out of stock.",
    BULK_DELETED: "Selected products deleted successfully.",
    SLUG_EXISTS: "A product with this slug already exists.",
  },

  // ── Category ───────────────────────────────────────────────────────────────
  CATEGORY: {
    CREATED: "Category created successfully.",
    UPDATED: "Category updated successfully.",
    DELETED: "Category deleted successfully.",
    NOT_FOUND: "Category not found.",
    FETCHED: "Category fetched successfully.",
    LIST_FETCHED: "Categories fetched successfully.",
    HAS_CHILDREN: "Cannot delete a category that has sub-categories.",
    HAS_PRODUCTS: "Cannot delete a category that has associated products.",
    REORDERED: "Categories reordered successfully.",
  },

  // ── Brand ──────────────────────────────────────────────────────────────────
  BRAND: {
    CREATED: "Brand created successfully.",
    UPDATED: "Brand updated successfully.",
    DELETED: "Brand deleted successfully.",
    NOT_FOUND: "Brand not found.",
    FETCHED: "Brand fetched successfully.",
    LIST_FETCHED: "Brands fetched successfully.",
    NAME_EXISTS: "A brand with this name already exists.",
  },

  // ── Order ──────────────────────────────────────────────────────────────────
  ORDER: {
    PLACED: "Order placed successfully.",
    UPDATED: "Order updated successfully.",
    CANCELLED: "Order cancelled successfully.",
    NOT_FOUND: "Order not found.",
    FETCHED: "Order fetched successfully.",
    LIST_FETCHED: "Orders fetched successfully.",
    CANNOT_CANCEL: "This order cannot be cancelled at its current stage.",
    CANNOT_RETURN: "This order is not eligible for return.",
    INVALID_STATUS_TRANSITION: "Invalid order status transition.",
    INVOICE_GENERATED: "Invoice generated successfully.",
    REFUND_INITIATED: "Refund initiated successfully.",
    REFUNDED: "Refund completed successfully.",
    RETURN_REQUESTED: "Return request submitted successfully.",
    RETURN_APPROVED: "Return request approved.",
    RETURN_REJECTED: "Return request rejected.",
  },

  // ── Coupon ─────────────────────────────────────────────────────────────────
  COUPON: {
    CREATED: "Coupon created successfully.",
    UPDATED: "Coupon updated successfully.",
    DELETED: "Coupon deleted successfully.",
    NOT_FOUND: "Coupon not found.",
    FETCHED: "Coupon fetched successfully.",
    LIST_FETCHED: "Coupons fetched successfully.",
    APPLIED: "Coupon applied successfully.",
    REMOVED: "Coupon removed.",
    INVALID: "Invalid or expired coupon.",
    ALREADY_USED: "You have already used this coupon.",
    USAGE_LIMIT_REACHED: "This coupon has reached its usage limit.",
    NOT_APPLICABLE: "This coupon is not applicable to your cart.",
    CODE_EXISTS: "A coupon with this code already exists.",
    ACTIVATED: "Coupon activated successfully.",
    DEACTIVATED: "Coupon deactivated successfully.",
  },

  // ── Cart ───────────────────────────────────────────────────────────────────
  CART: {
    FETCHED: "Cart fetched successfully.",
    UPDATED: "Cart updated successfully.",
    CLEARED: "Cart cleared.",
    ITEM_ADDED: "Item added to cart.",
    ITEM_REMOVED: "Item removed from cart.",
    ITEM_NOT_FOUND: "Item not found in cart.",
    EMPTY: "Your cart is empty.",
  },

  // ── Review ─────────────────────────────────────────────────────────────────
  REVIEW: {
    CREATED: "Review submitted successfully.",
    UPDATED: "Review updated successfully.",
    DELETED: "Review deleted successfully.",
    NOT_FOUND: "Review not found.",
    FETCHED: "Review fetched successfully.",
    LIST_FETCHED: "Reviews fetched successfully.",
    APPROVED: "Review approved successfully.",
    REJECTED: "Review rejected.",
    ALREADY_REVIEWED: "You have already reviewed this product.",
    NOT_PURCHASED: "You can only review products you have purchased.",
    REPLIED: "Reply posted successfully.",
  },

  // ── Banner ─────────────────────────────────────────────────────────────────
  BANNER: {
    CREATED: "Banner created successfully.",
    UPDATED: "Banner updated successfully.",
    DELETED: "Banner deleted successfully.",
    NOT_FOUND: "Banner not found.",
    FETCHED: "Banner fetched successfully.",
    LIST_FETCHED: "Banners fetched successfully.",
    ACTIVATED: "Banner activated successfully.",
    DEACTIVATED: "Banner deactivated successfully.",
    REORDERED: "Banners reordered successfully.",
  },

  // ── Customer ───────────────────────────────────────────────────────────────
  CUSTOMER: {
    FETCHED: "Customer fetched successfully.",
    LIST_FETCHED: "Customers fetched successfully.",
    UPDATED: "Customer updated successfully.",
    DELETED: "Customer account deleted.",
    NOT_FOUND: "Customer not found.",
    ACTIVATED: "Customer activated successfully.",
    DEACTIVATED: "Customer deactivated successfully.",
    EMAIL_EXISTS: "A customer with this email already exists.",
  },

  // ── Notification ───────────────────────────────────────────────────────────
  NOTIFICATION: {
    FETCHED: "Notifications fetched successfully.",
    SENT: "Notification sent successfully.",
    DELETED: "Notification deleted.",
    MARKED_READ: "Notification marked as read.",
    ALL_MARKED_READ: "All notifications marked as read.",
  },

  // ── Analytics & Dashboard ──────────────────────────────────────────────────
  ANALYTICS: {
    FETCHED: "Analytics data fetched successfully.",
    EXPORTED: "Analytics report exported successfully.",
  },

  DASHBOARD: {
    FETCHED: "Dashboard data fetched successfully.",
  },

  // ── Settings ───────────────────────────────────────────────────────────────
  SETTINGS: {
    FETCHED: "Settings fetched successfully.",
    UPDATED: "Settings updated successfully.",
    MAINTENANCE_ON: "Maintenance mode enabled.",
    MAINTENANCE_OFF: "Maintenance mode disabled.",
  },

  // ── Audit ──────────────────────────────────────────────────────────────────
  AUDIT: {
    FETCHED: "Audit logs fetched successfully.",
    EXPORTED: "Audit logs exported successfully.",
    PURGED: "Audit logs purged successfully.",
  },

  // ── Upload ─────────────────────────────────────────────────────────────────
  UPLOAD: {
    SUCCESS: "File uploaded successfully.",
    FAILED: "File upload failed.",
    INVALID_TYPE: "Invalid file type. Allowed: jpg, jpeg, png, webp, pdf.",
    TOO_LARGE: "File size exceeds the allowed limit.",
  },

  // ── Wishlist ───────────────────────────────────────────────────────────────
  WISHLIST: {
    FETCHED: "Wishlist fetched successfully.",
    ITEM_ADDED: "Item added to wishlist.",
    ITEM_REMOVED: "Item removed from wishlist.",
    ALREADY_EXISTS: "Item is already in your wishlist.",
    NOT_FOUND: "Item not found in wishlist.",
    CLEARED: "Wishlist cleared.",
  },

  // ── Address ────────────────────────────────────────────────────────────────
  ADDRESS: {
    CREATED: "Address added successfully.",
    UPDATED: "Address updated successfully.",
    DELETED: "Address deleted successfully.",
    NOT_FOUND: "Address not found.",
    FETCHED: "Address fetched successfully.",
    LIST_FETCHED: "Addresses fetched successfully.",
    SET_DEFAULT: "Default address updated.",
  },
};