import BaseApi from "@/utils/baseApi.js";


class AuthService extends BaseApi {
  constructor() {
    super("/auth");
  }

  login(data)              { return this.postTo("/login",            data); }
  register(data)           { return this.postTo("/register",         data); }
  me()                     { return this.getFrom("/me");                    }
  logout()                 { return this.postTo("/logout",           {});   }
  updateProfile(data)      { return this.putTo("/profile",           data); }
  changePassword(data)     { return this.putTo("/change-password",   data); }
  forgotPassword(email)    { return this.postTo("/forgot-password",  { email }); }
  resetPassword(data)      { return this.postTo("/reset-password",   data); }
  verifyEmail(token)       { return this.postTo("/verify-email",     { token }); }
  resendVerification(email){ return this.postTo("/resend-verification", { email }); }
  refreshToken(token)      { return this.postTo("/refresh-token",    { token }); }
  uploadAvatar(formData)   { return this.upload("/avatar",       formData); }
}

export const authService = new AuthService();