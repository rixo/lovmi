import { browser } from "$app/env"

import { InMemoryGateway, PostsApi } from "./posts"
import { PouchDBGateway } from "./posts.pouch"

// export const posts = PostsApi(InMemoryGateway())

export const posts = PostsApi(browser ? PouchDBGateway() : InMemoryGateway())
