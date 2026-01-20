// ************************************************************************** //
//                                                                            //
//                                                                            //
//   FetchApi.ts                                                              //
//                                                                            //
//   By: jeportie <jeromep.dev@gmail.com>                                     //
//                                                                            //
//   Created: 2026/01/20 11:49:57 by jeportie                                 //
//   Updated: 2026/01/20 12:17:35 by jeportie                                 //
//                                                                            //
// ************************************************************************** //

import type { ApiRegistry } from './apiRegistry.js';
import type { ApiBody, ApiReturn, EndpointKey, FilterRoutes, HttpMethods } from './types.js';

export default class FetchApi<D extends keyof ApiRegistry> {
  #baseUrl: D;

  constructor(baseUrl: D) {
    this.#baseUrl = baseUrl;
  }

  get<E extends FilterRoutes<ApiRegistry[D], 'GET'>>(endoint: E) {
    return this.#request(endoint, 'GET');
  }

  post<E extends FilterRoutes<ApiRegistry[D], 'POST'>>(endoint: E, body: ApiBody<ApiRegistry[D], E, 'POST'>) {
    return this.#request(endoint, 'POST', body);
  }

  put<E extends FilterRoutes<ApiRegistry[D], 'PUT'>>(endoint: E, body: ApiBody<ApiRegistry[D], E, 'PUT'>) {
    return this.#request(endoint, 'PUT', body);
  }

  delete<E extends FilterRoutes<ApiRegistry[D], 'DELETE'>>(endoint: E) {
    return this.#request(endoint, 'DELETE');
  }

  async #request<E extends EndpointKey<ApiRegistry[D]>, M extends HttpMethods>(
    endpoint: E,
    method: M,
    body?: ApiBody<ApiRegistry[D], E, M>,
  ): Promise<ApiReturn<ApiRegistry[D], E, M>> {
    const url = this.#baseUrl + endpoint;

    const options: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
      },
    };

    if (body !== undefined) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`[API Error]: ${response.status} from: %{endpoint}`);
    }

    return response.json() as Promise<ApiReturn<ApiRegistry[D], E, M>>;
  }
}
