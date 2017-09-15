package flash {
	import flash.net.URLRequest;
	import flash.utils.getDefinitionByName;
	import flash.display.MovieClip;
	import flash.external.ExternalInterface;
	import haxe.Log;
	import flash.system.fscommand;
	import flash.net.navigateToURL;
	import flash.utils.describeType;
	import flash.utils.getTimer;
	public class Lib {
		static public var current : flash.display.MovieClip;
		static public function _getTimer() : int {
			return flash.utils.getTimer();
		}
		
		static public function eval(path : String) : * {
			var p : Array = path.split(".");
			var fields : Array = new Array();
			var o : * = null;
			while(p.length > 0) {
				try {
					o = flash.utils.getDefinitionByName(p.join("."));
				}
				catch( e : * ){
					fields.unshift(p.pop());
				};
				if(o != null) break;
			};
			{
				var _g : int = 0;
				while(_g < fields.length) {
					var f : String = fields[_g];
					++_g;
					if(o == null) return null;
					o = o[f];
				}
			};
			return o;
		}
		
		static public function getURL(url : flash.net.URLRequest,target : String = null) : void {
			var f : Function = flash.net.navigateToURL;
			if(target == null) f(url);
			else ((f) as Function)(url,target);
		}
		
		static public function fscommand(cmd : String,param : String = null) : void {
			flash.system.fscommand(cmd,((param == null)?"":param));
		}
		
		static public function _trace(arg : *) : void {
			trace(arg);
		}
		
		static public function describeType(value : *) : XML {
			return flash.utils.describeType(value);
		}
		
		static public function attach(name : String) : flash.display.MovieClip {
			var cl : * = flash.utils.getDefinitionByName(name) as Class;
			return new cl();
		}
		
		static public function _as(v : *,c : Class) : * {
			return v as c;
		}
		
		static public function redirectTraces() : void {
			if(flash.external.ExternalInterface.available) haxe.Log._trace = flash.Lib.traceToConsole;
		}
		
		static protected function traceToConsole(v : *,inf : * = null) : void {
			var type : String = ((inf != null && inf.customParams != null)?inf.customParams[0]:null);
			if(type != "warn" && type != "info" && type != "debug" && type != "error") {
				if(inf == null) type = "error";
				else type = "log";
			};
			var str : String = ((inf == null)?"":inf.fileName + ":" + inf.lineNumber + " : ");
			try {
				str += Std.string(v);
			}
			catch( e : * ){
				str += "????";
			};
			str = str.split("\\").join("\\\\");
			flash.external.ExternalInterface.call("console." + type,str);
		}
		
	}
}
