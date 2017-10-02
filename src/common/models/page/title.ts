/**
 * URL-decoded normalized wiki URL path. e.g.: Main_Page,
 * Bill_&_Ted's_Excellent_Adventure.
 */
export type PageTitleID = string;

/**
 * URL-encoded normalized wiki URL path. e.g.: Main_Page,
 * Bill_%26_Ted%27s_Excellent_Adventure.
 */
export type PageTitlePath = string;

/**
 * Plain text localized page title. e.g.:
 *   Possible: Banana, Main Page, Bill & Ted's Excellent Adventure, Talk:Pie.
 *   Impossible: Main_Page, Bill_%26_Ted%27s_Excellent_Adventure.
 */
export type PageTitleText = string;
