const {utils:Cu, interfaces:Ci, classes:Cc} = Components;
Cu.import('resource://gre/modules/Services.jsm');

/*start - windowlistener*/
var windowListener = {
	//DO NOT EDIT HERE
	onOpenWindow: function (aXULWindow) {
		// Wait for the window to finish loading
		var aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
		aDOMWindow.addEventListener('load', function () {
			aDOMWindow.removeEventListener('load', arguments.callee, false);
			windowListener.loadIntoWindow(aDOMWindow);
		}, false);
	},
	onCloseWindow: function (aXULWindow) {},
	onWindowTitleChange: function (aXULWindow, aNewTitle) {},
	register: function () {
		// Load into any existing windows
		var DOMWindows = Services.wm.getEnumerator(null);
		while (DOMWindows.hasMoreElements()) {
			var aDOMWindow = DOMWindows.getNext();
			windowListener.loadIntoWindow(aDOMWindow);
		}
		// Listen to new windows
		Services.wm.addListener(windowListener);
	},
	unregister: function () {
		//Stop listening so future added windows dont get this attached
		Services.wm.removeListener(windowListener);
		
		// Unload from any existing windows
		var DOMWindows = Services.wm.getEnumerator(null);
		while (DOMWindows.hasMoreElements()) {
			var aDOMWindow = DOMWindows.getNext();
			windowListener.unloadFromWindow(aDOMWindow);
		}		
	},
	//END - DO NOT EDIT HERE
	loadIntoWindow: function (aDOMWindow) {
		if (!aDOMWindow) {
			return;
		}
		
		var aDOMDocument = aDOMWindow.document;
		var keyset = aDOMDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'keyset'); //http://forums.mozillazine.org/viewtopic.php?f=19&t=2711165&p=12885299&hilit=mainKeyset#p12885299
		keyset.setAttribute('id', 'BootstrapHotkey_keyset');
		//cant use mainKeyset so we create our own keyset
			// reason is: key listeners are attached when keyset is added
		var key = aDOMDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'key');
		var props = {
		  id: 'BootstrapHotkey_key',
		  modifiers: 'accel',
		  keycode: 'VK_F12',
		  oncommand: 'alert("tirggered BootstrapHotkey_mykey")'
		};
		for (var p in props) {
		  key.setAttribute(p, props[p]);
		}
		keyset.appendChild(key);
		aDOMDocument.documentElement.appendChild(keyset);
	},
	unloadFromWindow: function (aDOMWindow) {
		if (!aDOMWindow) {
			return;
		}
		var myKeyset = aDOMWindow.document.getElementById('BootstrapHotkey_keyset');
		if (myKeyset) {
			myKeyset.parentNode.removeChild(myKeyset);
		}
	}
};
/*end - windowlistener*/

function install() {}
function uninstall() {}

function startup() {
	//wm watcher more
	windowListener.register();
	//end wm watcher more
}
 
function shutdown() {
	//wm watcher more
	windowListener.unregister();
	//end wm watcher more
}
