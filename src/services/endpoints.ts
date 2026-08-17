export const authEndpoints = {
  signup: '/auth/signup',
  login: '/auth/login',
  logout: '/auth/logout',
  me: '/auth/me',
  refreshToken: '/auth/refresh-token',
} as const;

export const vocabularyEndpoints = {
  list: '/vocabularies',
  getById: (id: string) => `/vocabularies/${id}`,
  create: '/vocabularies',
  update: (id: string) => `/vocabularies/${id}`,
  remove: (id: string) => `/vocabularies/${id}`,
} as const;

export const reviewEndpoints = {
  due: '/reviews/due',
  submit: '/reviews',
  history: '/reviews/history',
} as const;

export const notesEndpoints = {
  list: '/notes',
  getById: (id: string) => `/notes/${id}`,
  create: '/notes',
  update: (id: string) => `/notes/${id}`,
  remove: (id: string) => `/notes/${id}`,
} as const;

export const settingsEndpoints = {
  get: '/settings',
  update: '/settings',
} as const;

export const dashboardEndpoints = {
  overview: '/dashboard/overview',
} as const;

export const shadowingEndpoints = {
  list: '/shadowing/recordings',
  getById: (id: string) => `/shadowing/recordings/${id}`,
  create: '/shadowing/recordings',
  remove: (id: string) => `/shadowing/recordings/${id}`,
} as const;
