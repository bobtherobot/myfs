
/*

# run

cd /Volumes/Drives/projects/myfs
node ./_build.js

*/


//var doc = require('documon');
var doc = require('/Volumes/Drives/projects/documon/documon/index.js'); // 

var bob = doc({
	src : "./",
	//src : "index.js",
	out : "/Users/bob/Desktop/docs/", // puts the docs into this folder.
	//more : __dirname
});