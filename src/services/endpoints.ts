export const authEndpoints = {
  signup: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",
  me: "/auth/me",
} as const;

export const vocabularyEndpoints = {
  list: "/vocabularies",
  getById: (id: string) => `/vocabularies/${id}`,
  create: "/vocabularies",
  update: (id: string) => `/vocabularies/${id}`,
  delete: (id: string) => `/vocabularies/${id}`,
} as const;
