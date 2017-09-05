// Children are always arrays. See
// https://github.com/developit/preact/blob/6756a9c/src/preact.d.ts#L70-L71
// and https://preactjs.com/guide/differences-to-react#what-s-missing-.
export type Children = (JSX.Element | JSX.Element[] | string)[];
