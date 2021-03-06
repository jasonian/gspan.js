"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (cache, timestamp) => {
  var ret = [];
  cache.forEach((val, i) => {
    if (!timestamp) {
      ret.push(val.r);
    } else if (val.t >= parseInt(timestamp)) {
      ret.push(val.r);
    }
  });
  return ret.join(' ');
};