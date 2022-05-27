import { browser } from "$app/env"

import { readable, derived } from "$lib/util/store"

import { getUserAuth } from "$lib/user"

import { render } from "./posts.util"

const liveFind = (
  db$,
  {
    prefix,
    selector = {
      _id: {
        $gt: prefix,
        $lt: prefix + "\uffff",
      },
    },
  }
) =>
  derived(
    db$,
    async (db, set) => {
      if (!db) return
      try {
        const feed = db.liveFind({
          selector,
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
        console.error("Failed to init pouch live find", err)
      }
    },
    []
  )

export const PouchDBGateway = () => {
  const dbHost = import.meta.env.VITE_DB_HOST

  const settingsDb = readable(null, async (set) => {
    const { default: PouchDB } = await import("$lib/pouch")
    set(new PouchDB(dbHost + "/lovmi-settings"))
  })

  const settings = derived(
    liveFind(settingsDb, { selector: {} }),
    ($docs) => Object.fromEntries($docs.map((doc) => [doc._id, doc])),
    {}
  )

  const postsDb$ = derived(settings, async ($settings, set) => {
    const { default: PouchDB } = await import("$lib/pouch")
    if (!$settings["lovmi-session"]) return
    const dbName = dbHost + "/" + $settings["lovmi-session"].current_posts_db
    set(
      new PouchDB(dbName, {
        fetch(url, opts) {
          const auth = getUserAuth()
          if (auth) {
            opts.headers.set("authorization", auth)
          }
          return fetch(url, opts)
        },
      })
    )
  })

  const getPostsDb = async () =>
    new Promise((resolve) => {
      const unsubscribe = postsDb$.subscribe((db) => {
        if (!db) return
        setTimeout(() => unsubscribe())
        resolve(db)
      })
    })

  const posts = liveFind(postsDb$, { prefix: "posts/" })

  const votes = liveFind(postsDb$, { prefix: "votes/" })

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
  }

  const add = async (post) => {
    const db = await getPostsDb()
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
    const db = await getPostsDb()
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
