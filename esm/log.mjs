function write(str){
	process.stdout.write(str + "\n");
}
function log(data, title, quiet){
	if( ! quiet ){
		if(title){
			write("------------------");
			write(title);
			write("------------------");
		}
		if(data){
			if(typeof data == "object"){
				if( Array.isArray(data) ){
					for(var i=0; i<data.length; i++){
						write( "  " + data[i] );
					}
				} else {
					for(var prop in data){
						write( "  " + prop + " : " + data[prop] );
					}
				}
			} else {
				write(data);
			}
		}
	}
}

export default  log;