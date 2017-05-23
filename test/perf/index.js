'use strict'

let _run = require('../run')

let _cases = require('./cases')

let cases = _interopRequireWildcard(_cases)

function _interopRequireWildcard (obj) { if (obj && obj.__esModule) { return obj; } else { let newObj = {}
    if (obj != null) { for (let key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(0, _run.runTest)('performance', cases)
