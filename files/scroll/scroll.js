/***********************
    SCROLLBAR CREATION
************************/
// Global variables
var scrollEngaged = false;
var scrollInterval;
var scrollBars = new Array();

// Utility to retrieve effective style property
function getElementStyle(elemID, IEStyleAttr, CSSStyleAttr) {
    var elem = document.getElementById(elemID);
    if (elem.currentStyle) {
        return elem.currentStyle[IEStyleAttr];
    } else if (window.getComputedStyle) {
        var compStyle = window.getComputedStyle(elem, "");
        return compStyle.getPropertyValue(CSSStyleAttr);
    }
    return "";
}

// Scrollbar constructor function
function scrollBar(rootID, ownerID, ownerContentID, scrollBorderColor ) {
    this.rootID = rootID;
    this.ownerID = ownerID;
    this.ownerContentID = ownerContentID;
    this.index = scrollBars.length;
	this.BorderColor = scrollBorderColor;

    // one-time evaluations for use by other scroll bar manipulations  
    this.rootElem = document.getElementById(rootID);
    this.ownerElem = document.getElementById(ownerID);
    this.contentElem = document.getElementById(ownerContentID);
    this.ownerHeight = parseInt(getElementStyle(ownerID, "height", "height"));
    this.ownerWidth = parseInt(getElementStyle(ownerID, "width", "width"));
    this.ownerBorder = parseInt(getElementStyle(ownerID, "borderTopWidth", 
        "border-top-width")) * 2;
    this.contentHeight = Math.abs(parseInt(this.contentElem.style.top));
    this.contentWidth = this.contentElem.offsetWidth;
    this.contentFontSize = parseInt(getElementStyle(this.ownerContentID, 
        "fontSize", "font-size"));
    this.contentScrollHeight = this.contentElem.scrollHeight;

    // create quirks object whose default (CSS-compatible) values
    // are zero; pertinent values for quirks mode filled in later  
    this.quirks = {on:false, ownerBorder:0, scrollBorder:0, contentPadding:0};
    if (navigator.appName == "Microsoft Internet Explorer" && 
        navigator.userAgent.indexOf("Win") != -1 && 
        (typeof document.compatMode == "undefined" || 
        document.compatMode == "BackCompat")) {
        this.quirks.on = true;
        this.quirks.ownerBorder = this.ownerBorder;
        this.quirks.contentPadding = parseInt(getElementStyle(ownerContentID, 
        "padding", "padding"));
     }

    // determined at scrollbar initialization time
    this.scrollWrapper = null;
    this.upButton = null;
    this.dnButton = null;
    this.thumb = null;
    this.buttonLength = 0;
    this.thumbLength = 0;
    this.scrollWrapperLength = 0
    this.dragZone = {left:0, top:0, right:0, bottom:0}

    // build a physical scrollbar for the root div  
    this.appendScroll = appendScrollBar;
}

// Create scrollbar elements and append to the "pseudo-window"
function appendScrollBar() {
    // button and thumb image sizes (programmer customizable)
    var imgH = 9;
    var imgW = 9;
    var thumbH = 20;

    // "up" arrow, needed first to help size scrollWrapper
    var lineup = document.createElement("img");
    lineup.id = "lineup" + (scrollBars.length - 1);
    lineup.className = "lineup";
    lineup.index = this.index;
    lineup.src = "img/scroll/btn-up.gif";
    lineup.height = imgH;
    lineup.width = imgW;
    lineup.alt = "Scroll Up";
    lineup.style.position = "absolute";
    lineup.style.top = "0px";
    lineup.style.left = "0px";
    lineup.style.border = "1px solid " + this.BorderColor;
    

    // scrollWrapper defines "page" region color and 3-D borders
    var wrapper = document.createElement("div");
    wrapper.id = "scrollWrapper" + (scrollBars.length - 1);
    wrapper.className = "scrollWrapper";
    wrapper.index = this.index;
    wrapper.style.position = "absolute";
    wrapper.style.visibility = "hidden";
    wrapper.style.top = "0px";
    wrapper.style.left = this.ownerWidth + this.ownerBorder - this.quirks.ownerBorder + "px";    
    if (this.quirks.on) {
        this.quirks.scrollBorder = 2;
    }
    wrapper.style.width = lineup.width + (this.quirks.scrollBorder * 2) + "px";
    wrapper.style.height = this.ownerHeight + (this.ownerBorder - 4) - 
        (this.quirks.scrollBorder * 2) + "px";
    //wrapper.style.border = "1px solid #CEB35A";

    // "down" arrow
    var linedn = document.createElement("img");
    linedn.id = "linedown" + (scrollBars.length - 1);
    linedn.className = "linedown";
    linedn.index = this.index;
    linedn.src = "img/scroll/btn-dn.gif";
    linedn.height = imgH;
    linedn.width = imgW;
    linedn.alt = "Scroll Down";
    linedn.style.position = "absolute";
    linedn.style.top = parseInt(this.ownerHeight) + (this.ownerBorder - 4) - 
        (this.quirks.ownerBorder) - linedn.height + "px";
    linedn.style.left = "0px";
    linedn.style.border = "1px solid " + this.BorderColor;

    // fixed-size draggable thumb 
    var thumb = document.createElement("img");
    thumb.id = "thumb" + (scrollBars.length - 1);
    thumb.index = this.index;
    thumb.src = "img/scroll/track.gif";
    thumb.height = thumbH;
    thumb.width = imgW;
    thumb.alt = "Scroll Dragger";
    thumb.style.position = "absolute";
    thumb.style.top = lineup.height + "px";
    thumb.style.width = imgW + "px";
    thumb.style.height = thumbH + "px";
    thumb.style.left = "0px";
    thumb.style.border = "1px solid " + this.BorderColor;

    // fill in scrollBar object properties from rendered elements
    this.upButton = wrapper.appendChild(lineup);
    this.thumb = wrapper.appendChild(thumb);
    this.dnButton = wrapper.appendChild(linedn);
    this.scrollWrapper = this.rootElem.appendChild(wrapper);
    this.buttonLength = imgH;
    this.thumbLength = thumbH;
    this.scrollWrapperLength = parseInt(getElementStyle(this.scrollWrapper.id, 
        "height", "height"));
    this.dragZone.left = 0;
    this.dragZone.top = this.buttonLength;
    this.dragZone.right = this.buttonLength;
    this.dragZone.bottom = this.scrollWrapperLength - this.buttonLength - 
        (this.quirks.scrollBorder * 2)

    // all events processed by scrollWrapper element
    this.scrollWrapper.onmousedown = handleScrollClick;
    this.scrollWrapper.onmouseup = handleScrollStop;
    this.scrollWrapper.oncontextmenu = blockEvent;
    this.scrollWrapper.ondrag = blockEvent;

    // OK to show
    this.scrollWrapper.style.visibility = "visible";
}

