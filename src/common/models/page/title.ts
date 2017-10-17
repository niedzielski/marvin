/**
 * URL-decoded denormalized wiki URL path. e.g.: Main_Page,
 * Bill_&_Ted's_Excellent_Adventure. See
 * https://www.mediawiki.org/wiki/API:Query#Title_normalization.
 */
export type PageTitleID = string;

/**
 * URL-encoded denormalized wiki URL path. e.g.: Main_Page,
 * Bill_%26_Ted%27s_Excellent_Adventure.
 */
export type PageTitlePath = string;

/**
 * Plain text, normalized localized page title. e.g.:
 *   Possible: Banana, Main Page, Bill & Ted's Excellent Adventure, Talk:Pie.
 *   Impossible: Main_Page, Bill_%26_Ted%27s_Excellent_Adventure.
 */
export type PageTitleText = string;
