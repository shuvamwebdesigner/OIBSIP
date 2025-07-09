const display = document.getElementById('display');
const expressionLine = document.getElementById('expression');
const buttons = document.querySelectorAll('button');
let ans = '';

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (value === 'clear') {
      display.value = '';
      expressionLine.textContent = '';
    } else if (value === 'del') {
      display.value = display.value.slice(0, -1);
    } else if (value === 'ans') {
      display.value += ans;
    } else if (value === 'ENTER') {
      try {
        expressionLine.textContent = display.value;
        ans = parseExpression(display.value);
        display.value = ans;
      } catch (err) {
        display.value = 'Error';
      }
    } else if (value === '±') {
      if (display.value.startsWith('-')) {
        display.value = display.value.slice(1);
      } else {
        display.value = '-' + display.value;
      }
    } else {
      display.value += value;
    }
  });
});

// Safe math parser
function parseExpression(expr) {
  const output = [];
  const operators = [];
  const tokens = tokenize(expr);

  const precedence = {
    '+': 1, '-': 1,
    '*': 2, '/': 2,
    '%': 2
  };

  tokens.forEach(token => {
    if (isNumber(token)) {
      output.push(parseFloat(token));
    } else if (token === '√') {
      operators.push(token);
    } else if (['+', '-', '*', '/', '%'].includes(token)) {
      while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
        output.push(operators.pop());
      }
      operators.push(token);
    } else if (token === '(') {
      operators.push(token);
    } else if (token === ')') {
      while (operators.length && operators[operators.length - 1] !== '(') {
        output.push(operators.pop());
      }
      operators.pop(); // Remove '('
    }
  });

  while (operators.length) {
    output.push(operators.pop());
  }

  const stack = [];
  output.forEach(token => {
    if (typeof token === 'number') {
      stack.push(token);
    } else if (token === '√') {
      stack.push(Math.sqrt(stack.pop()));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
        case '%': stack.push(a % b); break;
      }
    }
  });

  return stack[0];
}

function tokenize(expr) {
  return expr.match(/(\d+\.?\d*|\.\d+|[()+\-*/%√])/g);
}

function isNumber(str) {
  return !isNaN(str);
}
