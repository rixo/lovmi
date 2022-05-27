export const freshIdeas = (ideas) => lastIdeasFirst(ideas).slice(0, 3)

export const hotIdeas = (ideas) =>
  [...ideas]
    .sort((a, b) => {
      return b.score - a.score
    })
    .slice(0, 3)

export const lastIdeasFirst = (ideas) =>
  [...ideas].sort((a, b) => {
    return b.time - a.time
  })

export const lastIdea = (ideas) => [ideas[0]].filter(Boolean)
