"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async function (doc, limit, fillBackup = false, backupName = 'transcript.txt', verbose = false) {
  const cache = [];

  if (fillBackup) {
    let backup = null;

    try {
      backup = _fs2.default.readFileSync(backupName, 'utf8');
      const d = new Date();
      d.setDate(d.getDate() - 100);
      const text = (0, _format2.default)(backup);
      (0, _writeToDoc2.default)(docsAPI, doc, text);
    } catch (e) {
      console.error(e);
    }
  }

  const backupStream = _fs2.default.createWriteStream(backupName, {
    flags: 'a'
  });

  return new Promise(resolve => {
    const socket = _socket2.default.connect('https://openedcaptions.com:443');

    let iter = 0;
    let endedInPeriod = false;
    socket.on('content', data => {
      if (data.data.body === '\r\n') {
        return;
      }

      const dat = data.data.body;
      (0, _backupCache2.default)(backupStream, ` ${dat}`, backupName);

      if (verbose) {
        console.log(Date.now(), dat);
      }

      let formatted = (0, _format2.default)(dat);

      if (endedInPeriod) {
        formatted = formatted.replace(/(\w)/, (a, b) => b.toUpperCase());
      }

      cache.push(formatted);

      if (formatted.match(/\.\s*$/)) {
        endedInPeriod = true;
      } else {
        endedInPeriod = false;
      }

      iter++;

      if (limit && iter === limit) {
        resolve();
        socket.disconnect();
      }
    });
    setInterval(() => {
      const text = (0, _getCache2.default)(cache);
      (0, _writeToDoc2.default)(docsAPI, doc, text);
    }, 2500);
  });
};

var _socket = require("socket.io-client");

var _socket2 = _interopRequireDefault(_socket);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _interactiveBin = require("@politico/interactive-bin");

var _format = require("./utils/format");

var _format2 = _interopRequireDefault(_format);

var _backupCache = require("./utils/backupCache");

var _backupCache2 = _interopRequireDefault(_backupCache);

var _writeToDoc = require("./utils/writeToDoc");

var _writeToDoc2 = _interopRequireDefault(_writeToDoc);

var _getCache = require("./utils/getCache");

var _getCache2 = _interopRequireDefault(_getCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const docsAPI = new _interactiveBin.google.Docs();
;