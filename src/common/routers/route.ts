export interface Route {
  path: string,
  response: () => Promise<any>,
  status: number
}
