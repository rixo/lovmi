import fetch from "node-fetch"
import * as db from "$lib/_db"
import { createUser } from "$lib/_db/users"

const btoa = (string) => Buffer.from(string).toString("base64")

const basicAuth = (login, password) => `Basic ${btoa(login + ":" + password)}`

export async function post({ request }) {
  const { login: name, password } = await request.json()

  const { current_era: period } = await db.get("$settings")

  const era = String(period).split(".")[0]

  const lovmiName = `lovmi__${era}__${name}`

  const id = `org.couchdb.user:${lovmiName}`

  try {
    await createUser({ name, password })
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
    body: { id: name, era, name, auth: basicAuth(lovmiName, password) },
  }
}
