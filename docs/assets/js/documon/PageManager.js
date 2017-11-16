/*
Part of Documon.
Copyright (c) Michael Gieson.
www.documon.net
 */

this.documon = this.documon || {};

this.documon.PageManager = (function(){

	var uid = 0;
	var idPrefix = "page_";
	var tabPanel;
	var pagePanel;
	var tabul;
	var tabline;
	var storage;

	var pageList = {};
	function init(){

		storage = gieson.Storage;
		
		tabPanel = document.getElementById("tabPanel");
		pagePanel = document.getElementById("pagePanel");

		tabul = document.createElement("ul");
		tabul.className = "tabrow";
		tabPanel.appendChild(tabul);

		tabline = document.createElement("div");
		tabline.className = "tabline";
		tabul.appendChild(tabline);

		documon.TabManager.init({
					target : tabul,
					callback : tabAction
				});


	}

	var currentPageId = null;
	var loadedPageIds = [];
	function loadPage(action, item){
console.log("action, item", action, item)
		if(action == "select" && item.url){
			
			var url = item.url;
			var parsedUrl = documon.Docutils.parseUrl(url, true);

			//var id = idPrefix + uid++;
			//var id  = item.id;

			// Set the id to the base page URL, so we dont' open the same page multiple times 
			// when the menu links to a hash (foo.html#property.id)
			var id  = parsedUrl.baseurl;
			var label = item.name || item.label || parsedUrl.basename;

			var existing = isPageOpen(id);
			if( existing ){
				showPage( id );
				pageList[id].frame.src = url; // index may have changed
			
			} else {

				// IMPORTANT: item.id is not the same as a page id.
				// A page id is essentially the url. Whereas the item id may be wildly different.
				loadedPageIds.push(item.id);
				storage.set("loadedPageIds", loadedPageIds);
				
				pageList[id] = {
					id 		: id,
					label 	: label,
					frame 	: buildFrame(url),
					tab 	: documon.TabManager.make(id, label),
					source 	: item,
					url 	: url,
					baseurl : parsedUrl.baseurl,
					parsedUrl : parsedUrl
				};


				showPage(id);
				
			}
			
		}
		
	}

	function tabAction(kind, id){

		if(kind == "show"){
			showPage(id);
		} else if (kind == "close"){
			destroy(id);
		}
	}

	function isPageOpen(id){
		if(id){
			for(var prop in pageList){
				var item = pageList[prop];
				if(item.id === id){
					return true;
				}
			}
		}
		
		return false;
	}

	function buildFrame(url){
		// <iframe frameborder="0" seamless="seamless" scrolling="no" src="http://test.com/wimpy/wimpy.iframe.html?" width="360" height="240"></iframe>
		var elem = document.createElement("iframe");
		elem.id = idPrefix + (uid++);
		elem.className = "pageFrame";
		elem.frameborder = 0;
		elem.seamless = "seamless";
		elem.scrolling = "yes";
		elem.width = "100%";
		elem.height = "100%";
		elem.src = url;

		pagePanel.appendChild(elem);
		return elem;
		
	}

	function destroyFrame(item){
		pagePanel.removeChild(item.frame);
	}


	function destroy(id){
		var item = pageList[id];
		var realID;
		if(item){
			realID = item.source.id
			destroyFrame(item);
			for(var prop in item){
				item[prop] = null;
			}
		}
		pageList[id] = null;
		delete pageList[id];

		if(realID){
			var pageIndex = loadedPageIds.indexOf(realID);
			if(pageIndex > -1){
				loadedPageIds.splice(pageIndex, 1);
			}

			storage.set("loadedPageIds", loadedPageIds);
		}

		if( ! loadedPageIds.length){
			storage.set("currentPageId", null);
		}

	}


	function showPage(id){
		var count = 1;

		for(var prop in pageList){
			var item = pageList[prop];
			var frame = item.frame;
			frame.style.display = "none";

			var tab = item.tab;
			tab.classList.remove("selected");
			tab.style.zIndex = count;
			count++;
		}
		var item = pageList[id];

		var frame = item.frame;
		frame.style.display = "block";

		tabline.style.zIndex = count++;

		var tab = item.tab;
		tab.classList.add("selected");
		tab.style.zIndex = count++;

		storage.set("currentPageId", item.source.id);
	}

	function applyAccess(message){
		for(var prop in pageList){
			var frame = pageList[prop].frame;
			frame.contentWindow.postMessage(message, '*');
		}
	}


	return {
		init : init,
		loadPage : loadPage,
		applyAccess : applyAccess
	}
}());

