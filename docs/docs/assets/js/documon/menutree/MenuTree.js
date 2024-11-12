/*
Part of Documon.
Copyright (c) Michael Gieson.
www.documon.net
 */


	/**
	Builds a menu based on a "menu array". The menu array must conform to the following structure:

		var myMenuData = [
			{
				"id"		: "foo", 		// Unique ID used to identify a menu list item.
				"url"		: "foo.html",	// (optional) The URL to open when the menu item is clicked.
				"label"		: "foo",		// The display text for the menu item.
				"kind"		: "myCssRule",	// The CSS class to apply to the item -- good for including icons!
				"children"	: []			// An array of menu item just like this one.
			}
			... etc...
		];

	When an item has children, a sub-menu will be constructed as the immediate "nextSibling" UL, 
	which will house all the items within the "children" array. Thus, one may have as many sub-menus as needed.

	The menu will be build using the following HTML structure:
		
		<ul>
			<li>foo</li> <-- opener - used to open/close the next immediate sibling UL
			<ul>
				<li>foo</li>
				<li>foo</li>
			</ul>
			<li>foo</li>
			<li>foo</li>
			<li>foo</li> <-- opener - used to open/close the next immediate sibling UL
			<ul>
				<li>foo</li>
				<li>foo</li> <-- opener - used to open/close the next immediate sibling UL
				<ul>
					<li>foo</li>
					<li>foo</li>
					<li>foo</li>
					<li>foo</li>
				</ul>
				<li>foo</li>
				<li>foo</li>
			</ul>
		</ul>

	

	@class MenuTree
	@package gieson
	@example

		// For now, the only action we ping is "select"
		function opHandler(action, item){
			if(action == "select"){
				//con sole.log(item);
			}

		}
		var myMenu = new gieson.MenuTree({
					callback : opHandler,
					menuData : MenuData // MenuData should be located on the window object, since it is loaded in via <script src="_menuData.js">
			});
	

	 */

this.gieson = this.gieson || {};

