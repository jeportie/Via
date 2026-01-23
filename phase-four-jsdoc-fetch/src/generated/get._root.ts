import FetchClient from "../FetchClient";
import { ApiBody, ApiReturn } from "../types";

export class GETApi<S> {
  constructor(private client: FetchClient) {}

  /**
   * Expose Prometheus metrics
   * @description Returns application performance and system metrics in Prometheus text format.         This endpoint is intended for scraping by Prometheus or compatible monitoring tools.         The response contains metrics about Fastify routes, event loop lag, memory usage,         and any custom counters registered via the Prometheus client.
   */
  metrics() {
    return this.client.request<ApiReturn<S, "/metrics", "GET">>("/metrics", "GET");
  }

}