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

var binaryExt = [
	"3dm",
	"3ds",
	"3g2",
	"3gp",
	"7z",
	"a",
	"aac",
	"adp",
	"ai",
	"aif",
	"aiff",
	"alz",
	"ape",
	"apk",
	"ar",
	"arj",
	"asf",
	"au",
	"avi",
	"bak",
	"baml",
	"bh",
	"bin",
	"bk",
	"bmp",
	"btif",
	"bz2",
	"bzip2",
	"cab",
	"caf",
	"cgm",
	"class",
	"cmx",
	"cpio",
	"cr2",
	"cur",
	"dat",
	"dcm",
	"deb",
	"dex",
	"djvu",
	"dll",
	"dmg",
	"dng",
	"doc",
	"docm",
	"docx",
	"dot",
	"dotm",
	"dra",
	"DS_Store",
	"dsk",
	"dts",
	"dtshd",
	"dvb",
	"dwg",
	"dxf",
	"ecelp4800",
	"ecelp7470",
	"ecelp9600",
	"egg",
	"eol",
	"eot",
	"epub",
	"exe",
	"f4v",
	"fbs",
	"fh",
	"fla",
	"flac",
	"fli",
	"flv",
	"fpx",
	"fst",
	"fvt",
	"g3",
	"gh",
	"gif",
	"graffle",
	"gz",
	"gzip",
	"h261",
	"h263",
	"h264",
	"icns",
	"ico",
	"ief",
	"img",
	"ipa",
	"iso",
	"jar",
	"jpeg",
	"jpg",
	"jpgv",
	"jpm",
	"jxr",
	"key",
	"ktx",
	"lha",
	"lib",
	"lvp",
	"lz",
	"lzh",
	"lzma",
	"lzo",
	"m3u",
	"m4a",
	"m4v",
	"mar",
	"mdi",
	"mht",
	"mid",
	"midi",
	"mj2",
	"mka",
	"mkv",
	"mmr",
	"mng",
	"mobi",
	"mov",
	"movie",
	"mp3",
	"mp4",
	"mp4a",
	"mpeg",
	"mpg",
	"mpga",
	"mxu",
	"nef",
	"npx",
	"numbers",
	"nupkg",
	"o",
	"oga",
	"ogg",
	"ogv",
	"otf",
	"pages",
	"pbm",
	"pcx",
	"pdb",
	"pdf",
	"pea",
	"pgm",
	"pic",
	"png",
	"pnm",
	"pot",
	"potm",
	"potx",
	"ppa",
	"ppam",
	"ppm",
	"pps",
	"ppsm",
	"ppsx",
	"ppt",
	"pptm",
	"pptx",
	"psd",
	"pya",
	"pyc",
	"pyo",
	"pyv",
	"qt",
	"rar",
	"ras",
	"raw",
	"resources",
	"rgb",
	"rip",
	"rlc",
	"rmf",
	"rmvb",
	"rtf",
	"rz",
	"s3m",
	"s7z",
	"scpt",
	"sgi",
	"shar",
	"sil",
	"sketch",
	"slk",
	"smv",
	"snk",
	"so",
	"stl",
	"suo",
	"sub",
	"swf",
	"tar",
	"tbz",
	"tbz2",
	"tga",
	"tgz",
	"thmx",
	"tif",
	"tiff",
	"tlz",
	"ttc",
	"ttf",
	"txz",
	"udf",
	"uvh",
	"uvi",
	"uvm",
	"uvp",
	"uvs",
	"uvu",
	"viv",
	"vob",
	"war",
	"wav",
	"wax",
	"wbmp",
	"wdp",
	"weba",
	"webm",
	"webp",
	"whl",
	"wim",
	"wm",
	"wma",
	"wmv",
	"wmx",
	"woff",
	"woff2",
	"wrm",
	"wvx",
	"xbm",
	"xif",
	"xla",
	"xlam",
	"xls",
	"xlsb",
	"xlsm",
	"xlsx",
	"xlt",
	"xltm",
	"xltx",
	"xm",
	"xmind",
	"xpi",
	"xpm",
	"xwd",
	"xz",
	"z",
	"zip",
	"zipx"
];


/**
 * Checks the extension against a list of known binary files.
 * 
 * NOTE: This is not a fail-safe evaluation -- only a fast check.
 * 
 * @method     isBinary
 * @param      {string}    src     - The source file path.
 * @param      {boolean}   [manual]  - Used interally to see if the user actually set a value.
 */
function isBinary(src, manual){
	if ( typeof manual == 'undefined' ) {
		return binaryExt.indexOf( path.ext(src) ) > -1;
	}
	return manual;
}

