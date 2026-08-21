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
