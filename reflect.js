var Reflect = function(file) {
	var request = new XMLHttpRequest
	request.open('GET', 'adder.js', true)
	request.send()

	request.onload = function() {
		return inject(this.response)
	}

	function inject(file) {
		// parse out the function signature
		var aPrivateFunctions = file.match(/function\s*?(\w.*?)\(/g);

		var funcString = "new ("
			+ objectAsString.substring(0, objectAsString.length - 1)
			+ ";"
			+ "this._privates = {};\n"
			+ "this._initPrivates = function(pf) {"
			+ "  this._privates = {};"
			+ "  for (var i = 0, ii = pf.length; i < ii; i++)"
			+ "  {"
			+ "    var fn = pf[i].replace(/(function\\s+)/, '').replace('(', '');"
			+ "    try { "
			+ "      this._privates[fn] = eval(fn);"
			+ "    } catch (e) {"
			+ "      if (e.name == 'ReferenceError') { continue; }"
			+ "      else { throw e; }"
			+ "    }"
			+ "  }"
			+ "}"
			+ "\n\n})()";

		var instance = eval(funcString);
		instance._initPrivates(aPrivateFunctions);

		// delete the initiation functions
		delete instance._initPrivates;

		return instance;
	}
};
