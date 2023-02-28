export const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem("user")!);

  if (!user || !user.token) return false;

  return true;
};

export const isAuthorizated = () => {
  const user = JSON.parse(localStorage.getItem("user")!);

  if(!user) {
    return false
  }

  return user.isAdmin;
};
