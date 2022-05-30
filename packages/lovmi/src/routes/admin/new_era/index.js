import { authGuard } from "$lib/admin/auth"
import * as db from "$lib/_db"

export async function post({ request }) {
  return authGuard(request, async () => {
    const doc = await db.get("$settings")
    const currentEra = parseInt(String(doc.current_era).split(".")[0])
    doc.current_era = `${currentEra + 1}.0`
    await db.put(doc)
    return {
      body: doc,
    }
  })
}
