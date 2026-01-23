import FetchClient from "../FetchClient";
import { ApiBody, ApiReturn } from "../types";

export class AuthGETApi<S> {
  constructor(private client: FetchClient) {}

  /**
   * Activate a user account using an activation token
   * @description Activates a newly registered user account using the activation link         sent by email. The endpoint verifies the activation token for validity,         ensures it has not been used, and marks both the token and user as activated.         Expired or invalid tokens will result in appropriate error responses.
   */
  activate() {
    return this.client.request<ApiReturn<S, "/api/auth/activate/{token}", "GET">>("/api/auth/activate/{token}", "GET");
  }

  /**
   * Start OAuth flow
   * @description Redirects to the OAuth provider’s authorization URL with proper state and next cookie set.
   */
  start() {
    return this.client.request<ApiReturn<S, "/api/auth/{provider}/start", "GET">>("/api/auth/{provider}/start", "GET");
  }

  /**
   * OAuth callback
   * @description Handles the OAuth2 provider redirect, exchanges code for profile, and issues tokens.
   */
  callback() {
    return this.client.request<ApiReturn<S, "/api/auth/{provider}/callback", "GET">>("/api/auth/{provider}/callback", "GET");
  }

  /**
   * Get user sessions
   * @description Returns all active and historical refresh token sessions for the authenticated user, including device info, IP address, timestamps, and current session indicator.
   */
  sessions() {
    return this.client.request<ApiReturn<S, "/api/auth/sessions", "GET">>("/api/auth/sessions", "GET");
  }

}