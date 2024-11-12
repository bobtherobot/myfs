# myfs
My lightweight, Node-specific, no dependancy, simplified, cross-platform methods for manipulating files and folders syncronously with Node.js.


## Install

	npm install myfs --save
	
## Usage

Load myfs (choose one!)

    // Load myfs for CommonJS:
    //var myfs = require("myfs");

    // Load myfs for ESM (native import):
    import myfs from "myfs";

Open / Read 

	var myfile = myfs.open("/path/to/folder/file1.txt"); // Yeilds the text contents of the file.
	var myfile = myfs.read("/path/to/folder/file1.txt"); // same as above

Save / Write

	var myfile = myfs.save("/path/to/folder/file1.txt", data); // Wites the text data to the file.
	var myfile = myfs.write("/path/to/folder/file1.txt", data); // same as above

Listing files from a folder. NOTE: This can list recursively too.

	var mylist = myfs.list("/path/to/folder");
	//
	// Yeilds
	//
	// {
	// 		files : [
	// 					"/path/to/folder/file1.txt",
	// 					"/path/to/folder/file2.txt",
	// 					"/path/to/folder/file3.txt"
	// 					],
	// 		dirs : [
	// 					"/path/to/folder/folder1",
	// 					"/path/to/folder/folder2",
	// 					"/path/to/folder/folder3"
	// 					]
	// 	}


Listing only files of X extension.

	var mylist = myfs.listExt("/path/to/folder", "txt");
	//
	// Yeilds
	// 		[
	// 			"/path/to/folder/file1.txt",
	// 			"/path/to/folder/file2.txt",
	// 			"/path/to/folder/file3.txt"
	// 		]


Listing files of X & Y extension

	var mylist = myfs.listExt("/path/to/folder", "txt,foo");
	//
	// Yeilds
	// 		[
	// 			"/path/to/folder/file1.txt",
	// 			"/path/to/folder/file2.txt",
	// 			"/path/to/folder/bob1.foo",
	// 			"/path/to/folder/bob2.foo"
	// 		]


## Documentation

Full documentation for all properties and methods available here:
[https://documon.net/projects/myfs/](https://documon.net/projects/myfs/)

You can also find the full documentation in the downloaded package locally (within node_modules) at:

    /node_modules/myfs/docs

You can also download the docs (and source) from [the repo here](https://github.com/bobtherobot/myfs)

Below is a quick reference for common methods.

### Quick Reference

This quick reference only includes the most commonly used methods, with simple descriptions.

#### Properties

| Property | Description |
|----------|-------------|
|__slash__ | The kind of seperator used in paths. Windows = \ or POSIX = /
|____dirname__ | Same as native __dirname, but provices access for ESM imports.
|____filename__ | Same as native __filename, but provices access for ESM imports.

#### Methods

| Method | Arguments | Description |
|--------|-----------|-------------|
|__copy__|src, dest|Copies a file or a folder from one location to another. Automatically handles creating destination folder structure if not exist.|
|__empty__|path, dryRun|Recursively empties a folder of all it's contents (and all the sub-folder's contents), but leaves the source folder.|
|__list__ |from, filter, recursive, store| Read a folder and returns an object containing a "files" array and a "dirs" array. Each array lists full system paths.|
|__listExt__|from, exts, recursive|Returns an array of paths for files that have the extension(s). The exts argument can be a comma-delimited string list of extensions.|
|__mkdir__|path|Creates a folder at the specified location. The sub-folder heirarchy is constructed as needed. |
|__rm__|src|Deletes a file from the system.|
|__rmdir__|who, dryRun|Recursively removes a folder and all of it's sub-folders as well.|
|__move__|src|Moves a file or folder. Can also be used to rename files and folders|
|__open__|src, binary|Reads the text or binary data out of a file.|
|__save__|src, data, binary|Saves data to a file. Overwrites entire file with provided data.|
|__isFile__|src|Checks to see if src is a file, as opposed to exists, which checks if either file OR folder exists.|
|__isBinary__|src|A cheap/fast check to see if a file's extension is in a list of known binary extensions.|
|__exists__|path|Checks to see if a file or folder exists. |
|__isDir__|src|Checks to see if src is a folder, as opposed to exists, which checks if either file OR folder exists.|
|__touch__|src|Creates or updates the timestamp on a specific file or folder.|
|__dupe__|src|Duplicates a file "in place" by making a copy with appended "copy N" in the file name.|
|__launch__|target, opts|A file launcher. Opens stuff like websites, files, executables using the native system program.|
|__addSlash__|path|Adds a trailing slash from path (if doesn't exist).|
|__removeSlash__|path|Removes a trailing slash from path (if exists).|
|__resolve__|path...|Generates an absolute path based on the provided arguments.|
|__basename__|path, ext|Returns the last portion of a path, with or without extension.|
|__name__|path|Returns the naked file name without extension. ("/foo/bar/bob.txt" --> "bob"|
|__ext__|src|Returns the bare, base extension (no dot).|
|__clean__|arg|Normalizes slashes by converting double \ to single \ and / to \ or \ tp / based on the current platform requirements.
|__parent__|path|Returns the path to the parent folder that the item resides within.|
|__join__|paths...|Joins path segments and resolves relativity.|
|__normalize__|path|Resolves ".." and "." portions of a path. Reduces double slashes to single (e.g. // -> / ). Forces back-slashes to forward slashes (e.g. \\ -> / ).|
|__parse__|path|Extracts basic path and file parts. root, dir, base, ext, name, ext2, extension, basename, filename, parent. Extends NodeJS's native "path.parse()" with additional fields with more context.|
|__cwd__|tack|Gets the current working directory. Resolves the argument to the path. Simliar to native __dirname, which is depreciated.|
|__swapExt__|src|Changes the path's (or filename's) extension.
|...|And many more!|Plus there are aliases for many methods. For those who think diffrently.|

