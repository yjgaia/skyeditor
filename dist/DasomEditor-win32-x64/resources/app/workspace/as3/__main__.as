package  {
	import flash.Boot;
	import flash.Lib;
	public class __main__ extends flash.Boot {
		public function __main__() {
			super();
			flash.Lib.current = this;
			{
				Math["NaN"] = Number.NaN;
				Math["NEGATIVE_INFINITY"] = Number.NEGATIVE_INFINITY;
				Math["POSITIVE_INFINITY"] = Number.POSITIVE_INFINITY;
				Math["isFinite"] = function(i : Number) : Boolean {
					return isFinite(i);
				};
				Math["isNaN"] = function(i1 : Number) : Boolean {
					return isNaN(i1);
				}
			}
			Sample.main();
		}
	}
}
