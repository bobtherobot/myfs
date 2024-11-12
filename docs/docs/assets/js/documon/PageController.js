/*
Part of Documon.
Copyright (c) Michael Gieson.
www.documon.net
 */

this.PageController = (function(){

	
	function init(){

		prettyPrint();

	}

	return {
		init : init
	}
}());

document.addEventListener("DOMContentLoaded", PageController.init);