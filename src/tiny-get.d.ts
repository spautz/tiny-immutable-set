declare module '@ngard/tiny-get' {
  export function get(
    object: any,
    path: string | number | Array<string | number>,
    defaultValue?: any,
  ): any;
}
