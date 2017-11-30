import * as assert from "assert";
import { Headers, Response } from "node-fetch";
import * as sinon from "sinon";
import { ClientError, RedirectError, ServerError, request } from "./fetch";

describe("fetch", () => {
  describe(".request()", () => {
    it("returns a response when successful", () => {
      const expected = new Response(undefined, { status: 200 });
      const fetch = sinon.stub().returns(Promise.resolve(expected));

      return request("url", undefined, fetch).then(response => {
        assert.deepEqual(response, expected);
      });
    });

    it("throws a RedirectError when redirected", () => {
      const response = new Response(undefined, {
        status: 300,
        // todo: add node-fetch Headers constructor definition.
        headers: new (Headers as any)({ location: "destination" })
      });
      const fetch = sinon.stub().returns(Promise.resolve(response));

      return request("url", undefined, fetch).catch((error: any) => {
        assert.ok(error instanceof RedirectError);
        assert.deepEqual(error.status, 300);
        assert.deepEqual(error.url, "destination");
      });
    });

    it("throws a ClientError when the client fails", () => {
      const response = new Response(undefined, { status: 400 });
      const fetch = sinon.stub().returns(Promise.resolve(response));

      return request("url", undefined, fetch).catch((error: any) => {
        assert.ok(error instanceof ClientError);
        assert.deepEqual(error.status, 400);
      });
    });

    it("throws a ServerError when the server fails", () => {
      const response = new Response(undefined, { status: 500 });
      const fetch = sinon.stub().returns(Promise.resolve(response));

      return request("url", undefined, fetch).catch((error: any) => {
        assert.ok(error instanceof ServerError);
        assert.deepEqual(error.status, 500);
      });
    });
  });
});
