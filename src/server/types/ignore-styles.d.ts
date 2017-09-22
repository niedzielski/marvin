declare module "ignore-styles" {
  interface onLoad {
    (module: any, filename: string): any;
  }
  function register(extensions: any, cb: onLoad): void;
  export default register;
}
