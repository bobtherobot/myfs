// --------------
// myjs
// --------------
// By Mike Gieson
// www.gieson.com

const du = require("./dirutils.js");
const fu = require("./fileutils.js");
const path = require("./npath.js");
const launch = require("./opn.js");

// hooks for esm
const node__filename = __filename;
const node__dirname = __dirname;


const myfs = {

    /**
     * @property {string} __filename - shortcut helper to get legacy node __filename (path to THIS current working file)
     */
    __filename : __filename,

    /**
     * @property {string} __dirname - shortcut helper to get legacy node __dirname (path to THIS current working directory). See also [cwd](#cwd)
     */
    __dirname : __dirname, //path.cwd(),

    /**
     * @property {dirutils} du - access to the underlaying directory utility class for access to additional methods that are not so common.
     */
    du: du,

    /**
     * @property {fileutils} fu - access to the underlaying file utility class for access to additional methods that are not so common.
     */
    fu: fu,


    /**
     * @property {npath} path - access to the underlaying path utility class for access to additional methods that are not so common.
     */
    path: path,

    /**
     * @property {string} sep - The kind of seperator used in paths. Windows = \\  or POSIX	= /
     */
    sep: path.sep,

    /**
     * @property {string} slash - alias for [sep](#sep)
     */
    slash: path.sep,




    /**
     * 
     * @method  addSlash - Alias for [addTrailingSlash](#addTrailingSlash). See [addTrailingSlash](#addTrailingSlash) for full details.
     * 
     * Will use appropriate slash based on system (windows gets back slash(s) "\\\\", posix gets forward slash "/")
     * @param   {string} path
     * @return  {string} - the appropriate path with trailing slash
     * @see [addTrailingSlash](#addTrailingSlash)
     * @see [addSlash](#addSlash) (alias for __addTrailingSlash__)
     * @see [removeTrailingSlash](#removeTrailingSlash)
     * @see [removeSlash](#removeSlash) (alias for __removeTrailingSlash__)
     * 
     */
    addSlash: path.addTrailingSlash,

    /**
     * 
     *
     * @method  addTrailingSlash - Adds a trailing slash to provided path when/if slash doesn't already exist.
     * 
     * Will use appropriate slash based on system (windows gets back slash(s) "\\\\", posix gets forward slash "/")
     * @param   {string} path
     * @return  {string} - the appropriate path with trailing slash
     * @see [addTrailingSlash](#addTrailingSlash)
     * @see [addSlash](#addSlash) (alias for __addTrailingSlash__)
     * @see [removeTrailingSlash](#removeTrailingSlash)
     * @see [removeSlash](#removeSlash) (alias for __removeTrailingSlash__)
     * @example
     * 
     *      var foo = myfs.addSlash("some/path");
     *      // foo = "some/path/"
     *      
     *      var foo = myfs.addSlash("some/path/"); // <-- already has trailing slash
     *      // foo = "some/path/" <-- same result, even when not needed
     */
    addTrailingSlash: path.addTrailingSlash,



    /**
     * @method  base - Extracts the base file name without extension. Alias for [name](#name).
     * @returns {string} - The base file name without the extension.
     * @see [basename](#basename) (includes extension)
     * @see [filename](#filename) (alias for __basename__)
     * @see [name](#name) (a helper when you don't want extension)
     * @example
     * 
     *      var foo = myfs.base("some/path/bob.txt");
     *      // foo = "bob"
     * 
     */
    base: path.name, // alias

    /**
     * 
     * Returns the filename (with or without extension) from the provided path string.
     * 
     * > Shortcut: If you don't want the extension, use [base](#base) or [name](#name).
     * 
     * @method basename
     * @param  {string} path - The full path
     * @param  {string} [ext] - Lops off the extension if it matches.
     * @return {string} - The last portion of a path, generally the "filename".
     * 
     * @see [filename](#filename) (alias for __basename__)
     * @see [name](#name) (a helper when you don't want extension)
     * @see [base](#base) (alias for __name__ )
     * @see Same as node's built-in [path.basename](https://nodejs.org/api/path.html#pathbasenamepath), with the helper of appending a "." if second argument does not include a dot.
     * 
     * @example
     * 
     *      var foo = myfs.basename("/foo/bar/bob.txt");
     *      // foo = "bob.txt"
     *      
     *      var foo = myfs.basename("/foo/bar/bob.txt", ".txt") 
     *      // foo = "bob" // default node behaviour
     *      
     *      var foo = myfs.basename("/foo/bar/bob.txt", "txt") 
     *      // foo = "bob" // ok without dot
     * 
     */
    basename: path.basename,



    /**
     * Normalizes slashes by converting double slash to single slash adhering to the platform slash requirements.
     * 
     * @method clean
     *
     * @param  {string | array | object} - The string to cleans. If array or object provided, will clean strings within there too, can also be multi-dimensional array or multi-dimensional object.
     *
     * @return {string}
     * 
     * @example
     * 
     * string
     * 
     * ~~~
     * var foo = myfs.clean("a\\b///c/d")
     * // foo =  "a/b/c/d"
     * ~~~  
     * 
     * 
     * object
     * 
     * ~~~
     * var foo = clean({
     *     a : "a//b/c\\d"
     * })
     *      
     * // foo = {a: "a/b/c/d"}
     * ~~~
     * 
     * 
     * array
     * 
     * ~~~ 
     * var foo = clean([
     *      "a//b/c\\d"
     *      "x\\y\/z"
     * ])
     *      
     * // foo = ["a/b/c/d", "x/y/z"]
     * ~~~
    */
    clean: path.clean,


    /**
     * Copies a file or folder from one location to another. Automatically handles creating destination folder structure if not exist.
     *
     * @method     copy
     * @param      {string}    src     - The source file path.
     * @param      {string}    dest    - The destination to copy the source to.
     * @param      {boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.)
     * 
     * @see [cp](#cp) (alias for copy)
     * @see [cpdir](#cpdir) (folders only)
     * @see [duplicate](#duplicate) (copy in place and make new file unique file name)
     * @see [dupe](#dupe) (alias for duplicate)
     * @example
     * 
     *      myfs.copy("path/to/file.txt", "somewhere/else/file.txt")
     *      // copies source file to new file "somewhere/else/file.txt"
     * 
     * Setting destination as a folder, will automatically pull the existing file name from src. NOTE: Automatically handles with/without destination trailing slash.
     * 
     *      myfs.copy("path/to/file.txt", "somewhere/else")
     *      // copies source file to new file "somewhere/else/file.txt"
     * 
     */
    copy: fu.copy,

    /**
     * @method  cp - Alias for [copy](#copy) -- see [copy](#copy) for details.
     * @param      {string}    src     - The source file path.
     * @param      {string}    dest    - The destination to copy the source to.
     * @param      {boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.)
     * @see [copy](#copy) (files and folders)
     * @see [cpdir](#cpdir) (folders only)
     * @see [duplicate](#duplicate) (copy in place and make new file unique file name)
     * @see [dupe](#dupe) (alias for duplicate)
     */
    cp: fu.copy,



    /**
     * Copies the entire folder's heirarchy folder from one location to another. If the other location doesn't exists, it will be constructed.
     *
     * 
     * @method cpdir
     *
     * @param  {string}  from - The source folder
     * @param  {string}  to   - The destination folder (get's created if not exist)
     * 
     * @see [copy](#copy) (files and folders)
     * @see [cp](#cp) (alias for copy)
     * @see [duplicate](#duplicate) (copy in place and make new file unique file name)
     * @see [dupe](#dupe) (alias for duplicate)
     */
    cpdir: du.copy,


    /**
     * Returns current working directory.
     * @method     cwd
     * @private
     * @param      {string}    [tack]    Optionally appends or (resolves)[resolve] additional context to the current working directory as needed.
     *		
    * @return     {string}            The resolved path.
    * @example
    * 
    *       // Asuming current working directory is: 
    *       //   /my/current/working/folder
    *       
    *       var foo = myfs.cwd();
    *       // foo = /my/current/working/folder
    *       // gets the current working directory
    *       
    *       var example = myfs.cwd("../");
    *       // foo = /my/current/working
    *       // backs up one step
    *       
    *       var example = myfs.cwd("foo/bar"); 
    *       // foo = /my/working/folder/foo/bar
    *       // tacks arg onto the end 
    * 
    * 
    */
     cwd: path.cwd,


    /**
     * Resolves the path to the parent folder of the provided path. 
     * 
     * If providing a path to a file, will return the path to the file's parent folder.
     * 
     * If providing a path to a folder, will return the provided path's parent folder.
     * 
     * Includes helper to [clean](#clean) slashes.
     * 	
     * @method dir
     * @param  {string} path - The path to parse.
     * @param  {boolean} [addTrailingSlash=false] - Add a trailing slass to the result?
     * @return {string} - The provided path's parent path.
     * @see [parent](#parent) (same thing, different name)
     * @example
     * 
     *      var foo = myfs.parent("/foo/bar/bob.txt");
     *      // foo = "/foo/bar"
     *      
     *      // with trailing slash:
     *      var foo = myfs.parent("/foo/bar/bob.txt", true);
     *      // foo = "/foo/bar/"
     *      
     *      var foo = myfs.parent("/foo/sally/yoyo/boob");
     *      // foo = "/foo/sally/yoyo"
     * 
     *      // with trailing slash:
     *      var foo = myfs.parent("/foo/sally/yoyo/boob", true);
     *      // foo = "/foo/sally/yoyo/"
     */

    dir: path.dirname,


    /**
     * Duplicates a file "in place" by appending a "copy N" to the base file name. Similar to how Mac's finder "keep both" works. 
     * 
     * @method  dupe
     * @param	{string} src - The source file path.
     * @returns	{string} - The file path to the newly duplicated file.
     * @see [copy](#copy) (files and folders)
     * @see [cp](#cp) (alias for copy)
     * @see [cpdir](#cpdir) (folders only)
     * @see [duplicate](#duplicate) (copy in place and make new file unique file name)
     * @example
     * 
     *      var foo = myfs.dupe("somewhere/foo.txt");
     *      // foo = "somewhere/foo copy.txt" <-- first time, no number
     *      
     *      var foo = myfs.dupe("somewhere/foo.txt");
     *      // foo = "somewhere/foo copy 1.txt" <-- next dupe will start to increment N
     *      
     * 
     * ... will duplicate the file and auto increment multiple copies (when called multiple times):
     * 
     *      "somewhere/foo copy.txt"
     *      "somewhere/foo copy 1.txt"
     *      "somewhere/foo copy 2.txt"
     *      "somewhere/foo copy 3.txt"
     */

    dupe: fu.dupe,

    /**
     * 
     * Duplicates a file "in place" by appending a "copy N" to the base file name. __Alias__ for [dupe](#dupe). See [dupe](#dupe) for details.
     * 
     * @method duplicate
     * @param {string} src - The source file path.
     * @returns	{string} - The file path to the newly duplicated file.
     * @see [copy](#copy) (files and folders)
     * @see [cp](#cp) (alias for copy)
     * @see [cpdir](#cpdir) (folders only)
     * @see [dupe](#dupe) (alias for duplicate)
     * 
     */

    duplicate: fu.dupe,



    /**
     * Recursively empties a folder of all it's contents (and all the sub-folder's contents), but leaves the source folder.
     *
     * @method empty
     *
     * @param  {string}   	who    - The source folder
     * @param  {boolean}   	[dryRun=false] - Prevents actual deletion, but still allows the return list to display what "will" be deleted.
     *
     * @return {array} - An array containing a list of paths to files and folders that we're deleted (or will be deleted when dryrun is true)
     * 
     * @example
     * 
     *      var foo = myfs.empty("/path/to/folder");
     *      // Result is an array of all the things that were deleted:
     *      // foo = [
     *      //     "/path/to/folder/a.txt",
     *      //     "/path/to/folder/b.txt",
     *      //     "/path/to/folder/c.txt",
     *      //     "/path/to/folder/sub/x/1.txt",
     *      //     "/path/to/folder/sub/x/2.txt",
     *      //     "/path/to/folder/sub/x/3.txt"
     *      // ]
     */

    empty: du.empty,


    /**
     * @method  exist - Alias for [exists](#exists) (plural). See [exists](#exists) for details.
     * @param {string} - The source file path.
     * @returns {boolean=false}  - True if exists, false if no file nor folder exists.
     */
    exist: fu.exists,


    /**
     * 
     * Checks to see if a file or folder exists. FYI: To validate either file or folder use [isFile](#isFile) or [isDir](#isDir).
     * 
     * @method     exists
     * @private
     * @param      {string} src - The source file path.
     * @return     {boolean=false} - True if exists, false if no file nor folder exists.
     * @see [isFile](#isFile) (file)
     * @see [isFolder](#isFolder) (folder)
     * @see [isDir](#isDir) (folder)
     * @example
     *  
     *      var foo = myfs.exists("/some/file/to/check.txt")
     *      // foo = TRUE or FALSE depending on reality.
     */

    exists: fu.exists,

    /**
     * Returns the bare, base extension (no dot).
     * @method ext
     * @param  {string} path - The path to parse.
     * @return {string} - The extension
     * @example
     * 
     *      var foo = myfs.ext("file.txt");
     *      // foo = "txt"
     */
    ext: path.ext, // alias


    /**
     * @method  filename - Gets the filename from a path, with or without extensions. Alias for [basename](#basename). See [basename](#basename) for details.
     * @param {string} path - The path to extract file name from.
     * @see [basename](#basename) (includes extension)
     * @see [name](#name) (a helper when you don't want extension)
     * @see [base](#base) (alias for __name__ )
     */
    filename: path.basename,



    /**
     * Combines the elements of an object into a string. The opposite of [parse](#parse). 
     * 
     * @example
     * ~~~
     * 		{
     * 			root : "/",
     * 			dir : "/home/user/dir",
     * 			base : "file.txt",
     * 			ext : ".txt",
     * 			name : "file"
     * 		}
     * ~~~
     * 
     * ... is converted to
     *
     * 		/home/user/dir/file.txt
     * 
     * @method  format
     * @param   {object}  obj  - The object containing some of the required keys to formulate a path.
     * @return  {string} - The string representation of the object.
     * @see [join](#join) (similar, but uses an array instead)
     * 
     */

    format: path.format,

    


    /**
     * Determines if path is an absolute path.
     *
     * @method  isAbsolute
     * @param   {string} path - The path to parse.
     * @return  {Boolean}
     * @example
     * 
     *      var foo = myfs.isAbsolute("/path/to/somwhere");
     *      // foo = true
     *      
     *      var foo = myfs.isAbsolute("../to/somwhere");
     *      // foo = false
     * 
     *      var foo = myfs.isAbsolute("./to/somwhere");
     *      // foo = false
     * 
     */
    isAbsolute: path.isAbsolute,


    /**
     * 
     * Checks the extension against a list of known binary files.
     * 
     * NOTE: This is not a fail-safe evaluation -- only a fast check against a known list of binary file extensions (I hope I'm not stuck in 1984?).
     * 
     * @method     isBinary
     * @param      {string}    src     - The source file path.
     * @return  {Boolean}
     * @example
     * 
     *      var foo = myfs.isBinary("/path/to/file.pdf");
     *      // foo = true
     *      
     *      var foo = myfs.isBinary("/path/to/file.txt");
     *      // foo = false
     * 
     */
    isBinary: fu.isFile,

    /**
     * @method isDir - Same as [isFolder](#isFolder). See [isFolder](#isFolder) for details.
     * @param {string} path - the path to check
     * @return  {Boolean}
     * @see [exists](#exists) (file or folder)
     * @see [isFile](#isFile) (file)
     * @see [isFolder](#isFolder) (folder)
     * @example
     * 
     *      var foo = myfs.isDir("/path/to/somewhere");
     *      // foo = true
     *      
     *      var foo = myfs.isDir("/path/to/file.txt");
     *      // foo = false
     */
    isDir: du.exists,

    /**
     * Validates if a file exists AND that it's not a folder. 
     * 
     * Use [exists](#exists) to generalize exisistance of file or folder.
     * 
     * > If the path is a FOLDER, will yield FALSE. 
     * 
     * @method isFile
     * @param {string} path - The source file path.
     * @return {Boolean}
     * @see [exists](#exists) (file or folder)
     * @see [isFolder](#isFolder) (folder)
     * @see [isDir](#isDir) (folder)
     * @example
     * 
     *      var foo = myfs.isFile("/path/to/somewhere");
     *      // foo = false
     *      
     *      var foo = myfs.isFile("/path/to/file.txt");
     *      // foo = true
     */
    isFile: fu.isFile,


    /**
     * Checks to see if provided path is a folder and not a file. 
     * 
     * Use [exists](#exists) to generalize exisistance of file or folder.
     * 
     * > If the path is a FILE, will still return FALSE. 
     * 
     * @method isFolder
     * @param {string} path - the path to check
     * @return {Boolean}
     * @see [exists](#exists) (file or folder)
     * @see [isFile](#isFile) (file)
     * @see [isDir](#isDir) (folder)
     * @example
     * 
     *      var foo = myfs.isDir("/path/to/somewhere");
     *      // foo = true
     *      
     *      var foo = myfs.isDir("/path/to/file.txt");
     *      // foo = false
     *
     */
    isFolder: du.exists,


    /**
     * 
     * @method  join - Joins path segments and resolves relativity.
     * @param	{string|array} paths - 
     * - __If string__: Send in as many arguments as you want as strings, each will be a segment in the result. 
     * - __If array__: Each item in the array will be a segment of the result. 
     * 
     * @return  {string} - The final combined string.
     * @see [format](#format) (similar, but uses an object instead)
     * @see Same as node's built-in [path.join](https://nodejs.org/api/path.html#pathjoinpaths), but we do extra step of cleaning provided arguments.
     * @example 
     * 
     *      var foo = myfs.join('/foo', 'bar');
     *      // foo = "/foo/bar"
     *       
     *      var foo = myfs.join('/foo', 'bar', 'baz/asdf', '..', 'quux');
     *      // foo = "/foo/bar/baz/quux"
     *      
     *      // essentially the same as above, but sending in an array
     *      var arr = ['/foo', 'bar', 'baz/asdf', '..', 'quux'];
     *      var foo = myfs.join(arr);
     *      // foo = "/foo/bar/baz/quux"
     * 
     */
    join: path.join,


    /**
     * 
     * @method launch - A file launcher. Opens stuff like websites, files, executables. Cross-platform.
     * @param {string} target - The URI to open. Example: "/path/to/track.mp3" will open the MP3 in the default media player.
     * @param {string} target - The URI to open.
     * @param {object} [opts] - Options
     * @param {array} [opts.app] - Specify the app to open the target with, or an array with the app and app arguments. 
     * 
     * The app name is platform dependent. Don't hard code it in reusable modules. For example, Chrome is google chrome on macOS, google-chrome on Linux and chrome on Windows.
     * 
     * @param {boolean} [opts.wait=true] - Wait for the opened app to exit before fulfilling the promise. If false it's fulfilled immediately when opening the app.
     * 
     * On Windows you have to explicitly specify an app for it to be able to wait.
     * @example
     * 
     *      myfs.launch("path/to/file.pdf");
     *      // will open the document with the systems native PDF handler
     * 
     *      myfs.launch("path/to/file.pdf", ["-f foo", "-o example"]);
     *      // will open the document with the systems native PDF handler, sending in "-f" and "-o" flags
     * 
     */
    launch: launch,


    /**
    Read a folder and returns an object containing a "files" array and a "dirs" array with full system absolute paths.
    
        {
            files : [
                "/path/to/file1.txt",
                "/path/to/file2.txt",
                "/path/to/file3.txt"
            ],
            dirs : [
                "/path/to/folder1",
                "/path/to/folder2",
                "/path/to/folder3"
            ]
        }
    
    @method list
    @param  {string} from - The path to the folder to read.
    @param  {function} [filter] - A custom filter function should return boolean (return TRUE to include, return FALSE to exclude). The function will be set arguments of the following signature:
    
        filter( isFolder [boolean], file [URI string], stats [instance of Node's statSync] );
        
    @param  {boolean} [recursive] - Should we read all sub-folders too?
    @param  {object} [store] - Used internally to store recursive findings. Note that you may also provide this argument and as an object `{files:[], dirs:[]}` and will populate your existing files/folder list. But is recommended to leave this argument alone.
    
    @return {object} - An object containing an array of "files" and "dirs" (folders), where each is an array.
    @see [listExt](#listExt) - A shortcut for specfying filtering based on extension(s).
    @see [ls](#ls) - (same as this "list" method)
    @see For filtering, the third argument "stats" will be Node's [statSync](https://nodejs.org/api/fs.html#fs_class_fs_stats)
    @example

        
        var contents = list("/path/to/folder");
        // contents = {
        //    files : [
        //        "/path/to/folder/index.html",
        //        "/path/to/folder/about.html",
        //    ],
        //    dirs : [
        //        "/path/to/folder/images",
        //        "/path/to/folder/styles"
        //    ]
        //}

    No filtering, but get all contents recursively.

        var contents = list("/path/to/folder", null, true);
        // contents = {
        //    files : [
        //        "/path/to/folder/index.html",
        //        "/path/to/folder/about.html",
        //        "/path/to/folder/images/1.jpg",
        //        "/path/to/folder/images/2.jpg",
        //        "/path/to/folder/images/3.jpg",
        //        "/path/to/folder/images/icons/logo.jpg",
        //        "/path/to/folder/images/icons/home.jpg",
        //        "/path/to/folder/styles/page.css",
        //        "/path/to/folder/styles/footer.css",
        //        "/path/to/folder/styles/min/page.min.css",
        //        "/path/to/folder/styles/min/footer.min.css"
        //    ],
        //    dirs : [
        //        "/path/to/folder/images",
        //        "/path/to/folder/images/icons",
        //        "/path/to/folder/styles",
        //        "/path/to/folder/styles/min"
        //    ]
        //}

    Filtering and recursively.
    
        var contents = list("/path/to/folder", (isDir, file, stats)=>{
            if( ! isDir ){
                return file.test(/.jpg$/i);
            } else {
                return false;
            }
        }), true);
        // contents = {
        //    files : [
        //        "/path/to/folder/images/1.jpg",
        //        "/path/to/folder/images/2.jpg",
        //        "/path/to/folder/images/3.jpg",
        //        "/path/to/folder/images/icons/logo.jpg",
        //        "/path/to/folder/images/icons/home.jpg"
        //    ],
        //    dirs : []
        //}
    
    */

    list: du.list,


    /**

     Collects files from a folder based on the specified extension (or extensions). Can be used to search recursively through all sub-folders, and can search multiple extensions.

     NOTE: Extension filtering is case-insensative, so files with both upper and lower-case extensions will be captured.

     Provided as shortcut for [list](#list) with your own extension-checking filter.

     * @method listExt
     *
     * @param  {string}			from 		- The path to search
     * @param  {string | array} [exts] 		- The extension to look for (e.g. "jpg"). 
     * - Use a string for one extension only: "txt"
     * - Or use a comma delimited list: "jpg, png, bmp"
     * - Or use an array: ["jpg", "png", "gif"]
     * 
     * 
     * @param  {boolean}		[recursive] - Find all matching files in all sub-folders.
     * @param  {function}		[filter] 	- A function to filter items on. The signature for this function's arguments is:
     - __isFolder__ (boolean): Whether the item is a folder or not
     - __file__ (string): The URI to the file
     - __stats__ (object) : Info for the file such as time. See Node's [statSync](https://nodejs.org/api/fs.html#fs_class_fs_stats)
     - __pathInfo__ (object) :  The path parsed to an object, broken down (see [parse](#parse) ).
     *
     * @return {array} - The resulting array contains only files that mathc the
     specified extension(s).
     * @see [list](#list) (roll your own)
     * @see [ls](#ls) (same as list)
     * @see [readExt](#readExt) (same thing, different name)
     * @see [parse](#parse) (for filter's pathInfo argument)
     * @see For filtering, the third argument "stats" will be Node's [statSync](https://nodejs.org/api/fs.html#fs_class_fs_stats)
     * @example
     * 
     *      var contents = list("/path/to/folder", "jpg", true);
     *      // contents = {
     *      //    files : [
     *      //        "/path/to/folder/images/1.jpg",
     *      //        "/path/to/folder/images/2.jpg",
     *      //        "/path/to/folder/images/3.jpg",
     *      //        "/path/to/folder/images/icons/logo.jpg",
     *      //        "/path/to/folder/images/icons/home.jpg"
     *      //    ],
     *      //    dirs : []
     *      //}
     * 
     * Using a filter:
     * 
     *      var contents = list("/path/to/folder", "jpg", true, (isFolder, file, stats, pathInfo) => {
     *          // assume isFolder will always be false.
     *          return /bob/i.test(pathInfo.name); // don't include files when "bob" is naked file name
     *      });
     *      // contents = {
     *      //    files : [
     *      //        "/path/to/folder/images/1.jpg",
     *      //        "/path/to/folder/images/2.jpg",
     *      //        "/path/to/folder/images/3.jpg",
     *      //        "/path/to/folder/images/icons/logo.jpg",
     *      //        "/path/to/folder/images/icons/home.jpg"
     *      //    ],
     *      //    dirs : []
     *      //}
     * 
     */

    listExt: du.readExt,


    /**
     * @method ls - Alias for [list](#list). See [list](#list) for details.
     * @param  {string} from - The path to the folder to read.
     * @param  {function} [filter] - A custom filter function.
     * @param  {boolean} [recursive] - Should we read all sub-folders too?
     * @param  {object} [store] - Used internally.
     * @return {object} - An object containing an array of "files" and "dirs" (folders), where each is an array.
     * @see [list](#list) (has more info and examples)
     * @see [listExt](#listExt) (helper to auto filter on extension)
     * @see [readExt](#readExt) (same as listExt)
     * @example
     *  
     *      var contents = myfs.ls("path/to/folder");
     *      // contents = {
     *      //    files : [
     *      //        ... all files found ...
     *      //    ],
     *      //    dirs : [
     *      //        ... all dirs found ...     
     *      //    ]
     *      // }
     */
    ls: du.list,



    /**
     * Creates a folder at the specified location. The sub-folder heirarchy is constructed as needed. 
     * 
     * @method makedir
     * @param  {string}  path
     * @see [mkdir](#mkdir) (same thing, different name)
     * @example
     * 
     *      // using absolute path
     *      myfs.makedir("/path/to/create/me"); 
     * 
     *      // using relative path
     *      myfs.makedir("create/me"); 
     * 
     * 
     * 
     */
    makedir: du.mkdir,

    /**
     * Exact same thing as [makedir](#makedir)
     * 
     * @method mkdir
     * @param  {string}  path
     * @see [makedir](#makedir) (same thing, different name)
     * @example
     * 
     *      // using absolute path
     *      myfs.mkdir("/path/to/create/me"); 
     * 
     *      // using relative path
     *      myfs.mkdir("create/me"); 
     * 
     * 
     * 
     */
    mkdir: du.mkdir,



    /**
     * Moves (or renames) a file or folder.
     * 
     * @method     move
     * @param      {string}    from    	- The source file path.
     * @param      {string}    to    	- The destination file path.
     * @see [rename](#rename) (same thing, different name)
     * @example
     * 
     *      // rename a file
     *      myfs.move("some/file.txt", "some/new_name.txt");
     *      
     *      // move a file
     *      myfs.move("some/file.txt", "put/here/file.txt");
     *      
     *      // rename a folder
     *      myfs.move("some/folder", "some/new_folder_name");
     *      
     *      // move a folder
     *      myfs.move("some/folder", "put/here/folder");
     * 
     */
    move: fu.rename,



    /**
     * 
     * Extracts the file name without extension.
     * 
     * > If you want the extension, use [basename](#basename) (includes extension)
     * 
     * @method name
     * @param  {string} path - The path to a file. (But can also just be a file name too.)
     * @return {string} - The last portion of a path, generally the "filename" but without the extension.
     * @example
     * 
     *      var name = myfs.name("/foo/bar/bob.txt")
     *      // name =  "bob"
     * 
     *      var name = myfs.name("bob.txt")
     *      // name =  "bob"
     * 
     * 
     * @see [basename](#basename) (includes extension)
     * @see [filename](#filename) (alias for __basename__)
     * @see [base](#base) (alias for __name__ )
     * 
     */
    name: path.name,



    /**
     * Resolves ".." and "." portions of a path.
     * Reduces double slashes to single (e.g. // -> /  )
     * Forces back-slashes to forward slashes (e.g. \ -> /  )
     *
     * Retains trailing slash if exists.
     * 		
     *   	myfs.normalize("/foo/////bar") --> "/foo/bar"
     *   	myfs.normalize("/foo/bar/../boob") --> "/foo/boob"
     *   	myfs.normalize("./foo/") --> "/current/working/dir/foo/"
     *
     * @method  normalize
     * @param   {string} path - The path to parse.
     * @return  {string} - The normalized path.
     */
    normalize: path.normalize,


    /**
     * Reads the data out of a file.
     *
     * @method     open
     * @param      {string}    src    - The source file path.
     * @param      {boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.)
     * @return     {string | binary} - Returns the contents of the file.
     * @see [read](#read) (same thing, different name)
     * @example
     * 
     *      var foo = myfs.open("path/to/file.txt");
     *      // foo = "all the text contents of the file"
     */
    open: fu.read,


    /**
     * Resolves the path to the parent folder of the provided path. 
     * 
     * If providing a path to a file, will return the path to the file's parent folder.
     * 
     * If providing a path to a folder, will return the provided path's parent folder.
     * 
     * Includes helper to [clean](#clean) slashes.
     * 	
     * @method parent
     * @param  {string} path - The path to parse.
     * @param  {boolean} [addTrailingSlash=false] - Add a trailing slass to the result?
     * @return {string} - The provided path's parent path.
     * @see [dir](#dir) (same thing, different name)
     * @example
     * 
     *      var foo = myfs.parent("/foo/bar/bob.txt");
     *      // foo = "/foo/bar"
     *      
     *      // with trailing slash:
     *      var foo = myfs.parent("/foo/bar/bob.txt", true);
     *      // foo = "/foo/bar/"
     *      
     *      var foo = myfs.parent("/foo/sally/yoyo/boob");
     *      // foo = "/foo/sally/yoyo"
     * 
     *      // with trailing slash:
     *      var foo = myfs.parent("/foo/sally/yoyo/boob", true);
     *      // foo = "/foo/sally/yoyo/"
     */

    parent: path.dirname,



    /**
    Extracts basic path and file parts. The opposite of [format](#format), but includes additional non-nodejs fields in an attempt to normalize/simplify concepts. 

    @method  parse
    @param   {string}  path - The path to parse.
    @return  {object} - An object containing the following properties:

        {
            // Traditional node properties (used by "format")
            root    : "/",
            dir     : "/home/user/dir",
            base    : "file.txt",
            ext     : ".txt",
            name    : "file",
        
            // Additional "for my brain" fields:
            ext2     : "txt" 		// no dot
            extension: "txt" 		// alias to above
            basename : "file" 	
            filename : "file.txt"
            parent   : "/home/user/dir"
            path     : "/home/user/dir/file.txt" 	// the original source path string
            src      : "/home/user/dir/file.txt" 	// same as above
        }

    @example

        var foo = myfs.parse('/home/user/dir/file.txt');
        // foo = {
        //     root     : "/",
        //     dir      : "/home/user/dir",
        //     base     : "file.txt",
        //     ext      : ".txt",
        //     ext2     : "txt" 		// no dot
        //     extension: "txt" 		// alias to above
        //     name     : "file",
        //     basename : "file" 	
        //     filename : "file.txt"
        //     parent   : "/home/user/dir"
        //     path     : "/home/user/dir/file.txt" 	// the original source path string
        //     src      : "/home/user/dir/file.txt" 	// same as above
        // }

    */
    parse: path.parse,


    /**
     * Reads the data out of a file.
     *
     * @method     read
     * @param      {string}    src    - The source file path.
     * @param      {boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.)
     * @return     {string | binary} - Returns the contents of the file.
     * @see [open](#open) (same thing, different name)
     * @example
     * 
     *      var foo = myfs.read("path/to/file.txt");
     *      // foo = "all the text contents of the file"
     */
    read: fu.read,



    /**
     * @method readExt - Alias for [listExt](#listExt). See [listExt](#listExt) for details.
     * @param  {string}			from 		- The path to search
     * @param  {string | array} [exts] 		- The extension to look for.
     * @param  {boolean}		[recursive] - Find all matching files in all sub-folders.
     * @param  {function}		[filter] 	- A function to filter items on.
     * @returns {object} - An object containing 2 properties: files, dirs. Each will be array of found paths.
     * @see [listExt](#listExt) (has more details and examples, same thing, different name)
     * @see [list](#list) (roll your own)
     * @see [ls](#ls) (same as list)
     */
    readExt: du.readExt,



    /**
     * Creates a relative path between __from__ and __to__.
     *
     * @method  relative
     *
     * @param   {string}    [from]  - When null, the cwd is used for this value.
     * @param   {string}    [to]    - When null, the cwd is used for this value.
     *
     * @return  {string}	- The relative path between __from__ and __to__
     * @example
     * 
     * 		var foo = myfs.relative('/path/to/test/aaa', '/path/to/impl/bbb')
     * 		// Returns: '../../impl/bbb'
     * 
     */
    relative: path.relative,

    /**
     * Deletes a file from the system.
     * @method remove
     * @param {string} path - The source file path.
     * @see [rm](#rm) (same thing, different name)
     * @see [removeDir](#removeDir) (to remove directory)
     * @see [rmdir](#rmdir) (same as removeDir)
     * @example
     * 
     *      myfs.remove("path/to/file.txt")
     * 
     */
    remove: fu.remove,

    /**
     * Recursively removes a __folder__ and all of it's sub-folders and files as well.
     * 
     * @method removeDir
     * @param  {string} who - The path to the folder
     * @param  {boolean} [dryRun=false] - Prevents actual deletion, but still allows the return to return the list of items that "will" be deleted.
     * @return {array} - An array of all the items that were deleted (or "will be" deleted if dryrun is true).
     * 
     * @see [rmdir](#rmdir) (same thing, different name)
     * @see [rm](#rm) (for deleting files)
     * @see [remove](#remove) (for deleting files, same as rm, different name)
     * @example
     * 
     *      var foo = myfs.rmdir("path/to/folder")
     *      // foo = [
     *      //     "this/file/was/removed.txt",
     *      //     "this/folder/gone",
     *      //      ... etc... 
     *      // ]
     * 
     */
    removeDir: du.remove,






    /*
     * Platform environment PATH delimiter.
     * 
     * > NOTE: This is not the directory [slash](#slash), rather this is used for determining environment $PATH varible
     *
     * Example of how PATH appears on Windows:
     * 
     *      'C:\Windows\system32;C:\Windows;C:\Program Files\node\'
     * 
     * Example of how PATH appears on POSIX systems (Mac Unix):
     * 
     *      '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'
     *
     * Read the PATH with Node:
     * 
     * ~~~
     * console.log(process.env.PATH)
     * 
     * // Windows  = ; (semicolon)
     * // POSIX	  = : (colon)
     * ~~~
     * 
     * @property {string} delimiter
     
    delimiter: path.delimiter,
    */

    /**
     * 
     * @method  removeSlash - Removes a trailing slash from path (if exists). Same thing as [removeTrailingSlash](#removeTrailingSlash).
     * @param   {string} path
     * @return  {string} - The path with the trailing slash removed.
     * @see [removeTrailingSlash](#removeTrailingSlash) (same thing, different name)
     * @see [addTrailingSlash](#addTrailingSlash)
     * @see [addSlash](#addSlash) (alias for __addTrailingSlash__)
     * @example
     * 
     *      var foo = myfs.removeSlash("/path/to/somewhere/")
     *      // foo = "/path/to/somewhere"
     * 
     */
    removeSlash: path.removeTrailingSlash,

    /**
     * @method  removeTrailingSlash - Removes a trailing slash from path (if exists). Same thing as [removeSlash](#removeSlash).
     * @param   {string} path
     * @return  {string} - The path with the trailing slash removed.
     * @see [removeSlash](#removeSlash) (same thing, different name)
     * @see [addTrailingSlash](#addTrailingSlash)
     * @see [addSlash](#addSlash) (alias for __addTrailingSlash__)
     * @example
     * 
     *      var foo = myfs.removeTrailingSlash("/path/to/somewhere/")
     *      // foo = "/path/to/somewhere"
     * 
     */
    removeTrailingSlash: path.removeTrailingSlash,


    /**
     * Renames (or moves) a file or folder.
     * 
     * @method     move
     * @param      {string}    from    	- The source file path.
     * @param      {string}    to    	- The destination file path.
     * @see [move](#move) (same thing, different name)
     * @example
     * 
     *      // rename a file
     *      myfs.rename("some/file.txt", "some/new_name.txt");
     *      
     *      // move a file
     *      myfs.rename("some/file.txt", "put/here/file.txt");
     *      
     *      // rename a folder
     *      myfs.rename("some/folder", "some/new_folder_name");
     *      
     *      // move a folder
     *      myfs.rename("some/folder", "put/here/folder");
     * 
     */
    rename: fu.rename,

    /**
     * Generates an __absolute path__ based on the provided arguments.
     * 
     * If an absolute path is not resolved after constructing all arguments, the CWD is inserted.
     *
     * 		resolve("a", "b", "c"); // yields: "/current/working/dir/a/b/c"
     *
     * Agin, path construction occurs from right < to < left
     * 
     * 		resolve("/a", "b", "c"); // yields: "/a/b/c"
     *
     * If an absolute path is resolved during construction, the items to the left are ignored.
     *
     * 		resolve("a", "/b", "c"); // yields: "/b/c" ("a" is ignored)
     *
     * Relative paths are automatically resolved:
     *
     * 		resolve("/a", "../b", "c"); // yields "/a/c"
     * 
     * 
     *
     *
     * @method	resolve
     * @param	{string} path - All arguments are evaluated as paths for construction.
     * @param	{string} [...] - Any numer of arguments can be included to construct/build the path.
     * @return 	{string}
     * @see Same as node's built-in [path.resolve](https://nodejs.org/api/path.html#pathresolvepaths), but we do extra step of cleaning provided arguments.
     
     */
    resolve: path.resolve,

    /**
     * Deletes a __file__ from the system. Exact same thing as [remove](#remove). See [remove](#remove) for details.
     * @method rm
     * @param {string} path - The source file path.
     * @see [remove](#remove) (same thing, different name)
     * @see [removeDir](#removeDir) (to remove directory)
     * @see [rmdir](#rmdir) (same as removeDir)
     * 
     * @example
     *  
     *      myfs.rm("/path/to/file.txt")
     * 
     */
    rm: fu.remove,

    /**
     * Exact same thing as [removeDir](#removeDir). See [removeDir](#removeDir) for details.
     *
     * @method rmdir
     * @param  {string} who - The path to the folder
     * @param  {boolean} [dryRun=false] - Prevents actual deletion.
     * @return {array} - Deleted items.
     * 
     * @see [removeDir](#removeDir) (same thing, different name)
     * @see [rm](#rm) (for deleting files)
     * @see [remove](#remove) (for deleting files, same as rm, different name)
     */
    rmdir: du.remove,




    /**
     * Changes a path's extension. Can apply to a basic filename or a full path.
     * 
     * NOTE: This operates on a string (path), not the actual system file. You'll need to use [rename](#rename) if you want to do this kind of operation on file system.
     * @method     swapExt
     * @param      {string}     path      The original path.
     * @param      {string}     newExt    The new extenion to use.
     * @return     {sring}               The new path.
     */
    swapExt: path.swapExt,



    /**
     * Saves text or binary data to a file. Overwrites entire file with provided data.
     * 
     * If the folder structure for the destination path does not exist, it will be created automatically for you.
     *
     * @method     save
     * @param      {string}    destination    - The place where you want the file to go.
     * @param      {string}    data    - The data to save.
     * @param      {string|boolean}   [binary=false]  - Is this a binary file? (We assume it's a text file.) Honors the string "binary" or just use a boolean. If you use a string, only "binary" is recognized, anything other than "binary" will default down to "UTF-8".
     * @returns - NOTHING
     * @see [write](#write) (same thing, different name)
     * @example
     * 
     *      myfs.save("path/to/file.txt", "this is my text data to put into the file")
    */
    save: fu.write,


    /**
     * Can do 3 things:
     * 1. Update the timestamp (to "now") on a file or folder.
     * 2. Create an empty file (without data). (aka: Initialize a file, so it exists).
     * 3. Create an empty folder (if not exits)
     * 
     * To specify that you want to touch a directory, include a trailing slash on the path, or set __isFolder__ to true, otherwise we assume your toughing a file.
     * 
     * @method touch
     * @param {string} path - The file or folder path.
     * @param {boolean} [isFolder=false] - Whether your trying to touch a folder. A trailing slash on the path is assume isFolder=true
     * @param {Date} [date=now] - To specify a specific date, use a Date object, otherwise time "now" is used.
     */

    touch: fu.touch,

    /**
     * Exact same thing as [save](#save). See [save](#save) for details.
     *
     * @method     write
     * @param      {string}    destination    - The path.
     * @param      {string}    data    - The data.
     * @param      {string|boolean}   [binary=false]  - Is this a binary file?
     * @see [save](#save)
    */
    write: fu.write,

}

module.exports = myfs
