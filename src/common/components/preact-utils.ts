import {
  ComponentProps,
  ComponentConstructor,
  FunctionalComponent as PreactFunctionalComponent
} from "preact";

// todo: delete pending https://github.com/developit/preact/pull/869.
export type ComponentChild = JSX.Element | string;
export type ComponentChildren = ComponentChild[];

// Identical to PreactFunctionalComponent but props are required for
// TypeScript strictFunctionTypes.
interface FunctionalComponentWithProps<Props>
  extends Partial<PreactFunctionalComponent<Props>> {
  (props: Props & ComponentProps<this>, context?: any): JSX.Element;
}

export type FunctionalComponent<Props> =
  | PreactFunctionalComponent<Props>
  | FunctionalComponentWithProps<Props>;

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
