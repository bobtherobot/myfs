# myfs
My lightweight, Node-specific, no dependancy, simplified, cross-platform methods for manipulating files and folders syncronously with Node.js.


### Install

	npm install myfs --save
	... or
	yarn add myfs


# Quick Reference


NOTE: See the "docs" folder details (this is just a basic listing).


| Method | Arguments | Description |
|--------|-----------|-------------|
|__copy__|src, dest, binary|Copies a file from one location to another.|
|__cp__|src, dest, binary|alias for copy|
|__cpdir__|from, to|Copies the entire folder's heirarchy folder from one location to another. If the other location doesn't exists, it will be constructed.|
|__empty__|who, dryRun|Recursively empties a folder of all it's contents (and all the sub-folder's contents), but leaves the source folder.|
|__exists__|src|Checks to see if a file or folder exists. |
|__launch__|target, opts|A file launcher. Opens stuff like websites, files, executables using the native system program.|
|__list__ |from, filter, recursive, store| Read a folder and returns an object containing a "files" array and a "dirs" array. Each array lists full system paths.|
|__listExt__|from, exts, recursive|Returns an array of paths for files that have the extension(s). The ext argument can be an array to return multiple extensions.|
|__ls__||alias for list|
|__makedir__|destination|Creates a folder at the specified location. The sub-folder heirarchy is constructed as needed. |
|__move__|src|Moves a file or folder. |
|__rename__|src|Alias for move. |
|__open__|src, binary|Reads the text or binary data out of a file. Use the "binary" (boolean) argument for non-text files. |
|__rm__|src|Deletes a file from the system.|
|__rmdir__|who, dryRun|Recursively removes a folder and all of it's sub-folders as well.|
|__save__|src, data, binary|Saves text data to a file. Overwrites entire file with provided data.|
|__write__|src, data, binary|Alias for save.|
|__isFile__|src|Checks to see if src is a file, as opposed to exists, which checks if either file OR folder exists.|
|__isDir__|src|Checks to see if src is a folder, as opposed to exists, which checks if either file OR folder exists.|
|__touch__|src|Creates or updates the timestamp on a specific file or folder.|


##### Path Stuff

| Method | Arguments | Description |
|--------|-----------|-------------|
|__addSlash__|path|Adds a trailing slash from path (if doesn't exist).|
|__addTrailingSlash__||alias for addSlash|
|__removeSlash__|path|Removes a trailing slash from path (if exists).|
|__removeTrailingSlash__|path|alias for removeSlash|
|__resolve__|path...|Generates an absolute path based on the provided arguments.|
|__base__|name|alias for basename|
|__basename__|path, ext|Returns the last portion of a path, generally the "filename".|
|__clean__|arg|Normalizes slashes by converting double \ to single \ and / to \ or \ tp / based on the current platform requirements.
|__dir__||alias for dirname|
|__ext__|src|Returns the bare, base extension (no dot).|
|__filename__|src|alias for basename|
|__format__|obj|Combines the elements of an object into a string. The opposite of path.parse().|
|__isAbsolute__|src|Determines if path is an absolute path.|
|__join__|paths...|Joins path segments and resolves relativity.|
|__name__|path|npath.name("/foo/bar/bob.txt") --> "bob"|
|__normalize__|path|Resolves ".." and "." portions of a path. Reduces double slashes to single (e.g. // -> / ). Forces back-slashes to forward slashes (e.g. \ -> / ). Retains trailing slash if exists.|
|__parent__|path|Returns the path to the parent folder that the item resides within.|
|__parse__|path|Note that this uses the mind-warping name, basename, ext of the default Node.path.parse() plus some props that don't hurt my brain. Extracts basic path and file parts. root, dir, base, ext, name, ext2, extension, basename, filename, parent|
|__relative__|from, to|Creates a relative path between "from" and "to"|
|__cwd__|tack|Gets the current working directory. Resolves the argument to the path. |
|__swapExt__|src|Changes the path's (or filename's) extension.


#### Properties

| Property | Description |
|----------|-------------|
|__sep__ | The kind of seperator used in paths. Windows = \ or POSIX = /
|__delimiter__ | Platform environment $PATH delimiter.
|__du__ | Access to the underlaying directory utility class for access to additional methods that are not so common.
|__fu__ | Access to the underlaying file utility class for access to additional methods that are not so common.
|__path__ | Essentially the same as Node's built-in path, but has a few extras and unified cross-platform'd. This provides access to the underlaying path utility class for access to additional methods that are not so common.

### Usage

	var myfs = require('myfs');
	var data = myfs.open("/path/to/file.txt");
	myfs.save("/path/to/file.txt", "This is the contents of my file.");


Open / Read 

	var myfile = myfs.open("/path/to/folder/file1.txt"); // Yeilds the text contents of the file.
	var myfile = myfs.read("/path/to/folder/file1.txt"); // same as above

Save / Write

	var myfile = myfs.save("/path/to/folder/file1.txt", data); // Wites the text data to the file.
	var myfile = myfs.write("/path/to/folder/file1.txt", data); // same as above

Listing files from a folder

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

	var mylist = myfs.listExt("/path/to/folder", ["txt", "foo"]);
	//
	// Yeilds
	// 		[
	// 			"/path/to/folder/file1.txt",
	// 			"/path/to/folder/file2.txt",
	// 			"/path/to/folder/bob1.foo",
	// 			"/path/to/folder/bob2.foo"
	// 		]





### Change log

1.0.15 - Sept. 8, 2018

- readExt/listExt would not capture file with upper-case extensions. Made upper/lower-case agnostic. When call this method, use lower-case strings for your extension(s).

1.0.14 - August 14, 2018

- added filter to the ```readExt```

1.0.13 - August 14, 2018

- Check if dir exists before attempt to delete
- ```copy``` now copies folders too.
- Added ```touch```

1.0.12 - May 1, 2018

- ensure exists added into a couple other places in fileutils
- fileutils.write now honors a string in the binary argument
- added better documentation on readdir filter 

1.0.8 - May 1, 2018

- Added __swapExt__

### License
MIT - Mike Gieson
