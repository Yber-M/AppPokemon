const isBrowser = typeof window !== "undefined";

export const tokenStorage = {
  getAccess: () => (isBrowser ? localStorage.getItem("accessToken") : null),
  setAccess: (token: string) => {
    if (isBrowser) localStorage.setItem("accessToken", token);
  },
  removeAccess: () => {
    if (isBrowser) localStorage.removeItem("accessToken");
  },

  getRefresh: () => (isBrowser ? localStorage.getItem("refreshToken") : null),
  setRefresh: (token: string) => {
    if (isBrowser) localStorage.setItem("refreshToken", token);
  },
  removeRefresh: () => {
    if (isBrowser) localStorage.removeItem("refreshToken");
  },

  clear: () => {
    if (!isBrowser) return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
