/*
Part of Documon.
Copyright (c) Michael Gieson.
www.documon.net
 */

this.documon = this.documon || {};

		console.log("interceptClick");
this.documon.Linker = (function(){

	function interceptClick(e) {
	    var target = e.target;
	    if (target.tagName === 'A') {
			
	        var href = target.getAttribute('href');
	        console.log("href", href);

	        if(	href.match(/^(https?|ftp|file):\/\//) ){

	        	e.preventDefault();
	        	window.open(href, '_blank');

	        } else {
		        if(href.charAt(0) != "#"){
		        	e.preventDefault();
		        	if(href.substr(0, 4) == 'more'){
		        		href = href.toLowerCase();
		        	}
		        	console.log("href", href, href.substr(0, 4));
		        	gieson.MenuTree.openById(href, true, true);
		        }

		    }

	    }
	
	}

	function init(){
		document.addEventListener('click', interceptClick);
	}

	return {
		init : init
	}

}());


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