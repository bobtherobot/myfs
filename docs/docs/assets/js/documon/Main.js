/*
Part of Documon.
Copyright (c) Michael Gieson.
www.documon.net
 */

/**
 * THe main entry point for initializing other classes.
 *
 * @class Main
 * @package  documon
 */

this.documon = this.documon || {};

this.documon.Main = (function(){


	var storage;

	/**
	 * Called by the DOMContentReady listener on the window once the page is fully loaded.
	 *
	 * Initilizes MenuTree and PageManager and loads previously loaded pages.
	 *
	 * @method  init
	 */
	

	function init(){

		storage = gieson.Storage;

		documon.PageManager.init();
		documon.MenuTree = new gieson.MenuTree({
				target : "menuPanel",
				callback : documon.PageManager.loadPage,
				menuData : MenuData // MenuData should be located on the window object, since it is loaded in via <script src="_menuData.js">
		});
		
		// snag current page before loading others (otherwise the stored value will get overwritten)
		var currentPageId = storage.get("currentPageId");
		var loadedPageIds = storage.get("loadedPageIds");
		
		if(loadedPageIds && loadedPageIds.length){
			for(var i=0; i<loadedPageIds.length; i++){
				documon.MenuTree.select(loadedPageIds[i]);
			}
		}
		if(currentPageId){
			documon.MenuTree.select(currentPageId);
		} else {
			if(MenuData && MenuData.length){
				documon.MenuTree.select(MenuData[0].id);
			}
			
		}

		documon.Access.init();

		documon.Search.init();

		window.addEventListener("message", receiveMessage, false);

	}

	function receiveMessage(message){
		var messageId = message.data.id;
		console.log("receiveMessage", message.data); 
		if(messageId == "menuOpenById"){
			var linkid = message.data.openMeId;

			// Stages this spawns:
			// ------------------------
			// MenuTree.openById > 
			// 		MenuTree.openLeaf > 
			// 			MenuTree.selectItem > callback = documon.PageManager.loadPage (scroll up to see that we set the cllabkca when instaciating on this page.)

			documon.MenuTree.openById(linkid, true);
		}
	}



	return {
		init : init
	}
}());

document.addEventListener("DOMContentLoaded", documon.Main.init);

