# 2.0.0 - Nov 14, 2024
- make usable for imports (esm)
- better documentation:
    - http://www/documon.net/projects/myfs
    - also updated README with better stuff
- many tweaks and stuff.

# 1.0.22 - Oct 20, 2019
- Added isBinary and dupe file methods.

# 1.021 - Dec. 20, 2018

- readExt/listExt properly documented and available... One was missing and the docs explained the other, now they're both in their.

# 1.0.19 - Sept. 8, 2018

- readExt/listExt would not capture file with upper-case extensions. Made upper/lower-case agnostic. When call this method, use lower-case strings for your extension(s).
- added "path" and "src" to parse, both of which return the original source path string provided.
- fixed issue with readdir when stats fails (mac)

# 1.0.14 - August 14, 2018

- added filter to the ```readExt```

# 1.0.13 - August 14, 2018

- Check if dir exists before attempt to delete
- ```copy``` now copies folders too.
- Added ```touch```

# 1.0.12 - May 1, 2018

- ensure exists added into a couple other places in fileutils
- fileutils.write now honors a string in the binary argument
- added better documentation on readdir filter 

# 1.0.8 - May 1, 2018

- Added __swapExt__