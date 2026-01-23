import FetchClient from "../FetchClient";
import { ApiBody, ApiReturn } from "../types";

export class UserGETApi<S> {
  constructor(private client: FetchClient) {}

  /**
   * List all users (admin only)
   * @description Retrieves the full list of registered users. Access restricted to `admin` role.
   */
  users() {
    return this.client.request<ApiReturn<S, "/api/user/users", "GET">>("/api/user/users", "GET");
  }

  /**
   * Get authenticated user
   * @description Returns the authenticated user’s profile. Requires a valid Bearer access token.
   */
  me() {
    return this.client.request<ApiReturn<S, "/api/user/me", "GET">>("/api/user/me", "GET");
  }

}