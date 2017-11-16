// Here's a nice alternative:
// https://github.com/nathancahill/Split.js


this.jbeeb = this.jbeeb || {};
this.jbeeb.utils = this.jbeeb.utils || {};

/**

A layout splitter for web apps that need resizable panels.
 
DIVs can have the following data-atts:
- <strong>data-layout</strong>		(required) (string) - "row" "col"
- <strong>data-size</strong>			(optional) (number | string for percent) - assume pixel when number, use "!00%" for percent vals
- <strong>data-min</strong>			(optional) (number | string for percent)
- <strong>data-fixed</strong>		(optional) - attaches panel to current position (e.g. a fixed-size righ-hand panel)
- <strong>data-remember</strong>		(optional) - remembers panels open/closed/position when page is reloaded
- <strong>data-noresize</strong>		(optional) - prevents resizing when exists
- <strong>data-noscroll</strong>		(optional) - prevents scrolling when exists
- <strong>data-onresize</strong>		(optional) (string) - funciton identifier as a string (e.g. "myFunc")
- <strong>data-onresizecomplete</strong>	(optional) (string) - funciton identifier as a string (e.g. "myFunc")

<h4>Example</h4>
 
	<div data-layout="col">
		<div data-layout="row" data-size=100>frank</div>
		
		<!-- no size, layout will auto-determine the size -->
		<div data-layout="row">bob</div> 
		
		<!-- "fixed" = attached to bottom -->
		<div data-layout="row" data-size=100 data-fixed>sally</div>
	</div>

<h4>Notes</h4>
- There should be one "root" element, which can be either a "row" or "col".
- The parent of the root (e.g. <body> or wrapping <div>) must have a width and height (style or css). 
- Only div's with an ID attribute will be automatically restored.

@class Layout
@namespace jbeeb.utils

@return {object} - A handle to the layout object for initialization and access to built-in functions.

*/

