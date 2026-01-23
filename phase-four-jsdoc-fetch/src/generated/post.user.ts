import FetchClient from "../FetchClient";
import { ApiBody, ApiReturn } from "../types";

export class UserPOSTApi<S> {
  constructor(private client: FetchClient) {}

  /**
   * Modify the password of the currently authenticated user
   * @description Allows an authenticated user to change their password.         For local accounts, the user must provide their current password.         For OAuth-linked accounts, the `oauth` flag can be used to skip verification.
   */
  modifyPwd(body: ApiBody<S, "/api/user/modify-pwd", "POST">) {
    return this.client.request<ApiReturn<S, "/api/user/modify-pwd", "POST">>("/api/user/modify-pwd", "POST", body);
  }

}