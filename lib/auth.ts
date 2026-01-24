/**
 * Authentication Utilities
 * Dummy authentication logic (will be replaced with API integration)
 */

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("admin_token");
  const email = localStorage.getItem("admin_email");

  // Dummy check - in production, validate token with API
  return !!(token && email);
}

/**
 * Get current admin user
 */
export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const email = localStorage.getItem("admin_email");
  const token = localStorage.getItem("admin_token");

  if (!email || !token) return null;

  return {
    email,
    token,
  };
}

/**
 * Login function (dummy)
 */
export function login(email: string, password: string): Promise<boolean> {
  // Dummy credentials
  const DUMMY_CREDENTIALS = {
    email: "admin@poolsandpool.com",
    password: "admin123",
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
        const token = "dummy-admin-token-" + Date.now();

        // Set cookie (for middleware)
        document.cookie = `admin_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        document.cookie = `admin_email=${email}; path=/; max-age=${60 * 60 * 24 * 7}`;

        // Set localStorage (for client-side)
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_email", email);

        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
}

/**
 * Logout function
 */
export function logout(): void {
  if (typeof window === "undefined") return;

  // Clear cookies
  document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "admin_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  // Clear localStorage
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_email");

  // Redirect to login
  window.location.href = "/admin/login";
}
