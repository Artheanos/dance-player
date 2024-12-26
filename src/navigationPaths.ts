const BASE = import.meta.env.BASE_URL as string

export const navigationPaths = {
  songs: {
    root: `${BASE}`,
    single: (id: Stringable) => `${BASE}/songs/${id}`,
  },
}

type Stringable = unknown
