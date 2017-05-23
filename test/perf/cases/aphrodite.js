'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.aphroditeCase = undefined

let _aphrodite = require('aphrodite')

let _styles = require('../styles')

let _render = require('../render')

const aphroditeCase = exports.aphroditeCase = caseName => {
  const useStyles = _aphrodite.StyleSheet.create((0, _styles.createStylesheet)())

  const { html, css } = _aphrodite.StyleSheetServer.renderStatic(() => (0, _render.renderBody)(caseName, (0, _aphrodite.css)(useStyles.container), (0, _aphrodite.css)(useStyles.button)))

  _aphrodite.StyleSheetTestUtils.clearBufferAndResumeStyleInjection()

  return (0, _render.renderHtml)(css.content, html)
}
