// todo: delete pending https://github.com/developit/preact/pull/869.
export type ComponentChild = JSX.Element | string;
export type ComponentChildren = ComponentChild[];

export interface ChildrenProps {
  children?: ComponentChildren;
}

export interface ClassProps {
  class?: string;
}

export const classOf = (...names: (string | undefined)[]): string =>
  names.filter(name => name).join(" ");
