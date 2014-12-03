function ChardinJs(el) {
    var _this = this;

    this.$el = el;  // el is already a selected node
    this.isOpened = false;

    this.startEvent = new CustomEvent('ChardinJs:start');
    this.endEvent = new CustomEvent('ChardinJs:stop');

    window.onresize = function(e) {
        return _this.refresh();
    };

    return this;
}

ChardinJs.prototype.utils = {
    classy: {
        hasClass: function (ele, cls) {
            return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },
        addClass: function (ele, cls) {
            if (!this.hasClass(ele, cls)) ele.className += " " + cls;
        },
        removeClass: function (ele, cls) {
            if (this.hasClass(ele, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                ele.className = ele.className.replace(reg, ' ');
            }
        }
    },
    removeElementsByClass: function(className){
        var elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    },
    removeClassesByClass: function(className, removeClass){
        var elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            this.classy.removeClass(elements[0],removeClass);
        }
    }
};

ChardinJs.prototype.start = function() {
    var el, _i, _len, _ref;

    if (this._overlay_visible()) {
        return false;
    }
    this._add_overlay_layer();
    _ref = this.$el.querySelectorAll('[data-intro]');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        this._show_element(el);
    }

    this.isOpened = true;

    return document.dispatchEvent(this.startEvent); // Send event
};

ChardinJs.prototype.toggle = function() {
    if (!this._overlay_visible()) {
        return this.start();
    } else {
        return this.stop();
    }
};

ChardinJs.prototype.refresh = function() {
    var el, _i, _len, _ref, _results;

    if (this._overlay_visible()) {
        _ref = this.$el.querySelectorAll('[data-intro]');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            el = _ref[_i];
            _results.push(this._position_helper_layer(el));
        }
        return _results;
    } else {
        return this;
    }
};

ChardinJs.prototype.stop = function() {
    this.utils.removeElementsByClass('chardinjs-overlay');
    this.utils.removeElementsByClass('chardinjs-helper-layer');

    this.utils.removeClassesByClass('chardinjs-show-element','chardinjs-show-element');
    this.utils.removeClassesByClass('chardinjs-relative-position','chardinjs-relative-position');

    if (window.removeEventListener) {
        window.removeEventListener("keydown", this._onKeyDown, true);
    } else {
        if (document.detachEvent) {
            document.detachEvent("onkeydown", this._onKeyDown);
        }
    }
    this.isOpened = false;
    return document.dispatchEvent(this.endEvent); // Send event
};

ChardinJs.prototype._overlay_visible = function() {
    return this.$el.getElementsByClassName('chardinjs-overlay').length !== 0;
};

ChardinJs.prototype._add_overlay_layer = function() {
    var element_position, overlay_layer, styleText,
        _this = this;

    if (this._overlay_visible()) {
        return false;
    }
    overlay_layer = document.createElement("div");
    styleText = "";
    overlay_layer.className = "chardinjs-overlay";
    if (this.$el.nodeName.toUpperCase() === "BODY") {
        styleText += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;";
        overlay_layer.setAttribute("style", styleText);
    } else {
        element_position = this._get_offset(this.$el);
        if (element_position) {
            styleText += "width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px;left: " + element_position.left + "px;";
            overlay_layer.setAttribute("style", styleText);
        }
    }
    this.$el.appendChild(overlay_layer);
    overlay_layer.onclick = function() {
        return _this.stop();
    };
    return setTimeout(function() {
        styleText += "opacity: .8;opacity: .8;-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';filter: alpha(opacity=80);";
        return overlay_layer.setAttribute("style", styleText);
    }, 10);
};

ChardinJs.prototype._get_position = function(element) {
    return element.getAttribute('data-position') || 'bottom';
};

ChardinJs.prototype._place_tooltip = function(element) {
    var my_height, my_width, target_element_position, target_height, target_width, tooltip_layer, tooltip_layer_position;

    tooltip_layer = document.getElementById(element.dataset.tooltipLayer);
    tooltip_layer_position = this._get_offset(tooltip_layer);
    tooltip_layer.style.top = null;
    tooltip_layer.style.right = null;
    tooltip_layer.style.bottom = null;
    tooltip_layer.style.left = null;
    switch (this._get_position(element)) {
        case "top":
        case "bottom":
            target_element_position = this._get_offset(element);
            target_width = target_element_position.width;
            my_width = tooltip_layer.offsetWidth;
            tooltip_layer.style.left = "" + ((target_width / 2) - (tooltip_layer_position.width / 2)) + "px";
            break;
        case "left":
        case "right":
            target_element_position = this._get_offset(element);
            target_height = target_element_position.height;
            my_height = tooltip_layer.offsetHeight;
            tooltip_layer.style.top = "" + ((target_height / 2) - (tooltip_layer_position.height / 2)) + "px";
    }
    switch (this._get_position(element)) {
        case "left":
            return tooltip_layer.style.left = "-" + (tooltip_layer_position.width - 34) + "px";
        case "right":
            return tooltip_layer.style.right = "-" + (tooltip_layer_position.width - 34) + "px";
        case "bottom":
            return tooltip_layer.style.bottom = "-" + tooltip_layer_position.height + "px";
        case "top":
            return tooltip_layer.style.top = "-" + tooltip_layer_position.height + "px";
    }
};

ChardinJs.prototype._position_helper_layer = function(element) {
    var element_position, helper_layer;

    helper_layer = document.getElementById(element.dataset.helperLayer);
    element_position = this._get_offset(element);
    return helper_layer.setAttribute("style", "width: " + element_position.width + "px; height:" + element_position.height + "px; top:" + element_position.top + "px; left: " + element_position.left + "px;");
};

ChardinJs.prototype._show_element = function(element) {
    var current_element_position, element_position, helper_layer, tooltip_layer;

    element_position = this._get_offset(element);
    helper_layer = document.createElement("div");
    helper_layer.id = 'helper_'+(new Date().getTime());
    tooltip_layer = document.createElement("div");
    tooltip_layer.id = 'tooltip_'+(new Date().getTime());
    element.dataset.helperLayer = helper_layer.id;
    element.dataset.tooltipLayer = tooltip_layer.id;
    if (element.id) {
        helper_layer.setAttribute("data-id", element.id);
    }
    helper_layer.className = "chardinjs-helper-layer chardinjs-" + (this._get_position(element));
    this.$el.appendChild(helper_layer);
    this._position_helper_layer(element);
    tooltip_layer.className = "chardinjs-tooltip chardinjs-" + (this._get_position(element));
    tooltip_layer.innerHTML = "<div class='chardinjs-tooltiptext'>" + (element.getAttribute('data-intro')) + "</div>";
    helper_layer.appendChild(tooltip_layer);
    this._place_tooltip(element);
    element.className += " chardinjs-show-element";
    current_element_position = "";
    if (element.currentStyle) {
        current_element_position = element.currentStyle["position"];
    } else {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            current_element_position = document.defaultView.getComputedStyle(element, null).getPropertyValue("position");
        }
    }
    current_element_position = current_element_position.toLowerCase();
    if (current_element_position !== "absolute" && current_element_position !== "relative") {
        return element.className += " chardinjs-relative-position";
    }
};

ChardinJs.prototype._get_offset = function(element) {
    var element_position, _x, _y;

    element_position = {
        width: element.offsetWidth,
        height: element.offsetHeight
    };
    _x = 0;
    _y = 0;
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
        _x += element.offsetLeft;
        _y += element.offsetTop;
        element = element.offsetParent;
    }
    element_position.top = _y;
    element_position.left = _x;
    return element_position;
};
