this.PageController = (function(){

	
	function init(){

		prettyPrint();

	}

	return {
		init : init
	}
}());

document.addEventListener("DOMContentLoaded", PageController.init);