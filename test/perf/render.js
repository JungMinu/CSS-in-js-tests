'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
const renderHtml = exports.renderHtml = (css, body) => `<html>
    <head>
        <style type="text/css">
${css}
        </style>
    </head>
    <body>
${body}
    </body>
</html>
`

const renderBody = exports.renderBody = (libraryName, containerClassNames, buttonClassNames) => `<section class="${containerClassNames}">
    <h1>${libraryName}</h1>
    <button class="${buttonClassNames}">Click me</button>
</section>`
