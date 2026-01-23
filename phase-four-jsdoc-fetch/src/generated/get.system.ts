import FetchClient from "../FetchClient";
import { ApiBody, ApiReturn } from "../types";

export class SystemGETApi<S> {
  constructor(private client: FetchClient) {}

  /**
   * Health check
   * @description Returns the current health status of the API and database.
   */
  health() {
    return this.client.request<ApiReturn<S, "/api/system/health", "GET">>("/api/system/health", "GET");
  }

}