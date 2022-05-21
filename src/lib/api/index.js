import { InMemoryGateway, PostsApi } from './posts'

export const posts = PostsApi(InMemoryGateway())
