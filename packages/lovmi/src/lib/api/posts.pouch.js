import { readable } from "$lib/util/store"

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
      db = new PouchDB(import.meta.env.VITE_POUCHDB_POSTS)
    }
    return db
  }

  const posts = readable([], async (set) => {
    try {
      const db = await getDb()
      const feed = db.liveFind({
        selector: {},
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

  const castVote = async (user, value) => {
    const db = await getDb()
    const record = {
      _id: `votes/${post._id}/${post.author}`,
      value: value > 0 ? 1 : value < 0 ? -1 : 0,
    }
    return await db.push(record)
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
    subscribe: posts.subscribe,
    add,
  }
}
