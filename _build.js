
/*

# run

cd /Volumes/Drives/projects/myfs
node ./_build.js

*/


//var doc = require('documon');
var doc = require('/Volumes/Drives/projects/documon/documon/index.js');

var bob = doc({
	src : __dirname,
	out : __dirname + "/", // puts the docs into this folder.
	more : __dirname
});