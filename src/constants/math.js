/** @type {{ [name: String]: import('./types').Math }} */
const math = {
  plus: {
    symbol: '+',
    description: 'Addition operator',
    example: '2 + 3',
    result: '5',
  },
  minus: {
    symbol: '-',
    description: 'Subtraction Operator',
    example: '2 - 3',
    result: '-1',
  },
  obelus: {
    symbol: '/',
    description: 'Division Operator',
    example: '3 / 2',
    result: '1.5',
  },
  times: {
    symbol: '\\',
    description: 'Multiplication Operator',
    example: '2 \\ 3',
    result: '6',
  },
  modulo: {
    symbol: 'Mod',
    description: 'Modulus Operator',
    example: '3 Mod 2',
    result: '1',
  },
  parentheses: {
    symbol: '()',
    description: 'Parenthesis',
  },
  sigma: {
    symbol: 'Sigma',
    description: 'Summation',
    example: 'Sigma(1, 100, n)',
    result: '5050',
  },
  capitalPi: {
    symbol: 'Pi',
    description: 'Product',
    example: 'Pi(1, 10, n)',
    result: '3628800',
  },
  variable: {
    symbol: 'n',
    description: 'Variable for Summation or Product',
  },
  piConstant: {
    symbol: 'pi',
    description: 'Math constant pi',
    result: '3.14',
  },
  eConstant: {
    symbol: 'e',
    description: 'Math constant e',
    result: '2.71',
  },
  combination: {
    symbol: 'C',
    description: 'Combination operator',
    example: '4 C 2',
    result: '6',
  },
  permutation: {
    symbol: 'P',
    description: 'Permutation operator',
    example: '4 P 2',
    result: '12',
  },
  factorial: {
    symbol: '!',
    description: 'Factorial operator',
    example: '4!',
    result: '24',
  },
  logarithmic: {
    symbol: 'log',
    description: 'Logarithmic function with base 10',
    example: 'log 1000',
    result: '3',
  },
  natural: {
    symbol: 'ln',
    description: 'Natural log function with base e',
    example: 'ln 2',
    result: '.3010',
  },
  power: {
    symbol: 'pow',
    description: 'Power function with two operator',
    example: 'pow(2, 3)',
    result: '8',
  },
  caret: {
    symbol: '^',
    description: 'Power operator',
    example: '2 ^ 3',
    result: '8',
  },
  squareRoot: {
    symbol: 'root',
    description: 'Underroot function',
    example: 'root 4',
    result: '2',
  },
  sine: {
    symbol: 'sin',
    description: 'Sine function',
    example: 'sin 90',
    result: '1',
  },
  cosine: {
    symbol: 'cos',
    description: 'Cosine function',
    example: 'cos 90',
    result: '0',
  },
  tangent: {
    symbol: 'tan',
    description: 'Tangent function',
    example: 'tan 45',
    result: '1',
  },
  arcsine: {
    symbol: 'asin',
    description: 'Arcsine function',
    example: 'asin 1',
    result: '90',
  },
  arccosine: {
    symbol: 'acos',
    description: 'Arccosine function',
    example: 'acos 0',
    result: '90',
  },
  arctangent: {
    symbol: 'atan',
    description: 'Arctangent function',
    example: 'atan 1',
    result: '45',
  },
  hyperbolicSine: {
    symbol: 'sinh',
    description: 'Hyperbolic sine function',
    example: 'sinh 1',
    result: '1.175201193643801',
  },
  hyperbolicCosine: {
    symbol: 'cosh',
    description: 'Hyperbolic cosine function',
    example: 'cosh 1',
    result: '1.543080634815244',
  },
  hyperbolicArcsine: {
    symbol: 'asinh',
    description: 'Hyperbolic arcsine function',
    example: 'asinh 1',
    result: '0.881373587019543',
  },
  hyperbolicArccosine: {
    symbol: 'acosh',
    description: 'Hyperbolic arccosine function',
    example: 'acosh 1',
    result: '0',
  },
  hyperbolicArctangent: {
    symbol: 'atanh',
    description: 'Hyperbolic arctangent function',
    example: 'atanh 1',
    result: 'Infinity',
  },
};

module.exports = { math };
