// ************************************************************************** //
//                                                                            //
//                                                                            //
//   FetchClient.ts                                                           //
//                                                                            //
//   By: jeportie <jeromep.dev@gmail.com>                                     //
//                                                                            //
//   Created: 2026/01/14 13:25:21 by jeportie                                 //
//   Updated: 2026/01/19 17:10:40 by jeportie                                 //
//                                                                            //
// ************************************************************************** //

import { HttpMethods } from "./types";

export default class FetchClient {
  #baseUrl: string;

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
  }

  async request<TResponse>(
    endpoint: string,
    method: HttpMethods,
    body?: unknown
  ): Promise<TResponse> {
    const options: RequestInit = {
      method,
      headers: {
        Accept: "application/json",
      },
    };

    if (body !== undefined) {
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(body);
    }

    const response = await fetch(this.#baseUrl + endpoint, options);

    if (!response.ok) {
      throw new Error(`[API Error] ${response.status} on ${endpoint}`);
    }

    return response.json() as Promise<TResponse>;
  }
}
