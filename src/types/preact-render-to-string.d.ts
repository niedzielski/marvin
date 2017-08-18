// todo: delete file when
// https://github.com/developit/preact-render-to-string/pull/39 is merged.
/// <reference path="../../node_modules/preact/dist/preact.d.ts" />

declare namespace render {
  interface Options {
    shallow: boolean,
    xml: boolean,
    pretty: boolean;
  }

  function render(vnode: preact.VNode, context?: any, options?: Options): string;
  function shallowRender(vnode: preact.VNode, context?: any): string;
}

declare module "preact-render-to-string" {
  export = render;
}
