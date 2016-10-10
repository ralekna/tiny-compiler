var source = '(mult 2 30)';

// can pass as reference
function Source(source) {
  this.valueOf = this.toString = function() {
    return source;
  };
}

var Char = (function() {

  var cargoToString = {
    " " : "   space",
    "\n": "   newline",
    "\t": "   tab"
  };

  function Char(char, lineIndex, colIndex, sourceIndex, source) {
    this.cargo          = char;
    this.sourceIndex    = sourceIndex;
    this.lineIndex      = lineIndex;
    this.colIndex       = colIndex;
    this.source         = source;
  }

  Char.prototype.isWhiteSpace = function () {
    return !!cargoToString[this.cargo];
  };

  Char.prototype.toDetailedString = function() {

    var cargo = this.cargo;
    if (cargoToString[cargo]) {
      cargo = cargoToString[cargo];
    } else {
      cargo = '\"' + cargo + '\"';
    }
    return cargo + ' line:' + this.lineIndex + 'col:' + this.colIndex;
  };

  Char.prototype.toString = Char.prototype.valueOf = function() {
    return this.cargo;
  };

  return Char;
})();

var Scanner = (function () {

  function scan(source) {
    var columnIndex = -1;
    var lineIndex = 0;

    return Array.prototype.map.call(source, function(char, sourceIndex) {
      if (char === '\n') {
        columnIndex = -1;
        lineIndex++;
      }
      columnIndex++;
      return new Char(char, lineIndex, columnIndex, sourceIndex, source);
    });
  }

  function Scanner(sourceText) {
    this.position = 0;
    this.buffer = scan(sourceText);
  }

  Scanner.prototype.getNext = function() {
    return this.buffer[this.position++];
  };
  Scanner.prototype.getCurrect = function () {
    return this.buffer[this.position];
  };
  Scanner.prototype.peek = function() {
    return this.buffer[this.position + 1];
  };

  Scanner.prototype.isEof = function() {
    return this.peek() == null;
  };

  return Scanner;
})();

var Tokenizer = (function () {

  function Tokenizer(scanner) {

  }

  Tokenizer.prototype.getNext = function () {

  };

  return Tokenizer;
})();

function tokenize(source) {

}

var tail = Function.prototype.call.bind(Array.prototype.slice, 1);
var head = Function.prototype.call.bind(Array.prototype.slice, 0, 1);

function readNumber(source) {
  let first = source[0];
  if (/\d/.test(first)) {
    return readNumber(tail(source));
  } else {
    return;
  }
}

function tokenizer(source) {

  var position = 0;
  var tokens = [];

  while(position < source.length) {

    var char = source[position];

      if (char.match(/\s/)) {
        readSpace();
        position++;
        continue;
      }

      if (char.match(/\d/)) {
        tokens.push({type: 'number', value: readNumber()});
        position++;
        continue;
      }

      if (char === '(') {
        tokens.push({type: 'lparen', value: '('});
        position++;
        continue;
      }

      if (char === ')') {
        tokens.push({type: 'rparen', value: ')'});
        position++;
        continue;
      }

      if (char.match(/[a-z]/i)) {
        tokens.push({type: 'name', value: readName()});
        continue;
      }

      throw new Error('unknown char ' + char + ' at position ' + position);

  }

  function readNumber() {
    let token = '';
    do {
      token += source[position];
      position++;
    } while (source[position].match(/\d/));
    return token;
  }

  function readName() {
    let token = '';
    do {
      token += source[position];
      position++;
    } while (source[position].match(/[a-z]/i));
    return token;
  }

  function readSpace() {
    do {
      position++
    } while (source[position].match(/\s/));
  }


  return tokens;
}


console.log(tokenizer(source));
