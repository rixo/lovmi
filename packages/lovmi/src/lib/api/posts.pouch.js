import { browser } from "$app/env"
import { derived } from "svelte/store"

import { readable } from "$lib/util/store"

import { getUserAuth } from "$lib/user"

import { render } from "./posts.util"

export const PouchDBGateway = () => {
  let db

  // const getDb = async () => {
  //   if (!db) {
  //     const { default: PouchDB } = await import("$lib/pouch")
  //     db = new PouchDB("lovmi.posts")
  //   }
  //   return db
  // }

  const getDb = async () => {
    if (!db) {
      const { default: PouchDB } = await import("$lib/pouch")
      db = new PouchDB(import.meta.env.VITE_POUCHDB_POSTS, {
        fetch(url, opts) {
          const auth = getUserAuth()
          if (auth) {
            opts.headers.set("authorization", auth)
          }
          return fetch(url, opts)
        },
      })
    }
    return db
  }

  const posts = readable([], async (set) => {
    try {
      const db = await getDb()
      const feed = db.liveFind({
        selector: {
          _id: {
            $gt: "posts/",
            $lt: "posts/\uffff",
          },
        },
        aggregate: true,
      })
      feed.on("update", (update, aggregate) => {
        // update.doc.id = update.doc._id
        set(aggregate)
      })
      return () => {
        feed.cancel()
      }
    } catch (err) {
      console.error("Failed to init pouch live find for posts", err)
    }
  })

  const votes = readable([], async (set) => {
    try {
      const db = await getDb()
      const feed = db.liveFind({
        selector: {
          _id: {
            $gt: "votes/",
            $lt: "votes/\uffff",
          },
        },
        aggregate: true,
      })
      feed.on("update", (update, aggregate) => {
        // update.doc.id = update.doc._id
        set(aggregate)
      })
      return () => {
        feed.cancel()
      }
    } catch (err) {
      console.error("Failed to init pouch live find for posts", err)
    }
  })

  const postsWithVotes = derived([posts, votes], ([$posts, $votes]) => {
    const votesByPosts = {}
    for (const vote of $votes) {
      const match = /^votes\/([^/]+)\/(.*)$/.exec(vote._id)
      if (!match) continue
      const userId = match[1]
      const postId = match[2]
      if (!votesByPosts[postId]) {
        votesByPosts[postId] = {
          _score: 0,
        }
      }
      const value = vote.value > 0 ? 1 : vote.value < 0 ? -1 : 0
      votesByPosts[postId][userId] = value
      votesByPosts[postId]._score += value
    }

    return $posts.map((post) => ({
      ...post,
      score: votesByPosts[post._id]?._score || 0,
      votes: votesByPosts[post._id] || {},
    }))
  })

  // keep open
  if (browser) {
    postsWithVotes.subscribe(() => {})
    // posts.subscribe((x) => {
    //   console.log("posts", x)
    // })
    // votes.subscribe((x) => {
    //   console.log("votes", x)
    // })
  }

  const add = async (post) => {
    const db = await getDb()
    const record = {
      ...post,
      _id: `posts/${post.author}/${new Date().getTime()}`,
      description_html: post.description && render(post.description),
      votes: {},
      score: 0,
    }
    return await db.post(record)
  }

  const castVote = async (userId, postId, value) => {
    const db = await getDb()
    const id = `votes/${userId}/${postId}`
    const record = {
      _id: id,
      date: new Date().toISOString(),
      value: value > 0 ? 1 : value < 0 ? -1 : 0,
    }
    try {
      return await db.put(record)
    } catch (err) {
      if (err.name === "conflict") {
        const existing = await db.get(id)
        return await db.put({ ...record, _rev: existing._rev })
      } else {
        console.error("Failed to put vote", err)
      }
    }
  }

  // add({
  //   author: "foobar",
  //   title: "Hello World",
  //   description: `
  //   Badaboom
  //
  //   boom
  //   `,
  // })
  // // add({
  // //   author: "bahbar",
  // //   title: "I love you",
  // //   description: "... if you love me!",
  // //   image: "https://pixy.org/src/11/116695.png",
  // // })
  // // add({
  // //   author: "bahbar",
  // //   title: "I love you",
  // //   description: "... if you love me!",
  // //   image: "https://pixy.org/src/11/116695.png",
  // // })
  // add({
  //   author: "foobar",
  //   title: "Hello World",
  //   description: `
  //   Badaboom
  //
  //   boom (2)
  //   `,
  // })

  return {
    subscribe: postsWithVotes.subscribe,
    add,
    castVote,
  }
}
