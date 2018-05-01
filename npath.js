// --------------
// myjs
// --------------
// By Mike Gieson
// www.gieson.com


/**
 * A drop-in replacement for path, that provides cross-playform normalization. Easing the development of cross-platform modules.
 *
 * Essentially what we're doing is pre-processing all methods with a path normalization -- always enforcing forward slashes.
 *
 * @module npath
 * @package  myfs
 * 
 */

var path = require("path");


/**
 * @property {string} sep - The kind of seperator used in paths. Windows = \\  or POSIX	= /
 */
var sep = path.sep;

/**
 * Platform environment PATH delimiter.
 *
 * Example of how PATH appears on Windows:
 * 
 * 		'C:\Windows\system32;C:\Windows;C:\Program Files\node\'
 * 
 * Example of how PATH appears on POSIX systems (Mac Unix):
 * 
 * 		'/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'
 *
 * Read the PATH with Node:
 * 
 * 		console.log(process.env.PATH)
 * 
 * 		Windows 	= ;
 *   	POSIX	= : 
 *
 * @property {string} delimiter
 */
var delimiter = path.sep == "/" ? ":" : ";";

//sep = "/"; //delimiter == ";" ? sep + "\\" : sep;


/**
 * Normalizes slashes by converting double \\ to single \ and / to \\ or \\ tp / based on the current platform requirements.
 * 
 * @method clean
 *
 * @param  {string | array} arg
 *
 * @return {string}
 */
function clean(arg){

	if(typeof arg == 'string'){

		/*
		arg = arg.replace(/\\/g, sep);

		var dub = /\/+/g; // perhaps faster ?
		//var dub = /\/\//g; // perhaps faster ?
		//var dub = /\/\//;
		while( arg.match(dub) ){
			arg = arg.replace(dub, '/');
		}
		//*/

		//arg = arg.replace(/\/+/g, sep);

		//arg = arg.replace(/\/+/g, "/"); // Always use forward slashes, since windows **can** handle it.

		//arg = arg.replace(/[\\\/]+/g, "/"); // This does both above at once

		// I suck at regex
		arg = arg.replace( /[\/\\]+/g, "/" );

		return path.normalize(arg);

	} else if(typeof arg == 'object'){

		var result;

		if( Array.isArray( arg ) ){

			result = [];
			for(var i=0; i<arg.length; i++){
				result.push( clean( arg[i] ) );
			}

		} else {

			result = {};
			for(var prop in arg){
				result[prop] = clean( arg[prop] );
			}
		
		}
		
		return result;
	}

	return arg;
	
}


/**
 * 		npath.basename("/foo/bar/bob.txt") --> "bob.txt"
 *   	npath.basename("/foo/bar/bob.txt", ".txt") --> "bob"
 * 
 * @method basename
 * @param  {string} path - The full path
 * @param  {string} ext - Lops off the extension if it matches.
 * @return {string} - The last portion of a path, generally the "filename".
 */
function basename(Vpath, Vext){
	return path.basename( clean(Vpath), Vext );
}

/**
 * 		npath.name("/foo/bar/bob.txt") --> "bob"
 * 
 * @method name
 * @param  {string} path - The full path
 * @return {string} - The last portion of a path, generally the "filename" but without the extension.
 */
function name(Vpath){
	return path.parse( clean(Vpath) ).name;
}


/**
 * Returns the path to the parent folder that the item resides within.
 * 	
 * 		npath.dirname("/foo/bar/bob.txt") --> "/foo/bar"
 *   	npath.dirname("/foo/sally/yoyo/boob") --> "/foo/sally/yoyo"
 * 
 * @method dirname
 * @param  {string} Vpath - The path to parse.
 * @return {string} - The path to the file/folder.
 */
function dirname(Vpath){
	return clean( path.dirname( clean(Vpath) ) );
}

