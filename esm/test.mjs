
var __dirname = import.meta.dirname;
import myfs from './index.mjs';
var testDir = myfs.join(__dirname, "test");
var testFile1 = "test1.txt";
var testFile2 = "test2.txt";
var testFile3 = "test3.txt";
function failed(msg, other){
	console.log(msg, other ? other : "");
	process.exit();
}
function wait(ms){
	var waitTill = new Date(new Date().getTime() + ms);
	while(waitTill > new Date()){
	}
    return
}
if( myfs.slash != "/" ){
	failed("fail: slash");
}
myfs.mkdir(testDir);
if( ! myfs.exists(testDir) ){
	failed("fail: save");
}
var path1 = myfs.join(testDir, testFile1);
var fileContents = "this is a test";
myfs.save(path1, fileContents);
if( ! myfs.exists(path1) ){
	failed("fail: save and join 1");
}
var path1 = myfs.join([testDir, testFile1]);
var fileContents = "this is a test";
myfs.save(path1, fileContents);
if( ! myfs.exists(path1) ){
	failed("fail: save and join 2 (as array)");
}
var contents = myfs.open(path1);
if( contents && contents != fileContents ){
	failed("fail: open");
}
var path2 = myfs.join(testDir, testFile2);
myfs.copy(path1, path2);
if( ! myfs.exists(path2) ){
	failed("fail: copy");
}
var newFile = myfs.dupe(path2);
if( ! myfs.exists(newFile) ){
	failed("fail: dupe");
}
myfs.rm(path2);
if( myfs.exists(path2) ){
	failed("fail: rm");
}
myfs.copy(path1, path2); 
var testDir2 = testDir + "2"
myfs.cpdir(testDir, testDir2);
if( ! myfs.exists(testDir2) ){
	failed("fail: cpdir");
}
var testDir2 = testDir + "2"
myfs.copy(testDir, testDir2);
if( ! myfs.exists(testDir2) ){
	failed("fail: copy (fu bump to du)");
}
var list = myfs.list(testDir2);
if( ! list.files.length ){
	failed("fail: list", list);
}
var list = myfs.list(testDir2, "txt");
if( ! list.files.length ){
	failed("fail: list");
}
myfs.empty(testDir2);
if( list.length ){
	failed("fail: empty");
}
var testDir3 = testDir + "3";
myfs.move(testDir, testDir3); 
wait(1000);
if( ! myfs.exists(testDir3) ){
	failed("fail: move", testDir3);
}
myfs.rmdir(testDir3); 
if( myfs.exists(testDir3) ){
	failed("fail: rmdir");
}
myfs.rmdir(testDir2);
var pathExample = "this/is/a/path";
var pathExampleBald = pathExample;
var pathExampleHair = pathExample + "/";
var pathExampleEmpty = "";
var pathExampleNull = null;
if( myfs.removeSlash(pathExampleHair) !== pathExampleBald ){
	failed("fail: removeSlash");
}
if( myfs.removeSlash(pathExampleBald) !== pathExampleBald ){
	failed("fail: removeSlash - already clean");
}
if( myfs.addSlash(pathExampleBald) !== pathExampleHair ){
	failed("fail: addSlash");
}
if( myfs.addSlash(pathExampleHair) !== pathExampleHair ){
	failed("fail: addSlash - has trailing slash already");
}
if( myfs.addSlash(pathExampleEmpty) !== "/" ){
	failed("fail: addSlash - empty string should return slash");
}
if( myfs.addSlash(pathExampleNull) !== "/" ){
	failed("fail: addSlash - null should return slash");
}
var example = "path/to/this.foo";
if( myfs.base(example) !== "this" ){
	failed("fail: base");
}
example = "path//\\\\//to///\/\/\///\\\\\/\/this.foo";
if( myfs.clean(example) !== "path/to/this.foo" ){
	failed("fail: clean", myfs.clean(example));
}
example = "/foo/bar/../boob";
if( myfs.normalize(example) !== "/foo/boob" ){
	failed("fail: normalize", myfs.normalize(example));
}
example = "/foo/bar/sally.txt";
if( myfs.dir(example) !== "/foo/bar" ){
	failed("fail: dir", myfs.dir(example));
}
example = "/foo/bar/sally.said.txt";
if( myfs.ext(example) !== "txt" ){
	failed("fail: ext");
}
example = "/foo/bar/sally.txt";
if( myfs.filename(example) !== "sally.txt" ){
	failed("fail: filename");
}
example = "/foo/bar/sally.txt";
if( myfs.name(example) !== "sally" ){
	failed("fail: name");
}
example = "/foo/bar/sally.txt";
if( myfs.parent(example) !== "/foo/bar" ){
	failed("fail: parent");
}
example = "/foo/bar/sally.txt";
if( ! myfs.isAbsolute(example) ){
	failed("fail: isAbsolute 1");
}
example =   {
    root : "/",
    dir : "/home/user/dir",
    base : "file.txt",
    ext : ".txt",
    name : "file"
}
if( myfs.format(example) != "/home/user/dir/file.txt" ){
	failed("fail: isAbsolute 2");
}
if( myfs.join("foo", "bar", "goes", "/into/", "here.jpg") != "foo/bar/goes/into/here.jpg" ){
	failed("fail: join", myfs.join("foo", "bar", "goes", "/into/", "here.jpg"));
}
if( myfs.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb') != '../../impl/bbb'){
	failed("fail: relative");
}
if( myfs.resolve("foo", "bar/", "goes", "/into/", "here.jpg") != "/into/here.jpg" ){
	failed("fail: resolve 1", myfs.resolve("foo", "bar/", "goes", "/into/", "here.jpg"));
}
if( myfs.resolve("/here.jpg") != "/here.jpg" ){
	failed("fail: resolve 2", myfs.resolve("/here.jpg"));
}
if( myfs.resolve("here.jpg") != __dirname + "/here.jpg" ){
	failed("fail: resolve 3", myfs.resolve("here.jpg"));
}
if( myfs.swapExt("here.jpg", "png") != "here.png" ){
	failed("fail: swapExt 1", myfs.swapExt("here.jpg", "png"));
}
if( myfs.swapExt("/path/to/here.jpg", "png") != "/path/to/here.png" ){
	failed("fail: swapExt 2");
}
var touchFile = "./touch.txt";
if( myfs.touch(touchFile) ) {
	if( ! myfs.exists(touchFile) ) {
		failed("fail: touch failed to create file");
	}
}
var touchDir = "./touch/";
if( myfs.touch(touchDir) ) {
	if( ! myfs.exists(touchDir) ) {
		failed("fail: touch failed to create folder (with trailing slash)");
	}
}
var stampStr = '1995-12-17T03:24:00';
var stamp = new Date(stampStr);
if( myfs.touch(touchFile, false, stamp) ) {
	var stats = fs.statSync(touchFile);
	if( stats.atime != stampStr ) {
		failed("fail: touch failed timestamp: " + stats);
	}
}
if( myfs.cwd() != "/Volumes/Drives/projects/myfs" ){
	failed("fail: cwd :" + myfs.cwd());
}
myfs.launch("README.md");
console.log("DONE... see any failures above? No? you good!");
process.exit();