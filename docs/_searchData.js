var SearchData = {
	"myfs.dirutils": "dirutils : collection utilities manipulating directories syncronouslydirutils myfs",
	"myfs.dirutils.makedir": "makedir : Creates folder specified location folder heirarchy constructed needed example folder exists here path folder following folders exists path folder three Then three tree will constructed inside path foldermakedir destination folder create",
	"myfs.dirutils.readExt": "readExt : Collects files from folder based specified extension extensions used search recursively through folders search multiple extensions Provided shortcut readdir readdir with your extension checking filterreadExt path search extension look search multiple extensions array Find matching files folders resulting array contains only files that mathc specified extension",
	"myfs.dirutils.readdir": "readdir : Read folder returns object containing files folder arraysreaddir path folder read custom filter funciton Should retrieve folders Used internally store recursive findings Note that also provide this argument readdir will populate your existing files folder list recommended leave this argument alone object containing list files folders properties returned list where each array contents readdir path folder null true yeids contents files path folder path folder path folder path folder sub1 path folder sub2 path folder sub3 dirs path folder sub1 path folder sub2 path folder sub3",
	"myfs.dirutils.copydir": "copydir : Copies entire folder heirarchy folder from location another other location doesn exists will constructedcopydir source folder destination folder created exist",
	"myfs.dirutils.emptydir": "emptydir : Recursively empties folder contents folder contents leaves source folderemptydir source folder Prevents actual deletion still allows return list display what will deleted array containing list paths files folders that deleted will deleted when dryrun true",
	"myfs.dirutils.removedir": "removedir : Recursively removes folder folders wellremovedir path folder Prevents actual deletion still allows return return list items that will deleted array items that were deleted will deleted dryrun true",
	"myfs.dirutils.exists": "exists : Checks folder existsexists path folder",
	"myfs.fileutils": "fileutils : collection basic common simplified syncronous file methodsfileutils myfs",
	"myfs.fileutils.copy": "copy : Copies file from location anothercopy source file path destination copy source this binary file assume text file",
	"myfs.fileutils.Open": "Open : Reads entire file string NOTE This alias read readOpen source file path description",
	"myfs.fileutils.read": "read : Reads entire file stringread source file path this binary file assume text file",
	"myfs.fileutils.save": "save : Saves text data file Overwrites entire file with provided data NOTE This alias write writesave source file path text data save",
	"myfs.fileutils.write": "write : Saves text data file Overwrites entire file with provided datawrite source file path text data save this binary file assume text file",
	"myfs.fileutils.remove": "remove : Deletes file from systemremove source file path",
	"myfs.fileutils.exists": "exists : Checks file exists Note this also checks folder same name existsexists source file path True exists false file folder exists",
	"myfs.fileutils.rename": "rename : Renames file folderrename source file path destination file path",
	"root.launch": "launch : file launcher Opens stuff like websites files executables Cross platform Using https github sindresorhuslaunch open Example path track will open default media player Options myfs details",
	"root.makedir": "makedir : Creates folder specified location folder heirarchy constructed needed Alias makedir myfs dirutils makedirmakedir destination",
	"root.cpdir": "cpdir : Copies entire folder heirarchy folder from location another other location doesn exists will constructed Alias copydir myfs dirutils copydircpdir source folder destination folder created exist",
	"root.rmdir": "rmdir : Recursively removes folder folders well Alias copydir myfs dirutils removedirrmdir path folder Prevents actual deletion still allows return return list items that will deleted array items that were deleted will deleted dryrun true",
	"root.list": "list : Read folder returns object containing files folder arrays Alias copydir myfs dirutils readdirlist path folder read custom filter funciton Should retrieve folders Used internally store recursive findings Note that also provide this argument readdir will populate your existing files folder list recommended leave this argument alone object containing list files folders properties returned list where each array contents readdir path folder null true yeids contents files path folder path folder path folder path folder sub1 path folder sub2 path folder sub3 dirs path folder sub1 path folder sub2 path folder sub3",
	"root.ls": "ls : alias list listalias list list",
	"root.listExt": "listExt : Collects files from folder based specified extension extensions used search recursively through folders search multiple extensions Provided shortcut readdir readdir with your extension checking filter Alias copydir myfs dirutils readExtlistExt path search extension look search multiple extensions array Find matching files folders resulting array contains only files that mathc specified extension",
	"root.empty": "empty : Recursively empties folder contents folder contents leaves source folder Alias copydir myfs dirutils emptyempty source folder Prevents actual deletion still allows return list display what will deleted array containing list paths files folders that deleted will deleted when dryrun true",
	"root.exists": "exists : Checks file exists Note this also checks folder same name existsexists source file path True exists false file folder exists",
	"root.exist": "exist : alias exists exists pluralalias exists exists plural",
	"root.open": "open : Reads data file Alias read myfs readopen source file path this binary file assume text file",
	"root.save": "save : Saves text data file Overwrites entire file with provided data Alias write myfs writesave source file path text data save this binary file assume text file",
	"root.cp": "cp : alias copy copyalias copy copy",
	"root.copy": "copy : Copies file from location another Alias copy myfs copycopy source file path destination copy source this binary file assume text file",
	"root.rm": "rm : Deletes file from systemsource file path",
	"root.move": "move : Moves file folder Alias rename myfs fileutils renamemove source file path destination file path",
	"root.name": "name : npath namename full path last portion path generally filename without extension",
	"root.basename": "basename : npath basename npath basenamebasename full path Lops extension matches last portion path generally filename",
	"root.filename": "filename : alias basename basenamealias basename basename",
	"root.base": "base : alias name namealias name name",
	"root.parent": "parent : Returns path parent folder that item resides within npath dirname npath dirname sally yoyo boob sally yoyoparent path parse path file folder",
	"root.dir": "dir : alias dirname dirnamealias dirname dirname",
	"root.ext": "ext : Returns bare base extensionpath parse extension",
	"root.isAbsolute": "isAbsolute : Determines path absolute pathisAbsolute path parse",
	"root.normalize": "normalize : Resolves portions path Reduces double slashes single Forces back slashes forward slashes Retains trailing slash exists npath normalize npath normalize boob boob npath normalize current workingnormalize path parse",
	"root.clean": "clean : alias normalize normalizealias normalize normalize",
	"root.parse": "parse : Extracts basic path file parts path parse home user file Yeilds traditional node proerties root home user base file name file additional brain labels ext2 extension alias basename file filename file parent home userparse path parse object containing following properties root home user base file name file",
	"root.relative": "relative : Creates relative path between from path relative data orandea test data orandea impl Returns implrelative When null used this value When null used this value relative path between from",
	"root.format": "format : opposite path parse Combines elements object into string Example root home user base file name file converted home user fileformat object containing some required keys formulate path string representaiton object",
	"root.join": "join : Joins path segments resolves relativity path join asdf quux Returns asdfjoin arguments evaluated paths construction description",
	"root.resolve": "resolve : Generates absolute path based provided arguments Path construction occurs from right left resolve yields absolute path resolved during construction items left ignored resolve yields ignored absolute path resolved after constructing arguments inserted resolve yields current working Relative paths automatically resolved resolve yieldsresolve arguments evaluated paths construction",
	"root.removeSlash": "removeSlash : Removes trailing slash from path existsremoveSlash path",
	"root.removeTrailingSlash": "removeTrailingSlash : alias removeSlash removeSlashalias removeSlash removeSlash",
	"root.addSlash": "addSlash : Adds trailing slash from path doesn existaddSlash path",
	"root.addTrailingSlash": "addTrailingSlash : alias addSlash addSlashalias addSlash addSlash",
	"root.du": "du : access underlaying directory utility myfs dirutil class access additional methods that commonaccess underlaying directory utility myfs dirutil class access additional methods that common",
	"root.fu": "fu : access underlaying file utility myfs fileutil class access additional methods that commonaccess underlaying file utility myfs fileutil class access additional methods that common",
	"root.path": "path : access underlaying path utility myfs npath class access additional methods that commonaccess underlaying path utility myfs npath class access additional methods that common",
	"root.sep": "sep : kind seperator used paths Windows POSIXkind seperator used paths Windows POSIX",
	"root.delimiter": "delimiter : Platform environment PATH delimiter Example PATH appears Windows Windows system32 Windows Program Files node Example PATH appears POSIX systems Unix sbin sbin local Read PATH with Node console process PATH Windows POSIX",
	"myfs.log": "log : Writes console Will accept object array well string boolena other prepare them proper presentation consolemyfs string array object output title message Disables logging prevents console output require Some Title false prints Some Title",
	"myfs.npath": "npath : drop replacement path that provides cross playform normalization Easing development cross platform modules Essentially what doing processing methods with path normalization always enforcing forward slashesnpath myfs",
	"myfs.npath.clean": "clean : Normalizes slashes converting double single based current platform requirements",
	"myfs.npath.basename": "basename : npath basename npath basenamebasename full path Lops extension matches last portion path generally filename",
	"myfs.npath.name": "name : npath namename full path last portion path generally filename without extension",
	"myfs.npath.dirname": "dirname : Returns path parent folder that item resides within npath dirname npath dirname sally yoyo boob sally yoyodirname path parse path file folder",
	"myfs.npath.extname": "extname : this includes npath extname npath extname sally yoyo boobextname path parse extension exists including",
	"myfs.npath.ext": "ext : Just bare base extensionpath parse extension",
	"myfs.npath.isAbsolute": "isAbsolute : Determines path absolute pathisAbsolute path parse",
	"myfs.npath.normalize": "normalize : Resolves portions path Reduces double slashes single Forces back slashes forward slashes Retains trailing slash exists npath normalize npath normalize boob boob npath normalize current workingnormalize path parse",
	"myfs.npath.parse": "parse : Extracts basic path file parts path parse home user file Yeilds traditional node proerties root home user base file name file additional brain labels ext2 extension alias basename file filename file parent home userparse path parse object containing following properties root home user base file name file",
	"myfs.npath.relative": "relative : Creates relative path between from path relative data orandea test data orandea impl Returns implrelative When null used this value When null used this value relative path between from",
	"myfs.npath.format": "format : opposite path parse Combines elements object into string Example root home user base file name file converted home user fileformat object containing some required keys formulate path string representaiton object",
	"myfs.npath.join": "join : Joins path segments resolves relativity path join asdf quux Returns asdfjoin arguments evaluated paths construction description",
	"myfs.npath.resolve": "resolve : Generates absolute path based provided arguments Path construction occurs from right left resolve yields absolute path resolved during construction items left ignored resolve yields ignored absolute path resolved after constructing arguments inserted resolve yields current working Relative paths automatically resolved resolve yieldsresolve arguments evaluated paths construction",
	"myfs.npath.removeTrailingSlash": "removeTrailingSlash : Removes trailing slash from path existsremoveTrailingSlash path",
	"myfs.npath.addTrailingSlash": "addTrailingSlash : Adds trailing slash from path doesn existaddTrailingSlash path",
	"myfs.npath.sep": "sep : kind seperator used paths Windows POSIXkind seperator used paths Windows POSIX",
	"myfs.npath.delimiter": "delimiter : Platform environment PATH delimiter Example PATH appears Windows Windows system32 Windows Program Files node Example PATH appears POSIX systems Unix sbin sbin local Read PATH with Node console process PATH Windows POSIX",
	"myfs.opn": "opn : cross platform launch files from Node Direct copy npmjs https npmjs package github https github sindresorhus USAGE const require Opens image default image viewer unicorn then image viewer closed Opens default browser http sindresorhus Specify open http sindresorhus firefox Specify arguments http sindresorhus google chrome incognitomyfs open Options",
	"more.readme_md": "myfs simplified cross platform methods manipulating files folders syncronously with Node Install install myfs save yarn myfs Usage myfs require myfs data myfs open path file Docs docs folder better details than this file provide Properties Property Description kind seperator used paths Windows POSIX delimiter Platform environment PATH delimiter Access underlaying directory utility class access additional methods that common Access underlaying file utility class access additional methods that common path Access underlaying path utility class access additional methods that common Methods NOTE including arguments because including params here makes things visually complicated DOCs folder details This just quick reference File Folder stuff Method Arguments Description copy dest binary Copies file from location another dest binary alias copy cpdir from Copies entire folder heirarchy folder from location another other location doesn exists will constructed empty dryRun Recursively empties folder contents folder contents leaves source folder exists Checks file exists Note this also checks folder same name exists launch target opts file launcher Opens stuff like websites files executables list from filter recursive store file launcher Opens stuff like websites files executables Cross platform listExt from exts recursive Collects files from folder based specified extension extensions used search recursively through folders search multiple extensions alias list makedir destination Creates folder specified location folder heirarchy constructed needed move Moves file folder open binary Reads data file Deletes file from system rmdir dryRun Recursively removes folder folders well write data binary Saves text data file Overwrites entire file with provided data Path Stuff Method Arguments Description addSlash path Adds trailing slash from path doesn exist addTrailingSlash alias addSlash removeSlash path Removes trailing slash from path exists removeTrailingSlash path alias removeSlash resolve path Generates absolute path based provided arguments base name alias basename basename path Returns last portion path generally filename clean Normalizes slashes converting double single based current platform requirements alias dirname Returns bare base extension filename alias basename format Combines elements object into string opposite path parse isAbsolute Determines path absolute path join paths Joins path segments resolves relativity name path npath name normalize path Resolves portions path Reduces double slashes single Forces back slashes forward slashes Retains trailing slash exists parent path Returns path parent folder that item resides within parse path Note that this uses mind warping name basename default Node path parse plus some props that hurt brain Extracts basic path file parts root base name ext2 extension basename filename parent relative from Creates relative path between from License Mike Gieson"
}