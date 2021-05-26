/**
 * @license
 * Copyright 2011 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Object representing a trash can icon.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.PositionableTest');

/**
 * Class for a trash can.
 * @param {!Blockly.WorkspaceSvg} workspace The workspace to sit in.
 * @constructor
 * @implements {Blockly.IDeleteArea}
 * @implements {Blockly.IPositionable}
 */
Blockly.PositionableTest = function(workspace) {
    this.HEIGHT_ = 100;
    this.MARGIN_BOTTOM_ = 10;
    this.WIDTH_ = 100;
    this.MARGIN_SIDE_ = 10;

};

/**
 * Create the trash can elements.
 * @return {!SVGElement} The trash can's SVG group.
 */
Blockly.PositionableTest.prototype.createDom = function() {
  this.svgGroup_ = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.Rect,
      {
        'class': 'something',
        'rx': 10, 'ry': 10,
        'width': '100px',
        'height': '100px',
        'stroke': 'red',
      }, null);
    this.verticalSpacing_ = this.MARGIN_BOTTOM_;
  return this.svgGroup_;
};

/**
 * Position the trashcan.
 * It is positioned in the opposite corner to the corner the
 * categories/toolbox starts at.
 * @param {!Blockly.MetricsManager.ContainerRegion} viewMetrics The workspace
 *     viewMetrics.
 * @param {!Blockly.MetricsManager.AbsoluteMetrics} absoluteMetrics The absolute
 *     metrics for the workspace.
 * @param {!Blockly.MetricsManager.ToolboxMetrics} toolboxMetrics The toolbox
 *     metrics for the workspace.
 * @param {!Array<Blockly.utils.Rect>} savedPositions List of rectangles that
 *     are already on the workspace.
 */
Blockly.PositionableTest.prototype.position = function(
    viewMetrics, absoluteMetrics, toolboxMetrics, savedPositions) {
  // Not yet initialized.
  if (!this.verticalSpacing_) {
    return;
  }
  if (toolboxMetrics.position == Blockly.TOOLBOX_AT_LEFT ||
      (this.workspace_.horizontalLayout && !this.workspace_.RTL)) {
    // Toolbox starts in the left corner.
    this.left_ = viewMetrics.width + absoluteMetrics.left -
        this.WIDTH_ - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;
  } else {
    // Toolbox starts in the right corner.
    this.left_ = this.MARGIN_SIDE_ + Blockly.Scrollbar.scrollbarThickness;
  }

  // Upper corner placement
  var minTop = this.top_ = this.verticalSpacing_;
  // Bottom corner placement
  var maxTop = viewMetrics.height + absoluteMetrics.top -
      this.HEIGHT_ - this.verticalSpacing_;
  var placeBottom = toolboxMetrics.position !== Blockly.TOOLBOX_AT_BOTTOM;
  this.top_ = placeBottom ? maxTop : minTop;
  if (placeBottom) {
    this.zoomInGroup_.setAttribute('transform', 'translate(0, 43)');
    this.zoomOutGroup_.setAttribute('transform', 'translate(0, 77)');
  } else {
    this.zoomInGroup_.setAttribute('transform', 'translate(0, 34)');
    if (this.zoomResetGroup_) {
      this.zoomResetGroup_.setAttribute('transform', 'translate(0, 77)');
    }
  }

  // Check for collision and bump if needed.
  var boundingRect = this.getBoundingRectangle();
  for (var i = 0, otherEl; (otherEl = savedPositions[i]); i++) {
    if (boundingRect.intersects(otherEl)) {
      if (placeBottom) {
        // Bump up
        this.top_ = otherEl.top - this.HEIGHT_ - this.MARGIN_BOTTOM_;
      } else {
        this.top_ = otherEl.bottom + this.MARGIN_BOTTOM_;
      }
      // Recheck other savedPositions
      boundingRect = this.getBoundingRectangle();
      i = -1;
    }
  }
  // Clamp top value within valid range.
  this.top_ = Blockly.utils.math.clamp(minTop, this.top_, maxTop);

  this.svgGroup_.setAttribute('transform',
      'translate(' + this.left_ + ',' + this.top_ + ')');
};

/**
 * Returns the bounding rectangle of the UI element in pixel units relative to
 * the Blockly injection div.
 * @returns {Blockly.utils.Rect} The plugin’s bounding box.
 */
Blockly.PositionableTest.prototype.getBoundingRectangle = function() {
  var bottom = this.top_ + this.BODY_HEIGHT_;
  var right = this.left_ + this.WIDTH_;
  return new Blockly.utils.Rect(this.top_, bottom, this.left_, right);
};
