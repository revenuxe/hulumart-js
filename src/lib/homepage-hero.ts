/**
 * Turns a dashboard hero destination into an app-relative URL.
 *
 * "Pre-Owned" is banner copy, not a category slug, so legacy values using it
 * route shoppers to the marketplace index.
 */
export function getHomepageHeroActionUrl(actionUrl: string | null | undefined) {
  const value = actionUrl?.trim() ?? "";
  if (!value || /^\/?pre[\s-]?owned\/?$/i.test(value) || /^\/?categories\/pre[\s-]?owned\/?$/i.test(value)) {
    return "/categories";
  }

  return value.startsWith("/") ? value : `/${value}`;
}
