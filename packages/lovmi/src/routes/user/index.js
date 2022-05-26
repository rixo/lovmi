import fetch from "node-fetch"

const btoa = (string) => Buffer.from(string).toString("base64")

const basicAuth = (login, password) => `Basic ${btoa(login + ":" + password)}`

export async function post({ request }) {
  const { login: name, password } = await request.json()

  const id = `org.couchdb.user:${name}`

  const res = await fetch(`${process.env.VITE_USER_DB_HOST}/_users/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: process.env.DB_POSTS_ADMIN_AUTH,
    },
    body: JSON.stringify({
      id,
      type: "user",
      name,
      password,
      roles: ["lovmi.user"],
    }),
  })

  if (!res.ok) {
    if (res.status === 409) {
      return {
        status: 409,
        body: { reason: "Already exists" },
      }
    }
    console.log(res.status)
    return {
      status: 500,
      body: await res.text(),
      headers: { "content-type": res.headers["content-type"] },
    }
  }

  return {
    status: 200,
    body: { id: name, name, auth: basicAuth(name, password) },
  }
}
