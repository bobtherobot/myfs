/**
 * Provides the search mechanism across the documentation.
 *
 * @class Search
 * @package  documon
 */

this.documon = this.documon || {};

this.documon.Search = (function(){

	var searchText;
	var searchButton;
	var searchResults;
	var searchPanel;

	function init(){
		searchText = document.getElementById("searchText");
		searchButton = document.getElementById("searchButton");
		searchResults = document.getElementById("searchResults");
		searchPanel = document.getElementById("searchPanel");

		searchText.addEventListener("keyup", keyup);
		searchButton.addEventListener("click", doSearch);

	}

	function doSearch(e){
		console.log("doSearch", doSearch);
		search(searchText.value);
	}

	function search(val){

		var re = new RegExp(val, "im");

		var newResults = "";

		var found = [];
		for(var id in SearchData){
			var str = SearchData[id];
			if( re.test(str) ){
				found.push(id);
				var data = documon.MenuTree.getDataById(id);
				if(data){
					newResults += `<div class="searchResultLine" onclick="documon.Search.openSearchLink('${data.id}')">${data.id}</div>`;
				}
				
			}
		}

		if(newResults){
			jbeeb.utils.Layout.expand( searchPanel );
		} else {
			newResults = "Nothing Found";
		}
		
		searchResults.innerHTML = newResults;

	}

	function openSearchLink(id){
		var item = documon.MenuTree.openById(id, true, true);
		console.log("openSearchLink", item);
		//documon.PageManager.loadPage("select", item);
	}

	function keyup(e){
		var code = e.which || e.keyCode;
		if(code == 13){
			doSearch();
		}
	}

	return {
		init :init,
		search : search,
		openSearchLink : openSearchLink
	}

}());