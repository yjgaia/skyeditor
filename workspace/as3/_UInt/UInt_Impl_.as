package _UInt {
	public  final class UInt_Impl_ {
		static public var addI : Function;
		static public var addF : Function;
		static public var add : Function;
		static public var mulI : Function;
		static public var mulF : Function;
		static public var mul : Function;
		static public var modI : Function;
		static public var modF : Function;
		static public var mod : Function;
		static public var subI : Function;
		static public var subF : Function;
		static public var sub : Function;
		static public var divI : Function;
		static public var divF : Function;
		static public var div : Function;
		static public var orI : Function;
		static public var or : Function;
		static public var xorI : Function;
		static public var xor : Function;
		static public var andI : Function;
		static public var and : Function;
		static public var shl : Function;
		static public function shr(lhs : uint,rhs : int) : uint {
			return uint(lhs >>> rhs);
		}
		
		static public var ushr : Function;
		static public var gt : Function;
		static public var gte : Function;
		static public var lt : Function;
		static public var lte : Function;
		static public var gtf : Function;
		static public var gtf2 : Function;
		static public var gtef : Function;
		static public var gtef2 : Function;
		static public var ltf : Function;
		static public var ltf2 : Function;
		static public var ltef : Function;
		static public var ltef2 : Function;
		static public var bneg : Function;
		static public var equalsInt : Function;
		static public var notEqualsInt : Function;
		static public var equalsFloat : Function;
		static public var notEqualsFloat : Function;
		static public var prefixIncrement : Function;
		static public var postfixIncrement : Function;
		static public var prefixDecrement : Function;
		static public var postfixDecrement : Function;
	}
}
