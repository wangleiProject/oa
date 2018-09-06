/// <reference path="jquery-1.11.1.min.js" />
/// <reference path="knockout-3.2.0.js" />
window.AppType = "";
window.Enjoy = $.extend(true, window.Enjoy, {
	///回调函数
	callback: function(content, func) {
		func(content);
	},

	waiting: null,
	//显示页面加载动画
	loading: function(message) {
		if(window.plus) {
			message = message == undefined ? "正在加载中,请稍等..." : message;
			Enjoy.waiting && Enjoy.waiting.close();
			Enjoy.waiting = plus.nativeUI.showWaiting(message);
		}
	},
	//隐藏加载动画
	loadingHide: function() {
		if(window.plus) {
			Enjoy.waiting && Enjoy.waiting.close();
			Enjoy.waiting = null;
		}
	},

	app: {
		namespace: "Enjoy",
		startupView: "Enjoy.startup",
		activeView: {
			id: ""
		},
		activeViewId: "",
		views: [{
			prve: "",
			next: "",
			id: "startup",
			active: false,
			type: "view"
		}]

	},

	service: {
		//本地服务器
		//		addressPort: "http://192.168.0.115:8060",
		//		    address: "http://192.168.0.115:8060/AppWebService.asmx/",
		//公司服务器
		addressPort: "http://115.29.147.166:8060",
		address: "http://115.29.147.166:8060/AppWebService.asmx/",
		type: "get",
		request: function() {
			var request = {
				UniqueKey: "",
				MethodName: "",
				UserNo: "",
				ClientTime: new Date(),
				ObjectData: null,
				Tag: null
			};
			return request;
		},
		response: function() {
			var response = {
				UniqueKey: "",
				MethodName: "",
				UserNo: "",
				ObjectData: null,
				HasException: false,
				Exception: {
					Code: "",
					Message: ""
				},
				Tag: null
			};
			return response;
		},
		ajax: function(req, contextObj, jsonpCallback, async, time, errorfun) {
			var that = this;
			var res = null;
			if(!async)
				async = true;
			var data = JSON.stringify(req);
			if(this.type == 'GET') {
				data = 'EnjoyRequest=' + data
			}

			$.ajax({
				url: this.address + req.MethodName,
				data: data, //{ EnjoyRequest: JSON.stringify(req) },
				timeout: time != undefined ? time : 30000,
				type: this.type,
				async: async,
				contentType: "application/json;charset=utf-8",
				dataType: "json",
				context: contextObj,
				// jsonpCallback: jsonpCallback,
				success: jsonpCallback,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					Enjoy.loadingHide();
					mui.toast("您的网络不给力，请检查您的网络连接！");
					if(errorfun != undefined && errorfun != null) {
						errorfun();
					}
				},
			});

			return res;
		}
	},

	webhref: function(c_url, c_id, extras) {
		//		window.location=c_url
		mui.openWindow({
				url: c_url,
				id: c_id,
				styles: {
					//		     	zindex:1,
					//		      top:'0px',//新页面顶部位置
					//		      bottom:newage-bottom-position,//新页面底部位置
					//		      width:100%,//新页面宽度，默认为100%
					//		      height:newpage-height,//新页面高度，默认为100% 
				},
				extras: extras, //自定义扩展参数，可以用来处理页面间传值 
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true
					aniShow: "slide-in-right", //页面显示动画，默认为”slide-in-right“；
					//		      duration:animationTime//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
				},
				waiting: {
					autoShow: true, //自动显示等待框，默认为true
					title: '正在加载...', //等待对话框上显示的提示内容
					options: {
						//		        width:waiting-dialog-widht,//等待框背景区域宽度，默认根据内容自动计算合适宽度
						//		        height:waiting-dialog-height,//等待框背景区域高度，默认根据内容自动计算合适高度 
					}
				}
			})
			// 		var item = plus.webview.getWebviewById(c_id);
			// 		var current = plus.webview.currentWebview();
			// 		if(current.id == 'home'){
			// 			item.addEventListener('close',function(){
			// 				mui.fire(current,'home:loadCount');
			// 				mui.fire(current,'home:loadSellMoney');
			// 			})
			// 		}
	},
	getPickData: function(id) {
		document.getElementById(id).addEventListener('tap', function() {
			plus.nativeUI.pickDate(function(e) {
				var d = e.date;
				var m = d.getMonth() + 1;
				if(m < 10) {
					m = '0' + m;
				}
				document.getElementById(id).innerHTML = d.getFullYear() + '-' + m;
			}, function(e) {

				//mui.toast('没有选择日期');
			}, {
				title: "请选择日期"

			});
		})
	},
		getPickTime: function(id) {
		document.getElementById(id).addEventListener('tap', function() {
			plus.nativeUI.pickDate(function(e) {
				var d = e.date;
				var f=d.getDate();
				if(f<10)
				{
					f='0'+f;
				}
				var m = d.getMonth() + 1;
				if(m < 10) {
					m = '0' + m;
				}
				document.getElementById(id).innerHTML =d.getFullYear()+'-'+m+'-'+f;
			}, function(e) {

				//mui.toast('没有选择日期');
			}, {
				title: "请选择日期"

			});
		})
	}
});

var first = null;

function AppQuit() {
	//首次按键，提示‘再按一次退出应用’
	if(!first) {
		first = new Date().getTime();
		mui.toast('再按一次退出应用');
		setTimeout(function() {
			first = null;
		}, 1000);
	} else {
		if(new Date().getTime() - first < 1000) {
			plus.runtime.quit();
		}
	}
};