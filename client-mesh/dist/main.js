"use strict";

var _popupComponent = _interopRequireDefault(require("../components/popup-component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.initMash = function () {
  new _popupComponent["default"](document.getElementById('mesh-popup-component'));
};