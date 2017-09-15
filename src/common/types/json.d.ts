// https://github.com/Microsoft/TypeScript/issues/1897

export type JSONPrimitive = string | number | boolean | null;

// eslint-disable-next-line no-use-before-define
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;

export type JSONObject = { [member: string]: JSONValue };

export interface JSONArray extends Array<JSONValue> {}
