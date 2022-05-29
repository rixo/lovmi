import { authGuard } from "$lib/admin/auth"
import * as db from "$lib/_db"

export async function post({ request }) {
  return authGuard(request, async () => {
    const doc = await db.get("$settings")
    doc.current_era = doc.current_era + 1
    await db.put(doc)
    return {
      body: doc,
    }
  })
}
