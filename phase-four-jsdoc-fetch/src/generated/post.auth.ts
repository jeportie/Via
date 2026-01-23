import FetchClient from "../FetchClient";
import { ApiBody, ApiReturn } from "../types";

export class AuthPOSTApi<S> {
  constructor(private client: FetchClient) {}

  /**
   * Enable 2FA (init setup)
   * @description Generates a TOTP secret + QR code for the user to scan with Google Authenticator.
   */
  enable(body: ApiBody<S, "/api/auth/enable", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/enable", "POST">>("/api/auth/enable", "POST", body);
  }

  /**
   * Verify TOTP code
   * @description Verify a 6-digit time-based code from the user’s authenticator app.
   */
  verifyTotp(body: ApiBody<S, "/api/auth/verify-totp", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/verify-totp", "POST">>("/api/auth/verify-totp", "POST", body);
  }

  /**
   * Login with TOTP code
   * @description Login with a 6-digit time-based code from the user’s authenticator app and issue a session.
   */
  loginTotp(body: ApiBody<S, "/api/auth/login-totp", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/login-totp", "POST">>("/api/auth/login-totp", "POST", body);
  }

  /**
   * Verify backup code
   * @description Verify a one-time backup code (issued when enabling 2FA). Each code can only be used once.
   */
  verifyBackup(body: ApiBody<S, "/api/auth/verify-backup", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/verify-backup", "POST">>("/api/auth/verify-backup", "POST", body);
  }

  /**
   * Disable 2FA
   * @description Clears the stored secret and disables 2FA for the user.
   */
  disable(body: ApiBody<S, "/api/auth/disable", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/disable", "POST">>("/api/auth/disable", "POST", body);
  }

  /**
   * Generate backup codes for 2FA
   * @description Generates 10 single-use backup codes, stores them hashed, and returns plaintext codes once.
   */
  backup(body: ApiBody<S, "/api/auth/backup", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/backup", "POST">>("/api/auth/backup", "POST", body);
  }

  /**
   * Check if 2FA is enabled for a user
   * @description This endpoint verifies whether a given username or email has two-factor authentication (2FA) enabled.         It is typically used before login to determine if a second verification step is required.
   */
  check2fa(body: ApiBody<S, "/api/auth/check-2fa", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/check-2fa", "POST">>("/api/auth/check-2fa", "POST", body);
  }

  /**
   * Login (issue access & refresh, or request 2FA)
   * @description Authenticate with username/email + password. If 2FA is enabled,         the server responds with `f2a_required` instead of issuing tokens.         If the account has not been activated, the server responds with         'activation_required' instead of issuing tokens.
   */
  login(body: ApiBody<S, "/api/auth/login", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/login", "POST">>("/api/auth/login", "POST", body);
  }

  /**
   * Register new account
   * @description Create a new user account with username, email, and password.
   */
  register(body: ApiBody<S, "/api/auth/register", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/register", "POST">>("/api/auth/register", "POST", body);
  }

  /**
   * Refresh access token (rotate refresh)
   * @description Uses the HttpOnly refresh cookie to validate and rotate the refresh token, then returns a new access token.
   */
  refresh(body: ApiBody<S, "/api/auth/refresh", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/refresh", "POST">>("/api/auth/refresh", "POST", body);
  }

  /**
   * Logout (revoke refresh)
   * @description Deletes the stored refresh token tied to the cookie and clears the cookie.
   */
  logout(body: ApiBody<S, "/api/auth/logout", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/logout", "POST">>("/api/auth/logout", "POST", body);
  }

  /**
   * Request a password reset email
   * @description Initiates the password reset process for an account associated with the given email.         This endpoint verifies the provided reCAPTCHA token, creates a reset token,         stores it in the database, and sends a password reset email to the user.         The email will contain a reset link valid for 1 hour.
   */
  forgotPwd(body: ApiBody<S, "/api/auth/forgot-pwd", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/forgot-pwd", "POST">>("/api/auth/forgot-pwd", "POST", body);
  }

  /**
   * Reset a user's password using a reset token
   * @description Completes the password reset process. The client must provide the reset token         received by email and the new password. The token is verified for validity, usage,         and expiration before the password is updated. The token is marked as used after success.
   */
  resetPwd(body: ApiBody<S, "/api/auth/reset-pwd", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/reset-pwd", "POST">>("/api/auth/reset-pwd", "POST", body);
  }

  /**
   * Resend the activation link to the user email adresse.
   * @description Emit a new token if no token has beed found of if the old one has expired.
   */
  resendLink(body: ApiBody<S, "/api/auth/resend-link", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/resend-link", "POST">>("/api/auth/resend-link", "POST", body);
  }

  /**
   * Revoke user session
   * @description Revokes a specific user refresh token session, effectively logging out that session. If the current session is revoked, related authentication cookies are cleared.
   */
  sessions(body: ApiBody<S, "/api/auth/sessions/revoke", "POST">) {
    return this.client.request<ApiReturn<S, "/api/auth/sessions/revoke", "POST">>("/api/auth/sessions/revoke", "POST", body);
  }

}