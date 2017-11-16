this.documon = this.documon || {};

this.documon.Docutils = (function(){

	
	
	function absoluteURL(url) {
		var a = document.createElement('a');
		a.href = url;
		return a.href;
	}

	function parseUrl(url, notAbsolute){
		
		if( !notAbsolute ){
			url = absoluteURL(url);
		}

		var baseurl = url.replace(/[\#\?].+?$/, "")
		var file = baseurl.split("/").pop();
		var Afile = file.split(".");
		var ext = Afile.pop();
		var basename = Afile.join(".");

		var query = url.match(/\?.+?$/, "");
		if(query){
			query = query[0];
		}

		var hash = url.match(/#.+?$/, "");
		if(hash){
			hash = hash[0];
		}

		var domain = url.match(/\:\/\/+?([^\/]+)/, "");
		if(domain){
			domain = domain[1];
		} else {
			domain = null;
		}

		return {
			  url : url
			, baseurl : baseurl
			, domain : domain
			, query : query
			, hash : hash
			, file : file
			, ext : ext
			, basename : basename
		}

	}

	function truncate( str, max, sep ) {
    
	    // Default to 10 characters
	    max = max || 10;
	    
	    var len = str.length;
	    if(len > max){
	        
	        // Default to elipsis
	        sep = sep || "...";
	        
	        var seplen = sep.length;
	        
	        // If seperator is larger than character limit,
	        // well then we don't want to just show the seperator,
	        // so just show right hand side of the string.
	        if(seplen > max) {
	            return str.substr(len - max);
	        }
	        
	        // Difference between max and string length.
	        // Multiply negative because small minus big.
	        var n = -0.5 * (max - len - seplen);
	        
	        // This gives us the centerline.
	        var center = len/2;
	        
	        var front = str.substr(0, center - n);
	        var back = str.substr(len - center + n);
	        
	        return front + sep + back;
	        
	    }
	    
	    return str;
	}

	function emptyNode(elem, andMe){
		while(elem.firstChild){
		    elem.removeChild(elem.firstChild);
		}
		if(andMe){
			elem.parentNode.removeChild(elem);
		}
	}

	function sortOn(arr, prop, reverse, numeric) {

        // Ensure there's a property
        if (!prop || !arr) {
            return arr
        }


        if (arr.length < 1) {
            return arr;
        }

        if (typeof numeric == 'undefined') {
            var first = arr[0][prop];
            if (typeof first == 'number') {
                numeric = true;
            }
        }

        // Set up sort function
        /**
         * Description
         * @private 
         * @private 
         * @method sort_by
         * @param {} field
         * @param {} rev
         * @param {} num
         * @return FunctionExpression
         */
        var sort_by = function(field, rev, num) {

            var primer = num ? function(val) {
                return parseFloat(String(val).replace(/[^0-9.\-]+/g, ''));
            } : function(val) {
                return String(val).toLowerCase();
            }

            var r = rev ? -1 : 1;

            // Return the required a,b function
            return function(a, b) {

                // Reset a, b to the field
                a = primer(a[field]), b = primer(b[field]);

                // Do actual sorting, reverse as needed
                //return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
                //var result = ((a > b) - (b > a)) * ();


                if (num) {

                    return (a - b) * r;
                } else {
                    //return a.localeCompare(b) * r;
                    return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * r;
                }

            };

        }

        // Distinguish between numeric and string to prevent 100's from coming before smaller
        // e.g.
        // 1
        // 20
        // 3
        // 4000
        // 50

        arr.sort(sort_by(prop, reverse, numeric));


    }

	return {
		truncate 	: truncate,
		parseUrl 	: parseUrl,
		absoluteURL : absoluteURL,
		emptyNode 	: emptyNode,
		sortOn 		: sortOn
	}
}());