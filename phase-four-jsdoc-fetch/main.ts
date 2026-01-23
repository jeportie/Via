// ************************************************************************** //
//                                                                            //
//                                                                            //
//   main.ts                                                                  //
//                                                                            //
//   By: jeportie <jeromep.dev@gmail.com>                                     //
//                                                                            //
//   Created: 2026/01/15 19:05:14 by jeportie                                 //
//   Updated: 2026/01/19 17:43:23 by jeportie                                 //
//                                                                            //
// ************************************************************************** //

import { paths } from "./src/apiSchema";
import { FetchApi } from "./src/generated";

const api = new FetchApi<paths>("https://example.com");

const data = await api.get.user.me();
api.post.auth.register({ username })
