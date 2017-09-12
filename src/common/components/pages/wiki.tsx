import App from "../app";
import { RouteParameters } from "../../routers/route";
import { h } from "preact";

export interface Parameters extends RouteParameters {
  title: string
}

export interface Properties {
  title: string
}

export const initialProperties = ({
  title
}: Parameters): Promise<Properties> => {
  return Promise.resolve({ title });
};

export const component = ({ title }: Properties): JSX.Element => (
  <App>
    <p>{title}</p>
  </App>
);
