/**
 * for grouping routes. i.e. all the user related routes will be grouped under
 *  "user" annotation so it's easy to invalidate them all at once.
 */
export interface QueryKeyAnnotations extends Record<string, unknown> {
  group: string;
}
