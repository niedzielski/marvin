import * as fetch from "node-fetch";
import { JSONValue } from "../types/json";

export function reviveFile(
  filename: string,
  reviver?: (key: any, value: JSONValue) => any
): any {
  return JSON.parse(JSON.stringify(require(filename)), reviver);
}

const ETAG_REVISION = 802006980;
const ETAG_TIME_ID = "4f754377-a235-11e7-a776-efb84f18649a";
export const HEADERS = new fetch.Headers();
HEADERS.append("etag", `${ETAG_REVISION}/${ETAG_TIME_ID}`);
export const EXPECTED_ETAG = { revision: ETAG_REVISION, timeID: ETAG_TIME_ID };
