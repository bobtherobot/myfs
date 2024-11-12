var myfs = require("./index.js");

/*

# run

cd /Volumes/Drives/projects/myfs
node ./_build.js

*/



// ----------------------------
// cjm
// ----------------------------
var out = "esm/";

var files = [
    "dirutils.js",
    "fileutils.js",
    "index.js",
    "log.js",
    "npath.js",
    "opn.js",
    "test.js"
]


var RE_BLOCKS = new RegExp([
    /\/(\*)[^*]*\*+(?:[^*\/][^*]*\*+)*\//.source,           // $1: multi-line comment
    /\/(\/)[^\n]*$/.source,                                 // $2 single-line comment
    /"(?:[^"\\]*|\\[\S\s])*"|'(?:[^'\\]*|\\[\S\s])*'/.source, // - string, don't care about embedded eols
    /(?:[$\w\)\]]|\+\+|--)\s*\/(?![*\/])/.source,           // - division operator
    /\/(?=[^*\/])[^[/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[/\\]*)*?\/[gim]*/.source
].join('|'),                                            // - regex
    'gm'  // note: global+multiline with replace() need test
);

// remove comments, keep other blocks
function stripComments(str) {

    var stripped = str.replace(RE_BLOCKS, function (match, mlc, slc) {
        return  mlc ? ' ' :   // multiline comment (replace with space)
                slc ? '' :    // single/multiline comment
                match;        // divisor, regex, or string, return as-is
    });

    // remove empty lines
    return stripped.replace(/^\s*$(?:\r\n?|\n)/gm, "");


}

function convertCommonJsToEsm(cjsCode) {

    // strip comments (only source will have 'em)
    var esmCode = stripComments(cjsCode);

    // replace imports
    esmCode = esmCode.replace(/(var|let|const)\s+([a-zA-Z0-9_]+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (match, varKind, varName, modulePath) => {
        modulePath = modulePath.replace(".js", ".mjs");
        return `import * as ${varName} from '${modulePath}'`;
    });


    // helpers
    if (/__dirname/.test(esmCode)) {
        esmCode = "\nvar __dirname = import.meta.dirname;\n" + esmCode;
    }
    if (/__filename/.test(esmCode)) {
        esmCode = "\nvar __filename = import.meta.filename;\n" + esmCode;
    }


    // Convert "module.exports" to "export default"

    // function or object
    var exps = esmCode.match(/module\.exports\s+=([\S\s]*?)\}/gm);
    if (exps && exps.length) {
        var found = exps[0];

        // check function first
        if (/=\s(.*?)(function|\()/.test(found)) {
            esmCode = esmCode.replace(/module\.exports\s+=/, "export default ");

        
        // assume object
        } else if (/=\s(.*?)\{/.test(found)) {
            
            var block = found.match(/(?<={)([\S\s]*?)(?=})/gm);
            if (block && block[0]) {
        
                var Ablock = block[0].split(",");
                var Akeys = [];
                for (var i = 0; i < Ablock.length; i++) {
                    var line = Ablock[i];
                    if (line) {
                        var Aline = line.split(":");
                        var first = Aline[0];
                        first = first.replace(/[^A-Za-z0-9_]/g, "");
                        if (first) {
                            Akeys.push(first.trim());
                        }

                    }
                }
                exps = "{\n\t" + Akeys.join(",\n\t") + "\n};"
            }

            if (exps) {
                esmCode = esmCode.replace(/module\.exports\s+=([\S\s]*?)\}/gm, "");
                esmCode = esmCode + "\nexport " + exps.trim();
            }

        }



    } else {
        // gets things like: module.exports = bob;
        var found = esmCode.match(/module\.exports\s+=([\S\s]*?)$/);
        if (found && found.length) {
            esmCode = esmCode.replace(/module\.exports\s+=([\S\s]*?)$/, "");
            exps = "default " + found[0].replace(/module\.exports\s+=/, "");
        }

        if (exps) {
            esmCode = esmCode + "\nexport " + exps.trim();
        }
    }


    return esmCode;
}

for (var i = 0; i < files.length; i++) {
    var p = files[i];
    if (p) {
        console.log(p)
        var file = myfs.open(p);
        var conv = convertCommonJsToEsm(file);
        var base = myfs.name(p);

        console.log(base);

        // one fix auto conversion couldn't make, so do manually here
        if(base == "index"){
            conv = conv.replace("import * as launch", "import launch");
        } else if(base == "test"){
            conv = conv.replace("import * as myfs", "import myfs");
        }
        myfs.save(out + base + ".mjs", conv);
    }

}

// ----------------------------
// docs
// ----------------------------

//var doc = require('documon');
var doc = require('/Volumes/Drives/projects/documon/documon/index.js');

var bob = doc({
	src : "./",
    name : "myfs",
    version : "2.0.0",
    url : "https://www.npmjs.com/package/myfs",
	//src : "index.js",
	out : "/Users/bob/Desktop/docs/", // puts the docs into this folder.
	//more : __dirname
});