this.jbeeb.utils.Layout = (function() {

    var toggleZone = 0; // pixels to buffer when toggleing closed so the splitter doesn't disappear

    var scrollbarSize;

    // Force html + body to be 100%
    // This is required so that we get the windows's actual dimensions!


    var mask;
    var splitter_size;
    var all;

    var cells = [];
    var rootList = [];

    var handleOnResizeTimeout;
    var handleOnResizeCompleteTimeout;


    var moveObj;
    var mouseStart;
    var startPos;

    var didMove = false;
    var amToggling = false;
    var resizeDone_timeout = null;
    var resizeDoneComplete_timeout = null;
    var STATIC_W = "w";
    var STATIC_H = "h";
    var STATIC_WIDTH = "width";
    var STATIC_HEIGHT = "height";
    var STATIC_TOP = "top";
    var STATIC_LEFT = "left";
    var STATIC_PX = "px";
    var LOCAL_STORAGE_PREFIX = "layoutRemember_"


    var doc;
    var bodyNode;
    var uuid = 0;

    /**
     * Initializes the page layout. This is called automatically via document.addEventListener("DOMContentLoaded", jbeeb.Layout.init)
     * @private 
     * @method init
     */
    function init() {

        doc = document;

        // Force html + body to be 100%
        // This is required so that we get the windows's actual dimensions!
        var htmlNode = doc.documentElement;
        htmlNode.style.width = "100%";
        htmlNode.style.height = "100%";

        bodyNode = doc.body;
        bodyNode.style.width = "100%";
        bodyNode.style.height = "100%";

        mask = doc.createElement("div");
        //mask.classList.add("layout-splitter-mask");

        var s = mask.style;
        s.position = "absolute";
        s.left = "0px";
        s.top = "0px";
        s.right = "0px";
        s.bottom = "0px";
        s.zIndex = 1001;
        //s.backgroundColor = "rgba(200, 0, 72, 0.09)";

        // Measure the splitter
        var temp = doc.createElement("div");
        temp.classList.add("layout-splitter-col");
        bodyNode.appendChild(temp);
        var splitterDims = temp.getBoundingClientRect();
        bodyNode.removeChild(temp);
        splitter_size = splitterDims.width;

        all = doc.querySelectorAll("[data-layout]");

        scrollbarSize = getScrollbarSize();

        // This is the big-boy
        var shouldReset = ripDoc();
        formatPanels();

        resizeThrottle.add(resize);

        if (shouldReset) {
            resetRemember();
        } else {
            restore();
        }

    }

    /**
     * Description
     * @private 
     * @method ripDoc
     */
    function ripDoc() {
        var shouldReset = false;
        for (var i = 0; i < all.length; i++) {
            var elem = all[i];

            elem.id = elem.id || "layout_uuid_" + (uuid++);

            if (!shouldReset) {
                shouldReset = datasetExistBool(elem, "reset");
            }

            var parent = elem.parentNode;

            // Walk until no layout to find root container.
            var container = parent;
            while (container.dataset.layout) {
                container = container.parentNode;
            }

            if (!shouldReset) {
                shouldReset = datasetExistBool(container, "reset");
            }

            var sibs = findSibs(elem);

            var numUnits = parseNumUnits(elem.dataset.size);
            var numUnitsMin = parseNumUnits(elem.dataset.min);


            var row = elem.dataset.layout == "row" ? true : false;

            var stylesComputed = elem.currentStyle || window.getComputedStyle(elem);
            var padding = {
                left: parseInt(stylesComputed.paddingLeft),
                right: parseInt(stylesComputed.paddingRight),
                top: parseInt(stylesComputed.paddingTop),
                bottom: parseInt(stylesComputed.paddingBottom)
            }


            var Estyle = elem.style;

            // Ensure we use box-sizing so padding and margins are calculated correctly
            // if the user puts extra styles onto the layout DIVs
            Estyle.boxSizing = Estyle.webkitBoxSizing = Estyle.mozBoxSizing = Estyle.oBoxSizing = Estyle.msBoxSizing = "border-box";



            var containerDims = container.getBoundingClientRect();


            if (numUnits.units == "%") {

                var pxVal = row ? containerDims.height : containerDims.width;
                numUnits.num = pxVal * (numUnits.num / 100);
            }



            var obj = {
                elem: elem,
                id: elem.id,
                first: !sibs.prev,
                last: !sibs.next,
                next: null,
                prev: null,
                nextElem: sibs.next,
                prevElem: sibs.prev,
                w: row ? null : numUnits.num,
                h: row ? numUnits.num : null
                    //, top : null
                    //, bottom : null
                    //, left : null
                    //, right : null
                    ,
                units: numUnits.units
                    //, defaultSize : defaultSize 
                    //, clickToggle : elem.dataset.clicktoggle !== "false"
                    ,
                clickToggle: !datasetExistBool(elem, "noclicktoggle"),
                fixed: datasetExistBool(elem, "fixed"),
                toggleState: false
                    //, openSize : 
                    ,
                parent: null,
                parentElem: parent,
                amRoot: (parent == container) ? true : false,
                row: row,
                children: null,
                rootElem: container,
                root: null,
                minSource: numUnitsMin.num,
                color: elem.dataset.color,
                remember: datasetExistBool(elem, "remember"),
                resizable: !datasetExistBool(elem, "noresize"),
                canScroll: !datasetExistBool(elem, "noscroll"),
                onResizeComplete: elem.dataset.onresizecomplete // always lower-cased
                    ,
                onResize: elem.dataset.onresize // always lower-cased
            };

            var cleanStr = new RegExp('[^A-Za-z0-1_\.]', "g");


            if (obj.onResizeComplete) {
                obj.onResizeComplete = obj.onResizeComplete.replace(cleanStr, "");
            }


            if (obj.onResize) {
                obj.onResize = obj.onResize.replace(cleanStr, "");
            }

            if (!obj.canScroll) {
                Estyle.overflow = "hidden";
            }

            if (obj.color) {
                Estyle.backgroundColor = obj.color;
            }

            // padding causes collapsing panles to revealfragments of content.
            //if(elem.dataset.pad){
            //	Estyle.padding = obj.pad + "px";
            //}


            obj.padding = padding;

            // Can't have a margin, screws everything up
            Estyle.margin = 0;

            if (obj.amRoot) {

                //var containerDims = container.getBoundingClientRect();
                rootList.push(obj);
                var w = containerDims.width;
                var h = containerDims.height;
                obj.w = w;
                obj.h = h;
                obj.parent = {
                    w: w,
                    h: h
                };

            }

            cells.push(obj);

            if (obj.onResizeComplete || obj.onResize) {
                //obj.elem.addEventListener("scroll", handleScroll);
            }

        }


        // Set links to next, prev, parent, children
        for (var i = 0; i < cells.length; i++) {
            var me = cells[i];
            for (var k = 0; k < cells.length; k++) {
                var obj = cells[k];
                if (obj.elem == me.nextElem) {
                    me.next = obj;
                }
                if (obj.elem == me.prevElem) {
                    me.prev = obj;
                }
                if (obj.parentElem == me.rootElem) {
                    me.root = obj;
                }
                if (obj.elem == me.parentElem) {
                    me.parent = obj;
                    if (!obj.children) {
                        obj.children = [];
                    }
                    obj.children.push(me);
                }
            }
        }

        return shouldReset;

    }


    /**
     * Description
     * @private 
     * @method datasetExistBool
     * @param {} elem
     * @param {} key
     * @return Literal
     */
    function datasetExistBool(elem, key) {
        var val = elem.dataset[key.toLowerCase()];

        if (typeof val != 'undefined') {
            if (val == 'false' || val === 0) {
                return false;
            } else {
                return true;
            }
        }

        return false;
    }

    /**
     * Description
     * @private 
     * @method getScrollbarSize
     * @return BinaryExpression
     */
    function getScrollbarSize() {
        var inner = doc.createElement('div');
        var s = inner.style;
        s.width = "100%";
        s.height = "200px";

        var outer = doc.createElement('div');
        s = outer.style;
        s.position = "absolute";
        s.top = 0;
        s.left = 0;
        s.visibility = "hidden";
        s.width = "200px";
        s.height = "150px";
        s.overflow = "hidden";
        outer.appendChild(inner);

        bodyNode.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2) {
            w2 = outer.clientWidth;
        }

        outer.removeChild(inner);
        bodyNode.removeChild(outer);

        inner = null;
        outer = null;

        return w1 - w2;
    }

    /**
     * Description
     * @private 
     * @method handleScroll
     * @param {Event} e
     */
    function handleScroll(e) {

        var obj = findObjFromElem(e.target);
        if (obj.handleOnResizeComplete) {
            handleOnResizeComplete(obj);
        }
        if (obj.handleOnResize) {
            handleOnResize(obj);
        }


    }


    /**
     * A callback triggered while a user changes the size of the panel.
     * Note that to establish this callback, we incorporate the function name as a string in the HTML, 
     * so it's not really a function per-se, rather it's a string that we convert to a function call. 
     *
     * The object (obj) returned is the internal object maintained for this panel and includes the following properties:
     * - __amRoot__ 	- (boolean) Whether or not this is the root panel.
     * - __canScroll__ 	- (boolean) 
     * - __children__ 	- (array) 
     * - __clickToggle__ - (um)
     * - __color__ 		- (um)
     * - __elem__ 		- (DOM Element) The panel's HTML DOM Element 
     * - __first__ 		- (boolean) If this is the first panel in a row or column
     * - __fixed__ 		- (boolean) If this panel is fixed position
     * - __h__ 			- (number) A shortcut to height
     * - __height__ 	- (number) The height
     * - __id__ 		- (string) Should be the same as the DOM Element id, or randomly generated if no ELEMENT id.
     * - __last__ 		- (boolean) If this is the last panel in a row or column
     * - __left__ 		- (number) The position (will be left or top depending on row or column)
     * - __top__ 		- (number) The position (will be left or top depending on row or column)
     * - __max__ 		- (number) The maximum size the panel can be
     * - __min__ 		- (number) The minimum size the panel can be
     * - __minSource__ 	- (number) The maximum size the panel can be as specified by user at startup
     * - __next__ 		- (object) The next object
     * - __nextElem__ 	- (DOM Element) The next object's element
     * - __onResize__ 	- 
     * - __onResizeComplete__ - 
     * - __padding__ 	- (number) 
     * - __parent__ 	- (object) The parent object (if this panel is embedded inside another panel).
     * - __parentElem__ - (DOM Element) The parent object's element.
     * - __prev__ 		- (object) The previous object
     * - __prevElem__ 	- (DOM Element) The previous object's element
     * - __remember__ 	- (boolean) 
     * - __resizeble__ 	- (boolean) 
     * - __root__ 		- (object) The root object
     * - __rootElem__ 	- (DOM Element) The root object's element
     * - __row__ 		- (boolean) Used to determine if this panel is a row or a column.
     * - __splitterElem__ - (DOM Element) 
     * - __splitterHandleELem__ - (DOM Element) 
     * - __toggleState__ - (boolean) 
     * - __units__ 		- (string) If using "px" or "%" units
     * - __w__ 			- (number) A shortcut to width
     * - __width__ 		- (number) The width
     * 
     * @event onResize
     * @private 
     * @method handleOnResize
     * @param {string} obj - The internal model used for the panel.
     */
    function handleOnResize(obj) {


        var fn = eval(obj.onResize);

        if (typeof fn == 'function') {

            obj.width = obj.w;
            obj.height = obj.h;

            if (handleOnResizeTimeout) {
                clearTimeout(handleOnResizeTimeout);
            }
            //handleOnResizeTimeout = setTimeout(fn + "()", 100);
            //handleOnResizeTimeout = setTimeout(fn + "(" + obj.w + "," + obj.h + "," + obj.elem.scrollLeft + "," + obj.elem.scrollTop + ")", 100);
            handleOnResizeTimeout = setTimeout(function() {
                return function() {
                    fn(obj);
                }
            }(), 100);
        }

    }

    /**
     * A callback that is pinged when a user completes changing the size of the panel.
     * Note that to establish this callback, we incorporate the function name as a string in the HTML, so it's not really a function per-se, rather it's a string that we convert to a function call. 
     * @event onResizeComplete
     * @private 
     * @method handleOnResizeComplete
     * @param {string} obj - The internal model used for the panel.
     */
    function handleOnResizeComplete(obj) {


        if (obj.onResizeComplete) {
            var fn = eval(obj.onResizeComplete);

            if (typeof fn == 'function') {

                obj.width = obj.w;
                obj.height = obj.h;

                if (handleOnResizeCompleteTimeout) {
                    clearTimeout(handleOnResizeCompleteTimeout);
                }
                //handleOnResizeTimeout = setTimeout(fn + "()", 100);
                //handleOnResizeTimeout = setTimeout(fn + "(" + obj.w + "," + obj.h + "," + obj.elem.scrollLeft + "," + obj.elem.scrollTop + ")", 100);
                handleOnResizeCompleteTimeout = setTimeout(function(Vobj) {
                    return function() {
                        fn(Vobj);
                    }
                }(obj), 100);
            }
        }




        /*
        var fn = obj.onResizeComplete;
		
		
        if(handleOnResizeCompleteTimeout){
        	clearTimeout(handleOnResizeCompleteTimeout);
        }
        obj.width = obj.w;
        obj.height = obj.h;

        handleOnResizeCompleteTimeout = setTimeout(fn + "(" + obj + ")", 100);
        //handleOnResizeCompleteTimeout = setTimeout(fn, 100);
        */

        /*
        handleOnResizeCompleteTimeout = setTimeout(function(Vfn, Vobj){
        	return function(){
        		eval(Vfn + "(" + Vobj + ")");
        	}
        }(fn, obj), 100);
        */



    }

     /**
     * Dispatched globally for any resize event.
     * 
     * 		function didResize(obj){
     * 			console.log("didResize");
     *  	}
     * 		beeb.utils.Layout.addListener("globalResize", this, didResize);
     *
     * 
     * @event globalResize
     */
    
     /**
     * Dispatched globally for any resize event.
     * 
     * 		function didResizeComplete(obj){
     * 			console.log("didResizeComplete");
     *  	}
     * 		beeb.utils.Layout.addListener("globalResizeComplete", this, didResizeComplete);
     *
     * 
     * @event globalResizeComplete
     */


    // 

    /**
     * Beginning at root, work way up and establish sizes
     * @private 
     * @method prepSizes
     * @param {} obj
     * @param {} fromResize
     */
    function prepSizes(obj, fromResize) {
        var kids = obj.children;
        if (kids) {
            var row = obj.row;
            var sum_w = 0;
            var sum_h = 0;
            var empty_w = [];
            var empty_h = [];
            for (var i = 0; i < kids.length; i++) {
                var kid = kids[i];
                var w = kid.w;
                if (w < 1) {
                    empty_w.push(kid);
                }
                sum_w += w || 0;

                var h = kid.h;
                if (h < 1) {
                    empty_h.push(kid);
                }
                sum_h += h || 0;
            }
            var diff_w = 0;
            var diff_h = 0;
            var to_w = obj.parent.w || 0;
            var to_h = obj.parent.h || 0;

            if (sum_w != to_w) {
                diff_w = to_w - sum_w;
            }

            if (sum_h != to_h) {
                diff_h = to_h - sum_h;
            }

            //var spread;

            // We're dealing with children, so if the obj is a row, we'll work on the columns within.
            if (obj.row) {


                // If sizes are larger than available space.
                if (diff_w < 0 || fromResize) {

                    // Try using the min values to see if it brings the diff above 0.

                    for (var i = 0; i < kids.length; i++) {
                        var obj = kids[i];
                        var min = obj.minSource;
                        if (min) {
                            obj.w = min;
                            diff_w += min;
                        }
                    }

                    // If still too much, reset to everything evenly distributed.
                    //
                    // Accept when we're reformatting a resize, in which case
                    // we'll make the last sibling shorter.
                    if (diff_w < 0) {

                        // Chop the last sib
                        if (fromResize) {

                            // Note that we use += because diff_h is negative
                            for (var i = 0; i < kids.length; i++) {
                                var obj = kids[i];
                                if (obj.last) {

                                    obj.w += diff_w;
                                }
                            }

                            // Distribute evenly
                        } else {

                            var spread = to_w / kids.length;
                            for (var i = 0; i < kids.length; i++) {
                                var obj = kids[i];
                                obj.w = spread; // spread is negative
                                var min = obj.minSource;
                                if (min) {
                                    obj.minSource = null;
                                }
                            }
                        }

                    }

                    // Distribute empty items evenly
                } else {

                    // Evenly size the empty cols with available space
                    var spread = diff_w / empty_w.length;
                    for (var i = 0; i < empty_w.length; i++) {
                        var obj = empty_w[i];


                        obj.w = spread;
                    }

                }

                // Make last item fill out to end if too short
                var sum = 0;
                var lastObj;
                for (var i = 0; i < kids.length; i++) {
                    var obj = kids[i];
                    sum += obj.w;
                    if (obj.last) {
                        lastObj = obj;
                    }
                }

                if (!lastObj) {
                    lastObj = obj;
                }

                // Why chrome not see when just one? (Firefox does)
                if (lastObj) {
                    // TODO: seems like we can just force this anyway
                    if (sum < to_w) {
                        lastObj.w += to_w - sum;
                    } else if (sum > to_w) {
                        lastObj.w += to_w - sum;
                    }
                }




            } else {

                // If sizes are larger than available space.
                if (diff_h < 0 || fromResize) {

                    // Try using the min values to see if it brings the diff above 0.
                    for (var i = 0; i < kids.length; i++) {
                        var obj = kids[i];
                        var min = obj.minSource;
                        if (min) {
                            obj.h = min;
                            diff_h += min;
                        }
                    }


                    // If still too much, reset to everything evenly distributed.
                    //
                    // Accept when we're reformatting a resize, in which case
                    // we'll make the last sibling shorter.
                    if (diff_h < 0) {

                        // Chop the last sib
                        if (fromResize) {

                            // Note that we use += because diff_h is negative
                            for (var i = 0; i < kids.length; i++) {
                                var obj = kids[i];
                                if (obj.last) {
                                    obj.h += diff_h;
                                }
                            }


                            // Distribute evenly
                        } else {

                            var spread = to_h / kids.length;
                            for (var i = 0; i < kids.length; i++) {
                                var obj = kids[i];
                                obj.h = spread; // spread is negative
                                var min = obj.minSource
                                if (min) {
                                    obj.minSource = null;
                                }
                            }

                        }

                    }

                    // Distribute empty items evenly
                } else {

                    var spread = diff_h / empty_h.length;
                    for (var i = 0; i < empty_h.length; i++) {
                        var obj = empty_h[i];
                        obj.h = spread;
                    }

                }

                // Make last item fill out to end if too short
                var sum = 0;
                var lastObj;
                for (var i = 0; i < kids.length; i++) {
                    var obj = kids[i];
                    sum += obj.h;
                    if (obj.last) {
                        lastObj = obj;
                    }
                }

                if (!lastObj) {
                    lastObj = obj;
                }

                // Why chrome not see when just one? (Firefox does)
                if (lastObj) {

                    // TODO: seems like we can just force this anyway
                    if (sum < to_h) {
                        lastObj.h += to_h - sum;
                    } else if (sum > to_h) {
                        lastObj.h += to_h - sum;
                    }
                }


            }


            for (var i = 0; i < kids.length; i++) {
                var kid = kids[i];
                prepSizes(kid, fromResize);
            }
        }

    }

    /**
     * Description
     * @private 
     * @method prepRoots
     * @param {} fromResize
     */
    function prepRoots(fromResize) {
        for (var i = 0; i < rootList.length; i++) {
            var obj = rootList[i];
            var rootElem = obj.elem;
            rootElem.style.overflow = "hidden";
            //addDomElemListenerWithArgs(rootElem, "resize", resize, obj);
            prepSizes(obj, fromResize);
        }
    }





    /**
     * Description
     * @private 
     * @method positionPanels
     */
    function positionPanels() {

        // Position panels and create splitters if needed
        for (var i = 0; i < cells.length; i++) {
            var obj = cells[i];
            var elem = obj.elem;
            //elem.classList.add("layout-base");

            // Used to establish a size to match root container dimensions
            var s = elem.style;
            s.position = "absolute";
            s.left = "0px";
            s.top = "0px";
            s.right = "0px";
            s.bottom = "0px";
            s.overflow = obj.canScroll ? "auto" : "hidden"; // hidden   auto
            //s.backgroundColor = "#fafafa";

            if (!obj.amRoot) {

                var row = obj.row;

                var top = 0;
                var bottom = 0;
                var right = 0;
                var left = 0;

                //var willSplit = (obj.prev && obj.next) ? true : false;
                var willSplit = (obj.next && obj.resizable) ? true : false;

                var offset = willSplit ? splitter_size : 0;
                if (row) {

                    var prev = obj.prev;
                    var wild = 0;
                    while (prev) {
                        top += prev.h;
                        prev = prev.prev;
                        wild++;
                        if (wild > 1000) {
                            break;
                        }
                    }

                    bottom = obj.parent.h - (top + obj.h);

                    obj.top = top;
                    obj.min = top + obj.minSource;
                    obj.max = top + obj.h;

                    elem.style.top = top + "px";
                    elem.style.height = obj.h + "px";

                } else {

                    var prev = obj.prev;
                    var wild = 0;
                    while (prev) {
                        left += prev.w;
                        prev = prev.prev;
                        wild++;
                        if (wild > 1000) {
                            break;
                        }
                    }

                    obj.left = left;
                    obj.min = left + obj.minSource;
                    obj.max = left + obj.w;

                    elem.style.left = left + "px";
                    elem.style.width = obj.w + "px";

                }

                if (obj.splitterElem) {

                    var splitter = obj.splitterElem;
                    if (row) {
                        splitter.style.top = obj.max - offset + "px";
                    } else {
                        splitter.style.left = obj.max - offset + "px";
                    }

                } else {

                    if (willSplit) {
                        var splitter = doc.createElement("div");
                        if (row) {
                            splitter.classList.add("layout-splitter-row");
                            splitter.style.top = obj.max - offset + "px";
                        } else {

                            splitter.classList.add("layout-splitter-col");
                            splitter.style.left = obj.max - offset + "px";
                        }

                        // still need the splitter?
                        // I think we still need the object because of the calculations.
                        //if(obj.resizable){
                        var splitterGrabber = doc.createElement("div");
                        if (row) {
                            splitterGrabber.classList.add("layout-splitter-line-row");
                            splitter.appendChild(splitterGrabber);
                        } else {
                            splitterGrabber.classList.add("layout-splitter-line-col");
                            splitter.appendChild(splitterGrabber);
                        }

                        if (obj.clickToggle && obj.resizable) {
                            var splitterHandle = doc.createElement("div");
                            if (row) {
                                splitterHandle.classList.add("layout-splitter-handle-row");
                                splitterHandle.classList.add("opened");
                                splitterGrabber.appendChild(splitterHandle);
                            } else {
                                splitterHandle.classList.add("layout-splitter-handle-col");
                                splitterHandle.classList.add("opened");
                                splitterGrabber.appendChild(splitterHandle);
                            }

                            obj.splitterHandleElem = splitterHandle;
                        }


                        addDomElemListenerWithArgs(splitterGrabber, "mousedown", mouse_down, obj);

                        //}


                        obj.parentElem.insertBefore(splitter, obj.nextElem);
                        obj.splitterElem = splitter;
                    }

                }

            }

        }

    }

    /**
     * Description
     * @private 
     * @method formatPanels
     * @param {} fromResize
     */
    function formatPanels(fromResize) {
        prepRoots(fromResize);
        positionPanels();
    }



    /**
     * Description
     * @private 
     * @method pauseEvent
     * @param {} e
     * @return Literal
     */
    function pauseEvent(e) {
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }



    /**
     * Description
     * @private 
     * @method mouse_down
     * @param {} e
     * @param {} obj
     */
    function mouse_down(e, obj) {

        //var elem = e.target;
        //if(elem != obj.elem){
        //	elem = elem.parentNode;
        //}

        didMove = false;
        pauseEvent(e);

        doc.addEventListener("mousemove", mouse_move);
        doc.addEventListener("mouseup", mouse_up);

        bodyNode.appendChild(mask);
        moveObj = obj;
        var splitterElemStyle = obj.splitterElem.style;
        if (obj.row) {
            mouseStart = e.clientY;
            startPos = parseFloat(splitterElemStyle.top);
        } else {
            mouseStart = e.clientX;
            startPos = parseFloat(splitterElemStyle.left);
        }

    }

    /**
     * Description
     * @private 
     * @method mouse_up
     * @param {} e
     */
    function mouse_up(e) {

        //pauseEvent(e);

        doc.removeEventListener("mousemove", mouse_move);
        doc.removeEventListener("mouseup", mouse_up);
        bodyNode.removeChild(mask);

        finishMove();

    }

    /**
     * Description
     * @private 
     * @method finishMove
     */
    function finishMove() {

        if (!didMove && moveObj.clickToggle) {
            prevState = moveObj.toggleState;
            moveObj.toggleState = !prevState;

            var px;

            if (prevState) {
                px = moveObj.toggleOriginalPx;

                moveObj.splitterHandleElem.classList.remove("closed");
                moveObj.splitterHandleElem.classList.add("opened");
            } else {
                var wOrH = moveObj.row ? "h" : "w";
                var prevPx = moveObj.prev ? moveObj.prev[wOrH] : 0;
                px = prevPx + toggleZone;
                // gotta keep it above 1. I don't know why, but it doesn't work otherwise. (Trust me I spent a good 2 hours roaming aroudn the jungle.)
                if (px < 2) {
                    px = 2;
                };
                moveObj.toggleOriginalPx = moveObj[wOrH] + prevPx;
                moveObj.splitterHandleElem.classList.remove("opened");
                moveObj.splitterHandleElem.classList.add("closed");
            }



            resizePanel(moveObj.elem, px);

        } else {


            if (moveObj.onResizeComplete) {
                handleOnResizeComplete(moveObj);
            }

            var next = moveObj.next;
            if (next) {
                if (next.onResizeComplete) {
                    handleOnResizeComplete(next);
                }
            }

            dispatch("globalResizeComplete", moveObj);

            didMove = false;
            amToggling = false;


            remember(moveObj);
        }

    }

    function expand(elem){
    	var obj = findObjFromElem(elem);
    	resizePanel(obj.prev.elem, 0);
    }

    /**
     * Description
     * @private 
     * @method findObjFromElem
     * @param {} elem
     * @return obj
     */
    function findObjFromElem(elem) {
        if (typeof elem == 'string') {
            elem = document.getElementById(elem);
        }

        var obj;

        for (var i = 0; i < cells.length; i++) {
            var me = cells[i];
            if (me.elem == elem) {
                obj = me;
                break;
            }
        }

        return obj;
    }

    /**
     * Manually (via javascript) resize a panel.
     * @private 
     * @method resizePanel
     * @param elem {DOMelement | DOMid} - The DOM element to resize (must be an existing layout DIV). Use the DIV's ID, otherwise send the actual DOM element.
     * @param size {number} - The pixel value to set the new size.
     */
    function resizePanel(elem, size) {

        size = parseFloat(size);

        var obj = findObjFromElem(elem);

        if (obj) {

            amToggling = true;

            moveObj = obj;
            startPos = 0;
            mouseStart = 0;

            mouse_move({
                clientX: size // do both since we're really only using one in mouse_move
                    ,
                clientY: size
            }, true)

            finishMove();
        }
    }

    /**
     * Manually scroll a panel.
     * 
     * @method scrollPanel
     * @private 
     * @param elem {DOMelement | DOMid} - The DOM element to resize (must be an existing layout DIV). Use the DIV's ID, otherwise send the actual DOM element.
     * @param x {nunmber} - The scroll x position to go to.
     * @param y {nunmber} - The scroll y position to go to.
     */
    function scrollPanel(elem, x, y) {

        var obj = findObjFromElem(elem);

        if (obj) {
            if (x !== null) {
                obj.elem.scrollLeft = parseInt(x);
            }

            if (y !== null) {
                obj.elem.scrollTop = parseInt(y);
            }
        }

    }

    /**
     * Description
     * 
     * @method mouse_move
     * @private 
     * @param {} e
     * @param {} manual
     */
    function mouse_move(e, manual) {

        //e.preventDefault();

        //pauseEvent(e);

        var clientPos = moveObj.row ? e.clientY : e.clientX;
        var diff = (mouseStart < clientPos) ? clientPos - mouseStart : -(mouseStart - clientPos);

        var pos = startPos + diff;


        if (Math.abs(diff) > 0) {
            didMove = true;
        }

        var suspend = false;
        var prevObj = moveObj.prev;
        if (prevObj) {

            if (prevObj.resizable && pos <= moveObj.min) {
                moveTo(prevObj, pos - splitter_size);
            }

            if (!prevObj.resizable && pos < prevObj.max) {
                suspend = true;
            }
        }

        if (!suspend) {

            var nextObj = moveObj.next;
            if (nextObj) {
                if (nextObj.resizable && pos > nextObj.max) {
                    moveTo(nextObj, pos + splitter_size);
                }

                if (!nextObj.resizable && pos > nextObj.max) {
                    suspend = true;
                }

            }


        }


        if (!suspend) {
            moveTo(moveObj, pos);
        }




    }


    //window.addEventListener("resize", resize);

    /*
    var containerDims = container.getBoundingClientRect();
    		rootList.push(obj);
    		var w = containerDims.width;
    		var h = containerDims.height;
    		*/

    // IMPORTANT: Body's css must be set to height : 100%


    /**
     * Description
     * @private 
     * @method resize
     */
    function resize() {

        for (var i = 0; i < rootList.length; i++) {
            var obj = rootList[i];
            var dims = obj.rootElem.getBoundingClientRect();
            var w = dims.width;
            var h = dims.height;

            var diff_w = w - obj.w;
            var diff_h = h - obj.h;

            if ((diff_w || diff_h)) {

                obj.parent.w = obj.w = w;
                obj.parent.h = obj.h = h;
                obj.elem.style.width = w + "px";
                obj.elem.style.height = h + "px";
                resizeLast(obj, diff_w, diff_h);
            }

        }

        // There's bug in that the 1st resize event is slightly delayed, 
        // causing the dimensions of the initial (very very first time only!)
        // to not report the actual dimensions of the window.
        //
        // My gut tells me that the even bubbling is in a phase that prevents 
        // obtaining the window dimensions. THe result is that there is a small gap
        // on the bottom and left (depending on browser -- for example firefox only
        // shows a gap at the bottom, while chrome shows a gap on the bottom and right).
        //
        // The gap is exactly the same size as the pixel difference for the first
        // event (e.g. diff_w/diff_h ).
        //
        // If you yank the window real fast, you'll get a larger gap. Things are sorta-kinda
        // OK when you go slower.
        if (resizeDone_timeout) {
            clearTimeout(resizeDone_timeout);
        }

        if (resizeDoneComplete_timeout) {
            clearTimeout(resizeDoneComplete_timeout);
        }

        resizeDone_timeout = setTimeout(function() {
            formatPanels(true);
            dispatch("globalResize");
        }, 300);

        resizeDoneComplete_timeout = setTimeout(function() {
        	formatPanels(true);
            dispatch("globalResizeComplete");
        }, 1000);


    }

    /**
     * Description
     * @method resizeLast
     * @private 
     * @param {} obj
     * @param {} diff_w
     * @param {} diff_h
     */
    function resizeLast(obj, diff_w, diff_h) {

        var kids = obj.children;
        for (var i = 0; i < kids.length; i++) {
            var kid = kids[i];
            if (kid.last) {

                // Assume when there are only one or 2 panels, that the last panel simply resizes, 
                // meaning that the first (or only) panel remains fixed and the second  panel grows.
                //
                // When there are > 2 panels, assume the last panel is fixed to the edge of the window 
                // and shrinks expands previous panels.
                //
                // So here we're seeing how many siblings there are
                var count = 0;
                var sib = kid;
                var wild = 0;
                while (sib.prev) {
                    count++;
                    sib = sib.prev;

                    wild++;
                    if (wild > 100) {
                        break;
                    }
                }

                var mover = (count > 1 || kid.fixed) ? kid.prev : kid;

                if (mover.row) {
                    moveTo(mover, mover.top + mover.h + diff_h, true);
                } else {
                    moveTo(mover, mover.left + mover.w + diff_w, true);
                }


            }

            if (kid.children) {
                resizeLast(kid, diff_w, diff_h)
            }
        }
    }


    /**
     * Description
     * @method moveTo
     * @private 
     * @param {} obj
     * @param {} pos
     * @param {} resizing
     */
    function moveTo(obj, pos, resizing) {

        var rootObj = obj.root;

        var amRow = obj.row

        if ( // pos >= obj.min &&
            //pos < nextCheckMin - splitter_size &&
            pos > obj.min && pos < (amRow ? rootObj.h : rootObj.w) - splitter_size && pos > splitter_size
        ) {

            var wh;
            var widthheight;
            var topleft;
            if (amRow) {

                wh = STATIC_H;
                widthheight = STATIC_HEIGHT;
                topleft = STATIC_TOP;


            } else {

                wh = STATIC_W;
                widthheight = STATIC_WIDTH;
                topleft = STATIC_LEFT;

            }

            // Splitter
            var splt = obj.splitterElem;
            if (splt) {
                splt.style[topleft] = pos + STATIC_PX;
            }

            // Move & resize obj
            var newSize = pos - obj[topleft];
            var diffSize = newSize - obj[wh];

            var killScrollbarsDiff = 0;
            if (newSize < scrollbarSize) {
                if (obj.canScroll && !obj.killedScroll) {

                    dealWithPadding(obj, true);

                    //obj.elem.style.overflow = "hidden";
                    obj.elem.style.display = "none";
                    obj.killedScroll = true;
                }
            } else {
                if (obj.canScroll && obj.killedScroll) {

                    dealWithPadding(obj);

                    //obj.elem.style.overflow = "auto";
                    obj.elem.style.display = "block";
                    obj.killedScroll = false;
                }
            }



            obj[wh] = newSize;
            // min stays as-is
            obj.max = pos;
            obj.elem.style[widthheight] = newSize + STATIC_PX;
            if (obj.onResize) {
                handleOnResize(obj);
            }

    		dispatch("globalResize", obj);

            // Move & resize NEXT obj
            var nextObj = obj.next;
            if (nextObj) {
                var nextStyle = nextObj.elem.style;
                nextObj[topleft] = pos;
                nextObj.min = pos + (nextObj.minSource || 0);
                nextStyle[topleft] = pos + splitter_size + STATIC_PX;

                var nextSize = nextObj[wh];

                // Leave NEXT width / height as-is when resizing window.
                if (!resizing) {
                    nextSize -= diffSize;
                }

                nextObj.max = pos + nextSize;
                nextObj[wh] = nextSize;
                nextStyle[widthheight] = nextSize + STATIC_PX;

                if (nextObj.onResize) {
                    handleOnResize(nextObj);
                }


            }


        }


    }

    /**
     * Description
     * 
     * @method dealWithPadding
     * @private 
     * @param {} obj
     * @param {} remove
     */
    function dealWithPadding(obj, remove) {



        var p = obj.padding;
        var s = obj.elem.style;

        if (remove) {

            var hasPadding = 0;

            if (p.left) {
                s.paddingLeft = 0;
                hasPadding = 1;
            }

            if (p.right) {
                s.paddingRight = 0;
                hasPadding = 1;
            }

            if (p.top) {
                s.paddingTop = 0;
                hasPadding = 1;
            }

            if (p.bottom) {
                s.paddingBottom = 0;
                hasPadding = 1;
            }

            obj.hasPadding = hasPadding;

        } else {

            var px = "px";

            var val = p.left;
            if (val) {
                s.paddingLeft = val + px;
                hasPadding = 1;
            }

            val = p.right;
            if (val) {
                s.paddingRight = val + px;
                hasPadding = 1;
            }

            val = p.top;
            if (val) {
                s.paddingTop = val + px;
                hasPadding = 1;
            }

            val = p.bottom;
            if (val) {
                s.paddingBottom = val + px;
                hasPadding = 1;
            }

        }




    }


    /**
     * Description
     * 
     * @method addDomElemListenerWithArgs
     * @private 
     * @param {} elem
     * @param {} evt
     * @param {} func
     * @param {} vars
     * @return f
     */
    function addDomElemListenerWithArgs(elem, evt, func, vars) {
        var f = (function(ff, vv) {
            return (function(e) {
                ff(e, vv);
            });
        }(func, vars));

        elem.addEventListener(evt, f);

        return f;
    }

    /**
     * Description
     * 
     * @method parseNumUnits
     * @private 
     * @param {} val
     * @return ObjectExpression
     */
    function parseNumUnits(val) {
        return {
            num: parseFloat(val) || 0,
            units: ("" + (val ? val : "")).match(/\%/) ? "%" : "px"
        }
    }

    /**
     * Description
     * 
     * @method findSibs
     * @private 
     * @param {} elem
     * @return ret
     */
    function findSibs(elem) {
        var prev = elem.previousSibling;
        var next = elem.nextSibling;

        var ret = { prev: null, next: null };
        if (prev) {

            while (prev.nodeType != 1) {
                prev = prev.previousSibling;
                if (!prev) {
                    prev = null;
                    break;
                }
            }
            ret.prev = prev;
        }

        if (next) {
            while (next.nodeType != 1) {
                next = next.nextSibling;
                if (!next) {
                    next = null;
                    break;
                }
            }
            ret.next = next;
        }


        return ret;
    }


    /**
     * Description
     * 
     * @method remember
     * @private 
     * @param {} obj
     */
    function remember(obj) {
        if (obj.remember) {
            localStorage[LOCAL_STORAGE_PREFIX + obj.id] = obj.row ? obj.h : obj.w;
        }
    }

    var ls_re = new RegExp("^" + LOCAL_STORAGE_PREFIX);

    /**
     * Description
     * 
     * @method restore
     * @private 
     */
    function restore() {
        for (var prop in localStorage) {
            if (prop.match(ls_re)) {
                var id = prop.replace(ls_re, "");
                var size = localStorage[prop];
                // todo: on vertical, some resizes are null???

                var num = Number(size);
                if (size !== null && typeof size != 'undefined' && size == num && num > 0.001) {
                    resizePanel(id, size);
                }
            }
        }
    }

    function resetRemember() {
        for (var prop in localStorage) {
            if (prop.match(ls_re)) {
                localStorage[prop] = null;
            }
        }
    }



    /**
     * resize throttle
     * ===============
     *
     * Throttles window resizing to prevent hogging CPU cycles.
     *
     * Auto initializes itself and acts as a module / class.
     * 
     * @module  resizeThrottle
     * @constructor
     * @see https://developer.mozilla.org/en-US/docs/Web/Events/resize
     */

    var resizeThrottle = (function() {

        var callbacks = [],
            running = false;


        /**
         * fired on resize event
         * 
         * @method resize
         * @private 
         */
        function resize() {

            if (!running) {
                running = true;

                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(runCallbacks);
                } else {
                    setTimeout(runCallbacks, 66);
                }
            }

        }


        /**
         * run the actual callbacks
         * @method runCallbacks
         * @private 
         */
        function runCallbacks() {

            callbacks.forEach(function(callback) {
                callback();
            });

            running = false;
        }


        /**
         * adds callback to loop
         * 
         * @method addCallback
         * @private 
         * @param {} callback
         */
        function addCallback(callback) {

            if (callback) {
                callbacks.push(callback);
            }

        }


        return {

            /**
             * public method to add additional callback
             * @method add
             * @private 
             * @param {} callback
             */
            add: function(callback) {
                if (!callbacks.length) {
                    window.addEventListener('resize', resize);
                }
                addCallback(callback);
            }
        }
    }());



    // Micro listener
    var listeners = {};

    function addListener(evt, callback, bind) {
        var lst = listeners[evt];
        if (!lst) {
            lst = listeners[evt] = [];
        }
        lst.push([bind ? this : bind, callback]);
    };

    function dispatch(evt, params) {
        var lst = listeners[evt];
        if (lst) {
            for (var i = lst.length; i--;) {
                lst[i][1].call(lst[i][0], evt, params);
            }
        }
    };

    function removeListener(evt, callback) {
        var lst = listeners[evt];
        if (lst) {
            for (var i = lst.length; i--;) {
                if (lst[i][1] == callback) {
                    lst.splice(i, 1);
                }
            }
        }
    }


    return {
        init: init,
        resizePanel: resizePanel,
        scrollPanel: scrollPanel,
        addListener : addListener,
        removeListener : removeListener,
        expand : expand
    }

}());




document.addEventListener("DOMContentLoaded", jbeeb.utils.Layout.init);
