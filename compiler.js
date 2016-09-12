var source = '(mult 2 30)';


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