/**
 * Yes, this includes the dot.
 * 
 * 		npath.extname("/foo/bar/bob.txt") --> ".txt"
 *   	npath.extname("/foo/sally/yoyo/boob") --> ""
 * 
 * @method extname
 * @param  {string} Vpath - The path to parse.
 * @return {string} - The extension (if exists), including the dot.
 */
function extname(Vpath){
	return path.extname( clean(Vpath) );
}


/**
 * Just the bare, base extension (no dot)
 * 
 * @method ext
 * @param  {string} Vpath - The path to parse.
 * @return {string} - The extension
 */
function ext(Vpath){
	return path.extname( clean(Vpath) ).replace(/^\./, "");
}


/**
 * Determines if path is an absolute path.
 *
 * @method  isAbsolute
 * @param   {string} Vpath - The path to parse.
 * @return  {Boolean}
 */
function isAbsolute(Vpath){
	return path.isAbsolute( clean(Vpath) );
}

/**
 * Resolves ".." and "." portions of a path.
 * Reduces double slashes to single (e.g. // -> /  )
 * Forces back-slashes to forward slashes (e.g. \ -> /  )
 *
 * Retains trailing slash if exists.
 * 		
 *   	npath.normalize("/foo/////bar") --> "/foo/bar"
 *   	npath.normalize("/foo/bar/../boob") --> "/foo/boob"
 *   	npath.normalize("./foo/") --> "/current/working/dir/foo/"
 *
 * @method  normalize
 * @param   {string} Vpath - The path to parse.
 * @return  {string}
 */
function normalize(Vpath){
	//return clean( path.normalize( clean(Vpath) ) );
	return clean(Vpath);
}


/**
Extracts basic path and file parts.

	path.parse('/home/user/dir/file.txt')

	// Yeilds 

	{
		// (traditional node proerties)
		root	: "/",
		dir		: "/home/user/dir",
		base	: "file.txt",
		ext		: ".txt",
		name	: "file"

		// additional "for my brain" labels:
		ext2		: "txt" 			// no dot
		extension	: "txt" 		// alias
		basename	: "file" 	
		filename	: "file.txt"
		parent		: "/home/user/dir"
	}

@method  parse
@param   {string}  Vpath - The path to parse.
@return  {object} - An object containing the following properties:

	{
		root : "/",
		dir : "/home/user/dir",
		base : "file.txt",
		ext : ".txt",
		name : "file"
	}

*/
function parse(Vpath){
	var res = path.parse( clean(Vpath) );

	// Keep node keys "as is", add more sensible labels for my brain.
	res.ext2 = res.ext.replace(".", "");
	res.extension = res.ext2;
	res.basename = res.name;
	res.filename = res.base;
	res.parent = res.dir;

	return clean( res );
}


/**
 * Creates a relative path between `from` adn `to`.
 *
 * 		path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')
 * 		// Returns: '../../impl/bbb'
 *
 * @method  relative
 *
 * @param   {string}    [from]  - When null, the cwd is used for this value.
 * @param   {string}    [to]    - When null, the cwd is used for this value.
 *
 * @return  {string}	- The relative path between `from` and `to`
 */
function relative(Vfrom, Vto){
	return clean( path.relative( clean(Vfrom) , clean(Vto) ) );
}

/**
 * The opposite of path.parse().
 *
 * Combines the elements of an object into a string. 
 *
 * Example:
 * 		
 * 		{
 * 			root : "/",
 * 			dir : "/home/user/dir",
 * 			base : "file.txt",
 * 			ext : ".txt",
 * 			name : "file"
 * 		}
 * 		
 * 	... is converted to
 *
 * 		/home/user/dir/file.txt
 * 		
 *
 * @method  format
 * @param   {object}  obj  - The object containing some of the required keys to formulate a path.
 * @return  {type} - The string representaiton of the object.
 */
function format(obj){
	return clean( path.format( clean( obj ) ) );
}


