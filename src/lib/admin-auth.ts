const ADMIN_USERNAME = process.env.ADMIN_BASIC_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_BASIC_PASSWORD;

export const ADMIN_SESSION_COOKIE = "kino_admin_session";

export function getAdminCredentials() {
  return {
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
  };
}

export function isAdminConfigured(): boolean {
  return Boolean(ADMIN_USERNAME && ADMIN_PASSWORD);
}

export function buildAdminSessionToken(): string | null {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return null;
  }

  return btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`);
}
