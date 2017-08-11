# Development

In this document you can find information on requirements and setup, and how to
run the project in development.

## Requirements

Marvin's requirements are listed in the package.json **engines** field.
Generally the latest [Node.js][] active LTS version (6.X), and npm > 5.X should
do it.

Before running the project on development, run:

```
npm install
```

To set up all the dependencies and tools for the project. This step may take
a few minutes, depending on your computer and network speed.

[Node.js]: https://nodejs.org/

## Developing

There are a few npm scripts set up for ease of development. See `package.json`
on the `scripts` field or run `npm run` to see the available options.

* To **run the compilers, and the application** in development mode, run:
  * `npm start`
  * After it is done, open <http://localhost:3000>, you should see the website.
  * If you change source files both on server code or client code, the process
    will detect changes and re-compile and re-launch the application, so just
    go and refresh the browser window when it is done.

* To run **linting & tests**:
  * `npm test`
  * If you want to watch files and run the linting and tests when some change,
    you can run:
    * `npm run test:watch`

* To automatically format source code and fix linting errors, you can run:
  * `npm run format`


## Running the production version

If you want to run the production version, then:

* Build production artifacts in dist/
  * `npm run build`
* Run the production server with:
  * `NODE_ENV=production node dist/server/index.js`
