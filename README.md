# myfs
My simplified, cross-platform methods for manipulating files and folders syncronously with Node.js.

### Install

	npm install myfs --save
	... or
	yarn add myfs


### Usage

	var myfs = require('myfs');
	var data = myfs.open("/path/to/file.txt");

### Docs
See the "docs" folder for better details than this md file can provide.


#### Properties
| Property | Description |
|----------|-------------|
|__sep__ | The kind of seperator used in paths. Windows = \ or POSIX = /
|__delimiter__ | Platform environment $PATH delimiter.
|__du__ | Access to the underlaying directory utility class for access to additional methods that are not so common.
|__fu__ | Access to the underlaying file utility class for access to additional methods that are not so common.
|__path__ | Access to the underlaying path utility class for access to additional methods that are not so common.

#### Methods

NOTE: We're not including arguments because including the params here makes things visually complicated. See the DOCs folder for details. This is just a quick reference.


##### File & Folder stuff

| Method | Arguments | Description |
|--------|-----------|-------------|
|__copy__|src, dest, binary|Copies a file from one location to another.|
|__cp__|src, dest, binary|alias for copy|
|__cpdir__|from, to|Copies the entire folder's heirarchy folder from one location to another. If the other location doesn't exists, it will be constructed.|
|__empty__|who, dryRun|Recursively empties a folder of all it's contents (and all the sub-folder's contents), but leaves the source folder.|
|__exists__|src|Checks to see if a file exists. Note this also checks if a folder of the same name exists too.|
|__launch__|target, opts|A file launcher. Opens stuff like websites, files, executables.|
|__list__ |from, filter, recursive, store| A file launcher. Opens stuff like websites, files, executables. Cross-platform.|
|__listExt__|from, exts, recursive|Collects files from a folder based on the specified extension (or extensions). Can be used to search recursively through all sub-folders, and can search multiple extensions.|
|__ls__||alias for list|
|__makedir__|destination|Creates a folder at the specified location. The sub-folder heirarchy is constructed as needed. |
|__move__|src|Moves a file or folder. |
|__open__|src, binary|Reads the data out of a file.|
|__rm__|src|Deletes a file from the system.|
|__rmdir__|who, dryRun|Recursively removes a folder and all of it's sub-folders as well.|
|__write__|src, data, binary|Saves text data to a file. Overwrites entire file with provided data.|


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


### License
MIT - Mike Gieson
