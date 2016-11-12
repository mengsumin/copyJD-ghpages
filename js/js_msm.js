(function(window) {

	window.msm = {
		loadJavaScript: loadJavaScript, //加载外部js
		loadJavaScriptString: loadJavaScriptString, //添加script片段
		loadStyle: loadStyle, //加载外部样式表
		matchesSelector: matchesSelector, //检测选择器内容是否匹配元素
		jsonToTable: jsonToTable, //动态创建表格
		insertRules: insertRules, //样式表中插入样式规则
		deleteRule: deleteRule, //删除样式表中样式规则
		getElementLeftOffset: getElementLeftOffset, //得到元素左侧偏移
		getElementTopOffset: getElementTopOffset, //得到顶部偏移
		getViewport: getViewport, //得到视口
		userAgentCheck: userAgentCheck, //用户代理检测
		converToArray: convertToArray, //转换数组
		selectText: selectText, //选择指定位置文本
		getSheet: function(ele) { //通过style或link元素获取CSSStyleSheet对象
			return ele.sheet || ele.StyleSheet;
		},
		getRules: function(sheet, index) { //通过样式表对象获取第index条规则几对象
			return sheet.cssRules[index].style || sheet.rules[index].style;
		},
		getElementStyle: getElementStyle,
		setElementProChange: setElementProChange, //设置某个元素的某些属性多态变化
		createObjectUrl: createObjectUrl, //获取blob或file对象的URL
	};

	/*
	       跨浏览器的事件对象
	 *param event
	 * */
	window.msmEvent = {
		addHandler: addhandler,
		removeHandler: removeHandler,

		getEvent: function(event) { //获取Event对象
			return event ? event : window.event;
		},

		getTarget: function(event) { //获取事件的目标
			return event.target || event.srcElement;
		},

		preventDefault: function(event) {
			if(event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},

		stopPropagation: function(event) { //阻止事件冒泡
			if(event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},
		getCharCode: function(event) { //检测keypress事件按下的键码
			if(event.charCode != 0) {
				return event.charCode;
			} else if(event.keyCode) {
				return event.keyCode;
			} else if(event.which) {
				return event.which;
			}
		}
	}

	/*
	        获取Blob对象或file对象的URL
	 *return string URL
	 * param blob/file Blob
	 * */
	function createObjectUrl(Blob) {
		if(window.URL) {
			return window.URL.createObjectURL(Blob);
		} else if(window.webkitURL) {
			return window.webkitURL.createObjectURL(Blob);
		} else {
			return null;
		}
	}

	/*
	 设置某个元素的某些属性多态变化
	 * param element obj
	 * param json json//属性集合
	 * param number  changeTime//变化频率
	 * */
	function setElementProChange(obj, json, changeTime) {
		clearInterval(obj.timer);
		obj.timer = setInterval(changeFun, changeTime);

		function changeFun() {
			var flag = true;
			for(var p in json) {
				flag = false;
				var styleValue = parseFloat(msm.getElementStyle(obj, p));
				//变化幅度
				if(p == "opacity") {
					styleValue = styleValue * 100;
				}
				var iSpeed = (parseFloat(json[p]) - styleValue) / 8;
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
				if((iSpeed >= 0 && parseFloat(json[p]) <= styleValue) || (iSpeed < 0 && styleValue <= parseFloat(json[p]))) {
					switch(p) {
						case "opacity":
							obj.style[p] = json[p] / 100;
							break;
						default:
							obj.style[p] = styleValue + "px";
							break;
					}
					delete json[p];
				} else {
					switch(p) {
						case "opacity":
							styleValue = ((styleValue + iSpeed) / 100).toFixed(2);
							obj.style[p] = styleValue;
							obj.style["filter"] = "Alpha(opacity=" + styleValue + ")"; //兼容IE8
							break;
						default:
							obj.style[p] = styleValue + iSpeed + "px";
							break;
					}
				}
			}
			//所有属性执行完毕，清除定时器
			if(flag) {
				clearInterval(obj.timer);
			}
		}
	}

	/*
	       获取某个元素的计算样式
	 * param element ele //元素节点
	 * param string attr  //样式属性名称
	 * */
	function getElementStyle(ele, attr) {
		if(window.getComputedStyle) {
			return window.getComputedStyle(ele, null)[attr];
		} else if(ele.currentStyle) {
			return ele.currentStyle[attr];
		} else {
			return "error";
		}
	}

	/*
	     跨浏览器选择文本
	 * param element(<input><textarea>) textbox
	 * param number startIndex
	 * param number stopIndex
	 * */
	function selectText(textbox, startIndex, stopIndex) {
		if(textbox.setSelectionRange) { //非IF
			textbox.setSelectionRange(startIndex, stopIndex);
		} else if(textbox.createTextRange) {
			var range = textbox.createTextRange();
			range.collapse(true);
			range.moveStart("character", startIndex);
			range.moveEnd("character", stopIndex - startIndex);
			range.select();
		}

		textbox.focus();
	}

	/*
	     将节点转换为数组
	 *param elements nodes
	 * return Array array
	 * */

	function convertToArray(nodes) {
		var array = null;
		try {
			array = Array.prototype.slice.call(nodes, 0); //针对非IE浏览器
		} catch(e) {
			array = new Array();
			for(var i = 0, len = nodes.length; i < len; i++) {
				array.push(nodes[i]);
			}
		}
		return array;
	}

	/*
	 用户代理字符串检测脚本
	 * return object{engine,browser,system}
	 * */
	function userAgentCheck() {
		//呈现引擎
		var engine = {
			ie: 0,
			gecko: 0,
			webkit: 0,
			khtml: 0,
			opera: 0,

			//完整的版本号
			ver: null
		};

		//浏览器
		var browser = {

			//主要的浏览器
			ie: 0,
			firefox: 0,
			safari: 0,
			konq: 0,
			opera: 0,
			chrome: 0,

			//具体版本号
			ver: null
		};

		//平台/设备/操作系统
		var system = {
			win: false,
			mac: false,
			x11: false,

			//移动设备
			iphone: false,
			ipod: false,
			ipad: false,
			ios: false,
			android: false,
			nokiaN: false,
			winMobile: false,

			//游戏系统
			wii: false,
			ps: false
		};

		//给上面的属性对象赋值(具体的检测方法实现)
		//检测呈现引擎和浏览器
		var ua = navigator.userAgent;
		if(window.opera) {
			engine.ver = browser.ver = window.opera.version();
			engine.opera = browser.opera = parseFloat(engine.ver);
		} else if(/AppleWebKit\/(\S+)/.test(ua)) {
			engine.ver = RegExp["$1"];
			engine.webkit = parseFloat(engine.ver);

			//确定是 Chrome or Safari
			if(/Chrome\/(\S+)/.test(ua)) {
				browser.ver = RegExp["$1"];
				browser.chrome = parseFloat(browser.ver);
			} else if(/Version\/(\S+)/.test(ua)) {
				browser.ver = RegExp["$1"];
				browser.safari = parseFloat(browser.ver);
			} else {
				//近似地确定版本号
				var safariVersion = 1;
				if(engine.webkit < 100) {
					safariVersion = 1;
				} else if(engine.webkit < 312) {
					safariVersion = 1.2;
				} else if(engine.webkit < 412) {
					safariVersion = 1.3;
				} else {
					safariVersion = 2;
				}

				browser.safari = browser.ver = safariVersion;
			}
		} else if(/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
			engine.ver = browser.ver = RegExp["$1"];
			engine.khtml = browser.konq = parseFloat(engine.ver);
		} else if(/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
			engine.ver = RegExp["$1"];
			engine.gecko = parseFloat(engine.ver);

			//确定是不是 Firefox
			if(/Firefox\/(\S+)/.test(ua)) {
				browser.ver = RegExp["$1"];
				browser.firefox = parseFloat(browser.ver);
			}
		} else if(/MSIE ([^;]+)/.test(ua)) {
			engine.ver = browser.ver = RegExp["$1"];
			engine.ie = browser.ie = parseFloat(engine.ver);
		}

		//检测浏览器
		browser.ie = engine.ie;
		browser.opera = engine.opera;

		//检测平台
		var p = navigator.platform;
		system.win = p.indexOf("Win") == 0;
		system.mac = p.indexOf("Mac") == 0;
		system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

		//检测 windows 操作系统
		if(system.win) {
			if(/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
				if(RegExp["$1"] == "NT") {
					switch(RegExp["$2"]) {
						case "5.0":
							system.win = "2000";
							break;
						case "5.1":
							system.win = "XP";
							break;
						case "6.0":
							system.win = "Vista";
							break;
						case "6.1":
							system.win = "7";
							break;
						default:
							system.win = "NT";
							break;
					}
				} else if(RegExp["$1"] == "9x") {
					system.win = "ME";
				} else {
					system.win = RegExp["$1"];
				}
			}
		}

		//移动设备
		system.iphone = ua.indexOf("iPhone") > -1;
		system.ipod = ua.indexOf("iPod") > -1;
		system.ipad = ua.indexOf("iPad") > -1;
		system.nokiaN = ua.indexOf("NokiaN") > -1;

		//windows mobile
		if(system.win == "CE") {
			system.winMobile = system.win;
		} else if(system.win == "Ph") {
			if(/Windows Phone OS (\d+.\d+)/.test(ua)) {;
				system.win = "Phone";
				system.winMobile = parseFloat(RegExp["$1"]);
			}
		}

		//检测 iOS 版本
		if(system.mac && ua.indexOf("Mobile") > -1) {
			if(/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
				system.ios = parseFloat(RegExp.$1.replace("_", "."));
			} else {
				system.ios = 2; //can't really detect - so guess
			}
		}

		//检测 Android 版本
		if(/Android (\d+\.\d+)/.test(ua)) {
			system.android = parseFloat(RegExp.$1);
		}

		//游戏系统
		system.wii = ua.indexOf("Wii") > -1;
		system.ps = /playstation/i.test(ua);

		//返回这些对象
		return {
			engine: engine,
			browser: browser,
			system: system
		};
	}

	/*
	 跨浏览器事件处理程序
	 * param element element
	 * param string type//事件类型
	 * param function handler
	 * */
	function addhandler(element, type, handler) {
		if(element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if(element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	}

	function removeHandler(element, type, handler) {
		if(element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if(element.detachEvent) {
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	}

	/*
	 确定浏览器视口大小
	 * return object{width,height}
	 * */
	function getViewport() {
		var pageWidth = window.innerWidth;
		var pageHeight = window.innerHeight;
		if(typeof pageWidth != "number") {
			if(document.compatMode == "CSS1Compat") {
				pageWidth = document.documentElement.clientWidth;
				pageHeight = document.documentElement.clientHeight;
			} else {
				pageWidth = document.body.clientWidth;
				pageHeight = document.body.clientHeight;
			}
		}
		return {
			width: pageWidth,
			height: pageHeight
		};
	}

	/*
	     获取某个元素在页面上的左偏移量
	 * param element element
	 * return offsetLeft
	 * */
	function getElementLeftOffset(element) {
		var actualLeft = element.offsetLeft;
		var current = element.offsetParent;
		while(current != null) {
			actualLeft += current.offsetLeft;
			current = current.offsetParent;
		}
		return actualLeft;
	}

	/*
	     获取某个元素在页面上的顶部偏移量
	 * param element element
	 * return offsetTop
	 * */
	function getElementTopOffset(element) {
		var actualTop = element.offsetTop;
		var current = element.offsetParent;
		while(current != null) {
			actualTop += current.offsetTop;
			current = current.offsetParent;
		}
		return actualTop;
	}

	/*
	     跨浏览器向样式表中添加样式
	 * param  CSSSheet sheet//样式表对象
	 * param  string selectorText//选择器内容
	 * param  string cssText
	 * param  index position
	 * */
	function insertRules(sheet, selectorText, cssText, position) {
		if(sheet.insertRule) {
			sheet.insertRule(selectorText + "{" + cssText + "}", position);
		} else if(sheet.addRule) {
			sheet.addRule(selectorText, cssText, position);
		};
	}

	/*
	    跨浏览器删除样式表中的样式
	 * param CSSSheet sheet
	 * param index
	 * */
	function deleteRule(sheet, index) {
		if(sheet.deleteRule) {
			sheet.deleteRule(index);
		} else if(sheet.removeRule) {
			sheet.removeRule(index);
		}
	}

	/*
	 动态加载外部js文件
	 * param string url
	 * */
	function loadJavaScript(url) {
		var oScript = document.createElement("script");
		oScript.type = "text/javascript";
		oScript.src = url;
		document.body.appendChild(oScript);
	}

	/*
	     根据传递的js动态创建内部js,兼容IE
	 * param string jsText
	 * */
	function loadJavaScriptString(jsString) {
		var oScript = document.createElement("script");
		oScript.type = "text/javascript";
		try {
			var oText = document.createTextNode(jsString);
			oScript.appendChild(oText);
		} catch(ex) {
			oScript.text = jsString;
		}
		document.body.appendChild(oScript);
	}

	/*
	  动态加载外部样式表CSS
	 *param string url
	 * */
	function loadStyle(url) {
		var oLink = document.createElement("link");
		oLink.type = "text/css";
		oLink.rel = "stylesheet";
		oLink.href = url;
		var head = document.head || document.getElementsByTagName("head")[0];
		document.head.appendChild(oLink);
	}

	/*
	     判断元素是否匹配选择器的内容
	 *param element e  
	 * paea string selector
	 * */
	function matchesSelector(e, selector) {
		var bMatches = false;
		if(e.matchesSelector) {
			bMatches = e.matchesSelector(selector);
		} else if(e.msMatchesSelector) {
			bMatchers = e.msMatchesSelector(selector);
		} else if(e.mozMatchesSelector) {
			bMatchers = e.mozMatchesSelector(selector);
		} else if(e.webkitMatchesSelector) {
			bMatchers = e.webkitMatchesSelector(selector);
		}

		return bMatchers;
	}

	/*
	 将一个JSON数据转换为Table
	 * param array datas
	 * param string className
	 * */
	function jsonToTable(datas, className) {
		//创建表格
		var oTable = document.createElement("table");
		oTable.className = className;

		//创建表头
		var str = "<thead><tr>";
		for(var p in datas[0]) {
			str += "<td>" + p + "</td>";
		}
		str += "</tr></thead>";
		//创建tbody
		str += "<tbody>";
		for(var i = 0, len = datas.length; i < len; i++) {
			str += "<tr>";
			for(var x in datas[i]) {
				str += "<td>" + datas[i][x] + "</td>";
			}
			str += "</tr>";
		}
		str += "</tbody>";
		oTable.innerHTML = str;
		document.body.appendChild(oTable);
	}

})(window);