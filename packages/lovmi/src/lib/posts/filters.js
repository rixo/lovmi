export const freshIdeas = (ideas, user) =>
  lastIdeasFirst(ideas)
    .filter((post) => !post?.votes[user?.id])
    .slice(0, 5)

export const hotIdeas = (ideas) =>
  [...ideas]
    .sort((a, b) => {
      return b.score - a.score
    })
    .slice(0, 5)

export const lastIdeasFirst = (ideas) =>
  [...ideas].sort((a, b) => {
    return b.time - a.time
  })

export const lastIdea = (ideas) => [ideas[0]].filter(Boolean)
