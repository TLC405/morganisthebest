export const APP_VERSION =
  (import.meta.env.VITE_APP_VERSION as string | undefined) || "dev";

export const APP_BUILD_TIME =
  import.meta.env.VITE_APP_BUILD_TIME as string | undefined;

export const getBuildTimestamp = () => {
  if (!APP_BUILD_TIME) return null;
  const parsed = new Date(APP_BUILD_TIME);
  return isNaN(parsed.getTime()) ? null : parsed.toLocaleString();
};
