//  Copyright (C) 2011 Matsukei Co.,Ltd.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

goog.provide('thin.Font');

goog.require('goog.array');
goog.require('thin.platform.Font');


/**
 * @param {string} family
 * @param {string=} opt_name
 * @constructor
 */
thin.Font = function(family, opt_name) {
  /**
   * @type {string}
   * @private
   */
  this.family_ = family;

  /**
   * @type {string}
   * @private
   */
  this.name_ = opt_name || family;
};


/**
 * @type {Array.<thin.Font>}
 * @private
 */
thin.Font.builtinFontRegistry_ = [];


/**
 * @type {thin.Font}
 * @private
 */
thin.Font.defaultFont_;


/**
 * @param {string} family
 * @param {string=} opt_name
 * @return {thin.Font}
 */
thin.Font.register = function(family, opt_name) {
  var font = new thin.Font(family, opt_name || family);
  thin.Font.builtinFontRegistry_.push(font);
  return font;
};


thin.Font.init = function() {
  var font = thin.Font;

  font.defaultFont_ = font.register('Helvetica', null, true);

  font.register('Courier New');
  font.register('Times New Roman');
  font.register('IPAMincho', 'IPA ' + thin.t('font_mincho'));
  font.register('IPAPMincho', 'IPA P' + thin.t('font_mincho'));
  font.register('IPAGothic', 'IPA ' + thin.t('font_gothic'));
  font.register('IPAPGothic', 'IPA P' + thin.t('font_gothic'));
};


/**
 * @return {string}
 */
thin.Font.getDefaultFontFamily = function() {
  return thin.Font.defaultFont_.getFamily();
};


/**
 * @return {Array.<thin.Font>}
 */
thin.Font.getBuiltinFonts = function() {
  return thin.Font.builtinFontRegistry_;
};


/**
 * @param {string} family
 * @return {boolean}
 */
thin.Font.isRegistered = function (family) {
  var detected = thin.Font.findFontByFamily(family);
  return detected !== null;
};


/**
 * @param {string} family
 * @return {thin.Font?}
 */
thin.Font.findFontByFamily = function (family) {
  return goog.array.find(thin.Font.fontRegistry_,
    function (font) {
      return font.getFamily() == family;
    });
};


/**
 * @type {Object.<Object>}
 * @private
 */
thin.Font.infoRegistry_ = {
  ascent: {},
  height: {}
};


/**
 * @param {...*} var_args
 * @return {string}
 * @private
 */
thin.Font.generateRegistryKey_ = function(var_args) {
  return goog.array.clone(arguments).join(':');
};


/**
 * @param {string} family
 * @param {number} fontSize
 * @param {boolean} isBold
 * @return {number}
 */
thin.Font.getAscent = function(family, fontSize, isBold) {
  var registryKey = thin.Font.generateRegistryKey_(family, fontSize, isBold);
  var ascent = thin.Font.infoRegistry_.ascent[registryKey];
  if (!goog.isDef(ascent)) {
    ascent = thin.platform.Font.getAscent(family, fontSize, isBold);
    thin.Font.infoRegistry_.ascent[registryKey] = ascent;
  }
  return ascent;
};


/**
 * @param {string} family
 * @param {number} fontSize
 * @return {number}
 */
thin.Font.getHeight = function(family, fontSize) {
  var registryKey = thin.Font.generateRegistryKey_(family, fontSize);
  var height = thin.Font.infoRegistry_.height[registryKey];
  if (!goog.isDef(height)) {
    height = thin.platform.Font.getHeight(family, fontSize);
    thin.Font.infoRegistry_.height[registryKey] = height;
  }
  return height;
};


/**
 * @return {string}
 */
thin.Font.prototype.getFamily = function() {
  return this.family_;
};


/**
 * @return {string}
 */
thin.Font.prototype.getName = function() {
  return this.name_;
};
