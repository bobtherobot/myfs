
var __filename = import.meta.filename;

var __dirname = import.meta.dirname;
import * as du from './dirutils.mjs';
import * as fu from './fileutils.mjs';
import * as path from './npath.mjs';
import launch from './opn.mjs';
const node__filename = __filename;
const node__dirname = __dirname;
const myfs = {
    __filename : __filename,
    __dirname : __dirname, 
    du: du,
    fu: fu,
    path: path,
    sep: path.sep,
    slash: path.sep,
    addSlash: path.addTrailingSlash,
    addTrailingSlash: path.addTrailingSlash,
    base: path.name, 
    basename: path.basename,
    clean: path.clean,
    copy: fu.copy,
    cp: fu.copy,
    cpdir: du.copy,
     cwd: path.cwd,
    dir: path.dirname,
    dupe: fu.dupe,
    duplicate: fu.dupe,
    empty: du.empty,
    exist: fu.exists,
    exists: fu.exists,
    ext: path.ext, 
    filename: path.basename,
    format: path.format,
    isAbsolute: path.isAbsolute,
    isBinary: fu.isFile,
    isDir: du.exists,
    isFile: fu.isFile,
    isFolder: du.exists,
    join: path.join,
    launch: launch,
    list: du.list,
    listExt: du.readExt,
    ls: du.list,
    makedir: du.mkdir,
    mkdir: du.mkdir,
    move: fu.rename,
    name: path.name,
    normalize: path.normalize,
    open: fu.read,
    parent: path.dirname,
    parse: path.parse,
    read: fu.read,
    readExt: du.readExt,
    relative: path.relative,
    remove: fu.remove,
    removeDir: du.remove,
    removeSlash: path.removeTrailingSlash,
    removeTrailingSlash: path.removeTrailingSlash,
    rename: fu.rename,
    resolve: path.resolve,
    rm: fu.remove,
    rmdir: du.remove,
    swapExt: path.swapExt,
    save: fu.write,
    touch: fu.touch,
    write: fu.write,
}

export default  myfs