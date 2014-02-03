var adder = (function() {
	// private function doAdd
	function doAdd(num1, num2) {
		return num1 + num2;
	}
	
	var foo = function() {
		return "foo";
	}, bar = function() {
		return "bar";
	}

	var Public;

	// public function do
	Public = {
		do: function(num1, num2) {
			return doAdd(num1, num2)
		}
	}

	return Public;
}());
