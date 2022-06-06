import { browser } from "$app/env"
import { get, readable, writable, derived } from "svelte/store"

import { render } from "./posts.util"

const getAuthorFromPostId = (_id) => {
  return _id.split("/")[2]
}

export const computePostsResult = ($posts) => {
  const stats = {}

  const getStat = (user) => {
    if (!stats[user]) {
      stats[user] = {
        userId: user,
        posts: 0,
        votes: 0,
        upvotes: 0,
        downvotes: 0,
        score: 0,
      }
    }
    return stats[user]
  }

  let interactions = 0

  for (const post of $posts) {
    const user = getAuthorFromPostId(post._id)
    const stat = getStat(user)
    stat.posts++
    stat.score += post.score

    interactions++

    if (post.votes) {
      for (const [voter, value] of Object.entries(post.votes)) {
        if (voter === "_score") continue

        interactions++

        const voterStat = getStat(voter)
        voterStat.votes++
        if (value > 0) {
          stat.upvotes++
        } else if (value < 0) {
          stat.downvotes++
        }
      }
    }
  }

  const results = Object.values(stats)
    .map((stat) => {
      stat.href = `/profile/${stat.userId}`
      // stat.total = stat.posts * 0 + stat.votes * 1 + stat.score * 10
      stat.total = stat.posts * 0 + stat.votes * 1 + stat.upvotes * 10
      return stat
    })
    .sort((a, b) => b.total - a.total)
    .map((stat, i) => {
      stat.href = `/profile/${stat.userId}`
      stat.pos = i + 1
      return stat
    })

  const prizePool = interactions * 4.2

  const allPositiveScores = results
    .filter(({ total }) => total > 0)
    .reduce((sum, { total }) => sum + total, 0)

  for (const line of results) {
    if (line.total > 0) {
      line.prize = Number(
        Math.floor(prizePool * (line.total / allPositiveScores) * 100) / 100
      ).toFixed(2)
    } else {
      line.prize = 0
    }
  }

  return { results, prizePool }
}

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
    loading: readable(true),
    getAll,
    add,
  }
}

const last = (arr) => arr[arr.length - 1]

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

  get time() {
    return last(this._id.split("/"))
  }

  constructor(data, gateway, onChange) {
    Object.assign(this, data)
    this.gateway = gateway
    this.notify = onChange
  }

  vote(by, value) {
    this.gateway.castVote(by, this._id, value)
  }

  upvote(by) {
    this.vote(by, 1)
  }

  downvote(by) {
    this.vote(by, -1)
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
            new Post(post, gateway, () => {
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
    await gateway.add({ ...data, author: user.id })

  const currentResults = derived(
    posts,
    ($posts) => computePostsResult($posts),
    []
  )

  const currentTopUsers = derived(
    currentResults,
    ($currentResults) => $currentResults.results,
    []
  )

  const currentPrizePool = derived(
    currentResults,
    ($currentResults) => $currentResults.prizePool,
    []
  )

  const pastTopUsers = derived(gateway.pastResults, ($pastResults) => {
    if (!$pastResults) return []
    return $pastResults.map(({ period, results, periodDiff }) => ({
      period,
      results,
      title:
        periodDiff === -1
          ? "Hier"
          : periodDiff === -2
          ? "Avant hier"
          : `Il y a ${-1 * periodDiff} jours`,
    }))
  })

  return {
    posts,
    loading: gateway.loading,
    error,
    create,
    currentTopUsers,
    currentPrizePool,
    pastTopUsers,
  }
}
