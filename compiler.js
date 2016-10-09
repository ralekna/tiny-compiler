var source = '(mult 2 30)';

var EOF = '\0';

// can pass as reference
function Source(source) {
  this.valueOf = this.toString = function() {
    return source;
  };
}

function Char(char, lineIndex, colIndex, sourceIndex, source) {
  this.cargo          = char;
  this.sourceIndex    = sourceIndex;
  this.lineIndex      = lineIndex;
  this.colIndex       = colIndex;
  this.source         = source;
}
Char.prototype.toString = function() {
  var cargoToString = {
    " " : "   space",
    "\n": "   newline",
    "\t": "   tab",
    "\0": "   eof"
  };

  var cargo = this.cargo;
  if (cargoToString[cargo]) {
    cargo = cargoToString[cargo];
  } else {
    cargo = '\"' + cargo + '\"';
  }
  return cargo + ' line:' + this.lineIndex + 'col:' + this.colIndex;
};

function scan(source) {
  var columnIndex = -1;
  var lineIndex = 0;

  var retVal = Array.prototype.map.apply(source, function(char, sourceIndex) {
    if (char === '\n') {
      columnIndex = -1;
      lineIndex++;
    }
    columnIndex++;

    return new Char(char, lineIndex, columnIndex, sourceIndex, source);
  });
  retVal.push(new Char(EOF, lineIndex, columnIndex, source.length - 1, source));
  return retVal;
}

function tokenize(source) {

}

var tail = Function.prototype.call.bind(Array.prototype.slice, 1);
var head = Function.prototype.call.bind(Array.prototype.slice, 0, 1);

function readNumber(source) {
  let first = source[0];
  if (/\d/.test(first)) {
    return readNumber(tail(source), position++);
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
