

this.gieson = this.gieson || {};

/**
 * Set/Get convienence methods for localStorage.
 *
 * @class Storage
 * @namespace gieson
 */
this.gieson.Storage = (function(){

	/**
	 * Stores data. Can store string, number, boolean and objects.
	 *
	 * @method  setStore
	 *
	 * @param   {string}	name 	- The name of the "thing" to store. (We use this to get it out later)
	 * @param   {any}		val   	- The actual thing to store.
	 */
	function setStore(name, val){
		var type = typeof val;
		if(type == "object"){
			val = JSON.stringify(val);
		} else if(type == "function"){
			val = val.toString();
		}
		localStorage[name] = val; // for permanent storage
		//sessionStorage[name] = val; // for temporary storage
	}

	/**
	 * Retrieves an item from browser's local storage.
	 *
	 * @method  getStore
	 * @param   {string}    name  - The name of the "thing" you want to get.
	 * @return  {any} - The stored data
	 */
	function getStore(name){

		var val = localStorage[name];
		var type = typeof val;
		if(type == "string"){
			var first = val.substr(0, 1);
			if(first == "{" || first == "["){
				val = JSON.parse(val);
			}
		}
		return val; // for permanent storage
		//return sessionStorage[name]; // for temporary storage
	}

	return {
		get : getStore,
		set : setStore
	}
}());