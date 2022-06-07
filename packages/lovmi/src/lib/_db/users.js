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

export async function userExists(name, era) {
  if (!era) {
    const { current_era: period } = await db.get("$settings")
    era = String(period).split(".")[0]
  }

  const lovmiName = `lovmi__${era}__${name}`

  const id = `org.couchdb.user:${lovmiName}`

  const res = await fetch(
    `${process.env.VITE_USER_DB_HOST}/_users/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: process.env.DB_POSTS_ADMIN_AUTH,
      },
    }
  )

  if (res.ok) {
    return true
  }

  if (res?.status === 404) {
    return false
  }

  throw new Error("Failed to get user: " + res.status)
}
