"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = undefined;

var _format = require("./format");

var _getWordsSince = require("./getWordsSince");

var _getWordsSince2 = _interopRequireDefault(_getWordsSince);

var _socket = require("socket.io-client");

var _socket2 = _interopRequireDefault(_socket);

var _cleanCache = require("./cleanCache");

var _cleanCache2 = _interopRequireDefault(_cleanCache);

var _interactiveBin = require("@politico/interactive-bin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const docsAPI = new _interactiveBin.google.Docs();

const start = exports.start = (doc, cache, callback, limit = null, timestamp = Date.now(), iteration = 0) => {
  const text = (0, _format.formatTranscript)((0, _format.formatText)((0, _getWordsSince2.default)(cache, timestamp)));

  if (text.length === 1) {
    if (/^<.*>:.*$/.test(text[0])) {
      docsAPI.append(doc, `\n\n${text[0]}`);
    } else {
      docsAPI.append(doc, ` ${text[0]}`);
    }
  } else if (text.length > 1) {
    docsAPI.append(doc, ` ${text.join('\n\n')}`);
  }

  const newTimestamp = Date.now();

  if (iteration !== limit) {
    setTimeout(() => {
      start(doc, cache, callback, limit, newTimestamp, iteration + 1);
    }, 2500);
  } else {
    callback();
  }
};

exports.default = (doc, limit) => {
  // Where we stash our stuff
  const cache = []; // Setup a cache buster so our cache doesn't use all the memory

  const cacheCheckInterval = 5 * 60 * 1000; // 5 mins -> microseconds

  setInterval(() => {
    (0, _cleanCache2.default)(cache);
  }, cacheCheckInterval);

  const socket = _socket2.default.connect('https://openedcaptions.com:443');

  socket.on('content', data => {
    if (data.data.body === '\r\n') {
      return;
    }

    const dat = {
      t: Date.now(),
      r: data.data.body
    }; // console.log(dat.t, dat.r);

    cache.push(dat);
  });
  return new Promise(resolve => {
    const callback = () => {
      socket.disconnect();
      resolve(cache);
    };

    start(doc, cache, callback, limit);
  });
};