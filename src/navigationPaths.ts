export const navigationPaths = {
  songs: {
    root: '/',
    single: (id: Stringable) => `/songs/${id}`,
  },
}

type Stringable = unknown
