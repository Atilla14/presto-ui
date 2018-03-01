/*
 * Copyright (c) 2012-2017 "JUSPAY Technologies"
 * JUSPAY Technologies Pvt. Ltd. [https://www.juspay.in]
 *
 * This file is part of JUSPAY Platform.
 *
 * JUSPAY Platform is free software: you can redistribute it and/or modify
 * it for only educational purposes under the terms of the GNU Affero General
 * Public License (GNU AGPL) as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 * For Enterprise/Commerical licenses, contact <info@juspay.in>.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  The end user will
 * be liable for all damages without limitation, which is caused by the
 * ABUSE of the LICENSED SOFTWARE and shall INDEMNIFY JUSPAY for such
 * damages, claims, cost, including reasonable attorney fee claimed on Juspay.
 * The end user has NO right to claim any indemnification based on its use
 * of Licensed Software. See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/agpl.html>.
 */

var Render = require("./Render");

module.exports = {
  getScreenDimensions: function () {
    let element = document.getElementById("content");
    return JSON.stringify({
      width: element.offsetWidth,
      height: element.offsetHeight
    });
  },

  runInUI: function (cmd) {
    if (typeof cmd == "string")
      return;

    Render.runInUI(cmd);
  },

  Render: function (view, cb) {
    var parentElement = document.getElementById("content");
    let parentView = {
      type: "linearLayout",
      props: {
        "h": parentElement.clientHeight,
        "w": parentElement.clientWidth,
      },
      children: [view]
    };

    Render.computeChildDimens(parentView);
    Render.inflateView(view, parentElement);
    if (cb)
      window.callUICallback(cb);
  },

  addViewToParent: function (id, view, index, cb, replace) {
    var parent = document.getElementById(id);
    var props = window.__VIEWS[id].props;
    var type = parent.className;
    var iterableChildNodes = Array.prototype.slice.call(parent.children);
    let parentView = window.__VIEWS[id];

    if (replace) {
      parentView.children = [];
      iterableChildNodes.forEach((each) => {
        each.remove();
      });
    }

    parentView.children.splice(index, 0, view);
    if (parentView.type == "relativeLayout") {
      const children = parentView.children;
      parentView.children = [view];
      Render.computeChildDimens(parentView);
      parentView.children = children;
    } else {
      Render.computeChildDimens(parentView);
    }

    if (parentView.type === "linearLayout")
      parentView.children.forEach(child => {
        Render.inflateView(child, parent);
      });
    else
      Render.inflateView(view, parent);

    if (cb)
      window.callUICallback(cb);
  },

  removeView: function (id) {
    let viewElem = document.getElementById(id);
    let parentid = viewElem.parentNode.id;
    let parentElem = document.getElementById(parentid);
    let view = window.__VIEWS[id];
    let parent = window.__VIEWS[parentid];
    let idx = parent.children.indexOf(view);

    parent.children.splice(idx, 1);
    viewElem.remove();

    Render.computeChildDimens(parent);
    if (parent.type === "linearLayout")
      parent.children.forEach(child => {
        Render.inflateView(child, parentElem);
      });
  },

  removeChildren: function (id) {
    let viewElem = document.getElementById(id);
    let view = window.__VIEWS[id];

    while(viewElem.firstChild) {
      viewElem.firstChild.remove();
    }

    view.children = [];
  }
};