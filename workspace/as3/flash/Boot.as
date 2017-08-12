package flash {
	import flash.events.Event;
	import flash.Lib;
	import flash.text.TextFormat;
	import flash.display.Stage;
	import flash.text.TextFieldAutoSize;
	import flash.utils.getQualifiedClassName;
	import flash.utils.setTimeout;
	import flash.display.MovieClip;
	import flash.text.TextField;
	public class Boot extends flash.display.MovieClip {
		public function Boot() : void { if( !flash.Boot.skip_constructor ) {
			super();
		}}
		
		protected function start() : void {
			var c : flash.display.MovieClip = flash.Lib.current;
			try {
				if(c == this && c.stage != null && c.stage.align == "") c.stage.align = "TOP_LEFT";
			}
			catch( e : * ){
			};
			if(c.stage == null) c.addEventListener(flash.events.Event.ADDED_TO_STAGE,this.doInitDelay);
			else if(c.stage.stageWidth == 0 || c.stage.stageHeight == 0) flash.utils.setTimeout(this.start,1);
			else this.init();
		}
		
		protected function doInitDelay(_ : *) : void {
			flash.Lib.current.removeEventListener(flash.events.Event.ADDED_TO_STAGE,this.doInitDelay);
			this.start();
		}
		
		protected function init() : void {
			throw "assert";
		}
		
		static protected var tf : flash.text.TextField;
		static protected var lines : Array;
		static protected var lastError : Error;
		static public var skip_constructor : Boolean = false;
		static protected var IN_E : int = 0;
		static public function enum_to_string(e : *) : String {
			if(e.params == null) return e.tag;
			var pstr : Array = [];
			if(flash.Boot.IN_E > 15) pstr.push("...");
			else {
				flash.Boot.IN_E++;
				{
					var _g : int = 0;
					var _g1 : Array = e.params;
					while(_g < _g1.length) {
						var p : * = _g1[_g];
						++_g;
						pstr.push(flash.Boot.__string_rec(p,""));
					}
				};
				flash.Boot.IN_E--;
			};
			return e.tag + "(" + pstr.join(",") + ")";
		}
		
		static public function __instanceof(v : *,t : *) : Boolean {
			try {
				if(t == Object) return true;
				return v is t;
			}
			catch( e : * ){
			};
			return false;
		}
		
		static public function __clear_trace() : void {
			if(flash.Boot.tf == null) return;
			flash.Boot.tf.parent.removeChild(flash.Boot.tf);
			flash.Boot.tf = null;
			flash.Boot.lines = null;
		}
		
		static public function __set_trace_color(rgb : uint) : void {
			var tf : flash.text.TextField = flash.Boot.getTrace();
			tf.textColor = rgb;
			tf.filters = [];
		}
		
		static public function getTrace() : flash.text.TextField {
			var mc : flash.display.MovieClip = flash.Lib.current;
			if(flash.Boot.tf == null) {
				flash.Boot.tf = new flash.text.TextField();
				var format : flash.text.TextFormat = flash.Boot.tf.getTextFormat();
				format.font = "_sans";
				flash.Boot.tf.defaultTextFormat = format;
				flash.Boot.tf.selectable = false;
				flash.Boot.tf.width = ((mc.stage == null)?800:mc.stage.stageWidth);
				flash.Boot.tf.autoSize = flash.text.TextFieldAutoSize.LEFT;
				flash.Boot.tf.mouseEnabled = false;
			};
			if(mc.stage == null) mc.addChild(flash.Boot.tf);
			else mc.stage.addChild(flash.Boot.tf);
			return flash.Boot.tf;
		}
		
		static public function __trace(v : *,pos : *) : void {
			var tf : flash.text.TextField = flash.Boot.getTrace();
			var pstr : String = ((pos == null)?"(null)":pos.fileName + ":" + pos.lineNumber);
			if(flash.Boot.lines == null) flash.Boot.lines = [];
			var str : String = pstr + ": " + flash.Boot.__string_rec(v,"");
			if(pos != null && pos.customParams != null) {
				var _g : int = 0;
				var _g1 : Array = pos.customParams;
				while(_g < _g1.length) {
					var v1 : * = _g1[_g];
					++_g;
					str += "," + flash.Boot.__string_rec(v1,"");
				}
			};
			flash.Boot.lines = flash.Boot.lines.concat(str.split("\n"));
			tf.text = flash.Boot.lines.join("\n");
			var stage : flash.display.Stage = flash.Lib.current.stage;
			if(stage == null) return;
			while(flash.Boot.lines.length > 1 && tf.height > stage.stageHeight) {
				flash.Boot.lines.shift();
				tf.text = flash.Boot.lines.join("\n");
			}
		}
		
		static public function __string_rec(v : *,str : String) : String {
			var cname : String = flash.utils.getQualifiedClassName(v);
			switch(cname) {
			case "Array":
			{
				if(v == Array) return "#Array";
				var s : String = "[";
				var i : *;
				var first : Boolean = true;
				var a : Array = v;
				{
					var _g1 : int = 0;
					var _g : int = a.length;
					while(_g1 < _g) {
						var i1 : int = _g1++;
						if(first) first = false;
						else s += ",";
						s += flash.Boot.__string_rec(a[i1],str);
					}
				};
				return s + "]";
			}
			break;
			case "Object":
			{
				var k : Array = function() : Array {
					var $r : Array;
					$r = new Array();
					for(var $k2 : String in v) $r.push($k2);
					return $r;
				}();
				var s1 : String = "{";
				var first1 : Boolean = true;
				{
					var _g11 : int = 0;
					var _g2 : int = k.length;
					while(_g11 < _g2) {
						var i2 : int = _g11++;
						var key : String = k[i2];
						if(key == "toString") try {
							return v.toString();
						}
						catch( e : * ){
						};
						if(first1) first1 = false;
						else s1 += ",";
						s1 += " " + key + " : " + flash.Boot.__string_rec(v[key],str);
					}
				};
				if(!first1) s1 += " ";
				s1 += "}";
				return s1;
			}
			break;
			default:
			{
				var _g3 : String = typeof v;
				switch(_g3) {
				case "function":
				return "<function>";
				break;
				case "undefined":
				return "null";
				break;
				}
			}
			break;
			};
			return new String(v);
		}
		
		static protected function __unprotect__(s : String) : String {
			return s;
		}
		
		static public function mapDynamic(d : *,f : *) : * {
			if(Std._is(d,Array)) return d["mapHX"](f);
			else return d["map"](f);
			return null;
		}
		
		static public function filterDynamic(d : *,f : *) : * {
			if(Std._is(d,Array)) return d["filterHX"](f);
			else return d["filter"](f);
			return null;
		}
		
		static static_init function init() : void{
			var aproto : * = Array.prototype;
			aproto.copy = function() : * {
				return this.slice();
			};
			aproto.insert = function(i : *,x : *) : void {
				this.splice(i,0,x);
			};
			aproto.remove = function(obj : *) : Boolean {
				var idx : int = this.indexOf(obj);
				if(idx == -1) return false;
				this.splice(idx,1);
				return true;
			};
			aproto.iterator = function() : * {
				var cur : int = 0;
				var arr : Array = this;
				return { hasNext : function() : Boolean {
					return cur < arr.length;
				}, next : function() : * {
					cur += 1;
					return arr[cur - 1];
				}}
			};
			aproto.setPropertyIsEnumerable("copy",false);
			aproto.setPropertyIsEnumerable("insert",false);
			aproto.setPropertyIsEnumerable("remove",false);
			aproto.setPropertyIsEnumerable("iterator",false);
			aproto.filterHX = function(f : Function) : Array {
				var ret : Array = [];
				var i1 : int = 0;
				var l : int = this.length;
				while(i1 < l) {
					if(f(this[i1])) ret.push(this[i1]);
					++i1;
				};
				return ret;
			};
			aproto.mapHX = function(f1 : Function) : Array {
				var ret1 : Array = [];
				var i2 : int = 0;
				var l1 : int = this.length;
				while(i2 < l1) {
					ret1.push(f1(this[i2]));
					++i2;
				};
				return ret1;
			};
			aproto.setPropertyIsEnumerable("mapHX",false);
			aproto.setPropertyIsEnumerable("filterHX",false);
			String.prototype.charCodeAtHX = function(i3 : *) : * {
				var s : String = this;
				var x1 : Number = s.charCodeAt(i3);
				if(isNaN(x1)) return null;
				return Std._int(x1);
			}
		}
	}
}
namespace static_init;
flash.Boot.static_init::init();
