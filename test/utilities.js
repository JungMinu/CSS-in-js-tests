Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.httpServer = exports.indent = exports.getSmallest = exports.sizeTable = exports.getSizeResults = exports.toClasses = exports.createOutputDir = exports.OUTPUT = exports.pad = exports.toKebabCase = undefined

let _easyTable = require('easy-table')

let _easyTable2 = _interopRequireDefault(_easyTable)

let _fs = require('fs')

let _fs2 = _interopRequireDefault(_fs)

let _http = require('http')

let _http2 = _interopRequireDefault(_http)

let _url = require('url')

let _url2 = _interopRequireDefault(_url)

let _path = require('path')

let _path2 = _interopRequireDefault(_path)

let _gzipSize = require('gzip-size')

let _gzipSize2 = _interopRequireDefault(_gzipSize)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const toKebabCase = exports.toKebabCase = n => n.replace(/Case$/, '').replace(/([a-z])([A-Z])/g, (match, c1, c2) => `${c1}-${c2.toLowerCase()}`)

const pad = exports.pad = n => {
  const titleLength = 30
  const p = '===================='
  const title = `${p} ${n} ${p}`
  const offset = (title.length - titleLength) / 2
  return title.substr(offset, titleLength)
}

const OUTPUT = exports.OUTPUT = './output/'

const createOutputDir = exports.createOutputDir = testName => {
  const outputDir = OUTPUT + testName
  if (!_fs2.default.existsSync(OUTPUT)) {
    _fs2.default.mkdirSync(OUTPUT)
  }
  if (!_fs2.default.existsSync(outputDir)) {
    _fs2.default.mkdirSync(outputDir)
  }
  return outputDir
}

const toClasses = exports.toClasses = css => {
  const newCss = {}
  Object.keys(css).forEach(className => {
    newCss[`.${className}`] = css[className]
  })
  return newCss
}

const getSizeResults = exports.getSizeResults = testCases => Object.keys(testCases).map(caseName => {
  const result = testCases[caseName].result
  return {
    caseName,
    size: result.length,
    gzippedSize: _gzipSize2.default.sync(result)
  }
})

const sizeTable = exports.sizeTable = sizeResults => {
  const t = new _easyTable2.default()
  sizeResults.forEach(sr => {
    t.cell('name', sr.caseName)
    t.cell('size', `${sr.size.toLocaleString()} B`, _easyTable2.default.padLeft)
    t.cell('gzipped size', `(${sr.gzippedSize.toLocaleString()} B gzipped)`, _easyTable2.default.padLeft)
    t.newRow()
  })
  return t
}

const getSmallest = exports.getSmallest = (_sizeResults, size, { threshold = 0.05 } = {}) => {
  const sizeResults = Array.from(_sizeResults); // clone so sort won't mutate original
  sizeResults.sort((a, b) => a[size] - b[size])

  const smallest = sizeResults[0]
  const smallestThreshold = smallest[size] * (1 + threshold)

  return sizeResults.filter(sr => sr[size] <= smallestThreshold)
}

const indent = exports.indent = (lines, { repeat = 2, character = ' ' } = {}) => lines.split('\n').map(line => character.repeat(repeat) + line).join('\n')

const httpServer = exports.httpServer = {
  start(dir, port) {
    this.server = _http2.default.createServer((req, res) => {
      let filename = _path2.default.join(dir, '..', _url2.default.parse(req.url).pathname)
      _fs2.default.stat(filename, (err, stat) => {
        if (!err && stat.isFile()) {
          res.writeHead(200, 'text/html')
          _fs2.default.createReadStream(filename).pipe(res)
        } else {
          res.end()
        }
      })
    })
    this.server.listen(port)
  },
  stop() {
    this.server.close()
  }
}
