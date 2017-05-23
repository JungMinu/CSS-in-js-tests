'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.styletronCase = undefined

let _styletronServer = require('styletron-server')

let _styletronServer2 = _interopRequireDefault(_styletronServer)

let _styletronUtils = require('styletron-utils')

let _styles = require('../styles')

let _render = require('../render')

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const styletronCase = exports.styletronCase = caseName => {
  const styletron = new _styletronServer2.default()

  const html = (0, _render.renderBody)(caseName, (0, _styletronUtils.injectStyle)(styletron, (0, _styles.createContainerStyle)()), (0, _styletronUtils.injectStyle)(styletron, (0, _styles.createButtonStyle)()))

  const css = styletron.getCss()

  return (0, _render.renderHtml)(css, html)
}
