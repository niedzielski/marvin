import { ComponentProps, h } from "preact";
import App from "../components/app/app";
import { RouteParameters } from "../routers/route";

export interface Parameters extends RouteParameters {
  title: string;
}

export interface Props extends ComponentProps<any> {
  title: string;
}

export const initialProps = ({ title }: Parameters): Promise<Props> => {
  return Promise.resolve({ title });
};

export const Component = ({ title }: Props): JSX.Element => (
  <App>
    <p>{title}</p>
  </App>
);
