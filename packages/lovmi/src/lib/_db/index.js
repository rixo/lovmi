export const get = async (id) => {
  const res = await fetch(
    `${process.env.VITE_USER_DB_HOST}/lovmi-posts/${id}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: process.env.DB_POSTS_ADMIN_AUTH,
      },
    }
  )

  if (!res.ok) {
    if (res.status >= 400 && res.status < 500) {
      return {
        status: res.status,
        body: res.json(),
      }
    }
  }

  return res.json()
}

export const put = async (doc) => {
  const res = await fetch(
    `${process.env.VITE_USER_DB_HOST}/lovmi-posts/${doc._id}`,
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
    if (res.status >= 400 && res.status < 500) {
      return {
        status: res.status,
        body: res.json(),
      }
    }
  }

  return res.json()
}
