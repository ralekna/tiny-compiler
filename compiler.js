var source = '(mult 2 (mult 3 4))';

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
    this.buffer = scan(sourceText.toString());
  }

  Scanner.prototype.getNext = function() {
    return this.buffer[this.position++];
  };
  Scanner.prototype.getCurrent = function () {
    return this.buffer[this.position];
  };
  Scanner.prototype.peek = function() {
    return this.buffer[this.position];
  };

  Scanner.prototype.isEof = function() {
    return !this.peek();
  };

  return Scanner;
})();

var Token = (function() {

  Token.NUMBER = 'number';
  Token.PAREN = 'paren';
  Token.NAME = 'name';

  function charsToString(chars) {
    return chars.reduce(function(prev, char) {
      return prev + char.cargo;
    }, '');
  }

  function Token(type, value) {
    this.type = type;
    this.value = value;
  }

  Token.prototype.toString = Token.prototype.valueOf = function() {
    return JSON.stringify({
      type: this.type,
      value: this.getValueText()
    });
  };

  Token.prototype.getValueText = function() {
    return charsToString(this.value);
  };

  return Token;

})();

var Tokenizer = (function () {

  function isNumber(char) {
    return /\d/.test(char.cargo);
  }

  function isLetter(char) {
    return /[a-z]/i.test(char.cargo);
  }

  function isAlphaNumeric(char) {
    return /[a-z0-9]/i.test(char.cargo);
  }

  function isParen(char) {
    return /[()]/.test(char.cargo);
  }

  function isWhiteSpace(char) {
    return char.isWhiteSpace();
  }


  function Tokenizer(scanner) {
    this.scanner = scanner;
    this.current = null;
  }

  Tokenizer.prototype.readWhile = function(predicate) {
    var retVal = [];
    while(!this.scanner.isEof() && predicate(this.scanner.peek())) {
      var char = this.scanner.getNext();
      retVal.push(char);
    }
    return retVal;
  };

  Tokenizer.prototype.readNext = function() {
    this.readWhile(isWhiteSpace);
    var char = this.scanner.peek();
    if (!char) { // EOF
      return null;
    }

    if (isParen(char)) {
      return new Token(Token.PAREN, [this.scanner.getNext()]);
    }

    if (isLetter(char)) {
      return this.readName();
    }

    if (isNumber(char)) {
      return this.readNumber();
    }

    throw new Error('Can\'t read char: ' + char.toString());
  };

  Tokenizer.prototype.readName = function() {
    var value = this.readWhile(isAlphaNumeric);
    return new Token(Token.NAME, value);
  };

  Tokenizer.prototype.readNumber = function() {
    var value = this.readWhile(isNumber);
    return new Token(Token.NUMBER, value);
  };

  Tokenizer.prototype.peek = function() {
    return this.current || (this.current = this.readNext());
  };

  Tokenizer.prototype.getNext = function () {
    var token = this.current;
    this.current = null;
    return token || this.readNext();
  };

  Tokenizer.prototype.isEof = function() {
    return !this.peek();
  };

  return Tokenizer;
})();

function tokenize(tokenizer) {
  // console.log(tokenizer.getNext());
  var tokens = [];
  while(!tokenizer.isEof()) {
    var token = tokenizer.getNext();
    console.log(token.toString());
    tokens.push(token);
  }

  // console.log(tokens);
}

tokenize(new Tokenizer(new Scanner(new Source(source))));