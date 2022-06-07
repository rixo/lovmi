import * as db from "$lib/_db"
import { createUser } from "$lib/_db/users"

const btoa = (string) => Buffer.from(string).toString("base64")

const basicAuth = (login, password) => `Basic ${btoa(login + ":" + password)}`

export async function post({ request }) {
  const { login, password } = await request.json()

  const trimmedName = login.trim()
  const lcName = trimmedName.toLowerCase()

  if (/[/$]/.test(lcName)) {
    return {
      status: 400,
      body: { reason: "Forbidden character" },
    }
  }
  if (lcName === "lovmi") {
    return {
      status: 400,
      body: { reason: "Forbidden username" },
    }
  }

  const { current_era: period } = await db.get("$settings")

  const era = String(period).split(".")[0]

  const lovmiName = `lovmi__${era}__${lcName}`

  try {
    await createUser({ name: lcName, password })
  } catch (err) {
    const res = err.response
    if (res) {
      if (res.status === 409) {
        return {
          status: 409,
          body: { reason: "Already exists" },
        }
      }
      return {
        status: 500,
        body: await res.text(),
        headers: { "content-type": res.headers["content-type"] },
      }
    } else {
      return {
        status: 500,
        body: "Server error",
      }
    }
  }

  return {
    status: 200,
    body: {
      id: lcName,
      era,
      name: trimmedName,
      auth: basicAuth(lovmiName, password),
    },
  }
}
