package  {
	import flash.Boot;
	public class IntIterator {
		public function IntIterator(min : int = 0,max : int = 0) : void { if( !flash.Boot.skip_constructor ) {
			this.min = min;
			this.max = max;
		}}
		
		public var min : int;
		public var max : int;
		public function hasNext() : Boolean {
			return this.min < this.max;
		}
		
		public function next() : int {
			return this.min++;
		}
		
	}
}
