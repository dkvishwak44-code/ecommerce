// const User = require("../user/user.model");
// const Token = require("./auth.token.model");
import User from "../user/user.model.js";
// import {Token} from "../../middleware/auth.middleware.js";
import Token from "./auth.token.model.js";

class AuthRepository {
  // ─── User Finders ────────────────────────────────────────────────────────────

  async findUserByEmail(email, selectFields = "") {
    return User.findOne({ email: email.toLowerCase() })
      .select(selectFields)
      .lean();
  }

  async findUserByEmailWithPassword(email) {
    return User.findOne({ email: email.toLowerCase() }).select(
      "+password +isFirstLogin +loginAttempts +lockUntil +isActive +isEmailVerified"
    );
  }

  async findUserById(id, selectFields = "") {
    return User.findById(id).select(selectFields).lean();
  }

  async findUserByIdWithPassword(id) {
    return User.findById(id).select(
      "+password +isFirstLogin +loginAttempts +lockUntil"
    );
  }

  async findUserByResetToken(hashedToken) {
    return User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password +isFirstLogin");
  }

  async findUserByEmailVerificationToken(hashedToken) {
    return User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });
  }

  // ─── User Updates ─────────────────────────────────────────────────────────────

  async updateUserById(id, updates) {
    return User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async updateUserPassword(id, hashedPassword) {
    return User.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
        isFirstLogin: false,
        passwordChangedAt: new Date(),
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
        loginAttempts: 0,
        lockUntil: undefined,
      },
      { new: true }
    ).lean();
  }

  async incrementLoginAttempts(id) {
    return User.findByIdAndUpdate(
      id,
      { $inc: { loginAttempts: 1 } },
      { new: true }
    ).select("loginAttempts lockUntil");
  }

  async lockUserAccount(id, lockUntil) {
    return User.findByIdAndUpdate(id, { lockUntil }, { new: true });
  }

  async resetLoginAttempts(id) {
    return User.findByIdAndUpdate(
      id,
      { loginAttempts: 0, lockUntil: undefined },
      { new: true }
    );
  }

  async setPasswordResetToken(id, hashedToken, expires) {
    return User.findByIdAndUpdate(id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: expires,
    });
  }

  async setEmailVerificationToken(id, hashedToken, expires) {
    return User.findByIdAndUpdate(id, {
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expires,
    });
  }

  async setOtp(id, hashedOtp, expires) {
    return User.findByIdAndUpdate(id, {
      otp: hashedOtp,
      otpExpires: expires,
      otpAttempts: 0,
    });
  }

  async findUserByOtp(email) {
    return User.findOne({ email: email.toLowerCase() }).select(
      "+otp +otpExpires +otpAttempts"
    );
  }

  async incrementOtpAttempts(id) {
    return User.findByIdAndUpdate(id, { $inc: { otpAttempts: 1 } });
  }

  async clearOtp(id) {
    return User.findByIdAndUpdate(id, {
      otp: undefined,
      otpExpires: undefined,
      otpAttempts: 0,
    });
  }

  async markEmailVerified(id) {
    return User.findByIdAndUpdate(id, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined,
    });
  }

  async setLastLogin(id) {
    return User.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }

  // ─── Refresh Token Management ─────────────────────────────────────────────────

  async saveRefreshToken(userId, tokenHash, expiresAt, meta = {}) {
    return Token.create({ userId, tokenHash, expiresAt, ...meta });
  }

  async findRefreshToken(tokenHash) {
    return Token.findOne({ tokenHash, isRevoked: false });
  }

  async revokeRefreshToken(tokenHash) {
    return Token.findOneAndUpdate({ tokenHash }, { isRevoked: true });
  }

  async revokeAllUserTokens(userId) {
    return Token.updateMany({ userId, isRevoked: false }, { isRevoked: true });
  }

  async deleteExpiredTokens(userId) {
    return Token.deleteMany({ userId, expiresAt: { $lt: new Date() } });
  }
}

export default new AuthRepository();