const BASE = '/dance-player'

export const navigationPaths = {
  songs: {
    root: `${BASE}`,
    single: (id: Stringable) => `${BASE}/songs/${id}`,
  },
}

type Stringable = unknown
