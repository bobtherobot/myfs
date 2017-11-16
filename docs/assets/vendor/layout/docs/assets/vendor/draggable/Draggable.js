


this.documon = this.documon || {};

(function() {
	"use strict";


/**
 * Makes a DOM Element draggable. NOTE: This is a stand-alone implementation. The jbeeb.utils.Draggable class is used for jbeeb objects. Whereas this class can be used on any DOM element (outside of jbeeb).
 * 
 * @class Draggable
 * @param {Object} params - Configuration settings.
 * @param {string | DOM Element} params.target		- The element to move. String = the ID of the element, or send in the DOM element directly.
 * @param {function} params.callback				- A function to ping for each kind of operation. See (callback)[#callback] for details.			
 * @param {string} params.constrain					- Constrain movement along the "x" or "y" axis. Both constrain and constrainRect can be used together or independantly.
 * @param {Object} params.constrainRect				- Constrain movement within a rectangle. The rectangle can be any object (including a DisplayObject) that contains the following properties `x, y, width, height`
 * @param {number} params.threshold=5				- The pixel threshold for issuing the "didMove" flag on "end"
 * @param {any} params.arg							- A custom argument to be delivered to the (callback)[#callback].
 * 
 * @example
 * 
		var myDrag = new documon.Draggable({
			  target	: obj 
			, callback	: fn
			, constrain	: "x"
			, constrainRect	: obj
			, threshold : 5
		});
 */
var Draggable = function(params) {
  this.init(params);
}

    /**
     * Shortcut to set the style position.
     * @private 
     * @method setX
     * @param {DOM Element} evt - The element to move.
     * @param {number} val - The x position in pixels.
     */
    function setX(elem, val){
    	elem.style.left = val + "px";
    }

    /**
     * Shortcut to set the style position.
     * @private 
     * @method setY
     * @param {DOM Element} evt - The element to move.
     * @param {number} val - The y position in pixels.
     */
    function setY(elem, val){
    	elem.style.top = val + "px";
    }

    /**
     * Shortcut to set the style position.
     * @private 
     * @method setXY
     * @param {DOM Element} evt - The element to move.
     * @param {number} x - The x position in pixels.
     * @param {number} x - The y position in pixels.
     */
    function setXY(elem, x, y){
    	var s = elem.style;
    	s.left = x + "px";
    	s.top = y + "px";
    }

     /**
     * Gets the CSS position (releative) of a DOM Element.
     * @private 
     * @method parsePos
     * @param {DOM Element} elem - The element
     */
    function parsePos(elem){
    	/*
    	var ret = {};
    	// getComputedStyle  getBoundingClientRect
    	var pos = window.getComputedStyle(elem);
    	var childPos = obj.offset();
		var parentPos = obj.parent().offset();
		var childOffset = {
		    top: childPos.top - parentPos.top,
		    left: childPos.left - parentPos.left
		}
    	for(var prop in pos){
    		ret[prop] = parseFloat(pos[prop]);
    	}
		*/
	
		/*
    	return {
    		left : elem.offsetLeft,
    		top : elem.offsetTop
    	};
    	*/
    
    	var pos = window.getComputedStyle(elem);
    	return {
    		left : parseFloat(pos.left),
    		top : parseFloat(pos.top)
    	};
    }


var p = Draggable.prototype;

	/**
	 * @private
     * @property {DOM Element} _target - The object we're going to drag.
     */
    p._target = null;

	/**
	 * @private
    * @property {function} _callback - Configured callback
    */
    p._callback = null;

    /**
	 * @private
    * @property {function} _callbackArg - Configured argument to send to the (callback)[#callback].
    */
    p._callbackArg = null;

    /**
	 * @private
    * @property {object} _constrain
    */
    p._constrain = null;

    /**
	 * @private
    * @property {object} _constrainRect
    */
    p._constrainRect = null;

    /**
	 * @private
    * @property {object} _startX
    */

	p._startX = null;

    /**
	 * @private
    * @property {object} _startY
    */
	p._startY = null;

    /**
	 * @private
    * @property {object} _startMouseX
    */

	p._startMouseX = null;

    /**
	 * @private
    * @property {object} _startMouseY
    */
	p._startMouseY = null;

    /**
	 * @private
    * @property {object} _didMove
    */

	p._didMove = null;

    /**
	 * @private
    * @property {object} _didMoveFudge
    */
	p._didMoveFudge = null;

    /**
	 * @private
    * @property {object} _didInitMove
    */
	p._didInitMove = false;

    /**
	 * @private
    * @property {function} _didMoveThreshold=5 - The pixel threshold for issuing the "didMove" flag on "end"
    */
	p._didMoveThreshold = 5;

    /**
	 * @private
    * @property {object} _down_bound
    */

	p._down_bound;

    /**
	 * @private
    * @property {object} _up_bound
    */
	p._up_bound;

    /**
	 * @private
    * @property {object} _move_bound
    */
	p._move_bound;

	/**
	 * @private
    * @property {DOM Element} _mask - The overlay masking object used to reject mouse events on underlaying DOM elements.
    */
    p._mask;
    

    /**
     * Initialize
     * @protected 
     * @method init
     * @param {object} params - See main class description for details.
     */
    p.init = function(params){
	
        this._target = params.target;

        this._down_bound = this._down.bind(this);
        this._up_bound = this._up.bind(this);
        this._move_bound = this._move.bind(this);
        this._target.addEventListener("mousedown", this._down_bound, false);

        if(params.callback){
            this._callback = params.callback;
            this._callbackArg = params.arg;
        }
        this._constrain = params.constrain;
        this._constrainRect = params.constrainRect;
        this._didMoveThreshold = typeof params.threshold != "undefined" ? params.threshold : 5;
    }

    /**
     * The function to ping when an operation occurs.
     * @method callback
     * @protected
     * @param {object} obj - The internal object we use to manage the 
     * @param {object} pos - An object with the following properties: left, top
     * @param {string} kind - The kind of operation that occured. Can be "start" | "end" | "move"
     * @param {boolean} didmove - Indicates if the item was simply clicked, or if it was dragged. Only issued when event == "end"
     * @param {any} arg - The argument that was defined during initialization.
     */





    /**
     * The mouse "down" listener function
     * @private 
     * @method _down
     * @param {MouseEvent} evt
     */
    p._down = function(evt){
    	
    	evt.preventDefault();
    	this._didMove = false;
    	this._didInitMove = false;

    	document.addEventListener("mouseup", this._up_bound, false);
        document.addEventListener("mousemove", this._move_bound, false);

    }

     /**
     * A one-time setup to extablish the starting position and create the (mask)[#maks].
     * @private 
     * @method _initMove
     * @param {MouseEvent} evt - Transfered from teh "move" listener.
     */
    p._initMove = function(evt){

    	var elem = this._target;

    	var pos = parsePos(elem);

    	elem.style.zIndex = 1000;

    	//elem.style.left = pos.left + "px";
    	//elem.style.top = pos.top + "px";

    	this._startX = pos.left;
    	this._startY = pos.top;

    	this._startMouseX = evt.pageX;
    	this._startMouseY = evt.pageY;

    	var mask = document.createElement("div");
    	var s = mask.style;
    	s.position = "absolute";
    	s.left = 0;
    	s.right = 0;
    	s.top = 0;
    	s.bottom = 0;
    	s.zIndex = 10000;
    	//s.backgroundColor = "rgba(255,0,0,0.1)";
    	document.body.appendChild(mask);
    	this._mask = mask;
        
        if(this._callback){
            this._callback(elem, pos, "start", false, this._callbackArg);
        }
    }

    /**
     * The mouse "move" listener function
     * @private 
     * @method _move
     * @param {MouseEvent} evt
     */
    p._move = function(evt){
		evt.preventDefault();

		if( ! this._didInitMove ){
			this._didInitMove = true;
			this._initMove(evt);
		}
		

    	var elem = this._target; //evt.target;

    	var diffX = evt.pageX - this._startMouseX;
    	var diffY = evt.pageY - this._startMouseY;

    	var newX = this._startX + diffX;
    	var newY = this._startY + diffY;

    	if( ! this._didMove ){
    		this._didMove = Math.abs(diffX) > this._didMoveThreshold || Math.abs(diffY) > this._didMoveThreshold;
    	}

    	var rect = this._constrainRect;
    	if(rect){
    		

			var rX = rect.x;
			var rY = rect.y;
			var rMax;
			if(newX < rX){
				newX = rX
			} else if(newX > (rMax = rX + rect.width) ){
				newX = rMax;
			}
			if(newY < rY){
				newY = rY
			} else if(newY > (rMax = rY + rect.height) ){
				newY = rMax;
			}


    	}

        var strain = this._constrain;
        if(strain){
            if(strain == "x"){
                setX(elem, newX);
            } else {
                setY(elem, newY);
            }
        } else {
            setXY(elem, newX, newY);
        }

        var pos = {
        	top : newY,
        	left : newX,
        	x : newX,
        	y : newY
        }
        
        if(this._callback){
            this._callback(elem, pos, "move", true, this._callbackArg);
        }
    }



    /**
     * The mouse "up" listener function
     * @private 
     * @method _up
     * @param {MouseEvent} evt
     */
    p._up = function(evt){

    	document.removeEventListener("mousemove", this._move_bound);
	    document.removeEventListener("mouseup", this._up_bound);

    	if(this._mask){
	    	var elem = this._target; //e.target;

	    	var pos = parsePos(elem);
	    	// getComputedStyle  getBoundingClientRect
	    	
    		document.body.removeChild(this._mask);
    		this._mask = null;
	    	
	    	
	        
	        if(this._callback){
	            this._callback(elem, pos, "end", this._didMove, this._callbackArg);
	        }
        }
    }

    /**
     * Sets the rectangle used to for the boundaries that the item can move within.
     * @method setConstrainRect
     * @param {Object} val - An object containing the following properties: `x, y, width, height`. Use "null" or no argument to clear contstraint.
     */
    p.setConstrainRect = function(rect){
    	this._constrainRect = rect;
    }

    /**
     * Causes the movement to be contrained along the X or Y axis.
     * @method setConstrain
     * @param {string} val - Use "x" or "y". Use "null" or no argument to clear contstraint.
     */
    p.setConstrain = function(val){
    	this._constrain = val;
    }

    /**
     * Destroys and removes listeners.
     * @method destroy
     */
    p.destroy = function(){

        this._target.removeEventListener("mousedown", this._down_bound, false);
        document.removeEventListener("mousemove", this._move_bound);
	    document.removeEventListener("mouseup", this._up_bound);

	    if(this._mask){
    		document.body.removeChild(this._mask);
    		this._mask = null;
    	}

        this._target = null;
	    this._callback = null;
	    this._constrain = null;
	    this._constrainRect = null;
    }


    p.type = "Draggable";
    
	documon.Draggable = Draggable;
	
}());