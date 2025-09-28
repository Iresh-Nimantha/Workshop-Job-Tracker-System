export function getUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role?.name || user?.role || null;
  } catch {
    return null;
  }
}
