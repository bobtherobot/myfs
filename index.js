// --------------
// myjs
// --------------
// By Mike Gieson
// www.gieson.com


if (typeof require !== 'undefined') {

	var du = require("./dirutils.js");
	var fu = require("./fileutils.js");
	var path = require("./npath.js");
	var launch = require("./opn.js");

	module.exports = {

		/**
		 * @property {dirutils} du - access to the underlaying [directory utility](myfs.dirutil) class for access to additional methods that are not so common.
		 */
		du: du,

		/**
		 * @property {fileutils} fu - access to the underlaying [file utility](myfs.fileutil) class for access to additional methods that are not so common.
		 */
		fu: fu,


		/**
		 * @property {npath} path - access to the underlaying [path utility](myfs.npath) class for access to additional methods that are not so common.
		 */
		path: path,

		
		/**
		 * A file launcher. Opens stuff like websites, files, executables. Cross-platform.
		 *
		 * Using [opn](https://github.com/sindresorhus/opn)
		 *
		 * @method launch
		 * @param {string} target - The URI to open. Example: "/path/to/track.mp3" will open the MP3 in the default media player.
		 * @param {object} [opts] - Options - See [opn.js[myfs.opn] for details
		 */
		launch: launch,


		// ================================================
		// ================================================
		// ================================================
		// ================================================
		// directory
		// ================================================

		/**
		 * Creates a folder at the specified location. The sub-folder heirarchy is constructed as needed. 
		 * 
		 * __Alias__ for [du.makedir](myfs.dirutils.makedir)
		 * 
		 * @method makedir
		 * @param  {string}  destination
		 */
		mkdir: du.mkdir,



		/**
		 * Copies the entire folder's heirarchy folder from one location to another. If the other location doesn't exists, it will be constructed.
		 *
		 * __Alias__ for [du.copydir](myfs.dirutils.copydir)
		 * 
		 * @method cpdir
		 *
		 * @param  {string}  from - The source folder
		 * @param  {string}  to   - The destination folder (get's created if not exist)
		 */
		cpdir: du.copy,



		/**
		 * Recursively removes a folder and all of it's sub-folders as well.
		 *
		 * __Alias__ for [du.copydir](myfs.dirutils.removedir) 
		 *
		 * @method rmdir
		 *
		 * @param  {string}		who    	- The path to the folder
		 * @param  {boolean}	dryRun 	- Prevents actual deletion, but still allows the return to return the list of items that "will" be deleted.
		 *
		 * @return {array} - An array of all the items that were deleted (or "will be" deleted if dryrun is true.
		 */
		rmdir: du.remove,



		/**
		 * Read a folder and returns an object containing all of the files and
		 *  folder in arrays.
		 * 
		 * __Alias__ for [du.copydir](myfs.dirutils.readdir)
		 * 
		 * @method list
		 *
		 * @param  {string}  	from      	- The path to the folder to read.
		 * @param  {function}  	filter   	- A custom filter funciton.
		 * @param  {boolean}  	recursive 	- Should we retrieve sub-folders too?
		 * @param  {object}  	store     	- Used internally to store recursive findings.
		 Note that you may also provide this argument and readdir will populate your
		 existing files/folder list. But is recommended to leave this argument alone.
		 *
		 * @return {object} - An object containing a list of "files" and "folders" 
		 (as properties of the returned list), where each is an array.
		 * 
		@example
		 	var contents = readdir("/path/to/folder", null, true);
		 	// yeids contents {
			// 		files : [
			// 					"/path/to/folder/1.foo",
			// 					"/path/to/folder/2.bar",
			// 					"/path/to/folder/3.png",
			//					"/path/to/folder/sub1/1.foo",
			// 					"/path/to/folder/sub2/2.bar",
			// 					"/path/to/folder/sub3/3.png"
			// 				],
			// 		dirs : [
			// 					"/path/to/folder/sub1",
			// 					"/path/to/folder/sub2",
			// 					"/path/to/folder/sub3"
			// 
			// 				]
			// }

		 */
		list: du.list,


		/**
		 * @method ls alias for [list](#list)
		 */
		ls: du.list,

		/**
		 * Collects files from a folder based on the specified extension (or
		 extensions). Can be used to search recursively through all sub-folders, and can
		 search multiple extensions.

		 Provided as shortcut for [readdir](#readdir) with your own
		 extension-checking filter.

		 __Alias__ for [du.copydir](myfs.dirutils.readExt)

		 * @method listExt
		 *
		 * @param  {string}		from 		- The path to search
		 * @param  {string | array} [exts] 	- The extension to look for (e.g. "jpg"). To
		 search for multiple extensions, use an array e.g. ["jpg", "png", "gif"]
		 * @param  {boolean}	[recursive] - Find all matching files in all
		 sub-folders.
		 *
		 * @return {array} - The resulting array contains only files that mathc the
		 specified extension(s).
		 */
		listExt: du.listExt,

		/**
		 * Recursively empties a folder of all it's contents (and all the sub-folder's contents), but leaves the source folder.
		 *
		 * __Alias__ for [du.copydir](myfs.dirutils.empty)
		 * 
		 * @method empty
		 *
		 * @param  {string}   	who    - The source folder
		 * @param  {boolean}   	dryRun - Prevents actual deletion, but still allows the return list to display what "will" be deleted.
		 *
		 * @return {array} - An array containing a list of paths to files and folders that we're deleted (or will be deleted when dryrun is true) 
		 */

		empty: du.empty,









		// ================================================
		// ================================================
		// ================================================
		// ================================================
		// file
		// ================================================


		/**
		 * 
		 * Checks to see if a file exists. Note this also checks if a folder of the same name exists too.
		 * 
		 * @method     exists
		 * @private
		 * @param      {type}    src    - The source file path.
		 * @return     {boolean}        - True if exists, false if no file nor folder exists.
		 */

		exists: fu.exists,

		/**
		 * @method  exist - alias for [exists](exists) (plural)
		 */
		exist: fu.exists,


		/**
		 * Reads the data out of a file.
		 *
		 * __Alias__ for [fu.read](myfs.fu.read)
		 *
		 * @method     open
		 * @param      {string}    src    - The source file path.
		 * @param      {boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.)
		 * @return     {string | binary}
		 */
		read: fu.read,


		/**
		 * @method open alias for [read](#read)
		 */
		open: fu.read,


		/**
		 * Saves text data to a file. Overwrites entire file with provided data.
		 *
		 * __Alias__ for [fu.write](myfs.fu.write)
		 *
		 * @method     save
		 * @param      {string}    src    - The source file path.
		 * @param      {string}    data    - The text data to save.
		 * @param      {boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.)
		 */
		write: fu.write,

		/**
		 * @method save - alias for [write](#write)
		 */
		save: fu.write,

		/**
		 * @method  cp - alias for [copy](#copy)
		 */
		cp: fu.copy,

		/**
		 * Copies a file from one location to another.
		 *
		 * __Alias__ for [fu.copy](myfs.fu.copy)
		 *
		 * @method     copy
		 * @param      {string}    src     - The source file path.
		 * @param      {string}    dest    - The destination to copy the source to.
		 * @param      {boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.)
		 */
		copy: fu.copy,

		/**
		 * Deletes a file from the system.
		 * @method     rm
		 * @param      {string}    src    - The source file path.
		 */
		rm: fu.remove,

		/**
		 * Moves a file or folder.
		 * 
		 * __Alias__ for [fu.rename](myfs.fileutils.rename)
		 * 
		 * @method     move
		 * @param      {string}    src    - The source file path. The destination file path.
		 */
		move: fu.move,







		// ================================================
		// ================================================
		// ================================================
		// ================================================
		// path
		// ================================================

		/**
		 * @property {string} sep - The kind of seperator used in paths. Windows = \\  or POSIX	= /
		 */
		sep: path.sep,


		/**
		 * 		npath.name("/foo/bar/bob.txt") --> "bob"
		 * 
		 * @method name
		 * @param  {string} path - The full path
		 * @return {string} - The last portion of a path, generally the "filename" but without the extension.
		 */
		name: path.name,

		/**
		 * 		npath.basename("/foo/bar/bob.txt") --> "bob.txt"
		 *   	npath.basename("/foo/bar/bob.txt", ".txt") --> "bob"
		 * 
		 * @method basename
		 * @param  {string} path - The full path
		 * @param  {string} ext - Lops off the extension if it matches.
		 * @return {string} - The last portion of a path, generally the "filename".
		 */
		basename: path.basename,

		/**
		 * @method  filename - alias for [basename](#basename)
		 */
		filename: path.basename,

		/**
		 * @method  base - alias for [name](#name)
		 */
		base: path.name, // alias


		/**
		 * Returns the path to the parent folder that the item resides within.
		 * 	
		 * 		npath.dirname("/foo/bar/bob.txt") --> "/foo/bar"
		 *   	npath.dirname("/foo/sally/yoyo/boob") --> "/foo/sally/yoyo"
		 * 
		 * @method parent
		 * @param  {string} Vpath - The path to parse.
		 * @return {string} - The path to the file/folder.
		 */

		parent: path.parent,


		/**
		 * @method  dir - alias for [dirname](#dirname)
		 */
		dir: path.dirname, // alias

		/**
		 * Returns the bare, base extension (no dot).
		 * @method ext
		 * @param  {string} Vpath - The path to parse.
		 * @return {string} - The extension
		 */
		ext: path.ext, // alias

		/**
		 * Determines if path is an absolute path.
		 *
		 * @method  isAbsolute
		 * @param   {string} Vpath - The path to parse.
		 * @return  {Boolean}
		 */
		isAbsolute: path.isAbsolute,

		/**
		 * Resolves ".." and "." portions of a path.
		 * Reduces double slashes to single (e.g. // -> /  )
		 * Forces back-slashes to forward slashes (e.g. \ -> /  )
		 *
		 * Retains trailing slash if exists.
		 * 		
		 *   	npath.normalize("/foo/////bar") --> "/foo/bar"
		 *   	npath.normalize("/foo/bar/../boob") --> "/foo/boob"
		 *   	npath.normalize("./foo/") --> "/current/working/dir/foo/"
		 *
		 * @method  normalize
		 * @param   {string} Vpath - The path to parse.
		 * @return  {string}
		 */
		normalize: path.normalize,


		/**
 * Normalizes slashes by converting double \\ to single \ and / to \\ or \\ tp / based on the current platform requirements.
 * 
 * @method clean
 *
 * @param  {string | array} arg
 *
 * @return {string}
 */
		clean: path.clean,

		/**
		Extracts basic path and file parts.

			path.parse('/home/user/dir/file.txt')

			// Yeilds 

			{
				// (traditional node proerties)
				root	: "/",
				dir		: "/home/user/dir",
				base	: "file.txt",
				ext		: ".txt",
				name	: "file"

				// additional "for my brain" labels:
				ext2		: "txt" 			// no dot
				extension	: "txt" 		// alias
				basename	: "file" 	
				filename	: "file.txt"
				parent		: "/home/user/dir"
			}

		@method  parse
		@param   {string}  Vpath - The path to parse.
		@return  {object} - An object containing the following properties:

			{
				root : "/",
				dir : "/home/user/dir",
				base : "file.txt",
				ext : ".txt",
				name : "file"
			}

		*/
		parse: path.parse,

		/**
		 * Creates a relative path between `from` adn `to`.
		 *
		 * 		path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')
		 * 		// Returns: '../../impl/bbb'
		 *
		 * @method  relative
		 *
		 * @param   {string}    [from]  - When null, the cwd is used for this value.
		 * @param   {string}    [to]    - When null, the cwd is used for this value.
		 *
		 * @return  {string}	- The relative path between `from` and `to`
		 */
		relative: path.relative,

		/**
		 * The opposite of path.parse().
		 *
		 * Combines the elements of an object into a string. 
		 *
		 * Example:
		 * 		
		 * 		{
		 * 			root : "/",
		 * 			dir : "/home/user/dir",
		 * 			base : "file.txt",
		 * 			ext : ".txt",
		 * 			name : "file"
		 * 		}
		 * 		
		 * 	... is converted to
		 *
		 * 		/home/user/dir/file.txt
		 * 		
		 *
		 * @method  format
		 * @param   {object}  obj  - The object containing some of the required keys to formulate a path.
		 * @return  {type} - The string representaiton of the object.
		 */

		format: path.format,

		/**
		 * Joins path segments and resolves relativity.
		 *
		 * 		path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
		 * 		Returns: '/foo/bar/baz/asdf'
		 * 
		 *
		 * @method  join
		 * @param	{string} paths... - All arguments are evaluated as paths for construction
		 * @return  {type}  description
		 */
		join: path.join,


		/**
		 * Generates an absolute path based on the provided arguments.
		 *
		 * Path construction occurs from right < to < left
		 * 
		 * 		resolve("/a", "b", "c"); // yields: "/a/b/c"
		 *
		 * If an absolute path is resolved during construction, the items to the left are ignored.
		 *
		 * 		resolve("a", "/b", "c"); // yields: "/b/c" ("a" is ignored)
		 *
		 * If an absolute path is not resolved after constructing all arguments, the CWD is inserted.
		 *
		 * 		resolve("a", "b", "c"); // yields: "/current/working/dir/a/b/c"
		 *
		 * Relative paths are automatically resolved:
		 *
		 * 		resolve("/a", "../b", "c"); // yields "/a/c"
		 * 
		 * 
		 *
		 * @method	resolve
		 * @param	{string} [path...] - All arguments are evaluated as paths for construction.
		 * @return 	{string}
		 */
		resolve: path.resolve,

		/**
		 * Platform environment PATH delimiter.
		 *
		 * Example of how PATH appears on Windows:
		 * 
		 * 		'C:\Windows\system32;C:\Windows;C:\Program Files\node\'
		 * 
		 * Example of how PATH appears on POSIX systems (Mac Unix):
		 * 
		 * 		'/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'
		 *
		 * Read the PATH with Node:
		 * 
		 * 		console.log(process.env.PATH)
		 * 
		 * 		Windows 	= ;
		 *   	POSIX	= : 
		 *
		 * @property {string} delimiter
		 */
		delimiter: path.delimiter,

		/**
		 * Removes a trailing slash from path (if exists).
		 *
		 * @method  removeSlash
		 * @param   {string} path
		 * @return  {string} 
		 */
		removeSlash: path.removeTrailingSlash,

		/**
		 * @method  removeTrailingSlash - alias for [removeSlash](#removeSlash)
		 */
		removeTrailingSlash: path.removeTrailingSlash,

		/**
		 * Adds a trailing slash from path (if doesn't exist).
		 *
		 * @method  addSlash
		 * @param   {string} path
		 * @return  {string} 
		 */
		addSlash: path.addTrailingSlash,

		/**
		 * @method  addTrailingSlash - alias for [addSlash](#addSlash)
		 */
		addTrailingSlash: path.addTrailingSlash

	}

}