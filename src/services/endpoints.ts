export const authEndpoints = {
  signup: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",
  me: "/auth/me",
} as const;

export const dashboardEndpoints = {
  overview: "/dashboard/overview",
} as const;

export const vocabularyEndpoints = {
  list: "/vocabularies",
  getById: (id: string) => `/vocabularies/${id}`,
  create: "/vocabularies",
  update: (id: string) => `/vocabularies/${id}`,
  delete: (id: string) => `/vocabularies/${id}`,
} as const;

export const reviewEndpoints = {
  due: "/reviews/due",
  submit: "/reviews",
  history: "/reviews/history",
} as const;

export const shadowingEndpoints = {
  list: "/shadowing/recordings",
  getById: (id: string) => `/shadowing/recordings/${id}`,
  create: "/shadowing/recordings",
  remove: (id: string) => `/shadowing/recordings/${id}`,
} as const;

export const audioItemEndpoints = {
  list: "/audio-items",
  getById: (id: string) => `/audio-items/${id}`,
  create: "/audio-items",
  upload: (id: string) => `/audio-items/${id}/upload`,
  transcript: (id: string) => `/audio-items/${id}/transcript`,
  remove: (id: string) => `/audio-items/${id}`,
} as const;
