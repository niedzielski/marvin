const TALK_MASK = 0x1;

/**
 * An enumeration describing the different possible built-in namespace codes.
 * Additional namespaces are possible.
 *
 * @see {@link https://phabricator.wikimedia.org/diffusion/APAW/browse/master/app/src/main/java/org/wikipedia/page/Namespace.java;c1b48fcd848406b646b894217d5561a323eae3ca Namespace.java (Android implementation)}
 * @see {@link https://en.wikipedia.org/wiki/Wikipedia:Namespace Wikipedia:Namespace}
 * @see {@link https://www.mediawiki.org/wiki/Extension_default_namespaces Extension default namespaces}
 * @see {@link https://github.com/wikimedia/wikipedia-ios/blob/master/Wikipedia/Code/NSNumber+MWKTitleNamespace.h NSNumber+MWKTitleNamespace.h (iOS implementation)}
 * @see {@link https://www.mediawiki.org/wiki/Manual:Namespace#Built-in_namespaces Manual:Namespace}
 * @see {@link https://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=namespaces|namespacealiases Namespaces reported by API}
 */
export enum Namespace {
  MEDIA = -2,
  SPECIAL = -1, // The only namespace where a bitwise test of TALK_MASK fails.
  /** Main page, disambiguation page, or article. */
  MAIN = 0,
  TALK = 1,
  USER = 2,
  USER_TALK = 3,
  PROJECT = 4, // Also: WP alias.
  PROJECT_TALK = 5, // Also: WT alias.
  FILE = 6, // Also: image alias.
  FILE_TALK = 7, // Also: image talk alias.
  MEDIAWIKI = 8,
  MEDIAWIKI_TALK = 9,
  TEMPLATE = 10,
  TEMPLATE_TALK = 11,
  HELP = 12,
  HELP_TALK = 13,
  CATEGORY = 14,
  CATEGORY_TALK = 15
}

export const special = (namespace: Namespace): boolean =>
  namespace === Namespace.SPECIAL;

export const main = (namespace: Namespace): boolean =>
  namespace === Namespace.MAIN;

export const talk = (namespace: Namespace): boolean =>
  // eslint-disable-next-line no-bitwise
  (namespace & TALK_MASK) === TALK_MASK && !special(namespace);

export const file = (namespace: Namespace): boolean =>
  namespace === Namespace.FILE;
