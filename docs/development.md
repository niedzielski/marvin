# Development

In this document you can find information on requirements and setup, and how to
run the project in development.

## Requirements

Marvin's requirements are listed in the package.json **engines** field.
Generally the latest [Node.js] active LTS version (6.X), and npm > 5.X should do
it.

Before running the project on development, run:

```sh
npm install
```

To set up all the dependencies and tools for the project. This step may take
a few minutes, depending on your computer and network speed.

[node.js]: https://nodejs.org/

## Developing

There are a few npm scripts set up for ease of development. See `package.json`
on the `scripts` field or run `npm run` to see the available options.

* To **run the compilers, and the application** in development mode, run:

  * `npm start`
  * After it is done, open <http://localhost:3000>, you should see the website.
  * If you change source files both on server code or client code, the process
    will detect changes and re-compile and re-launch the application, so just
    go and refresh the browser window when it is done.

* To run **linting and tests**:

  * `npm test`
  * If you want to watch files and run the linting and tests when some change,
    you can run:
    * `npm run test:watch`

* To automatically format source code and fix linting errors, you can run:

  * `npm run format`

* To suppress NPM-specific output, run the command with the `-s` option. e.g.:

  * `npm -s start`.

* To debug the build process, enable verbose output. e.g.:
  * `VERBOSE=true npm run test:watch`.

## Running the production version

If you want to run the production version, then:

* Build production artifacts in dist/
  * `npm run build`
* Run the production server with:
  * `NODE_ENV=production node dist/server/index.js`

## Coding conventions

### TypeScript

#### Typing

In TypeScript, data types may be explicitly specified or (often) inferred by the
compiler. Marvin's coding convention is to favor inference except for module
exports. Another way to phrase this is: write concisely except for APIs.

The reasoning is that the brevity of inferred code is preferred -as long as
the compiler doesn't complain- but APIs are seams and their types should be
both fixed and documented. We have set up the TypeScript compiler with the
strict settings so no implicit `any` or `null` / `undefined` should slip in.
When in doubt, treat typing as logical assertions.

The following examples are possible module implementations but the second or
third are preferred:

1. Explicitly over-typed (right-hand typing is internal):

   ```tsx
   const app: FunctionalComponent<any> = (_props: any): JSX.Element => (
     <div class="App">Hello world</div>
   );

   export default app;
   ```

2. **Preferred** - Explicitly typed (declared syntax):

   ```tsx
   const app: FunctionalComponent<any> = () => (
     <div class="App">Hello world</div>
   );

   export default app;
   ```

3. **Preferred** - Explicitly typed (inline syntax):

   ```tsx
   export default (_props: any): JSX.Element => (
     <div class="App">Hello world</div>
   );
   ```

4. Implicitly typed:
   ```tsx
   export default () => <div class="App">Hello world</div>;
   ```

The following are possible internal implementations but the second is preferred:

1. Explicitly typed lambda:

   ```tsx
   server.get("*", (_request: express.Request, response: express.Response) => {
     response.status(404).send("Not found");
   });
   ```

2. **Preferred** - Implicitly typed lambda:
   ```tsx
   server.get("*", (_request, response) => {
     response.status(404).send("Not found");
   });
   ```

Additionally, prefer a default export when only one export is needed.

#### Function signatures

* Prefer arrow-functions for short inline expressions that return a value and
  lambda or anonymous functions.
* Prefer the function keyword for top-level declarations, especially those
  requiring brackets.
* Prefer destructuring for options parameter objects that encapsulate arguments
  and functions with many parameters. e.g.:

  * **Preferred:**
    ```ts
    function addEventListener(type: string, listener: Event, {capture, once, passive}: Options) { ... }
    ```
  * **Preferred:**

    ```ts
    interface Props extends ChildrenProps {
      titleText: ComponentChild;
      manifest: Manifest;
      chunkName: string;
    }

    export default function Page({
      titleText,
      manifest,
      chunkName,
      children
    }: Props): JSX.Element {
      ...
    }
    ```

  * **Avoid:**
    ```ts
    function addEventListener(type: string, listener: Event, options: Options) { ... }
    ```

#### Function invocations

* Callers should prefer destructuring as opposed to manually assembling the
  object outside the invocation:
  * **Preferred:**
    ```ts
    fnc({ foo: …, bar: … });
    ```
  * **Avoid:**
    ```ts
    const foo = …;
    const bar = …;
    const param = { foo, bar };
    fnc(param);
    ```

#### Naming

* Static constants should be written in `SHOUTING_SNAKE_CASE`. All other
  variables should be written in `camelCase`.
* Preact components should be written in PascalCase.
* Functions should be verbs like `request` or `get`, not `requester` or
  `getter`.

### CSS

#### Naming

Marvin uses [SUIT naming conventions]. Please see the linked two page document
for more information.

[suit naming conventions]: https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md#suit-css-naming-conventions

### Abbreviations

Marvin uses the following abbreviations:

* Configuration => config
* Document => doc
* Parameters => params
* Properties => props
* Utilities => utils

### Filenaming

* All filenames should use shish-kebab-case.
* The filenames, not the enclosing folder, should describe the module. For
  example:
  * Prefer: app/app.tsx, link/link.css, router/router.test.ts.
  * Avoid: app/index.tsx, link/index.css, router/index.test.ts.
    The reason is that some editors use filenames for UI cues and naming
    everything "index.x" makes it difficult to distinguish among files quickly.
    Client and server files are excluded as frontend client and backend server
    entry points.
* Avoid folders with only one file. e.g.:
  * Prefer a folder when multiple files exist such as components/foo/foo.tsx and
    components/foo/foo.test.tsx.
  * Avoid a folder when only one file exists such as components/foo.tsx.

## Environment variables

See [configuration](../src/server/config.ts).

## Continuous integration

* [Jenkins jobs]
* [Jenkins Job Builder configuration]

[jenkins jobs]: https://integration.wikimedia.org/ci/view/Default/search/?q=marvin
[jenkins job builder configuration]: https://phabricator.wikimedia.org/diffusion/CICF/browse/master/jjb/misc.yaml
