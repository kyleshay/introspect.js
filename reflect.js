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
		var aPrivateFunctions = file.match(/function\s*?(\w.*?)\(/g);

		var replace = "return Public;";
		var instance = eval("new (" + file.replace(replace, "Public._privates = {};"
			+ "Public._initPrivates = function(pf){Public._privates = {};"
			+ "for (var i = 0, ii = pf.length; i < ii; i++){"
			+ "var fn = pf[i].replace(/(function\\s+)/, '').replace('(', '');"
			+ "try {Public._privates[fn] = eval(fn);}catch(e){"
			+ "if(e.name == 'ReferenceError') { continue; }"
			+ "else{throw e;}}}}\n" + replace)
			+ "})()");
		
		instance._initPrivates(aPrivateFunctions);

		// delete the initiation functions
		delete instance._initPrivates;

		return instance;
	}
};