/**
 * Joins path segments and resolves relativity.
 *
 * 		path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
 * 		Returns: '/foo/bar/baz/asdf'
 * 
 *
 * @method  join
 * @param	{string} paths... - All arguments are evaluated as paths for construction
 * @return  {type}  description
 */
function join(){
	var args = Array.prototype.slice.call(arguments);
	return clean( path.join.apply(null, clean(args) ) );
}


/**
 * Generates an absolute path based on the provided arguments.
 *
 * Path construction occurs from right < to < left
 * 
 * 		resolve("/a", "b", "c"); // yields: "/a/b/c"
 *
 * If an absolute path is resolved during construction, the items to the left are ignored.
 *
 * 		resolve("a", "/b", "c"); // yields: "/b/c" ("a" is ignored)
 *
 * If an absolute path is not resolved after constructing all arguments, the CWD is inserted.
 *
 * 		resolve("a", "b", "c"); // yields: "/current/working/dir/a/b/c"
 *
 * Relative paths are automatically resolved:
 *
 * 		resolve("/a", "../b", "c"); // yields "/a/c"
 * 
 * 
 *
 * @method	resolve
 * @param	{string} [path...] - All arguments are evaluated as paths for construction.
 * @return 	{string}
 */
function resolve(){
	var args = Array.prototype.slice.call(arguments);
	return clean( path.resolve.apply(null, clean(args) ) );
}

/**
 * Removes a trailing slash from path (if exists).
 *
 * @method  removeTrailingSlash
 * @param   {string} path
 * @return  {string} 
 */
function removeTrailingSlash(dpath){
	dpath = clean(dpath);
	if( dpath.substr(-sep.length) == sep ){
		dpath = dpath.substr(0, dpath.length - 1);
	}
	return dpath;
}

/**
 * Adds a trailing slash from path (if doesn't exist).
 *
 * @method  addTrailingSlash
 * @param   {string} path
 * @return  {string} 
 */
function addTrailingSlash(dpath){
	dpath = clean(dpath);
	if( dpath.substr(-sep.length) != sep ){
		dpath = dpath + sep;
	}
	return dpath;
}

/**
 * Returns current working directory.
 * @method     cwd
 * @private
 * @param      {string}    tack    Appends or (resolves)[resolve] additional context to the current working directory as needed.
 *
 *		var example = myfs.cwd("../"); // will back up one folder
 *		var example = myfs.cwd("foo/bar"); // will tack onto the end /system/path/to/foo/bar
 *		
 * @return     {string}            The resolved path.
 */
function cwd(tack){
	var cwd = process.cwd()
	if(tack){
		return resolve(cwd, tack);
	} else {
		return cwd;
	}
	
}

/**
 * Changes a path's extension. Can apply to a basic filename or a full path.
 * @method     swapExt
 * @private
 * @param      {string}     path      The original path.
 * @param      {string}     newExt    The new extenion to use.
 * @return     {sring}               The new path.
 */
function swapExt(path, newExt){
	return parent(path) + sep + name(path) + "." + newExt;
}


module.exports = {
	clean 		: clean,
	name		: name,
	base		: name, // alias
	basename 	: basename,
	filename 	: basename, // alias
	dirname 	: dirname,
	dir 		: dirname, // alias
	parent 		: dirname, // alias
	extname 	: extname,
	ext 		: ext,
	isAbsolute 	: isAbsolute,
	normalize 	: normalize,
	parse 		: parse,
	relative 	: relative,

	format 		: format,
	join 		: join,
	resolve 	: resolve,

	delimiter 	: delimiter,
	sep 		: path.sep, // provide what node says is slash, but interally, we always force forard slash "/"

	win32 		: path.win32, 	// leave as is
	posix 		: path.posix,	// leave as is

	removeTrailingSlash : removeTrailingSlash,
	addTrailingSlash : addTrailingSlash,
	swapExt : swapExt
	cwd
};