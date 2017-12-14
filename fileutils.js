// --------------
// myjs
// --------------
// By Mike Gieson
// www.gieson.com


/**
 * A collection of basic, common and simplified syncronous file methods.
 *
 * @class  fileutils
 * @package myfs
 */
var fs = require( 'fs' );
var path = require( './npath' );
var du = require( './dirutils' );

/**
 * Copies a file from one location to another.
 *
 * @method     copy
 * @param      {string}    src     - The source file path.
 * @param      {string}    dest    - The destination to copy the source to.
 * @param      {boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.)
 */
function copy( src, dest, binary ) {
	if ( !exists( src ) ) {
		return false;
	}
	var data = fs.readFileSync( src, binary ? null : "UTF-8" );

	// if just folder provided, tack on the file name.
	if ( du.exists( dest ) ) {
		var name = path.basename( src );
		console.log("copy: dest", dest);
		dest = path.removeTrailingSlash( dest ) + "/" + name;
		console.log("copy: dest", dest);
	}

	fs.writeFileSync( dest, data, binary ? null : "UTF-8" );
}


/**
 * Validates if a file exists AND that it's not a folder. If the src is a folder, this method will yeil false.
 * @method     isFile
 * @param      {string}    src     - The source file path.
 */
function isFile(src){
	if( ! exists(src) ){
		return false;
	}
	var val = false;
	var obj;
	try {
		//var obj = fs.lstatSync(who);
		var obj = fs.statSync(who); // dereference symlinks (follows symbolic links)
		if(obj){
			val = ! obj.isDirectory();
		}
		
	} catch(e){
		// ignore 
		// val = false;
	}

	return val;
}


/**
 * Reads the entire file as a string. NOTE: This is an alias for [read](#read).
 *
 * @method     Open
 * @param      {string}    src    - The source file path.
 * @return     {string}           description
 */

/**
 * Reads the entire file as a string.
 *
 * @method     read
 * @param      {string}    src    - The source file path.
 * @param      {boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.)
 * @return     {string}
 */
function read( src, binary ) {
	if ( !fs.existsSync( src ) ) {
		return false;
	}
	return fs.readFileSync( src, binary ? null : "UTF-8" );
}


/**
 * Saves text data to a file. Overwrites entire file with provided data. NOTE:  This is an alias for [write](#write).
 *
 * @method     save
 * @param      {string}    src    - The source file path.
 * @param      {string}    data    - The text data to save.
 */

/**
 * Saves text data to a file. Overwrites entire file with provided data.
 *
 * @method     write
 * @param      {string}    src    - The source file path.
 * @param      {string}    data    - The text data to save.
 * @param      {boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.)
 */
function write( src, data, binary ) {
	fs.writeFileSync( src, data, binary ? "binary" : "UTF-8" );
}

/**
 * Deletes a file from the system.
 * @method     remove
 * @param      {string}    src    - The source file path.
 */
function remove( src ) {
	fs.unlinkSync( src );
}

/**
 * Checks to see if a file exists. Note this also checks if a folder of the same name exists too.
 * @method     exists
 * @private
 * @param      {type}    src    - The source file path.
 * @return     {boolean}           - True if exists, false if no file nor folder exists.
 */
function exists( src ) {
	return fs.existsSync( src ) || du.exists( src )
}

/**
 * Renames (or moves) a file or folder.
 * @method     rename
 * @param      {string}    from    	- The source file path.
 * @param      {string}    to    	- The destination file path.
 */
function rename( from, to ) {
	fs.rename( from, to, function( err ) {
		if ( err ) throw err;
		/*
		fs.stat( to, function( err, stats ) {
			if ( err ) throw err;
			//con sole.log( 'stats: ' + JSON.stringify( stats ) );
		} );
		*/
	} );
}

module.exports = {
	copy: copy,
	read: read,
	open: read, // alias
	write: write,
	save: write, // alias
	remove: remove,
	exists: exists,
	rename: rename,
	move: rename, // alias
	isFile : isFile
}
