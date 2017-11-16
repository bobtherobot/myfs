/*
Part of Documon.
Copyright (c) Michael Gieson.
www.documon.net
 */

/**
 * Toggles member parts inheritance, private/public and protected in the menu and on the pages.
 *
 * This class serves dual purpose, as it is loaded on the main (index.html) page as well as 
 * individual pages that are loaded into the main page.
 *
 * Since individual pages are loaded as iframes, we use a messaging system to
 communicate between the index and content pages.
 *
 * @class  Access
 * @package  documon
 */


this.documon = this.documon || {};

this.documon.Access = (function(){
	var cb_private;
	var cb_protected;
	//var cb_depreciated;
	var cb_inherits;


	var showQuery = null;
	var hideQuery = null;

	var default_cb_private = false;
	var default_cb_protected = false;
	var default_cb_inherits = true;	
	var hasControls = false;
	var storage;

	/**
	 Applies the access to the current page. When showQuery and hideQuery are
	 provided, then these will be used to apply the access, when not provided, the
	 previous values will be used.

	 Generallly, the index page defines the showQuery and hideQuery values via the
	 checkbox actions, and the content pages rely on sending the arguments to the
	 function to apply the access to the page.

	 @method applyAccess
	 @public
	 @param  {string}    showQuery - The string to use as a selector for querySelectorAll 
	 @param  {string}    hideQuery 
	 */
	 
	function applyAccess(VshowQuery, VhideQuery){

		// Since only "pages" send in the V args, and the V args could be null, 
		// we need to check if they're null or just not being sent.
		if(typeof VshowQuery != 'undefined'){
			showQuery = VshowQuery;
		}

		if(typeof VhideQuery != 'undefined'){
			hideQuery = VhideQuery;
		}

		// The "NodeList" returned by querySelectorAll is not a real array 
		// (doesn't have the "indexOf" method). So we have to stuff them 
		// into this array so we can keep track of what was hidden.
		var hiddenElems = [];

		if(hideQuery){

			var query = document.querySelectorAll( hideQuery );
			for(var i=0; i<query.length; i++){
				var elem = query[i];
				elem.style.display = "none";
				hiddenElems.push(elem);
			}
		}


		if(showQuery){

			var query = document.querySelectorAll( showQuery );
			for(var i=0; i<query.length; i++){
				var elem = query[i];
				// Make sure it wasn't previously hidden.
				if(hiddenElems.indexOf(elem) < 0){
					var before = elem.style.display;
					if(!elem.style.display || elem.style.display == "none"){
						elem.style.display = elem.dataset.originalDisplay;
					}

				}
			}
		}

		
	}

	var displayValues = { "A": "inline", "ABBR": "inline", "ACRONYM": "inline", "ADDRESS": "block", "APPLET": "inline-block", "AREA": "none", "ARTICLE": "block", "ASIDE": "block", "AUDIO": "none", "B": "inline", "BASE": "none", "BASEFONT": "none", "BDI": "inline", "BDO": "inline", "BIG": "inline", "BLOCKQUOTE": "block", "BODY": "block", "BR": "inline", "BUTTON": "inline-block", "CANVAS": "inline", "CAPTION": "table-caption", "CENTER": "block", "CITE": "inline", "CODE": "inline", "COL": "table-column", "COLGROUP": "table-column-group", "DATALIST": "none", "DD": "inline", "DEL": "inline", "DETAILS": "block", "DFN": "inline", "DIALOG": "inline", "DIR": "block", "DIV": "block", "DL": "block", "DT": "block", "EM": "inline", "EMBED": "inline", "FIELDSET": "block", "FIGCAPTION": "block", "FIGURE": "block", "FONT": "inline", "FOOTER": "block", "FORM": "block", "FRAME": "inline", "FRAMESET": "block", "H1": "block", "H2": "block", "H3": "block", "H4": "block", "H5": "block", "H6": "block", "HEAD": "none", "HEADER": "block", "HR": "block", "HTML": "block", "I": "inline", "IFRAME": "inline", "IMG": "inline", "INPUT": "inline", "INS": "inline", "KBD": "inline", "KEYGEN": "inline", "LABEL": "inline", "LEGEND": "block", "LI": "list-item", "LINK": "none", "MAIN": "block", "MAP": "inline", "MARK": "inline", "MENU": "block", "MENUITEM": "inline", "META": "none", "METER": "inline-block", "NAV": "block", "NOFRAMES": "none", "NOSCRIPT": "none", "OBJECT": "inline", "OL": "block", "OPTGROUP": "block", "OPTION": "block", "OUTPUT": "inline", "P": "block", "PARAM": "none", "PICTURE": "inline", "PRE": "block", "PROGRESS": "inline-block", "Q": "inline", "RP": "none", "RT": "ruby-text", "RUBY": "ruby", "S": "inline", "SAMP": "inline", "SCRIPT": "none", "SECTION": "block", "SELECT": "inline-block", "SMALL": "inline", "SOURCE": "inline", "SPAN": "inline", "STRIKE": "inline", "STRONG": "inline", "STYLE": "none", "SUB": "inline", "SUMMARY": "block", "SUP": "inline", "TABLE": "table", "TBODY": "table-row-group", "TD": "table-cell", "TEXTAREA": "inline", "TFOOT": "table-footer-group", "TH": "table-cell", "THEAD": "table-header-group", "TIME": "inline", "TITLE": "none", "TR": "table-row", "TRACK": "inline", "TT": "inline", "U": "inline", "UL": "block", "VAR": "inline", "VIDEO": "inline", "WBR": "inline"};

	function getOriginalDisplay(elem){
		// getComputedStyle returns null when the elem is inside a hidden parent.
		var s = window.getComputedStyle(elem, null);
		var val;
		if(s){
			val = s.getPropertyValue("display");
		}

		return val ||  elem.style.display || displayValues[elem.tagName];

	}

	/**
	 * The checkbox action handler
	 *
	 * @method clickAccess
	 * @protected
	 *
	 * @param  {type} e - the window event
	 */
	
	function clickAccess(e){
		setAccess(cb_inherits.checked, cb_private.checked, cb_protected.checked);
		// Apply to iframe page(s)
		documon.PageManager.applyAccess( getApplyAccessMessage() );
		// Apply to this page as well (setAccess provides global arguments, so applyAccess arguments are not needed for this page)
		applyAccess();
	}

	/**
	 * Generates the selector strings for showing and hiding members.
	 *
	 * The query is based on HTML tags that have data- attributes that match the value (for non boolena
	 type access values such as public/private/protected. And for boolean access, such as inherits,
	 just checks to see if the data-inherits attribute exists
	 * @method setAccess
	 * @public
	 *
	 * @param  {boolean}    inherits   true when you want to show memebers that are inherited
	 * @param  {boolean}    pprivate   true when you want to show memebers that are private
	 * @param  {boolean}    pprotected true when you want to show memebers that are protected
	 */
	function setAccess(inherits, pprivate, pprotected){

		var show = [];
		var hide = [];

		if( ! inherits ){
			hide.push('[data-inherits]');
		} else {
			show.push('[data-inherits]');
		}


		if( ! pprivate ){
			hide.push('[data-access="private"]');
		} else {
			show.push('[data-access="private"]');
		}
		if( ! pprotected ){
			hide.push('[data-access="protected"]');
		} else {
			show.push('[data-access="protected"]');
		}



		/*
		// Brain melt here... I htink we can just get away with only hiding, which will over-ride things found previously
		if( ! inherits ){
			hide.push('[data-inherits]');
		} else {
			//show.push('[data-inherits]');
		}
		
		

		showQuery = show.length ? show.join(",") : null;
		hideQuery = hide.length ? hide.join(",") : null;
		*/
	
		showQuery = show.join(",");
		hideQuery = hide.join(",");

		if( hasControls && storage ){
			storage.set("cb_private", pprivate);
			storage.set("cb_protected", pprotected);
			storage.set("cb_inherits", inherits);
		}

	}

	

	/**
	 * Restores the checkboxes to the value used last visit
	 *
	 * @method restoreChecked
	 * @private
	 */
	
	function restoreChecked(){

		if( hasControls ){
			if(typeof storage.get("cb_private") != 'undefined'){
				cb_private.checked = storage.get("cb_private") === "true" ? true : false;
			}

			if(typeof storage.get("cb_protected") != 'undefined'){
				cb_protected.checked = storage.get("cb_protected") === "true" ? true : false;
			}

			if(typeof storage.get("cb_inherits") != 'undefined'){
				cb_inherits.checked = storage.get("cb_inherits") === "true" ? true : false;
			}
		}

	}


	/**
	 * The startup initializer
	 *
	 * @method init
	 * @public
	 *
	 */
	
	function init(){
		
		storage = gieson.Storage;

		// getComputedStyle returns null when the elem is inside a hidden parent.
		//
		// We'll need to grab the original display value at page load to 
		// prevent stuff in hidden iframes from preventing getComputedStyle
		// from displaying properly (firefox bug only?)

		var query = document.querySelectorAll( '[data-access="protected"],[data-access="private"],[data-inherits]' );
		for(var i=0; i<query.length; i++){
			var elem = query[i];
			elem.dataset.originalDisplay = getOriginalDisplay(elem);
		}

		if( document.getElementById("cb_private") ){
			hasControls = true;
		}

		if(hasControls){
			cb_private = document.getElementById("cb_private");
			cb_protected = document.getElementById("cb_protected");
			//cb_depreciated = document.getElementById("cb_depreciated");
			cb_inherits = document.getElementById("cb_inherits");

			restoreChecked();

			cb_private.addEventListener("click", clickAccess, false);
			cb_protected.addEventListener("click", clickAccess, false);
			cb_inherits.addEventListener("click", clickAccess, false);

			clickAccess();

		}

		window.addEventListener("message", receiveMessage, false);

	}

	function getApplyAccessMessage(){
		return {
			id : "applyAccess",
			showQuery : showQuery,
			hideQuery : hideQuery
		}
	}

	/**
	 * THe handler pinged when a content page is loaded to check to see what the access whoudl be on
	 the page.
	 *
	 * @method receiveMessage
	 * @protected
	 *
	 * @param  {type}         message - A message object.
	 */
	
	function receiveMessage(message){
		var messageId = message.data.id;
		if(messageId == "getAccess"){
			var frame = document.getElementById(message.data.pageId);
			frame.contentWindow.postMessage( getApplyAccessMessage() , '*');
		}
	}

	return {
		init : init,
		setAccess : setAccess,
		applyAccess : applyAccess
	}
}());