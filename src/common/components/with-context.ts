import { Component } from "preact";
import { History } from "history";

export interface Props {
  history: History;
  // todo: replace with ChildrenProps when
  // https://github.com/developit/preact/pull/869 is merged.
  children?: JSX.Element[];
}

export class WithContext extends Component<Props, void> {
  getChildContext() {
    const { children, ...history } = this.props;
    return history;
  }

  render({ children }: Props) {
    return (children && children[0]) || null;
  }
}
