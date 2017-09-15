package haxe {
	public interface IMap {
		function get(k : *) : * ;
		function set(k : *,v : *) : void ;
		function exists(k : *) : Boolean ;
		function remove(k : *) : Boolean ;
		function keys() : * ;
		function iterator() : * ;
		function toString() : String ;
	}
}
