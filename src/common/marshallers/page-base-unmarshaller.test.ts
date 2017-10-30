import * as assert from "assert";
import { PageGeolocation } from "../models/page/geolocation";
import {
  unmarshalETag,
  unmarshalPageGeolocation
} from "./page-base-unmarshaller";
import { RESTBase } from "./restbase";
import { EXPECTED_ETAG, HEADERS } from "./utils.test";

describe("page-base-unmarshaller", () => {
  it(".unmarshalPageGeolocation() unmarshals", () => {
    const json: RESTBase.PageSummary.Geolocation = {
      lat: 1,
      lon: 2
    };
    const expected: PageGeolocation = {
      latitude: 1,
      longitude: 2
    };
    const result = unmarshalPageGeolocation(json as {});
    assert.deepStrictEqual(result, expected);
  });

  it(".unmarshalETag() unmarshals", () => {
    const result = unmarshalETag(HEADERS);
    assert.deepStrictEqual(result, EXPECTED_ETAG);
  });
});
