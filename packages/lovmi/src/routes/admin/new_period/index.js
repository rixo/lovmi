import { authGuard } from "$lib/admin/auth"
import * as db from "$lib/_db"
import { consolidatePostsWithVotes } from "$lib/api/posts.pouch"
import { computePostsResult } from "$lib/api/posts"

const bumpPeriod = async () => {
  const doc = await db.get("$settings")
  const previousPeriod = doc.current_era

  const [era, period = 0] = String(doc.current_era).split(".")
  const newPeriod = `${era}.${parseInt(period) + 1}`
  doc.current_era = newPeriod

  await db.put(doc)

  return { previousPeriod, newPeriod }
}

const updateStats = async (eraAndPeriod) => {
  const docs = await db.find({
    limit: 9999,
    selector: {
      $or: [
        {
          _id: {
            $gt: `${eraAndPeriod}/posts/`,
            $lt: `${eraAndPeriod}/posts/\uffff`,
          },
        },
        {
          _id: {
            $gt: `${eraAndPeriod}/votes/`,
            $lt: `${eraAndPeriod}/votes/\uffff`,
          },
        },
      ],
    },
    fields: ["_id", "value"],
  })

  const posts = consolidatePostsWithVotes(docs.docs)

  const results = computePostsResult(posts)

  const [era, period] = String(eraAndPeriod).split(".")

  const _id = `${era}/results`

  const existing = await db.get(_id)

  const doc = {
    _id,
    ...existing,
    current_era: era,
    current_period: period,
    results: {
      ...existing?.results,
      [period]: results.results,
    },
  }

  await db.upsert(doc)
}

export async function post({ request }) {
  return authGuard(request, async () => {
    const { newPeriod, previousPeriod } = await bumpPeriod()

    await updateStats(previousPeriod)

    return {
      body: { newPeriod, previousPeriod },
    }
  })
}
