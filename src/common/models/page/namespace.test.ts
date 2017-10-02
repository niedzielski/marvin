import * as assert from "assert";
import { PageNamespace, special, main, talk, file } from "./namespace";

describe("namespace", () => {
  describe(`.special()`, () => {
    it(`is special`, () => assert.ok(special(PageNamespace.SPECIAL)));
    it(`not special`, () => assert.ok(!special(PageNamespace.MAIN)));
  });

  describe(`.main()`, () => {
    it(`is main`, () => assert.ok(main(PageNamespace.MAIN)));
    it(`not main`, () => assert.ok(!main(PageNamespace.TALK)));
  });

  describe(`.talk()`, () => {
    it(`is talk`, () => assert.ok(talk(PageNamespace.TALK)));
    it(`not talk`, () => assert.ok(!talk(PageNamespace.MAIN)));
    it(`special is not talk`, () => assert.ok(!talk(PageNamespace.SPECIAL)));
  });

  describe(`.file()`, () => {
    it(`is file`, () => assert.ok(file(PageNamespace.FILE)));
    it(`not file`, () => assert.ok(!file(PageNamespace.MAIN)));
  });
});
