var adder = (function() {
	// private function doAdd
	function doAdd(num1, num2) {
		return num1 + num2;
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
