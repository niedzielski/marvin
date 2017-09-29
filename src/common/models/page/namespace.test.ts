import * as assert from "assert";
import { Namespace, special, main, talk, file } from "./namespace";

describe("namespace", () => {
  describe(`.special()`, () => {
    it(`is special`, () => assert.ok(special(Namespace.SPECIAL)));
    it(`not special`, () => assert.ok(!special(Namespace.MAIN)));
  });

  describe(`.main()`, () => {
    it(`is main`, () => assert.ok(main(Namespace.MAIN)));
    it(`not main`, () => assert.ok(!main(Namespace.TALK)));
  });

  describe(`.talk()`, () => {
    it(`is talk`, () => assert.ok(talk(Namespace.TALK)));
    it(`not talk`, () => assert.ok(!talk(Namespace.MAIN)));
    it(`special is not talk`, () => assert.ok(!talk(Namespace.SPECIAL)));
  });

  describe(`.file()`, () => {
    it(`is file`, () => assert.ok(file(Namespace.FILE)));
    it(`not file`, () => assert.ok(!file(Namespace.MAIN)));
  });
});
