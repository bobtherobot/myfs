import * as path from 'path';
var sep = path.sep;
var delimiter = sep == "/" ? ":" : ";";
function clean(arg){
	if(typeof arg == 'string'){
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
function basename(Vpath, Vext){
    if(Vext){
        if( ! /^\./.test(Vext)){
            Vext = "." + Vext;
        }
    }
	return path.basename( clean(Vpath), Vext );
}
function name(Vpath){
	return path.parse( clean(Vpath) ).name;
}
function dirname(Vpath, addTrailingSlash){
	return clean( path.dirname( clean(Vpath) ) ) + (addTrailingSlash ? sep : "");
}
function extname(Vpath){
	return path.extname( clean(Vpath) );
}
function ext(Vpath){
	return path.extname( clean(Vpath) ).replace(/^\./, "");
}
function isAbsolute(Vpath){
	return path.isAbsolute( clean(Vpath) );
}
function normalize(Vpath){
	return clean(Vpath);
}
function parse(Vpath){
	var res = path.parse( clean(Vpath) );
	res.ext2 = res.ext.replace(".", "");
	res.extension = res.ext2;
	res.basename = res.name;
	res.filename = res.base;
	res.parent = res.dir;
	res.path = Vpath;
	res.src = Vpath; 
	return clean( res );
}
function relative(Vfrom, Vto){
	return clean( path.relative( clean(Vfrom) , clean(Vto) ) );
}
function format(obj){
	return clean( path.format( clean( obj ) ) );
}
function join(first){
	var args
    if(Array.isArray(first)){
        args = first;
    } else {
        args = Array.prototype.slice.call(arguments);
    }
	return clean( path.join.apply(null, clean(args) ) );
}
function resolve(){
	var args = Array.prototype.slice.call(arguments);
	return clean( path.resolve.apply(null, clean(args) ) );
}
function removeTrailingSlash(dpath){
	dpath = clean(dpath);
	if( dpath.slice(-sep.length) == sep ){
		dpath = dpath.slice(0, dpath.length - 1);
	}
	return dpath;
}
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
function cwd(tack){
	var cwd = process.cwd()
	if(tack){
		return resolve(cwd, tack);
	} else {
		return cwd;
	}
}
function swapExt(path, newExt){
	var Apath = path.split(".");
	Apath.pop();
	return Apath.join(".") + "." + newExt;
}
const base = name;
const filename = basename;
const dir = dirname;
const parent = dirname;
const posix = path.posix;
const win32 = path.win32;
;
export {
	clean,
	name,
	basename,
	dirname,
	extname,
	ext,
	isAbsolute,
	normalize,
	parse,
	relative,
	format,
	join,
	resolve,
	delimiter,
	sep,
	win32,
	posix,
	removeTrailingSlash,
	addTrailingSlash,
	swapExt,
	cwd,
	base,
	filename,
	dir,
	parent
};