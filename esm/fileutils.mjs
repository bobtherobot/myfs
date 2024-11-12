import * as fs from 'fs';
import * as path from './npath.mjs';
import * as du from './dirutils.mjs';
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
function isBinary(src, manual){
	if ( typeof manual == 'undefined' ) {
		return binaryExt.indexOf( path.ext(src) ) > -1;
	}
	return manual;
}
function dupe(src) {
    var info = path.parse(src);
    var base = info.parent + "/" + info.basename + " copy";
    var newPath = base + info.ext;
    if( exists(newPath) ) {
        var count = 1;
        while ( exists(newPath) && count < 1000 ) { 
            newPath = base + " " + count + info.ext;
            count++;
        }
    }
    copy(src, newPath, binaryExt.indexOf(info.ext2) > -1);
    return newPath
}
function copy( src, dest, binary ) {
	if ( ! exists( src ) ) {
		return false;
	}
	if ( du.exists( src ) ) {
		return du.copy(src, dest);
	}
	var bin = isBinary(src, binary);
	var data = fs.readFileSync( src, bin ? null : "UTF-8" );
	if ( du.exists( dest ) ) {
		var name = path.basename( src );
		dest = path.removeTrailingSlash( dest ) + "/" + name;
	}
	ensureParentExists(dest);
	fs.writeFileSync( dest, data, bin ? null : "UTF-8" );
}
function ensureParentExists(src){
	var par = path.parent(src);
	if ( ! du.exists( par ) ) {
		du.mkdir(par);
	}
}
function isFile(src){
	if( ! exists(src) ){
		return false;
	}
	var val = false;
	var obj;
	try {
		var obj = fs.statSync(who); 
		if(obj){
			val = ! obj.isDirectory();
		}
	} catch(e){
	}
	return val;
}
function read( src, binary ) {
	if ( !fs.existsSync( src ) ) {
		return false;
	}
	var bin = isBinary(src, binary)
	return fs.readFileSync( src, bin ? null : "UTF-8" );
}
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
function remove( src ) {
    fs.unlinkSync( src );
}
function exists( src ) {
	return fs.existsSync( src ) || du.exists( src )
}
function rename( from, to ) {
	fs.rename( from, to, function( err ) {
		if ( err ) throw err;
	} );
}
 var sep = path.sep;
function touch( path, isFolder, date ) {
	const stamp = parseInt(new Date(date || Date.now()).getTime() / 1000);
	if( typeof isFolder === 'undefined'){
		isFolder = (path.slice(-1) == sep);
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
const cp = copy;
const open = read;
const save = write;
const move = rename;
const duplicate = dupe;


export {
	copy,
	read,
	write,
	remove,
	exists,
	rename,
	isFile,
	touch,
	dupe,
	isBinary,
	cp,
	open,
	save,
	move,
	duplicate
};