this.gieson.MenuTree = (function(params){

	var openedMenuIds = [];
	var activeMenuElem;
	var UID = 0;
	var container;
	var consumeHash = false;
	var callback;
	var closeChildrenToo = false; // configurable. When a "folder" is closed, all children folders close too.

	function rememberState(miid, makeOpen){
		var index = openedMenuIds.indexOf(miid);
		var closing;
		if(makeOpen){
			// only add if it doen't already exist.
			if(index < 0){
				openedMenuIds.push(miid);
			}
		} else {
			if(index > -1){
				closing = openedMenuIds[index];
			}
		}

		var closingKids;
		if(closeChildrenToo){
			if(closing){
				closingKids = closeBranch(listdata[miid]);
			}
		}
		
		// Prevent duplicates and nulls
		var clean = [];
		for(var i=openedMenuIds.length; i--;){
			var val = openedMenuIds[i];
			var inkid = false;
			if(closingKids){
				inkid = closingKids.indexOf(val) > -1;
			}
			if( val && clean.indexOf(val) < 0 && !closing && !inkid){
				clean.push(val);
			} else {
				openedMenuIds.splice(i, 1);
			}
		}


		// NOTE: Don't replace (blast) the openedMenuIds array, 
		// because it'll wonkify restoring in init (the array will 
		// be there for the first, then not for the next and so on.)

		//openedMenuIds = clean = []; // for testing to clear
		
		if(storage){
			storage.set("openedMenuIds", clean);
		}

	}

	function closeBranch(item, remList){

		remList = remList || [];
		remList.push(item.$mt.miid);

		closeLeaf(item, true);

		var kids = item.children;
		if(kids){
			for(var i=0; i<kids.length; i++){
				var kid = kids[i];
				if(kid.$mt.open){
					closeBranch(kid, remList);
				}
			}
		}

		return remList;

	}


	function storeScroll(e){
		storage.set("menuScrollTop", e.target.scrollTop);
		storage.set("menuScrollLeft", e.target.scrollLeft);
	}

	var newline = "\n";

	/**
	 * TODO: We should convert the items we store in the list to a seperate class. For berevity we've just inlined it during development.
	 * A data store for each menu item. The keys for the listData refer to item ID's. Each item consists of the following:

		 	item = {
		 		id			// Optional (will be assigned unique one if none)
				children	// A list of other items.
				access		// Specific to documon
				inherits	// Specific to documon
				kind		// Applies a CSS class to the item
				label		// What the user sees

				// This is created and managed by MenuTree
				$mt - {

							miid 		// Menu item id.
							liid		// The ID of the actual <li> HTML element created for this item 
							ulid		// The ID of the parent <ul> element (this LI is a child of this UL)
							open		// (boolean) Current state.
							parentMiid	// The parent menu item.
							openerid	// The opener element's ID
							liElem		// The actual <li> element (only stored when interacted with)
							ulElem		// The actual parent <ul> element (only stored when interacted with)
							openerElem	// The actual opener triangle doo-dad element (only stored when interacted with)
							ulOriginalDisplay // The source node's original css style.display kind (for open/close so we go back to normal -- defaults to "block" when not set in CSS)

				}
			}

	 *
	 *
	 * @property  {Object} listdata
	 */
	var listdata = {};
	var uid = 0;
	var idPrefix = "_mi_";

	/**
	 * Used to toggle via mouse click. Toggles an item open/closed and prevents any further mouse bubbling.
	 *
	 * @method  toggleClick
	 * @param   {Event}  evt  - The mouse event object.
	 * @param   {string}  id  - The menu item id.
	 */
	function toggleClick(evt, id){
		evt.stopPropagation();
		toggle(id);
	}

	/**
	 * Toggles an item open/closed.
	 *
	 * @api toggle
	 * @method  toggle
	 * @param   {string}  id  - The menu item id.
	 */
	function toggle(id){
		var item = listdata[id];
		if(item.$mt.open){
			closeLeaf(item);
		} else {
			openLeaf(item);
		}
	}

	/**
	 * Opens and/or highlights an item in the menu when user physically clicks.
	 *
	 * @method  selectClick
	 * @param   {Event}  evt  - The mouse event object.
	 * @param   {string}  id  - The menu item id.
	 */
	function selectClick(evt, id){
		evt.stopPropagation();

		var item = listdata[id];
		if(item.$mt.open && item.$mt.liElem == activeMenuElem){
			closeLeaf(item);
		} else {
			select(id);
		}

		
	}

	/**
	 * Opens and/or highlights an item in the menu.
	 *
	 * @api select
	 * @method  select
	 * @param   {string}  id  - The menu item id.
	 */
	function select(id){

		var item = listdata[id];
		if(item){
			openLeaf(item, true, true);
		}
		
	}

	// internal
	function selectItem(item, scrollIntoView){
		var elem = item.$mt.liElem || document.getElementById(item.$mt.liid);
		if(! item.$mt.liElem ){
			item.$mt.liElem = elem
		}
		highlightElem(elem);

		if(scrollIntoView){
			console.log("scrollIntoView", scrollIntoView);
			elem.scrollIntoView({block: "end", behavior: "smooth"})
		}

		if(callback){
			callback("select", item);
		}
	}

	function highlightElem(elem){
		if(activeMenuElem){
			activeMenuElem.classList.remove("menu-current");
		}

		if(elem){
			elem.classList.add("menu-current");
			activeMenuElem = elem;
		}
	}

	function openLeaf(item, ignoreRemember, andSelect, scrollIntoView){

		var ul = item.$mt.ulElem || document.getElementById(item.$mt.ulid);
		if(ul){
			ul.style.display = item.$mt.ulOriginalDisplay || "block";
			if( ! item.$mt.ulElem ){
				item.$mt.ulElem = ul;
			}

			var opener = item.$mt.openerElem || document.getElementById(item.$mt.openerid);
			opener.classList.remove("menu-closed");
			opener.classList.add("menu-opened");
			if( ! item.$mt.openerElem ){
				item.$mt.openerElem = opener;
			}

			if( ! ignoreRemember ){
				rememberState(item.$mt.miid, true);
			}

			item.$mt.open = true;

		}

		if(andSelect){
			selectItem(item, scrollIntoView)
		}
		

	}

	function closeLeaf(item, ignoreRemember){

		var ul = item.$mt.ulElem || document.getElementById(item.$mt.ulid);
		if( ! item.$mt.ulOriginalDisplay ){
			item.$mt.ulOriginalDisplay = ul.style.display;
		}
		ul.style.display = "none";
		if( ! item.$mt.ulElem ){
			item.$mt.ulElem = ul;
		}

		var opener = item.$mt.openerElem || document.getElementById(item.$mt.openerid);
		opener.classList.remove("menu-opened");
		opener.classList.add("menu-closed");
		if( ! item.$mt.openerElem ){
			item.$mt.openerElem = opener;
		}

		if( ! ignoreRemember ){
			rememberState(item.$mt.miid, false);
		}

		item.$mt.open = false;

	}

	function openBranch(item, andSelect, scrollIntoView){

		openLeaf(item, false, andSelect, scrollIntoView);

		// We'll back-track and open parents without selecting... 
		// just to reveal all the way back to ther root.
		var parentMiid = item.$mt.parentMiid;
		if(parentMiid){
			openBranch(listdata[parentMiid]);
		}

	}

	
	/**
	 * Opens all decendants of a branch.
	 *
	 * @api openById
	 * @method  openById
	 * @param   {string}  	id  					- The menu item id.
	 * @param   {boolean}  	[andSelect=false]  		- Should the item be highlighted?
	 * @param   {boolean}  	[scrollIntoView=false]  - Should the menu scroll to show the item?
	 * @returns {object} - The item's source data as provided during init.
	 */
	function openById(miid, andSelect, scrollIntoView){
			
		var item = listdata[miid];
		if(item){
			openBranch(item, andSelect, scrollIntoView);
		}
		return item;
	}

	/**
	 * Gets the item's source data as provided during init. Convient way to retrive source data without navigating the source tree becuase we maintain a flat-list cross reference. This methods simply hooks into the cross reference.
	 *
	 * @api getDataById
	 * @method  getDataById
	 * @param   {string}  	id  - The menu item id.
	 * @returns {object} 		- The item's source data as provided during init.
	 */
	function getDataById(miid){
		return listdata[miid];
	}

	var newline = "\n";

	function build(list, show, menuCssClass, ulid, parentMT){

		var elem = null;
		if(list && list.length){

			var ulid = ulid || (idPrefix + uid++); // the root element won't have a ulid?

			
			elem = document.createElement("ul");
			elem.id = ulid
			if(menuCssClass){
				elem.className = menuCssClass
			}
			elem.style.display =  show ? "block" : "none";

			for (var i=0; i<list.length; i++){

				var item = list[i];
				var miid = item.id || idPrefix + (uid++);
				var liid = idPrefix + (uid++);

				var mtdata = {};
				mtdata.miid = miid;
				mtdata.liid = liid;
				mtdata.open = false;
				mtdata.parentMiid = parentMT ? parentMT.miid : null;
				//mtdata.access = item.access;

				var hasKids = item.children && item.children.length;

				// nodes
				var itemOpenerElem = document.createElement("i");

				// ulid is only forwarded when there are kids.
				ulid = null;
				if(hasKids){
					var openerid = idPrefix + (uid++);
					ulid = idPrefix + (uid++);

					mtdata.openerid = openerid;
					mtdata.ulid = ulid;
					
					// nodes
					itemOpenerElem.id = openerid;
					itemOpenerElem.className = "fa menu-opener menu-closed";
					itemOpenerElem.addEventListener("mousedown", (function(thatMiid){ return function(evt){ toggleClick(evt, thatMiid) } }(miid)), false);


				} else {
					
					itemOpenerElem.className = "fa menu-no-opener";
				
				}

			
				// <li>
				// 		<i opener /> <i icon /><span>label</span>
				// 		<ul>kids</ul>
				// </li>
			
				// nodes
				var itemElem = document.createElement("li");
				itemElem.addEventListener("mousedown", (function(thatMiid){ return function(evt){ selectClick(evt, thatMiid) } }(miid)), false);
				itemElem.id = liid;
				itemElem.dataset.access = item.access || "public";
				if(item.inherits){
					itemElem.dataset.inherits = true;
				}

				var itemSpan = document.createElement("span");
				
				var itemSpanIcon = document.createElement("i");
				itemSpanIcon.className = "fa " + item.kind;
				
				var itemSpanLabel = document.createElement("span");
				itemSpanLabel.className = "menu-label";
				itemSpanLabel.innerHTML = item.label;

				itemSpan.appendChild(itemSpanIcon);
				itemSpan.appendChild(itemSpanLabel);
				itemElem.appendChild(itemOpenerElem);
				itemElem.appendChild(itemSpan);

				elem.appendChild(itemElem);

				// Recursive build to add classes, properties, methods, etc... below packages and classes
				if(hasKids){

					var kids = build( item.children, false, null, ulid, mtdata );
					if(kids){
						elem.appendChild( kids );
					}
					
				}

				// Add after recursive build.
				item.$mt = mtdata;
				listdata[miid] = item;

			}

		}

		return elem;

	}



	var containerID = "menuPanel";

	function render(list, target){

		listdata = {};

		var html;
		var listElem;
		if(list){
			//html = build(list, true, "menu");
			listElem = build(list, true, "menu");
		}
		
		container = document.getElementById(target);

		if(container){
			//container.innerHTML = html;
			if(listElem){
				container.appendChild(listElem);
			}
			
		}
		
	}

	function hashChanged(e){

		var hash = window.location.hash.substring(1);
		if(hash){
			openById(hash, true);
		}
		
		
		// -----------------------------
		// -----------------------------
		// This will be useful for SPA
		/*
		if( ! consumeHash ){
			var link = window.location.hash.substring(1);
			e.preventDefault();

			if(link.indexOf(".") < 0){
				
				if(currentPageId){
					link = currentPageId + "." + link;

					consumeHash = true;

					window.location.hash = "#" + link;

				}
				
			}
		} else {
			consumeHash = false;
		}
		*/
		
	}

	var that = this;
	
	var storage;
	// @api public
	function init(params){

		var Vcallback = params.callback;
		var VmenuData = params.menuData;

	
		var menuData = VmenuData;
		storage = gieson.Storage;

		callback = Vcallback;

		if(menuData){
			// ------------
			// Render
			// ------------
			render(menuData, containerID);
			
			// ------------
			// Restore what was opened last visit
			// ------------
			var wasOpenList = storage.get("openedMenuIds");
			if( wasOpenList ){
				openedMenuIds = wasOpenList;
				if(openedMenuIds.length){
					for(var i=0; i<openedMenuIds.length; i++){
						openById( openedMenuIds[i] );
					}
				}
			}

			// ------------
			// Restore the scroll position
			// ------------
			container = document.getElementById("menuPanel");

			if(storage.get("menuScrollTop")){
				container.scrollTop = storage.get("menuScrollTop");
				container.scrollLeft = storage.get("menuScrollLeft");
			}

			// Do after restoring the scroll to prevent wonk.
			container.addEventListener("scroll", storeScroll, false);


			// ------------
			// Hash
			// ------------
			// Open if there is a hash in the address 
			// e.g. index.html#path.class.a.ClassC-properties
			var hash = window.location.hash.substring(1);
			if(hash){
				openById(hash, true);
			}
			window.onhashchange = hashChanged;
		}
		
	
	}

	init(params);



	return {
		init : init,
		toggle : toggle,
		select : select,
		openById : openById,
		getDataById : getDataById
	}

});