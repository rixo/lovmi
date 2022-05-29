import { writable } from "svelte/store"
import { browser } from "$app/env"

import { readable, derived } from "$lib/util/store"

import { getUserAuth } from "$lib/user"

import { render } from "./posts.util"

export const PouchDBGateway = () => {
  const dbHost = import.meta.env.VITE_DB_HOST

  const loading = writable(true)

  loading.subscribe((x) => {
    console.log(x)
  })

  const db$ = readable(null, async (set) => {
    const { default: PouchDB } = await import("$lib/pouch")
    set(
      new PouchDB(dbHost + "/lovmi-posts", {
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
      const unsubscribe = db$.subscribe((db) => {
        if (!db) return
        setTimeout(() => unsubscribe())
        resolve(db)
      })
    })

  const era$ = writable(null)

  if (browser) {
    const initEra = async () => {
      const db = await getPostsDb()
      const settings = await db.get("$settings")
      era$.set(settings?.current_era)
    }
    initEra()
  }

  const getCurrentEra = async () =>
    new Promise((resolve) => {
      const unsubscribe = era$.subscribe(($era) => {
        if (!$era) return
        setTimeout(() => unsubscribe())
        resolve($era)
      })
    })

  const allDocs = derived(
    [db$, era$],
    async ([db, $era], set) => {
      loading.set(true)

      if (!db) return
      if ($era == null) return

      try {
        const feed = db.liveFind({
          selector: {
            $or: [
              {
                _id: {
                  $gt: "$",
                  $lt: "$\uffff",
                },
              },
              {
                _id: {
                  $gt: `${$era}/`,
                  $lt: `${$era}/\uffff`,
                },
              },
            ],
          },
          aggregate: true,
        })

        feed.on("update", (update, aggregate) => {
          if (update.doc._id === "$settings") {
            era$.set(update.doc.current_era)
          }
          set(aggregate)
        })

        feed.then(() => {
          loading.set(false)
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

  const isPost = (doc) => /^\d+\/posts\//.test(doc._id)

  const isVote = (doc) => /^\d+\/votes\//.test(doc._id)

  const posts = derived(allDocs, ($allDocs) => $allDocs.filter(isPost))

  const votes = derived(allDocs, ($allDocs) => $allDocs.filter(isVote))

  const postsWithVotes = derived([posts, votes], ([$posts, $votes]) => {
    const votesByPosts = {}
    for (const vote of $votes) {
      const match = /^\d+\/votes\/([^/]+)\/(.*)$/.exec(vote._id)
      if (!match) continue
      const userId = match[1]
      const postId = match[2]
      if (!votesByPosts[postId]) {
        votesByPosts[postId] = { _score: 0 }
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
    const era = await getCurrentEra()
    const record = {
      ...post,
      _id: `${era}/posts/${post.author}/${new Date().getTime()}`,
      description_html: post.description && render(post.description),
      votes: {},
      score: 0,
    }
    return await db.post(record)
  }

  const castVote = async (userId, postId, value) => {
    const db = await getPostsDb()
    const era = await getCurrentEra()
    const id = `${era}/votes/${userId}/${postId}`
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

  return {
    subscribe: postsWithVotes.subscribe,
    loading,
    add,
    castVote,
  }
}
