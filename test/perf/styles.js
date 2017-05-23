'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
const createContainerStyle = exports.createContainerStyle = options => {
  const p = options && options.prefixPseudo ? '&' : ''
  return {
    color: 'yellow',
    display: 'block',
    backgroundColor: 'blue',
    textAlign: 'center',
    padding: '30px',
    fontSize: '50px',
    [p + ':hover']: { backgroundColor: 'darkturquoise' },
    '@media (max-height: 400px)': {
      backgroundColor: 'deepskyblue',
      textAlign: 'left',
      padding: '20px',
      fontSize: '25px',
      [p + ':hover']: { backgroundColor: 'turquoise' }
    }
  }
}

const createButtonStyle = exports.createButtonStyle = options => {
  const p = options && options.prefixPseudo ? '&' : ''
  return {
    color: 'yellow',
    display: 'block',
    backgroundColor: 'rebeccapurple',
    fontSize: '30px',
    border: '3px solid yellow',
    [p + ':hover']: {
      color: 'lightblue',
      [p + ':active']: {
        fontSize: '24px',
        color: 'red'
      }
    },
    '@media (max-height: 400px)': {
      color: 'lightgreen',
      fontSize: '24px',
      [p + ':hover:active']: {
        fontSize: '18px'
      }
    }
  }
}

const createStylesheet = exports.createStylesheet = options => ({
  container: createContainerStyle(options),
  button: createButtonStyle(options)
})
