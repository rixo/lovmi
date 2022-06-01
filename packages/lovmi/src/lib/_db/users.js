import * as db from "./index"

export async function createUser({ name, password }) {
  const { current_era: period } = await db.get("$settings")

  const era = String(period).split(".")[0]

  const lovmiName = `lovmi__${era}__${name}`

  const id = `org.couchdb.user:${lovmiName}`

  const res = await fetch(
    `${process.env.VITE_USER_DB_HOST}/_users/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: process.env.DB_POSTS_ADMIN_AUTH,
      },
      body: JSON.stringify({
        id,
        type: "user",
        name: lovmiName,
        password,
        roles: ["lovmi.user"],
      }),
    }
  )

  if (!res.ok) {
    throw Object.assign(new Error("HTTP error"), { response: res })
  }
}
