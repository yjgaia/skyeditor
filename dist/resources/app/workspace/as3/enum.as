package  {
	import flash.Boot;
	public class enum {
		public var tag : String;
		public var index : int;
		public var params : Array;
		public function toString() : String { return flash.Boot.enum_to_string(this); }
	}
}