/**
 * Duplicates a file "in place" by appending a "copy N" to the base file name.
 * 
 * Example:
 * 
 *  	myfs.copy("somewhere/foo.txt");
 * 
 *  	... will make "somewhere/foo copy.txt"
 *  	... will auto increment multiple copies:
 * 
 * 		"somewhere/foo copy.txt"
 * 		"somewhere/foo copy 1.txt"
 * 		"somewhere/foo copy 2.txt"
 * 		"somewhere/foo copy 3.txt"
 * 
 * @method  dupe
 * @param	{string}	src 	- The source file path.
 * @returns	{string}	- The file path to the newly duplicated file.
 */
function dupe(src) {

    var info = path.parse(src);

    var base = info.parent + "/" + info.basename + " copy";
    var newPath = base + info.ext;

    if( exists(newPath) ) {
        var count = 1;
        while ( exists(newPath) && count < 1000 ) { // 1000 = prevent while freeze
            newPath = base + " " + count + info.ext;
            count++;
        }
    }

    copy(src, newPath, binaryExt.indexOf(info.ext2) > -1);

    return newPath
    
}

/**
 * Copies a file from one location to another.
 * 
 * Will also copy a folder if the provided src is a folder. But this is just a convieneince, I recommend using dir.copy or dir.cp directly.
 *
 * @method     copy
 * @param      {string}    src     - The source file path.
 * @param      {string}    dest    - The destination to copy the source to.
 * @param      {boolean}   [binary]  - When not set, we'll see if the file extension matches a binary file type. This is not a fail-safe evaluation, so we recommend manually setting this value (if you know).
 */
function copy( src, dest, binary ) {
	if ( ! exists( src ) ) {
		return false;
	}

	if ( du.exists( src ) ) {
		return du.copy(src, dest);
	}

	var bin = isBinary(src, binary);

	var data = fs.readFileSync( src, bin ? null : "UTF-8" );

	// if just folder provided, tack on the file name.
	if ( du.exists( dest ) ) {
		var name = path.basename( src );
		dest = path.removeTrailingSlash( dest ) + "/" + name;
	}

	ensureParentExists(dest);

	fs.writeFileSync( dest, data, bin ? null : "UTF-8" );
	
}

/**
 * Ensures a file's parent folder exists so when we attempt to write, there's a folder ot write into.
 * The associated mkdir constructs the entire heirarchy as needed.
 * @method     ensureParentExists
 * @private
 * @param      {type}                src    - the path
 */
function ensureParentExists(src){
	var par = path.parent(src);
	if ( ! du.exists( par ) ) {
		du.mkdir(par);
	}
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

	var bin = isBinary(src, binary)
	return fs.readFileSync( src, bin ? null : "UTF-8" );
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
 * @param      {string|boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.) Honors the string "binary" or just use a boolean. If you use a string, only "binary" is recognized, anything other than "binary" will default down to "UTF-8".
 */
function write( src, data, binary ) {
	if(binary){
		if(typeof binary == 'string'){
			if(binary.toLowerCase() == "binary"){
				binary = true;
			} else {
				binary = false;
			}
		}
	}

	var bin = isBinary(src, binary)
	
	ensureParentExists(src);
	fs.writeFileSync( src, data, bin ? "binary" : "UTF-8" );
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

/**
 * Creates or updates the timestamp on a specific file or folder.

To specify that you want to touch a directory, include a trailing slash on the path, or set the isFolder argument to true, otherwise we assume your toughing a file.

 * @method     touch
 * @param      {string}    path    	- The file or folder path.
 * @param      {boolean}   isFolder - Whether your trying to touch a folder. A trailing slash on the path is assume isFolder=true
 * @param      {Date}   	[date=now] - To specify a specific date, use a Date object, otherwise time "now" is used.

 */

 var sep = path.sep;
function touch( path, isFolder, date ) {

	const stamp = parseInt(new Date(date || Date.now()).getTime() / 1000);

	if( typeof isFolder === 'undefined'){
		isFolder = (path.substr(-1) == sep);
	}

	if( exists(path) ) {

		fs.utimesSync(path, stamp, stamp);

	} else {

		if(isFolder){
			fs.mkdirSync(path);
		} else {
			var fd = fs.openSync(path, 'a+');
			fs.closeSync(fd);
		}

	}

}


/**
 * Alias for [copy](#copy)
 * @method     cp
 */


/**
 * Alias for [read](#read)
 * @method     open
 */

 /**
 * Alias for [write](#write)
 * @method     save
 */

 /**
 * Alias for [rename](#rename)
 * @method     move
 */

module.exports = {
	cp: copy, // alias
	copy: copy,
	read: read,
	open: read, // alias
	write: write,
	save: write, // alias
	remove: remove,
	exists: exists,
	rename: rename,
	move: rename, // alias
	isFile : isFile,
	touch : touch,
	dupe : dupe,
	duplicate : dupe, // alias
	isBinary : isBinary
}
