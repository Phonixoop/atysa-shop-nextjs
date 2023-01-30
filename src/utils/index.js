export function jsonify(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getPathName(path) {
  return path?.substring(path.lastIndexOf("/") + 1);
}

export function intersection() {
  var result = [];
  var lists;

  if (arguments.length === 1) {
    lists = arguments[0];
  } else {
    lists = arguments;
  }

  for (var i = 0; i < lists.length; i++) {
    var currentList = lists[i];
    for (var y = 0; y < currentList.length; y++) {
      var currentValue = currentList[y];
      if (result.indexOf(currentValue) === -1) {
        var existsInAll = true;
        for (var x = 0; x < lists.length; x++) {
          if (lists[x].indexOf(currentValue) === -1) {
            existsInAll = false;
            break;
          }
        }
        if (existsInAll) {
          result.push(currentValue);
        }
      }
    }
  }
  return result;
}

export function removeHalfSpace(value) {
  const str = value.split("");
  str.forEach((item, index) => {
    const charCode = item.charCodeAt(0);
    if (charCode === 32 || charCode === 8204) {
      str[index] = " ";
    }
  });

  value = str.join("");
  if (value === "چهارشنبه") return "چهار شنبه";
  if (value === "دوشنبه") return "دو شنبه";
  return value;
}

export function fixPersianWeekDayName(value) {
  const removedHalfSpaceValue = removeHalfSpace(value);
  if (removedHalfSpaceValue === "چهارشنبه") return "چهار شنبه";
  if (removedHalfSpaceValue === "دوشنبه") return "دو شنبه";
  return removedHalfSpaceValue;
}

export const getRangeWithGap = (start, end, step = 1) => {
  let output = [];
  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }
  for (let i = start; i <= end; i += step) {
    output.push(i);
  }
  return output;
};

export const getRangeNumbers = (start, end) =>
  Array.from({ length: end + 1 - start }, (v, k) => k + start);

export function getAverage(array) {
  return array.reduce((a, b) => a + b) / array.length;
}
// function intersection(x, y) {
//   x.sort();
//   y.sort();
//   let i = 0;
//   let j = 0;
//   let ret = [];
//   while (i < x.length && j < y.length) {
//     if (x[i] < y[j]) i++;
//     else if (y[j] < x[i]) j++;
//     else {
//       ret.push(x[i]);
//       i++, j++;
//     }
//   }
//   return ret;
// }
