package  {
	public class Reflect {
		static public function hasField(o : *,field : String) : Boolean {
			return o.hasOwnProperty(field);
		}
		
		static public function field(o : *,field : String) : * {
			try {
				return o[field];
			}
			catch( e : * ){
				return null;
			};
			return null;
		}
		
		static public function setField(o : *,field : String,value : *) : void {
			o[field] = value;
		}
		
		static public function getProperty(o : *,field : String) : * {
			try {
				return o["get_" + field]();
			}
			catch( e : * ){
				try {
					return o[field];
				}
				catch( e1 : * ){
					return null;
				}
			};
			return null;
		}
		
		static public function setProperty(o : *,field : String,value : *) : void {
			try {
				o["set_" + field](value);
			}
			catch( e : * ){
				o[field] = value;
			}
		}
		
		static public function callMethod(o : *,func : *,args : Array) : * {
			return func.apply(o,args);
		}
		
		static public function fields(o : *) : Array {
			if(o == null) return new Array();
			var a : Array = function() : Array {
				var $r : Array;
				$r = new Array();
				for(var $k2 : String in o) $r.push($k2);
				return $r;
			}();
			var i : int = 0;
			while(i < a.length) if(!o.hasOwnProperty(a[i])) a.splice(i,1);
			else ++i;
			return a;
		}
		
		static public function isFunction(f : *) : Boolean {
			return typeof f == "function";
		}
		
		static public function compare(a : *,b : *) : int {
			var a1 : * = a;
			var b1 : * = b;
			if(a1 == b1) return 0;
			else if(a1 > b1) return 1;
			else return -1;
			return 0;
		}
		
		static public function compareMethods(f1 : *,f2 : *) : Boolean {
			return f1 == f2;
		}
		
		static public function isObject(v : *) : Boolean {
			if(v == null) return false;
			var t : String = typeof v;
			if(t == "object") return !Reflect.isEnumValue(v);
			return t == "string";
		}
		
		static public function isEnumValue(v : *) : Boolean {
			try {
				return Type.getEnum(v) != null;
			}
			catch( e : * ){
				return false;
			};
			return false;
		}
		
		static public function deleteField(o : *,field : String) : Boolean {
			if(o.hasOwnProperty(field) != true) return false;
			delete(o[field]);
			return true;
		}
		
		static public function copy(o : *) : * {
			var o2 : * = { };
			{
				var _g : int = 0;
				var _g1 : Array = Reflect.fields(o);
				while(_g < _g1.length) {
					var f : String = _g1[_g];
					++_g;
					Reflect.setField(o2,f,Reflect.field(o,f));
				}
			};
			return o2;
		}
		
		static public function makeVarArgs(f : Function) : * {
			return function(...__arguments__) : * {
				return f(__arguments__);
			}
		}
		
	}
}
