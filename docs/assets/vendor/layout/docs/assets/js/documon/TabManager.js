this.documon = this.documon || {};

this.documon.TabManager = (function(){

	var callback;
	var target;
	var tablist = [];
	var tabTransition;
	
	function make(id, label){
		var icon = document.createElement("i");
		icon.id = "tab-icon-" + id;
		icon.className = "fa fa-times tab-close";
		icon.dataset.id = id;
		icon.addEventListener("mousedown", clickCloseDown, false);
		icon.addEventListener("mouseup", clickCloseUp, false);
	
		var span = document.createElement( "span" );
		span.className = "tab-label";
		span.style.pointerEvents = "none";
		var text = document.createTextNode( documon.Docutils.truncate( label, 30 ) );
		span.appendChild(text);

		var elem = document.createElement("li");
		elem.dataset.id = id;
		elem.appendChild(span);
		elem.appendChild(icon);
		elem.addEventListener("mousedown", tabMouseDown, false);

		target.appendChild(elem);

		// since the tab width can change, we'll need to always comp.
		var comp = window.getComputedStyle(elem);

		// Just store the stuff we need.
		var spec = getTabSpecs(comp, elem);

		// - margins and padding essentially change the width
		if( tabSpecOffset === null ){
			tabTransition = comp.transition || "left 100ms ease-out";
			tabSpecOffset = parseFloat(comp.marginLeft)
							+ parseFloat(comp.marginRight)
							+ parseFloat(comp.paddingLeft)
							+ parseFloat(comp.paddingRight);
		}

		var leftOffset = 0;
		var len = tablist.length
		if(len){
			var lastItem = tablist[len-1];
			leftOffset = lastItem.x + lastItem.width;
		}

		// Update this tab's specs.
		spec.elem = elem;
		spec.id = id;
		spec.width += tabSpecOffset;
		spec.x = leftOffset;
		spec.draggable = new documon.Draggable({
						  target	: elem 		// (DisplayObject) The thing that actually moves
						, callback	: drag		// (function) Callback when started return (obj, pos, kind, didmove ) where kind = "start" | "end" | "move"
												//			didmove is only issued when event == "end"
						, constrain	: "x"		// (string) Constrain movement along the "x" or "y" axis. Both constrain and constrainRect can be used together or independantly.
						//, constrainRect	: obj	// (object) Constrain movement within a rectangle THe rectangle can be any object (including a DisplayObject) that contains {x, y, width, height}
						, threshold : 5			// (optional) (default = 5) The pixel threshold for issuing the "didMove" flag on "end"
						, arg : id
					})
		tablist.push(spec);

		// force to absolute and set X
		elem.style.position = "absolute";
		elem.style.left = spec.x + "px";

		
		return elem;

	}

	function destroy(id){

		var spec;
		var nextPageIndex;
		for(var i=tablist.length; i--;){
			var spec = tablist[i];
			if(spec.id == id){
				nextPageIndex = i;
				spec = tablist.splice(i, 1)[0];
				break;
			}
		}

		// Select the page to the right... I think this might be a little wonky.
		var nextPageId;
		if(tablist.length){
			while( nextPageIndex && nextPageIndex >= tablist.length ){
				nextPageIndex--;
			}

			nextPageId = tablist[nextPageIndex];
			if(nextPageId){
				nextPageId = nextPageId.id;
			} else {
				nextPageId = null;
			}

			//... will continue at the end of the function.
		}




		spec.draggable.destroy();

		var icon = document.getElementById("tab-icon-" + spec.id);
		icon.removeEventListener("mousedown", clickCloseDown);
		icon.removeEventListener("mouseup", clickCloseUp);

		var elem = spec.elem;
		elem.removeEventListener("mousedown", tabMouseDown);

		documon.Docutils.emptyNode(elem, true);

		spec.elem = null;

		
		for(var i=0; i<tablist.length; i++){
			var item = tablist[i];
			item.elem.style.transition = tabTransition;
		}
		reorder();

		if(typeof nextPageId != 'undefined'){
			callback("show", nextPageId);
		}

	}

	function reorder(movingID, movingPos){
		
		documon.Docutils.sortOn(tablist, "x");

		if(movingID){

			var dragItemMoveIndex = tablist.indexOf(dragItem);

			var prevX = 0;
			var movingMid = dragItem.width/2;
			var movingX = movingPos.x + movingMid;
			for(var i=0; i<tablist.length; i++){
				var item = tablist[i];

				if( item != dragItem ){
					if( i > dragItemMoveIndex ){
						if(prevX > movingX){
							item.elem.style.left = prevX + "px";
						}
					} else {
						if(prevX < movingX){
							item.elem.style.left = prevX + "px";
						}
					}

					item.x = prevX;

				} else {
					item.x = movingPos.x;
				}
			
				prevX += item.width;
			}

		} else {

			var prevX = 0;
			for(var i=0; i<tablist.length; i++){
				var item = tablist[i];
				item.elem.style.left = prevX + "px";
				item.x = prevX;
				prevX += item.width;
			}

		}

		
		
	}
	var tabSpecOffset = null;
	function getTabSpecs(comp, elem){
		return {
			x : parseFloat(comp.left),
			y : parseFloat(comp.top),
			width : parseFloat(comp.width),
			height : parseFloat(comp.height)
		}
	}

	var dragItem;
	var dragItemStartIndex;
	function dragStart(id){
		
		//killDragTransitions();
		for(var i=0; i<tablist.length; i++){
			var item = tablist[i];
			if(item.id == id){
				dragItem = item;
				dragItemStartIndex = i;
				item.elem.style.transition = "none"; 
			} else {
				// property | duration | timing function | delay
				item.elem.style.transition = tabTransition; 
			}
			
		}

		callback("show", id);

	}

	//var transTimeout;
	function dragEnd(id){
		dragItem.elem.style.transition = tabTransition;
		//if(transTimeout){
		//	clearTimeout(transTimeout);
		//}
		//transTimeout = setTimeout(killDragTransitions, 1000);
		reorder();
	}

	/*
	function killDragTransitions(){
		for(var i=0; i<tablist.length; i++){
			var item = tablist[i];
			item.elem.style.transition = "none";
		}
	}
	*/
	function drag(elem, pos, kind, didMove, arg){

		if(kind == "start"){
			dragStart(arg);
		} else if(kind == "move"){
			reorder(arg, pos);
		} else if(kind == "end"){
			dragEnd(arg)
		}
	}




	function tabMouseDown(e){
		// Walk up to LI when children nodes are clicked.
		var elem = e.target;
		while (elem && elem.nodeName != "LI"){
			elem = elem.parentNode;
		}
		
		//var id = elem.dataset.id;
		//showPage(id);
		callback("show", elem.dataset.id);
	}


	function clickCloseDown(e){
    	e.stopPropagation();
	}

	function clickCloseUp(e){
		closeTab(e);
	}

	function closeTab(e){
		//destroy(e.target.dataset.id);
		var id = e.target.dataset.id;
		destroy(id);
		callback("close", id);
	}


	function init(params){
		target = params.target;
		callback = params.callback;
	}

	return {
		init : init,
		make : make,
		destroy : destroy
	}
}());