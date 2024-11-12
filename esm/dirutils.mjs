import * as fs from 'fs';
import * as path from './npath.mjs';
function makedir(dest) {
    dest = path.resolve(dest);
    if (!fs.existsSync(dest)) {
        makedir(path.dirname(dest));
        fs.mkdirSync(dest); 
    }
};
function readExt(from, exts, recursive, filter){
    if(typeof exts == "string") {
        exts = exts.split(",");
    }
    for(var i=0; i<exts.length; i++){
        exts[i] = exts[i].trim().toLowerCase();
    }
	var extFilter = function(isFolder, file, stats){
        if( isFolder ){
            return false;
        } else {
            var item = path.parse( file );
            var ok = exts.indexOf(item.ext.substring(1).toLowerCase()) > -1;
            if(filter && ok){
                ok = filter(isFolder, file, stats, item);
            }
            return ok;
        }
    };
	var obj = readdir(from, extFilter, recursive);
	return obj.files;
}
function readdir(from, filter, recursive, store){
	if( ! store ){
		store = { dirs: [], files: [] };
	}
	var hasFilterFunction = typeof filter == 'function';
	var files = fs.readdirSync(from);
	var len = files.length;
	for(var i=0; i<len; i++){
		var file = path.join(from, files[i]);
      	var stats = false; 
      	try {
      		stats = fs.statSync(file);  
      	} catch(e) {
      	}
      	if(stats){
      		if ( stats.isDirectory() ) {
	            if(hasFilterFunction){
	        		if( filter( true, file, stats ) ){
	        			store.dirs.push(file);
	        		}
	        	} else {
	        		store.dirs.push(file);
	        	}
	            if(recursive){
	            	readdir(file, filter, true, store);
	            }
	        } else if ( stats.isFile() ) {
	        	if(hasFilterFunction){
	        		if( filter( false, file, stats ) ){
	        			store.files.push(file);
	        		}
	        	} else {
	        		store.files.push(file);
	        	}
	        }
      	}
	}
	return store;
}
function copydir(from, to) {
    var list = readdir(from, null, true);
    if(	! exists(to) ){
    	makedir(to);
    }
    var dirs = list.dirs.sort(); 
	for(var i=dirs.length; i--;){
		makedir(  path.join(to, path.relative(from, dirs[i]))  );
	}
    var files = list.files;
	for(var i=files.length; i--;){
		var file = files[i];
        fs.writeFileSync(
        		path.join(to, path.relative(from, file)), 
        		fs.readFileSync(file, 'binary'), 
        		'binary'
        	);
	}
};
function emptydir(who, dryRun) {
	var removed = [];
	if( exists(who) ) {
	    var list = readdir(who, null, true);
	    var files = list.files;
		for(var i=files.length; i--;){
			var file = files[i];
			removed.push(file);
	        if( ! dryRun ){
	            fs.unlinkSync(file);
	        }
		}
		var dirs = list.dirs.sort(); 
		for(var i=dirs.length; i--;){
			var dir = dirs[i]
			removed.push(dir);
			if( ! dryRun ){
	            fs.rmdirSync(dir);
	        }
		}
	}
	return removed;
};
function removedir(who, dryRun){
	var removed = emptydir(who, dryRun);
	if( exists(who) ) {
		removed.push(who);
	    if( ! dryRun ){
	       fs.rmdirSync(who);
	    }
	}
    return removed;
}
function exists(who){
	var val = false;
	var obj;
	try {
		var obj = fs.statSync(who); 
		if(obj){
			val = obj.isDirectory();
		}
	} catch(e){
	}
	return val;
}
function rename( from, to ) {
	fs.rename( from, to, function( err ) {
		if ( err ) throw err;
	} );
}
const make = makedir;
const mkdir = makedir;
const copy = copydir;
const cp = copydir;
const read = readdir;
const list = readdir;
const listExt = readExt;
const empty = emptydir;
const remove = removedir;
const isFolder = exists;
const isDir = exists;


export {
	make,
	mkdir,
	copy,
	cp,
	read,
	readExt,
	list,
	listExt,
	empty,
	remove,
	exists,
	isFolder,
	isDir,
	rename
};