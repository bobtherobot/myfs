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
var delimiter = sep == "/" ? ":" : ";";

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
 * 
 * Returns the filename (with or without extension) from the provided path string.
 * 
 * Same as node's built-in [path.basename](https://nodejs.org/api/path.html#pathbasenamepath), with the helper of appending a "." if second argument does not include a dot.
 * 
 * 		myfs.basename("/foo/bar/bob.txt") --> "bob.txt"
 *   	myfs.basename("/foo/bar/bob.txt", ".txt") --> "bob"
 * 
 * Helper to tack on "." if missing
 * 
 *      myfs.basename("/foo/bar/bob.txt", "txt") --> "bob"
 * 
 * @method basename
 * @param  {string} path - The full path
 * @param  {string} ext - Lops off the extension if it matches.
 * @return {string} - The last portion of a path, generally the "filename.txt".
 */
function basename(Vpath, Vext){
    if(Vext){
        if( ! /^\./.test(Vext)){
            Vext = "." + Vext;
        }
    }
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
 * @param  {boolean} [addTrailingSlash=false] - Add a trailing slass to the result.
 * @return {string} - The path to the file/folder.
 */
function dirname(Vpath, addTrailingSlash){
	return clean( path.dirname( clean(Vpath) ) ) + (addTrailingSlash ? sep : "");
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

@method  parse
@param   {string}  Vpath - The path to parse.
@return  {object} - An object containing the following properties:

	path.parse('/home/user/dir/file.txt')
	
	// Yeilds:
	
	{
		// (traditional node proerties)
		root	: "/",
		dir		: "/home/user/dir",
		base	: "file.txt",
		ext		: ".txt",
		name	: "file"

		// additional "for my brain" labels:
		ext2		: "txt" 		// no dot
		extension	: "txt" 		// no dot (alias to above)
		basename	: "file" 	
		filename	: "file.txt"
		parent		: "/home/user/dir"
		path		: "/home/user/dir/file.txt" 	// the original source path string
		src			: "/home/user/dir/file.txt" 	// same as above
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
	res.path = Vpath;
	res.src = Vpath; // alias

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
 * Passthrough to nodejs's "format" method. See [nodejs docs](https://nodejs.org/api/path.html#pathformatpathobject) for additional examples and details.
 * 
 * One addition we do is [clean](#clean) the results.
 *
 * 
 * @method  format
 * @param   {object}  obj  - The object containing some of the required keys to formulate a path.
 * @param   {object}  [obj.dir]  - The directory path.
 * @param   {object}  [obj.root]  - Used when "dir" is not provided.
 * @param   {object}  [obj.base]  - The file name with ext.
 * @param   {object}  [obj.name]  - Name and ext are use when "base" not provided.
 * @param   {object}  [obj.ext]  - Name and ext are use when "base" not provided.
 * @return  {type} - The string representaiton of the object.
 * @see [join](#join) (array-based alternative)
 * @see [nodejs docs for "format"](https://nodejs.org/api/path.html#pathformatpathobject)
 * @example
 *  
 * 		var foo = myfs.format({
 * 			root : "/",
 * 			dir : "/home/user/dir",
 * 			base : "file.txt",
 * 			ext : ".txt",
 * 			name : "file"
 * 		})
 * 		// foo = /home/user/dir/file.txt
 * 	
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
 * Passthrough to nodejs's "join" method. See [nodejs docs](https://nodejs.org/api/path.html#pathjoinpaths) for additional examples and details.
 * 
 * One addition we do is [clean](#clean) the results.
 * 
 *
 * @method  join
 * @param	{string|array} paths - __If string__: Send in as many arguments as you want as strings, each will be a segment in the result. __If array__: Each item in the array will be a segment of the result. 
 * 
 * Interally we use the native nodejs path.join feaure -- so review that for details on the rules for combining what is provided.
 * @see [nodejs doc for "join"](https://nodejs.org/api/path.html#pathjoinpaths)
 */
function join(first){
	var args
    if(Array.isArray(first)){
        args = first;
    } else {
        args = Array.prototype.slice.call(arguments);
    }
	return clean( path.join.apply(null, clean(args) ) );
}


/**
 * Same as Node's path.resolve, with the additional helper so that provided arguments are cleaned.
 * 
 * See: [node.path.resolve](https://nodejs.org/api/path.html#pathresolvepaths)
 * 
 * Generates an absolute path based on the provided arguments.
 * 
 * When ANY argument begins with a slash, (e.g. "/b"), it is assumed that is the root that should be resolved, and arguments that exist to the left of that argument will get ignored.
 *
 * If an absolute path is not resolved after constructing all arguments, the CWD is inserted.
 *
 * 		resolve("a", "b", "c"); // yields: "/current/working/dir/a/b/c"
 *
 * Agin, path construction occurs from right < to < left
 * 
 * 		resolve("/a", "b", "c"); // yields: "/a/b/c"
 *
 * If an absolute path is resolved during construction, the items to the left are ignored.
 *
 * 		resolve("a", "/b", "c"); // yields: "/b/c" ("a" is ignored)
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
	if( dpath.slice(-sep.length) == sep ){
		dpath = dpath.slice(0, dpath.length - 1);
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
	if( ! dpath ){
		return sep;
	}
	dpath = clean(dpath);
	if( dpath.slice(-sep.length) != sep ){
		dpath = dpath + sep;
	}
	if(!dpath) {
		dpath = sep;
	}
	return dpath;
}

/**
 * Returns current working directory.
 * @method     cwd
 * @private
 * @param      {string}    [tack]    Optionally appends or (resolves)[resolve] additional context to the current working directory as needed.
 *		
 * @return     {string}            The resolved path.
 * @example
 * 
 *      // Asuming current working directory is: 
 *      //   /my/current/working/folder
 * 
 *      var foo = myfs.cwd();
 *      // foo = /my/current/working/folder
 *	    // gets the current working directory
 *
 *      var example = myfs.cwd("../");
 *      // foo = /my/current/working
 *	    // will back up to "working" directory
 *
 * 		var example = myfs.cwd("foo/bar"); 
 *      // will tack onto the end /my/working/folder/foo/bar
 * 
 * 
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
	var Apath = path.split(".");
	Apath.pop();
	return Apath.join(".") + "." + newExt;
}

// alias's

const base = name;
const filename = basename;
const dir = dirname;
const parent = dirname;
const posix = path.posix;
const win32 = path.win32;

module.exports = {
	clean 		: clean,
	name		: name,
	basename 	: basename,
	dirname 	: dirname,
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
	sep 		: sep, // provide what node says is slash, but interally, we always force forard slash "/"

	win32 		: win32, 	// leave as is
	posix 		: posix,	// leave as is

	removeTrailingSlash : removeTrailingSlash,
	addTrailingSlash : addTrailingSlash,
	swapExt : swapExt,
	cwd : cwd,

    // alias's
    base        : base,
    filename    : filename,
    dir         : dir,
    parent      : parent
};