export const tokenStorage = {
  getAccess: () => localStorage.getItem("accessToken"),
  setAccess: (token: string) => localStorage.setItem("accessToken", token),
  removeAccess: () => localStorage.removeItem("accessToken"),

  getRefresh: () => localStorage.getItem("refreshToken"),
  setRefresh: (token: string) => localStorage.setItem("refreshToken", token),
  removeRefresh: () => localStorage.removeItem("refreshToken"),

  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
