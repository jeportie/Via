import FetchClient from "../FetchClient";
import { GETApi } from "./get._root";
import { AuthGETApi } from "./get.auth";
import { SystemGETApi } from "./get.system";
import { UserGETApi } from "./get.user";
import { AuthPOSTApi } from "./post.auth";
import { UserPOSTApi } from "./post.user";

export class FetchApi<S> {
  readonly get: {
    _root: GETApi<S>;
    auth: AuthGETApi<S>;
    system: SystemGETApi<S>;
    user: UserGETApi<S>;
  };
  readonly post: {
    auth: AuthPOSTApi<S>;
    user: UserPOSTApi<S>;
  };

  constructor(baseUrl: string) {
    const client = new FetchClient(baseUrl);

    this.get = {
      _root: new GETApi<S>(client),
      auth: new AuthGETApi<S>(client),
      system: new SystemGETApi<S>(client),
      user: new UserGETApi<S>(client),
    };

    this.post = {
      auth: new AuthPOSTApi<S>(client),
      user: new UserPOSTApi<S>(client),
    };
  }
}