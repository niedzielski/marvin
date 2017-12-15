import * as assert from "assert";
import { Headers, Response } from "node-fetch";
import * as sinon from "sinon";
import {
  ClientError,
  RedirectError,
  ServerError,
  request,
  requestPage
} from "./fetch";

function newHeaders(headers: { [name: string]: string }): Headers {
  // todo: add node-fetch Headers constructor definition.
  return new (Headers as any)(headers);
}

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
        headers: newHeaders({ location: "location" })
      });
      const fetch = sinon.stub().returns(Promise.resolve(response));

      return request("url", undefined, fetch).catch((error: any) => {
        assert.ok(error instanceof RedirectError);
        assert.deepEqual(error.status, 300);
        assert.deepEqual(error.url, "location");
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

  describe(".requestPage()", () => {
    it("returns a response when successful", () => {
      const expected = new Response(undefined, { status: 200 });
      const fetch = sinon.stub().returns(Promise.resolve(expected));

      return requestPage("url", undefined, fetch).then(response => {
        assert.deepEqual(response, expected);
      });
    });

    it("throws when an error occurs", () => {
      const response = new Response(undefined, { status: 400 });
      const fetch = sinon.stub().returns(Promise.resolve(response));

      return requestPage("url", undefined, fetch).catch(error => {
        assert.ok(error instanceof ClientError);
        assert.deepEqual(error.status, 400);
      });
    });

    it("throws when redirected to a different title", () => {
      const response = new Response(undefined, {
        status: 300,
        headers: newHeaders({ location: "redirected title" })
      });
      const fetch = sinon.stub().returns(Promise.resolve(response));

      return requestPage("title", undefined, fetch).catch(error => {
        assert.ok(error instanceof RedirectError);
        assert.deepEqual(error.status, 300);
        assert.deepEqual(error.url, "redirected title");
      });
    });

    // eslint-disable-next-line max-len
    it("follows when redirected to an identical title (external origin)", () => {
      const expected = new Response(undefined, { status: 200 });
      const responses = [
        new Response(undefined, {
          status: 300,
          headers: newHeaders({ location: "https://bar/title" })
        }),
        expected
      ];
      const fetch = sinon.stub().returns(Promise.resolve(responses.pop()));
      return requestPage("https://foo/title", undefined, fetch).then(
        response => {
          assert.deepEqual(response, expected);
        }
      );
    });
  });
});
