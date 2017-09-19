import { FunctionalComponent, ComponentConstructor } from "preact";

// todo: delete pending https://github.com/developit/preact/pull/869.
export type ComponentChild = JSX.Element | string;
export type ComponentChildren = ComponentChild[];

// todo: consider upstreaming type definition for AnyComponent
export type AnyComponent<PropsType, StateType> =
  | FunctionalComponent<PropsType>
  | ComponentConstructor<PropsType, StateType>;

export interface ChildrenProps {
  children?: ComponentChildren;
}

export interface ClassProps {
  class?: string;
}

export const classOf = (...names: (string | undefined)[]): string =>
  names.filter(name => name).join(" ");
