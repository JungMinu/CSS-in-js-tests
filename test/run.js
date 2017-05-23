Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.runBrowser = exports.runView = exports.runTest = undefined

let _fs = require('fs')

let _fs2 = _interopRequireDefault(_fs)

let _cliTable = require('cli-table')

let _cliTable2 = _interopRequireDefault(_cliTable)

let _benchmark = require('benchmark')

let _beautifyBenchmark = require('beautify-benchmark')

let _beautifyBenchmark2 = _interopRequireDefault(_beautifyBenchmark)

let _wd = require('wd')

let _wd2 = _interopRequireDefault(_wd)

let _utilities = require('./utilities')

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const runTest = exports.runTest = (testName, cases) => new Promise(resolve => {
  const testCases = {}

  Object.keys(cases).forEach(k => {
    testCases[(0, _utilities.toKebabCase)(k)] = { testCase: cases[k], result: null }
  })

  console.log(`Running ${testName} test.\n`)

  const testSuite = new _benchmark.Suite()

  Object.keys(testCases).forEach(caseName => {
    testSuite.add(caseName, () => {
      testCases[caseName].result = testCases[caseName].testCase((0, _utilities.pad)(caseName))
    })
  })

  testSuite.on('cycle', e => {
    _beautifyBenchmark2.default.add(e.target)
  })

  testSuite.on('complete', function onComplete () {
    const sizeResults = (0, _utilities.getSizeResults)(testCases)
    const smallest = (0, _utilities.getSmallest)(sizeResults, 'size').map(s => s.caseName)
    const smallestGzipped = (0, _utilities.getSmallest)(sizeResults, 'gzippedSize').map(s => s.caseName)
    const fastest = this.filter('fastest').map('name')

    console.log((0, _utilities.indent)((0, _utilities.sizeTable)(sizeResults).print()))
    console.log((0, _utilities.indent)(`Smallest ${smallest.length < 2 ? 'is: ' : 'are:'}         ${smallest.join(', ')}`))
    console.log((0, _utilities.indent)(`Smallest gzipped ${smallestGzipped.length < 2 ? 'is: ' : 'are:'} ${smallestGzipped.join(', ')}`))

    _beautifyBenchmark2.default.log()
    console.log((0, _utilities.indent)(`Fastest ${fastest.length < 2 ? 'is' : 'are'}: ${fastest.join(', ')}\n`))

    resolve()
  })

  testSuite.run({ async: true })
})

const runView = exports.runView = (testName, cases) => new Promise((resolve, reject) => {
  const testCases = {}

  Object.keys(cases).forEach(caseName => {
    testCases[(0, _utilities.toKebabCase)(caseName)] = { testCase: cases[caseName], result: null }
  })

  console.log(`Running view ${testName}.\n`)

  const outputDir = (0, _utilities.createOutputDir)(testName.replace(/ /, '-'))

  Object.keys(testCases).forEach(caseName => {
    const html = testCases[caseName].testCase((0, _utilities.pad)(caseName))
    const path = `${outputDir}/${caseName}.html`
    _fs2.default.writeFileSync(path, html)
    console.log(`Wrote ${path}`)
  })
  resolve(outputDir)
})

const runBrowser = exports.runBrowser = (testName, cases) => {
  let testCases = {}
  return runView(testName, cases).then(outDir => {
    _utilities.httpServer.start(outDir, 8123)
  }).then(() => {
    console.log(`Running Browser tests for ${testName}.`)

    // Run each of the browser tests sequentially
    return Object.keys(cases).map(caseName => runBrowserTest(testName.replace(/ /, '-'), (0, _utilities.toKebabCase)(caseName))).reduce((p, fn) => p.then(data => {
      if (data) {
        testCases[(0, _utilities.toKebabCase)(data.caseName)] = data.result
      }
      return fn()
    }), Promise.resolve())
  }).then(() => {
    let table = new _cliTable2.default({
      head: ['Framework', 'Loading', 'Painting', 'Rendering', 'Scripting', 'Other'],
      colAligns: ['left', 'right', 'right', 'right', 'right', 'right']
    })
    for (let key in testCases) {
      let { loading, painting, rendering, scripting, other } = testCases[key]
      table.push([key, loading.toFixed(3), painting.toFixed(3), rendering.toFixed(3), scripting.toFixed(3), other.toFixed(3)])
    }
    console.log(table.toString())
    _utilities.httpServer.stop()
  })
}

