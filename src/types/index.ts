export type CommonData = {
  userInfo: {
    id: string;
    email: string;
    displayName: string;
    role: string;
  };
  settings: {
    theme: "light" | "dark" | "system";
  };
};
