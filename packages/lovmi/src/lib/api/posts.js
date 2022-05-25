import { browser } from "$app/env"
import { get, readable, writable } from "svelte/store"

import { render } from "./posts.util"

export const InMemoryGateway = () => {
  const posts = writable([])

  let lastId = 0

  const nextId = () => ++lastId

  const getAll = async () => {
    const $posts = get(posts)
    return {
      posts: $posts,
      limit: 1000,
      offset: 0,
      total: $posts.length,
    }
  }

  const add = async (post) => {
    const record = {
      ...post,
      id: nextId(),
      description_html: post.description && render(post.description),
      votes: {},
      score: 0,
    }
    posts.update(($posts) => {
      $posts.push(record)
      return $posts
    })
    return record
  }

  add({
    author: "foobar",
    title: "Hello World",
    description: `
    Badaboom

    boom
    `,
  })
  // add({
  //   author: "bahbar",
  //   title: "I love you",
  //   description: "... if you love me!",
  //   image: "https://pixy.org/src/11/116695.png",
  // })
  // add({
  //   author: "bahbar",
  //   title: "I love you",
  //   description: "... if you love me!",
  //   image: "https://pixy.org/src/11/116695.png",
  // })
  add({
    author: "foobar",
    title: "Hello World",
    description: `
    Badaboom

    boom (2)
    `,
  })

  return {
    subscribe: posts.subscribe,
    getAll,
    add,
  }
}

class Post {
  // id = 0
  author = ""
  title = ""
  description = ""
  description_html = ""
  image = ""
  votes = {}
  score = 0

  get id() {
    return this._id
  }

  constructor(data, onChange) {
    Object.assign(this, data)
    this.notify = onChange
  }

  upvote(by) {
    this.votes[by] = this.votes[by] > 0 ? 0 : 1
    this.calcVotes()
  }

  downvote(by) {
    this.votes[by] = this.votes[by] < 0 ? 0 : -1
    this.calcVotes()
  }

  isUpvotedBy(userId) {
    return this.votes[userId] > 0
  }

  isDownvotedBy(userId) {
    return this.votes[userId] < 0
  }

  calcVotes() {
    this.score = 0
    for (const vote of Object.values(this.votes)) {
      this.score += vote
    }
    this.notify()
  }

  // toJSON() {
  // 	return { a: 1 }
  // }
}

export const PostsApi = (gateway) => {
  const loading = writable(false)
  const error = writable("")

  let _posts

  const posts = readable([], (set) => {
    loading.set(true)

    if (browser) {
      return gateway.subscribe((posts) => {
        _posts = posts.map(
          (post) =>
            new Post(post, () => {
              set(_posts)
            })
        )
        set(_posts)
        loading.set(false)
      })
    } else {
      return
    }
  })

  const create = async (user, data) =>
    await gateway.add({
      ...data,
      author: user.id,
    })

  return { posts, loading, error, create }
}
