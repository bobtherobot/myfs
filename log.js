// --------------
// myjs
// --------------
// By Mike Gieson
// www.gieson.com



/**
 * Writes to the console. Will accept an object or array as well as string, boolena and other and prepare them for proper presentation to the console.
 *
 * @module log
 * @package  myfs
 *
 * @param  {any}  		data 	- A string, array or object to output
 * @param  {string}  	title 	- A title for the message
 * @param  {type}  		quiet 	- Disables logging (prevents console output.
 *
 * @example
 *
 *	var log = require("log");
 * 	log(["foo", "bar"], "Some Title", false);
 *
 * prints:
 *
 * 		--------------------
 * 		Some Title
 * 		--------------------
 * 		[
 * 			'foo',
 * 			'bar'
 * 		]
 * 		
 */




function write(str){
	process.stdout.write(str + "\n");
}

function log(data, title, quiet){
	if( ! quiet ){
		if(title){
			write("------------------");
			write(title);
			write("------------------");
		}
		if(data){
			if(typeof data == "object"){
				if( Array.isArray(data) ){
					for(var i=0; i<data.length; i++){
						write( "  " + data[i] );
					}
				} else {
					for(var prop in data){
						write( "  " + prop + " : " + data[prop] );
					}
				}
			} else {
				write(data);
			}
		}
	}
}

module.exports = log;