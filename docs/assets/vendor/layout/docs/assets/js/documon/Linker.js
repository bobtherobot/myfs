this.documon = this.documon || {};

this.documon.Linker = (function(){

	function interceptClick(e) {
	    var target = e.target;
	    if (target.tagName === 'A') {
			
			e.preventDefault();

	        var href = target.getAttribute('href');

	        var external = false;

	        if(	href.match(/^(https?|ftp|file):\/\//) ){
	        	var loc = window.open(href, '_blank');
	        	loc.location;
	        } else {
	        	var clean = href;
		        if(charAt(0) == "#"){
		        	clean = href.substr(1);
		        }

		        if(clean.indexOf(".") > -1){
		        	
		        }

		    }


	        if(external){

	        }

	          var re = new RegExp("^" + 
	        var onpage = href.match(/^
	        if(

	        


	    }
	}
	function init(){
		document.addEventListener('click', interceptClick);
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