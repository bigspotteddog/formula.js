var error = require('../lib/error');
var _ = require('./limited-lodash');

exports.argsToArray = function(args) {
  return Array.prototype.slice.call(args, 0);
};

exports.numbers = function() {
  var possibleNumbers = _.flatten(arguments);
  possibleNumbers.forEach(function (value, index) {
    if (value instanceof Date) {
      possibleNumbers[index] = exports.serialDate(value);
    }
  });
  return possibleNumbers.filter(function(el) {
    return typeof el === 'number';
  });
};

exports.cleanFloat = function(number) {
  var power = 1e14;
  return Math.round(number * power) / power;
};

exports.parseBool = function(bool) {
  if (typeof bool === 'boolean') {
    return bool;
  }

  if (bool instanceof Error) {
    return bool;
  }

  if (typeof bool === 'number') {
    if (bool === 0) {
      return false;
    } else {
      return true;
    }
  }

  if (typeof bool === 'string') {
    var up = bool.toUpperCase();
    if (up === 'TRUE') {
      return true;
    }

    if (up === 'FALSE') {
      return false;
    }
  }

  if (bool instanceof Date && !isNaN(bool)) {
    return true;
  }

  return error.value;
};

exports.parseNumber = function(string) {
  if (string instanceof Error) {
    return string;
  }
  if (string === undefined || string === null || string === '') {
    return error.value;
  }
  if (!isNaN(string)) {
    return parseFloat(string);
  } else {
    // var test = parseInt(string, 16);
    // if (!isNaN(test)) {
    //   return test;
    // }
  }
  return error.value;
};

exports.parseNumberArray = function(arr) {
  var len;
  if (!arr || (len = arr.length) === 0) {
    return error.value;
  }
  var parsed;
  while (len--) {
    parsed = exports.parseNumber(arr[len]);
    if (parsed === error.value) {
      return parsed;
    }
    arr[len] = parsed;
  }
  return arr;
};

exports.parseMatrix = function(matrix) {
  var n;
  if (!matrix || (n = matrix.length) === 0) {
    return error.value;
  }
  var pnarr;
  for (var i = 0; i < matrix.length; i++) {
    pnarr = exports.parseNumberArray(matrix[i]);
    matrix[i] = pnarr;
    if (pnarr instanceof Error) {
      return pnarr;
    }
  }
  return matrix;
};

var d1900 = new Date(1900, 0, 1);
exports.parseDate = function(date) {
  if (!isNaN(date)) {
    if (date instanceof Date) {
      return new Date(date);
    }
    var d = parseInt(date, 10);
    if (d < 0) {
      return error.num;
    }
    if (d <= 60) {
      return new Date(d1900.getTime() + (d - 1) * 86400000);
    }
    return new Date(d1900.getTime() + (d - 2) * 86400000);
  }
  if (typeof date === 'string') {
    date = new Date(date);
    if (!isNaN(date)) {
      return date;
    }
  }
  return error.value;
};

exports.parseDateArray = function(arr) {
  var len = arr.length;
  var parsed;
  while (len--) {
    parsed = exports.parseDate(arr[len]);
    if (parsed === error.value) {
      return parsed;
    }
    arr[len] = parsed;
  }
  return arr;
};

var d1900 = new Date(1900, 0, 1);
exports.serialDate = function (date) {
  if (date <= -2203891200000) {
    return (date - d1900) / 86400000 + 1;
  }
  return (date - d1900) / 86400000 + 2;
}

exports.anyIsError = function() {
  var n = arguments.length;
  while (n--) {
    if (arguments[n] instanceof Error) {
      return true;
    }
  }
  return false;
};

exports.arrayValuesToNumbers = function(arr) {
  var n = arr.length;
  var el;
  var numbers = [];
  while (n--) {
    el = arr[n];
    if (el === null) {
      arr.splice(n, 1);
    }
    if (typeof el === 'number') {
      continue;
    }
    if (el === true) {
      arr[n] = 1;
      continue;
    }
    if (el === false) {
      arr[n] = 0;
      continue;
    }
    if (typeof el === 'string') {
      var number = exports.parseNumber(el);
      if (number instanceof Error) {
        arr[n] = 0;
      } else {
        arr[n] = number;
      }
    }
  }
  return arr;
};
