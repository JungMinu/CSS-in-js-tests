'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.glamorCase = undefined

let _server = require('glamor/server')

let _glamor = require('glamor')

let _styles = require('../styles')

let _render = require('../render')

const glamorCase = exports.glamorCase = caseName => {
  const { html, css } = (0, _server.renderStatic)(() => (0, _render.renderBody)(caseName, (0, _glamor.style)((0, _styles.createContainerStyle)()), (0, _glamor.style)((0, _styles.createButtonStyle)())))

  ;(0, _glamor.flush)()

  return (0, _render.renderHtml)(css, html)
}