/***************************
    EVENT HANDLER FUNCTIONS
****************************/
// onmouse up handler
function handleScrollStop() {
    scrollEngaged = false;
}

// Prevent Mac context menu while holding down mouse button
function blockEvent(evt) {
    evt = (evt) ? evt : event;
    evt.cancelBubble = true;
    return false;
}

// click event handler
function handleScrollClick(evt) {
    var fontSize, contentHeight;
    evt = (evt) ? evt : event;
    var target = (evt.target) ? evt.target : evt.srcElement;
    target = (target.nodeType == 3) ? target.parentNode : target;
    var index = target.index;
    fontSize = scrollBars[index].contentFontSize;
    switch (target.className) {
        case "lineup" :
            scrollEngaged = true;
            scrollBy(index, parseInt(fontSize));
            scrollInterval = setInterval("scrollBy(" + index + ", " + 
                parseInt(fontSize) + ")", 100);
            evt.cancelBubble = true;
            return false;
            break;
        case "linedown" :
            scrollEngaged = true;
            scrollBy(index, -(parseInt(fontSize)));
            scrollInterval = setInterval("scrollBy(" + index + ", -" + 
                parseInt(fontSize) + ")", 100);
            evt.cancelBubble = true;
            return false;
            break;
        case "scrollWrapper" :
            scrollEngaged = true;
            var evtY = (evt.offsetY) ? evt.offsetY : ((evt.layerY) ? evt.layerY : -1);
            if (evtY >= 0) {
                var pageSize = scrollBars[index].ownerHeight - fontSize;
                var thumbElemStyle = scrollBars[index].thumb.style;
                // set value negative to push document upward
                if (evtY > (parseInt(thumbElemStyle.top) + 
                    scrollBars[index].thumbLength)) {
                    pageSize = -pageSize;
                }
                scrollBy(index, pageSize);
                scrollInterval = setInterval("scrollBy(" + index + ", " + 
                    pageSize + ")", 100);
                evt.cancelBubble = true;
                return false;
            }
    }
    return false;
}

// Activate scroll of inner content
function scrollBy(index, px) {
    var scroller = scrollBars[index];
    var elem = document.getElementById(scroller.ownerContentID);
    var top = parseInt(elem.style.top);
    var scrollHeight = parseInt(elem.scrollHeight);
    var height = scroller.ownerHeight;
    if (scrollEngaged && top + px >= -scrollHeight + height && top + px <= 0) {
        shiftBy(elem, 0, px);
        updateThumb(index);
    } else if (top + px < -scrollHeight + height) {
        shiftTo(elem, 0, -scrollHeight + height - scroller.quirks.contentPadding);
        updateThumb(index);
        clearInterval(scrollInterval);
    } else if (top + px > 0) {
        shiftTo(elem, 0, 0);
        updateThumb(index);
        clearInterval(scrollInterval);
    } else {
        clearInterval(scrollInterval);
    }
}

