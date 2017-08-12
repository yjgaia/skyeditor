package  {
	import flash.utils.getDefinitionByName;
	import flash.utils.getQualifiedClassName;
	import flash.utils.describeType;
	import flash.Boot;
	import flash.utils.getQualifiedSuperclassName;
	public class Type {
		static public function getClass(o : *) : Class {
			var cname : String = flash.utils.getQualifiedClassName(o);
			if(cname == "null" || cname == "Object" || cname == "int" || cname == "Number" || cname == "Boolean") return null;
			if(o.hasOwnProperty("prototype")) return null;
			var c : * = flash.utils.getDefinitionByName(cname) as Class;
			if(c.__isenum) return null;
			return c;
		}
		
		static public function getEnum(o : enum) : Class {
			var cname : String = flash.utils.getQualifiedClassName(o);
			if(cname == "null" || cname.substr(0,8) == "builtin.") return null;
			if(o.hasOwnProperty("prototype")) return null;
			var c : * = flash.utils.getDefinitionByName(cname) as Class;
			if(!c.__isenum) return null;
			return c;
		}
		
		static public function getSuperClass(c : Class) : Class {
			var cname : String = flash.utils.getQualifiedSuperclassName(c);
			if(cname == null || cname == "Object") return null;
			return flash.utils.getDefinitionByName(cname) as Class;
		}
		
		static public function getClassName(c : Class) : String {
			if(c == null) return null;
			var str : String = flash.utils.getQualifiedClassName(c);
			switch(str) {
			case "Boolean":
			return "Bool";
			break;
			case "Number":
			return "Float";
			break;
			case "Object":
			return "Dynamic";
			break;
			case "int":
			return "Int";
			break;
			default:
			break;
			};
			return str.split("::").join(".");
		}
		
		static public function getEnumName(e : Class) : String {
			return Type.getClassName(Class(e));
		}
		
		static public function resolveClass(name : String) : Class {
			var cl : Class;
			try {
				cl = flash.utils.getDefinitionByName(name) as Class;
				if(cl.__isenum) return null;
				return cl;
			}
			catch( e : * ){
				switch(name) {
				case "Dynamic":
				return Object;
				break;
				case "Float":
				return Number;
				break;
				case "Int":
				return int;
				break;
				};
				return null;
			};
			return null;
		}
		
		static public function resolveEnum(name : String) : Class {
			var e : *;
			try {
				e = flash.utils.getDefinitionByName(name);
				if(!e.__isenum) return null;
				return e;
			}
			catch( e1 : * ){
				if(name == "Bool") return Boolean;
				return null;
			};
			return null;
		}
		
		static public function createInstance(cl : Class,args : Array) : * {
			var _g : int = args.length;
			switch(_g) {
			case 0:
			return new cl();
			break;
			case 1:
			return new cl(args[0]);
			break;
			case 2:
			return new cl(args[0],args[1]);
			break;
			case 3:
			return new cl(args[0],args[1],args[2]);
			break;
			case 4:
			return new cl(args[0],args[1],args[2],args[3]);
			break;
			case 5:
			return new cl(args[0],args[1],args[2],args[3],args[4]);
			break;
			case 6:
			return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
			break;
			case 7:
			return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
			break;
			case 8:
			return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
			break;
			case 9:
			return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8]);
			break;
			case 10:
			return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9]);
			break;
			case 11:
			return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10]);
			break;
			case 12:
			return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10],args[11]);
			break;
			case 13:
			return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10],args[11],args[12]);
			break;
			case 14:
			return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7],args[8],args[9],args[10],args[11],args[12],args[13]);
			break;
			default:
			throw "Too many arguments";
			break;
			};
			return null;
		}
		
		static public function createEmptyInstance(cl : Class) : * {
			try {
				flash.Boot.skip_constructor = true;
				var i : * = new cl();
				flash.Boot.skip_constructor = false;
				return i;
			}
			catch( e : * ){
				flash.Boot.skip_constructor = false;
				throw e;
			};
			return null;
		}
		
		static public function createEnum(e : Class,constr : String,params : Array = null) : * {
			var f : * = e[constr];
			if(f == null) throw "No such constructor " + constr;
			if(Reflect.isFunction(f)) {
				if(params == null) throw "Constructor " + constr + " need parameters";
				return Reflect.callMethod(e,f,params);
			};
			if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
			return f;
		}
		
		static public function createEnumIndex(e : Class,index : int,params : Array = null) : * {
			var c : String = e.__constructs__[index];
			if(c == null) throw index + " is not a valid enum constructor index";
			return Type.createEnum(e,c,params);
		}
		
		static protected function describe(t : *,fact : Boolean) : Array {
			var fields : Array = new Array();
			var xml : XML = flash.utils.describeType(t);
			if(fact) xml = xml.factory[0];
			var methods : XMLList = xml.child("method");
			{
				var _g1 : int = 0;
				var _g : int = methods.length();
				while(_g1 < _g) {
					var i : int = _g1++;
					fields.push(Std.string(methods[i].attribute("name")));
				}
			};
			var vars : XMLList = xml.child("variable");
			{
				var _g11 : int = 0;
				var _g2 : int = vars.length();
				while(_g11 < _g2) {
					var i1 : int = _g11++;
					fields.push(Std.string(vars[i1].attribute("name")));
				}
			};
			var accs : XMLList = xml.child("accessor");
			{
				var _g12 : int = 0;
				var _g3 : int = accs.length();
				while(_g12 < _g3) {
					var i2 : int = _g12++;
					fields.push(Std.string(accs[i2].attribute("name")));
				}
			};
			return fields;
		}
		
		static public function getInstanceFields(c : Class) : Array {
			return Type.describe(c,true);
		}
		
		static public function getClassFields(c : Class) : Array {
			var a : Array = Type.describe(c,false);
			a.remove("__construct__");
			a.remove("prototype");
			return a;
		}
		
		static public function getEnumConstructs(e : Class) : Array {
			var a : Array = e.__constructs__;
			return a.copy();
		}
		
		static public function _typeof(v : *) : ValueType {
			var cname : String = flash.utils.getQualifiedClassName(v);
			switch(cname) {
			case "Boolean":
			return ValueType.TBool;
			break;
			case "Function":
			return ValueType.TFunction;
			break;
			case "Number":
			{
				if((v < -268435456 || v >= 268435456) && Std._int(v) == v) return ValueType.TInt;
				return ValueType.TFloat;
			}
			break;
			case "Object":
			return ValueType.TObject;
			break;
			case "int":
			return ValueType.TInt;
			break;
			case "null":
			return ValueType.TNull;
			break;
			case "void":
			return ValueType.TNull;
			break;
			default:
			{
				var c : * = null;
				try {
					c = flash.utils.getDefinitionByName(cname);
					if(v.hasOwnProperty("prototype")) return ValueType.TObject;
					if(c.__isenum) return ValueType.TEnum(c);
					return ValueType.TClass(c);
				}
				catch( e : * ){
					if(cname == "builtin.as$0::MethodClosure" || cname.indexOf("-") != -1) return ValueType.TFunction;
					if(c == null) return ValueType.TFunction;
					else return ValueType.TClass(c);
				}
			}
			break;
			};
			return null;
		}
		
		static public function enumEq(a : *,b : *) : Boolean {
			if(a == b) return true;
			try {
				if(a.index != b.index) return false;
				var ap : Array = a.params;
				var bp : Array = b.params;
				{
					var _g1 : int = 0;
					var _g : int = ap.length;
					while(_g1 < _g) {
						var i : int = _g1++;
						if(!Type.enumEq(ap[i],bp[i])) return false;
					}
				}
			}
			catch( e : * ){
				return false;
			};
			return true;
		}
		
		static public function enumConstructor(e : enum) : String {
			return e.tag;
		}
		
		static public function enumParameters(e : enum) : Array {
			if(e.params == null) return [];
			else return e.params;
			return null;
		}
		
		static public function allEnums(e : Class) : Array {
			var all : Array = [];
			var cst : Array = e.__constructs__;
			{
				var _g : int = 0;
				while(_g < cst.length) {
					var c : String = cst[_g];
					++_g;
					var v : * = Reflect.field(e,c);
					if(!Reflect.isFunction(v)) all.push(v);
				}
			};
			return all;
		}
		
	}
}
