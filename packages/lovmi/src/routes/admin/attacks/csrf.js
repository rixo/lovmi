import { authGuard } from "$lib/admin/auth"
import * as db from "$lib/_db"
import { createUser } from "$lib/_db/users"
import { randomString } from "$lib/util"
import { createPostRecord } from "$lib/api/posts.util"

export async function post({ request }) {
  return authGuard(request, async () => {
    const { attacker, post } = await request.json()

    const password = randomString()

    try {
      await createUser({ name: attacker, password })
    } catch (err) {
      if (err?.response?.status === 409) {
        // that's ok, already exists
      } else {
        console.error("Failed to create attacker user", err)
        return {
          status: 500,
          body: `Failed to create attacker user (${attacker})`,
        }
      }
    }

    const { current_era: eraPeriod } = await db.get("$settings")

    const replaceAttackLink = (desc) =>
      desc.replace(
        /\[attack-link\]([^[]*)\[\/attack-link\]/gm,
        `<a href="/my-account/transfert?recipient=${attacker}&all=on">$1</a>`
      )

    const record = createPostRecord(
      { eraPeriod },
      {
        ...post,
        author: attacker,
        description: replaceAttackLink(post.description),
      }
    )

    try {
      await db.put(record)
    } catch (err) {
      return {
        status: 500,
        body: `Failed to post CSRF post: ${err}`,
      }
    }

    return { body: record }
  })
}
