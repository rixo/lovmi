import { browser } from "$app/env"

import { InMemoryGateway, PostsApi } from "./posts"
import { PouchDBGateway } from "./posts.pouch"

// export const posts = PostsApi(InMemoryGateway())

export const gateway = browser ? PouchDBGateway() : InMemoryGateway()

export const posts = PostsApi(gateway)
