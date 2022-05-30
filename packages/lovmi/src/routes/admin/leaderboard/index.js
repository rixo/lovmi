import { authGuard } from "$lib/admin/auth"
import * as db from "$lib/_db"

export async function post({ request }) {
  return authGuard(request, async () => {
    const data = await request.json()
    const doc = await db.get("$settings")
    doc.leaderboard_enabled = !!data.enabled
    await db.put(doc)
    return {
      body: doc,
    }
  })
}
