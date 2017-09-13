import { Component } from "preact";
import { History } from "history";

export interface Props {
  history: History;
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
