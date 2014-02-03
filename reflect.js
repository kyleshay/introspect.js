var Reflect = function(file) {
	var request = new XMLHttpRequest
	request.open('GET', file, true)
	request.send()

	request.onload = function() {
		Reflect.injected = inject(this.response)
	}

	function inject(file) {
		file = file.substring(file.indexOf('function'), file.lastIndexOf('}'));

		// parse out the function signature
		var privs = file.match(/((var )?\s*?(\w.*?)=\s*?)?function(\s*?(\w.*?))?\(/g);

		var replace = "return Public;";
		var instance = eval("new (" + file.replace(replace, ''
			+ "Public._initPrivs = function(funcs){"
			+ "Public._privates = {};" // init _privates property
			+ "for(var i=funcs.length;i--;){" // loop the funcs found from `privs`
			+ "var fn=funcs[i].replace(/(=?\\s*?function\\s*?)/,'').replace('(','').replace('var ', '');" // get func name
			+ "try{Public._privates[fn] = eval(fn);}catch(e){" // test to see if func is defined
			+ "if(e.name=='ReferenceError'){continue;}else{throw e;}}}}\n" // if not, ignore
			+ replace)
			+ "})()"); // eval(new(function(){})()) turn it into a func we can call
		
		// call the initPrivs function to load the _privates property
		instance._initPrivs(privs);

		// delete the initiation functions
		delete instance._initPrivs;

		return instance;
	}
};
