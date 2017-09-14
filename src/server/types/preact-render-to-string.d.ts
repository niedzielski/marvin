// todo: delete file when
// https://github.com/developit/preact-render-to-string/pull/39 is merged.

declare namespace render {
  interface Options {
    shallow: boolean;
    xml: boolean;
    pretty: boolean;
  }

  function render(
    vNode: preact.VNode,
    context?: any,
    options?: Options
  ): string;
  function shallowRender(vNode: preact.VNode, context?: any): string;
}

declare module "preact-render-to-string" {
  export = render;
}
