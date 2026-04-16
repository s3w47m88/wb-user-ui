const NETWORK_ERROR_PATTERNS = [
  /load failed/i,
  /failed to fetch/i,
  /fetch failed/i,
  /networkerror/i,
  /network request failed/i,
  /err_name_not_resolved/i,
  /could not resolve host/i,
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "";
}

export function isSupabaseNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return NETWORK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

export function formatSupabaseClientError(
  error: unknown,
  fallback = "Something went wrong while talking to Supabase.",
): string {
  if (isSupabaseNetworkError(error)) {
    return "Unable to reach Supabase. Check that the configured project URLs still exist and resolve.";
  }

  const message = getErrorMessage(error).trim();
  return message || fallback;
}
