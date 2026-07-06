import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { authService } from "@/services/auth.service";
import {
  checkAllPermissions,
  checkAnyPermission,
  checkPermission,
  getPermissionsForRole,
  getFilteredPermissions,
} from "@/lib/permissions";
import {
  clearAuthFromStorage,
  loadAuthFromStorage,
  saveAuthToStorage,
  updateAuthInStorage,
} from "@/utils/auth-storage";
import { authService } from "@/services/authService.js";
import { filteredStore } from "@/lib/filteredStore";

// ── Load session from localStorage ────────────────────────────
const savedSession = loadAuthFromStorage();

const initialState = {
  user:           savedSession?.user        || null,
  role:           savedSession?.role        || null,
  permissions:    savedSession?.permissions || [],
  accessToken:    savedSession?.accessToken || null,
  store      :    savedSession?.store ||[],
  isLoggedIn:     !!savedSession,
  isFirstLogin:   false,
  isLoading:      false,
  error:          null,
};

// ── Async Thunks ───────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await authService.login(credentials);
      return res; // full API response
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.me();
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch user");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (err) {
      // clear locally even if API fails
      console.warn("Logout API failed:", err.message);
    }
  }
);

export const updateProfileUser = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.updateProfile(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Update failed");
    }
  }
);

export const changePasswordUser = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.changePassword(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Password change failed");
    }
  }
);

// ── Slice ──────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout(state) {
      state.user        = null;
      state.role        = null;
      state.store       = [];
      state.permissions = [];
      state.accessToken = null;
      state.isLoggedIn  = false;
      state.error       = null;
      clearAuthFromStorage();
    },

    grantPermission(state, action) {
      const perm = action.payload;
      if (!state.permissions.includes(perm)) {
        state.permissions.push(perm);
        updateAuthInStorage({ permissions: state.permissions });
      }
    },

    revokePermission(state, action) {
      state.permissions = state.permissions.filter((p) => p !== action.payload);
      updateAuthInStorage({ permissions: state.permissions });
    },

    restoreSession(state, action) {
      const saved = action.payload;
      if (saved) {
        state.user        = saved.user;
        state.role        = saved.role;
        state.store       = saved.store;
        state.permissions = saved.permissions;
        state.accessToken = saved.accessToken;
        state.isLoggedIn  = true;
      }
    },

    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      updateAuthInStorage({ user: state.user });
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // ── Login ────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // your API: response.result.user / response.result.accessToken
        const { user, store, accessToken, isFirstLogin ,permissions} = action.payload.result;

        state.user         = {
          id:               user.id || user._id,
          name:             user.name,
          email:            user.email,
          phone:            user.phone,
          avatar:           user.avatar,
          role:             user.role,
          roleName:         user.roleName,
          isSuperAdmin:     user.isSuperAdmin,
          store:            user.store,
          status:           user.status,
          isVerified:       user.isVerified,
          isEmailVerified:  user.isEmailVerified,
          isFirstLogin:     user.isFirstLogin,
          lastLoginAt:      user.lastLoginAt,
          createdAt:        user.createdAt,
          updatedAt:        user.updatedAt,
          bio:              user.bio,
          socialLinks:      user.socialLinks,
          addresses:        user.addresses,
        };
        state.role         = user.roleName;         // "superadmin"
        // state.permissions  = getPermissionsForRole(user.role.name);
        state.permissions  = getFilteredPermissions(user.permissions ||permissions || []);
        state.accessToken  =accessToken;
        state.store        = filteredStore(store)
        state.isLoggedIn   = true;
        state.isFirstLogin = isFirstLogin;
        state.isLoading    = false;
        state.error        = null;

        // ✅ Save to localStorage
        saveAuthToStorage({
          user:        state.user,
          role:        state.role,
          permissions: state.permissions,
          accessToken: state.accessToken,
           store:       state.store
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // ── Fetch Current User ────────────────────────────────────
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        const user       = action.payload?.result?.user || action.payload?.user;
        state.user       = { ...state.user, ...user };
        state.isLoading  = false;
        state.isLoggedIn = true;
        updateAuthInStorage({ user: state.user });
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading  = false;
        state.error      = action.payload;
        // token expired → clear everything
        state.user        = null;
        state.role        = null;
        state.permissions = [];
        state.accessToken = null;
        state.isLoggedIn  = false;
        clearAuthFromStorage();
      });

    // ── Logout ────────────────────────────────────────────────
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user        = null;
        state.role        = null;
        state.permissions = [];
        state.accessToken = null;
        state.isLoggedIn  = false;
        state.error       = null;
        clearAuthFromStorage();
      });

    // ── Update Profile ────────────────────────────────────────
    builder
      .addCase(updateProfileUser.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(updateProfileUser.fulfilled, (state, action) => {
        const user      = action.payload?.result?.user || action.payload?.user;
        state.user      = { ...state.user, ...user };
        state.isLoading = false;
        updateAuthInStorage({ user: state.user });
      })
      .addCase(updateProfileUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // ── Change Password ───────────────────────────────────────
    builder
      .addCase(changePasswordUser.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(changePasswordUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePasswordUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });
  },
});

export const {
  logout,
  grantPermission,
  revokePermission,
  restoreSession,
  updateUser,
  clearError,
  
} = authSlice.actions;

export default authSlice.reducer;

// ── Selectors ──────────────────────────────────────────────────
export const selectUser         = (state) => state.auth.user;
export const selectRole         = (state) => state.auth.role;
export const selectPermissions  = (state) => state.auth.permissions;
export const selectIsLoggedIn   = (state) => state.auth.isLoggedIn;
export const selectIsLoading    = (state) => state.auth.isLoading;
export const selectError        = (state) => state.auth.error;
export const selectAccessToken  = (state) => state.auth.accessToken;
export const selectIsFirstLogin = (state) => state.auth.isFirstLogin;
export const selectIsSuperAdmin = (state) => state.auth.user?.isSuperAdmin;
export const selectRoleName     = (state) => state.auth.user?.roleName;
export const selectUserStore    = (state) => state.auth?.store;

export const selectCan     = (permission)     => (state) => checkPermission(state.auth.permissions, permission);
export const selectCanAll  = (...permissions) => (state) => checkAllPermissions(state.auth.permissions, permissions);
export const selectCanAny  = (...permissions) => (state) => checkAnyPermission(state.auth.permissions, permissions);
export const selectHasRole = (...roles)       => (state) => roles.includes(state.auth.role);