this.documon = this.documon || {}
this.documon.Pages = (function(){

	var store;
	function receiveMessage(message){
		var data = message.data;
		var messageId = data.id;
		if(messageId == "applyAccess"){
			documon.Access.applyAccess(data.showQuery, data.hideQuery);
		}
	}

	function storeScroll(){
		store.set("lastScroll", window.pageYOffset);
	}
	var scroll_to;
	function handleScroll(e){
		if(scroll_to){
			clearTimeout(scroll_to);
		}
		scroll_to = setTimeout(storeScroll, 100);
	}


	function interceptClick(e) {
	    var target = e.target;
	    if (target.tagName === 'A') {
			//e.preventDefault();
	        var href = target.getAttribute('href');
	        console.log("href", href);
	    }
	}
	
	function init(){

		store = gieson.Storage;

		// Used to control private inherited and protected show/hide.
		// The index.html (window.parent) generally handles this.
		documon.Access.init();

		// index.html to (this) page communication
		// Used to manage tabs.
		window.onmessage = receiveMessage;
		window.parent.postMessage({id: 'getAccess', pageId:window.frameElement.id}, '*');

		
		// Remember last place we scrolled to so next time page is opened, 
		// it'll retrun to where we left off. This is important because when we click a tab, 
		// or click the menu, the page is reloaded (from scratch), so if the page was already opened
		// it doesn't return to previous scroll position, so we have to manage that manually here.
		var lastScroll = store.get("lastScroll");
		if(lastScroll){
			window.scrollTo(0, lastScroll);
		}
		document.addEventListener("scroll", handleScroll);

		// TODO:
		// - need to intercept clicks to links so we can pop a new window, or "scroll" to an internal link.
		//		see crud below for general ideas.

		document.addEventListener('click', interceptClick);

		prettyPrint();

	}

	return {
		init : init
	}
}());

document.addEventListener("DOMContentLoaded", this.documon.Pages.init);



/*
var handler = function(){
    ...torment kittens here...
}
for (var ls = document.links, numLinks = ls.length, i=0; i<numLinks; i++){
    ls[i].onclick= handler;
}

// ----------- or ------------------

function interceptClickEvent(e) {
    var href;
    var target = e.target || e.srcElement;
    if (target.tagName === 'A') {
        href = target.getAttribute('href');

        //put your logic here...
        if (true) {

           //tell the browser not to respond to the link click
           e.preventDefault();
        }
    }
}


//listen for link click events at the document level
if (document.addEventListener) {
    document.addEventListener('click', interceptClickEvent);
} else if (document.attachEvent) {
    document.attachEvent('onclick', interceptClickEvent);
}
 */