/**********************
    SCROLLBAR TRACKING
***********************/
// Position thumb after scrolling by arrow/page region
function updateThumb(index) {
    var scroll = scrollBars[index];
    var barLength = scroll.scrollWrapperLength - (scroll.quirks.scrollBorder * 2);
    var buttonLength = scroll.buttonLength;
    barLength -= buttonLength * 2;
    var docElem = scroll.contentElem;
    var docTop = Math.abs(parseInt(docElem.style.top));
    var scrollFactor = docTop/(scroll.contentScrollHeight - scroll.ownerHeight);
    shiftTo(scroll.thumb, 0, Math.round((barLength - scroll.thumbLength) * 
        scrollFactor) + buttonLength);
}

// Position content per thumb location
function updateScroll() {
    var index = selectedObj.index;
    var scroller = scrollBars[index];
    
    var barLength = scroller.scrollWrapperLength - (scroller.quirks.scrollBorder * 2);
    var buttonLength = scroller.buttonLength;
    var thumbLength = scroller.thumbLength;
    var wellTop = buttonLength;
    var wellBottom = barLength - buttonLength - thumbLength;
    var wellSize = wellBottom - wellTop;
    var thumbTop = parseInt(getElementStyle(scroller.thumb.id, "top", "top"));
    var scrollFactor = (thumbTop - buttonLength)/wellSize;
    var docElem = scroller.contentElem;
    var docTop = Math.abs(parseInt(docElem.style.top));
    var scrollHeight = scroller.contentScrollHeight;
    var height = scroller.ownerHeight;   
    shiftTo(scroller.ownerContentID, 0, -(Math.round((scrollHeight - height) * 
        scrollFactor)));
}
/*******************
   ELEMENT DRAGGING
********************/
// Global holds reference to selected element
var selectedObj;
// Globals hold location of click relative to element
var offsetX, offsetY;
var zone = {left:0, top:16, right:16, bottom:88};

// Set global reference to element being engaged and dragged
function setSelectedElem(evt) {
    var target = (evt.target) ? evt.target : evt.srcElement;
    target = (target.nodeType && target.nodeType == 3) ? target.parentNode : target;
    var divID = (target.id.indexOf("thumb") != -1) ? target.id : "";
    if (divID) {
        if (document.layers) {
            selectedObj = document.layers[divID];
        } else if (document.all) {
            selectedObj = document.all(divID);
        } else if (document.getElementById) {
            selectedObj = document.getElementById(divID);
        }
        setZIndex(selectedObj, 100);
        return;
    }
    selectedObj = null;
    return;
}

// Drag thumb only within scrollbar region
function dragIt(evt) {
    evt = (evt) ? evt : event;
    var x, y, width, height;
    if (selectedObj) {
        if (evt.pageX) {
            x = evt.pageX - offsetX;
            y = evt.pageY - offsetY;
        } else if (evt.clientX || evt.clientY) {
            x = evt.clientX - offsetX;
            y = evt.clientY - offsetY;
        }
        var index = selectedObj.index;        
        var scroller = scrollBars[index];
        var zone = scroller.dragZone;
        width = scroller.thumb.width;
        height = scroller.thumb.height;
        x = (x < zone.left) ? zone.left : ((x + width > zone.right) ? zone.right - width : x);
        y = (y < zone.top) ? zone.top : ((y + height > zone.bottom) ? zone.bottom - height : y);
        shiftTo(selectedObj, x, y);
        updateScroll();
        evt.cancelBubble = true;
        return false;
    }
}

// Turn selected element on and set cursor offsets
function engage(evt) {
    evt = (evt) ? evt : event;
    setSelectedElem(evt);
    if (selectedObj) {
        if (document.body && document.body.setCapture) {
            // engage event capture in IE/Win
            document.body.setCapture();
        }
        if (evt.pageX) {
            offsetX = evt.pageX - ((typeof selectedObj.offsetLeft != "undefined") ? 
                      selectedObj.offsetLeft : selectedObj.left);
            offsetY = evt.pageY - ((selectedObj.offsetTop) ? 
                      selectedObj.offsetTop : selectedObj.top);
        } else if (typeof evt.clientX != "undefined") {
            offsetX = evt.clientX - ((selectedObj.offsetLeft) ? 
                      selectedObj.offsetLeft : 0);
            offsetY = evt.clientY - ((selectedObj.offsetTop) ? 
                      selectedObj.offsetTop : 0);
        }
        return false;
    }
}

// Turn selected element off
function release(evt) {
    if (selectedObj) {
        setZIndex(selectedObj, 0);
        if (document.body && document.body.releaseCapture) {
            // stop event capture in IE/Win
            document.body.releaseCapture();
        }
        selectedObj = null;
    }
}

// Assign event handlers used by both Navigator and IE
function initDrag() {
    if (document.layers) {
        // turn on event capture for these events in NN4 event model
        document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
        return;
    } else if (document.body & document.body.addEventListener) {
        // turn on event capture for these events in W3C DOM event model
      document.addEventListener("mousedown", engage, true);
      document.addEventListener("mousemove", dragIt, true);
      document.addEventListener("mouseup", release, true);
      return;
    }
    document.onmousedown = engage;
     document.onmousemove = dragIt;
     document.onmouseup = release;
    return;
}
