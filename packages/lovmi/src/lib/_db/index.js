const DB = "lovmi-posts"

export const get = async (id, require = false) => {
  const res = await fetch(
    `${process.env.VITE_USER_DB_HOST}/${DB}/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: process.env.DB_POSTS_ADMIN_AUTH,
      },
    }
  )

  if (!res.ok) {
    if (res.status === 404) {
      return null
    }
    throw {
      status: res.status,
      body: res.json(),
    }
  }

  return await res.json()
}

export const put = async (doc) => {
  const res = await fetch(
    `${process.env.VITE_USER_DB_HOST}/${DB}/${encodeURIComponent(doc._id)}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: process.env.DB_POSTS_ADMIN_AUTH,
      },
      body: JSON.stringify(doc),
    }
  )

  if (!res.ok) {
    throw {
      status: res.status,
      body: res.json(),
    }
  }

  return await res.json()
}

export const upsert = async (doc) => {
  const existing = await get(doc._id)
  const updated = { ...existing, ...doc }
  return await put(updated)
}

export const find = async (query) => {
  const res = await fetch(`${process.env.VITE_USER_DB_HOST}/${DB}/_find`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: process.env.DB_POSTS_ADMIN_AUTH,
    },
    body: JSON.stringify(query),
  })

  if (!res.ok) {
    throw {
      status: res.status,
      body: res.json(),
    }
  }

  return await res.json()
}
