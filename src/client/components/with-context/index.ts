import { Component } from "preact";
import { History } from "history";

export interface Properties {
  history: History,
  children?: JSX.Element[]
}

export class WithContext extends Component<Properties, void> {
  getChildContext() {
    const { children, ...history } = this.props;
    return history;
  }

  render({ children }: Properties) {
    return (children && children[0]) || null;
  }
}