const runBrowserTest = (testName, caseName) => () => {
  let url = `http://localhost:8123/${testName}/${caseName}.html`
  const traceCategories = ['blink.console', 'devtools.timeline', 'disabled-by-default-devtools.timeline', 'toplevel', 'disabled-by-default-devtools.timeline.frame', 'benchmark']

  console.log(`Running ${url}`)

  let browser = _wd2.default.promiseRemote('http://localhost:9515')
  let chromeCapabilities = {
    browserName: 'chrome',
    chromeOptions: { perfLoggingPrefs: { traceCategories: traceCategories.join() } },
    loggingPrefs: { performance: 'ALL' }
  }
  return browser.init(chromeCapabilities).then(() => browser.get(url)).then(() => browser.sleep(1000)).then(() => browser.log('performance')).then(logs => {
    let eventStacks = {}

    let traceCategoriesRegEx = new RegExp('\\b(' + traceCategories.join('|') + '|__metadata)\\b')

    let eventCategories = {
      loading: ['ParseAuthorStyleSheet', 'ParseHTML', 'ResourceFinish', 'ResourceReceivedData', 'ResourceReceiveResponse', 'ResourceSendRequest'],
      painting: ['UpdateLayer', 'CompositeLayers', 'DecodeImage', 'MarkFirstPaint', 'Paint', 'PaintImage', 'PaintSetup', 'RasterTask', 'ResizeImage'],
      other: ['Program', 'Task'],
      rendering: ['Animation', 'BeginFrame', 'BeginMainThreadFrame', 'DrawFrame', 'HitTest', 'InvalidateLayout', 'Layout', 'RecalculateStyles', 'RequestMainThreadFrame', 'ScheduleStyleRecalculation', 'ScrollLayer', 'UpdateLayerTree', 'UpdateLayoutTree'],
      scripting: ['CancelAnimationFrame', 'CancelIdleCallback', 'CompileScript', 'ConsoleTime', 'EmbedderCallback', 'EvaluateScript', 'EventDispatch', 'FireAnimationFrame', 'FireIdleCallback', 'FunctionCall', 'GCCollectGarbage', 'GCCompleteSweep', 'GCEvent', 'GCIdleLazySweep', 'JSFrame', 'LatencyInfo', 'MajorGC', 'MarkDOMContent', 'MarkLoad', 'MinorGC', 'ParseScriptOnBackground', 'RequestAnimationFrame', 'RequestIdleCallback', 'RunMicrotasks', 'TimerFire', 'TimerInstall', 'TimerRemove', 'TimeStamp', 'UserTiming', 'WebSocketCreate', 'WebSocketDestroy', 'WebSocketReceiveHandshakeResponse', 'WebSocketSendHandshakeRequest', 'XHRLoad', 'XHRReadyStateChange ']
    }

    let result = {
      loading: 0, painting: 0, other: 0, rendering: 0, scripting: 0
    }

    // FIX this - make this efficient
    const addEventToResult = (name, val) => {
      for (let key in eventCategories) {
        if (eventCategories[key].filter(a => a === name).length === 1) {
          result[key] += val / 1000
          break
        }
      }
    }

    logs.forEach(log => {
      let msg = JSON.parse(log.message).message
      let result = {}
      if (msg.method !== 'Tracing.dataCollected' || !traceCategoriesRegEx.test(msg.params.cat)) {
        return
      }
      let e = msg.params
      switch (e.ph) {
        case 'I': // Instant Event
        case 'X':
          // Duration Event
          addEventToResult(e.name, e.dur || e.tdur || 0)
          break
        case 'B':
          // Begin Event
          if (typeof eventStacks[e.tid] === 'undefined') {
            eventStacks[e.tid] = []
          }
          eventStacks[e.tid].push(e)
          break
        case 'E':
          // End Event
          if (typeof eventStacks[e.tid] === 'undefined' || eventStacks[e.tid].length === 0) {
            // console.log('Encountered an end event that did not have a start event', e)
          } else {
            let b = eventStacks[e.tid].pop()
            if (b.name !== e.name) {
              // console.log('Start and end events dont have the same name', e, b)
            }
            addEventToResult(e.name, e.ts - b.ts)
          }
          break
      }
    })
    return { caseName, result}
  }).fin(() => browser.quit())
}
