import { writable } from "svelte/store"
import { browser } from "$app/env"

import { readable, derived } from "$lib/util/store"

import { createPostRecord } from "./posts.util"

const byTypeRegex = /^[\d.]+\/([^/]+)(?:\/|$)/

const splitDocsByType = ($allDocs) => {
  const docs = {
    posts: [],
    votes: [],
    results: [],
  }
  for (const doc of $allDocs) {
    const eraTypeMatch = byTypeRegex.exec(doc._id)
    if (!eraTypeMatch) continue
    const type = eraTypeMatch[1]
    docs[type].push(doc)
  }
  return docs
}

const mergePostsVotes = ($posts, $votes) => {
  const votesByPosts = {}
  for (const vote of $votes) {
    const match = /^[\d.]+\/votes\/([^/]+)\/(.*)$/.exec(vote._id)
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
}

export const consolidatePostsWithVotes = (docs) => {
  const docsByType = splitDocsByType(docs)
  return mergePostsVotes(docsByType.posts, docsByType.votes)
}

export const PouchDBGateway = () => {
  const dbHost = import.meta.env.VITE_DB_HOST

  const loading = writable(true)

  const db$ = readable(null, async (set) => {
    const { default: PouchDB } = await import("$lib/pouch")
    set(
      new PouchDB(dbHost + "/lovmi-posts", {
        async fetch(url, opts) {
          const { getUserAuth } = await import("$lib/user")
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

  const settings = writable({})

  if (browser) {
    const initEra = async () => {
      const db = await getPostsDb()
      settings.set(await db.get("$settings"))
    }
    initEra()
  }

  const getSettings = async () =>
    new Promise((resolve) => {
      const unsubscribe = settings.subscribe(($settings) => {
        if (!$settings) return
        setTimeout(() => unsubscribe())
        resolve($settings)
      })
    })

  const leaderboardEnabled = derived(
    settings,
    ($settings) => !!$settings?.leaderboard_enabled
  )

  const isLeaderboardEnabled = async () =>
    !!(await getSettings()).leaderboard_enabled

  const eraPeriod$ = derived(settings, ($settings) => $settings.current_era)

  const era$ = derived(eraPeriod$, ($era) =>
    $era != null ? String($era).split(".")[0] : null
  )

  const period$ = derived(eraPeriod$, ($era) =>
    $era != null ? String($era).split(".")[1] : null
  )

  const getCurrentEraPeriod = async () =>
    new Promise((resolve) => {
      const unsubscribe = eraPeriod$.subscribe(($era) => {
        if (!$era) return
        setTimeout(() => unsubscribe())
        resolve($era)
      })
    })

  const getCurrentEra = async () => {
    const eraPeriod = await getCurrentEraPeriod()
    return eraPeriod.split(".")[0]
  }

  const allDocs = derived(
    [db$, eraPeriod$],
    async ([db, $eraAndPeriod], set) => {
      loading.set(true)

      if (!db) return
      if ($eraAndPeriod == null) return

      const era = String($eraAndPeriod).split(".")[0]

      try {
        const feed = db.liveFind({
          limit: 999999,
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
                  $gt: `${era}/`,
                  $lt: `${era}/\uffff`,
                },
              },
              {
                _id: {
                  $gt: `${$eraAndPeriod}/`,
                  $lt: `${$eraAndPeriod}/\uffff`,
                },
              },
            ],
          },
          aggregate: true,
        })

        feed.on("update", (update, aggregate) => {
          if (update.doc._id === "$settings") {
            settings.set(update.doc)
          } else {
            set(aggregate)
          }
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

  const docsByType = derived(allDocs, splitDocsByType)

  const posts = derived(docsByType, ($docs) => $docs.posts)

  const votes = derived(docsByType, ($docs) => $docs.votes)

  const results = derived(docsByType, ($docs) => $docs.results)

  const postsWithVotes = derived([posts, votes], ([$posts, $votes]) =>
    mergePostsVotes($posts, $votes)
  )

  // keep open
  if (browser) {
    postsWithVotes.subscribe(() => {})
  }

  const pastResults = derived(
    [results, period$],
    ([$results, $period]) => {
      const results = $results?.[0]?.results
      if (!results) return []
      return Object.entries(results)
        .map(([period, results]) => ({
          period,
          results,
          periodDiff: parseInt(period) - $period,
        }))
        .filter(({ results }) => results?.length)
        .sort((a, b) => b.period - a.period)
    },
    []
  )

  const add = async (post) => {
    const db = await getPostsDb()
    const eraPeriod = await getCurrentEraPeriod()
    const record = createPostRecord({ eraPeriod }, post)
    return await db.post(record)
  }

  const castVote = async (userId, postId, value) => {
    const db = await getPostsDb()
    const era = await getCurrentEraPeriod()
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
    pastResults,
    era: era$,
    getCurrentEra,
    settings,
    leaderboardEnabled,
    isLeaderboardEnabled,
  }
}
