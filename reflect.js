var Reflect = function(file) {
	var request = new XMLHttpRequest
	request.open('GET', file, true)
	request.send()

	request.onload = function() {
		return inject(this.response.toString().replace(/var .* =/, ''))
	}

	function inject(file) {
		Reflect.file = file = file.substring(0, file.lastIndexOf('}'));
		console.log('something? ', file)

		// parse out the function signature
		var aPrivateFunctions = file.match(/function\s*?(\w.*?)\(/g);
		console.log('something? ', aPrivateFunctions)

		var funcString = "new " + file.replace('\n', "Public._privates = {};"
			+ "Public._initPrivates = function(pf){Public._privates = {};"
			+ "for (var i = 0, ii = pf.length; i < ii; i++){"
			+ "var fn = pf[i].replace(/(function\\s+)/, '').replace('(', '');"
			+ "try {Public._privates[fn] = eval(fn);}catch(e){"
			+ "if(e.name == 'ReferenceError') { continue; }"
			+ "else{throw e;}}}}\n")
			+ "\n})()";
		console.log('something? ', funcString)

		var instance = eval(funcString);
		instance._initPrivates(aPrivateFunctions);

		// delete the initiation functions
		delete instance._initPrivates;

		return instance;
	}
};
