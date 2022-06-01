import { authGuard } from "$lib/admin/auth"
import * as db from "$lib/_db"

export async function post({ request }) {
  return authGuard(request, async () => {
    const { changes } = await request.json()
    const doc = await db.get("$settings")
    Object.assign(doc, changes)
    await db.put(doc)
    return {
      body: doc,
    }
  })
}
