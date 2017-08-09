/**
 * Render a full HTML page
 * @param {!Object} params
 * @param {?string} params.title Title of the page
 * @param {string} [params.body = ""] HTML to render in the body of the page
 * @param {!Object.<string, !Object.<string, !string>>} params.assets Manifest of filename entry points to bundled assets.
 * @return {!string} HTML
 */
module.exports = function page({ body = "", assets, title }) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>${title ? `${title} - ` : ""}Marvin</title>
  </head>
  <body>
    <div id="root">${body}</div>
    <script type="text/javascript" src="./${assets.index.js}"></script>
  </body>
</html>`;
};
