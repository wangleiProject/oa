/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/

(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.u = loginInfo.u || '';
		loginInfo.p = loginInfo.p || '';

		if(loginInfo.u.length <= 0) {
			return callback('请输入账号');
		}
		if(loginInfo.p.length <= 0) {
			return callback('请输入密码');
		}

		mui.ajax({

			url: Enjoy.service.addressPort + '/ajax/login.ashx',
			data: loginInfo,
			type: 'post',
			dataType: 'text',
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			success: function(data) {
				Enjoy.loadingHide();
				if(data == 1) {
					//获取token（令牌）
					mui.ajax({
						url: Enjoy.service.address + 'GetNewGuid',
						data: {
							userid: loginInfo.u
						},
						type: 'get',
						dataType: 'json',
						contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
						success: function(data) {
							if(data.Result != null) {

								var token = data.Result;
								mui.ajax({
									url: Enjoy.service.address + 'CheckAdmin',
									data: {},
									type: 'get',
									dataType: 'text',
									success: function(isAdmin) {
										mui.ajax({
											url: Enjoy.service.address + 'GetUserInfo',
											data: {},
											type: 'get',
											dataType: 'text',
											success: function(userName) {
												return owner.createState(loginInfo.u, loginInfo.p, token, isAdmin.toLowerCase(), userName, callback);
											}
										})

									}
								})

							}
						},
						error: function(xhr, type, errorThrown) {

							mui.toast('获取令牌失败，请联系管理员');
							return;
						}

					})

				} else {
					if(data == 0) {

						mui.toast('用户名或密码错误');
					} else {
						mui.toast(data);
						return;
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				Enjoy.loadingHide();
				mui.toast('网络出错,请检查您的网络');
				return;

			}
		})

	};

	owner.createState = function(name, pwd, token, isAdmin, userName, callback) {
		//localStorage.clear();
		var states = owner.getState();
		states.account = name;
		states.token = token;
		states.pwd = pwd;
		states.isAdmin = isAdmin;
		states.userName = userName;
		owner.setState(states);
		var info = owner.getState();
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));

	};
	/**
	 * 清空本地存储
	 */
	owner.clearStates = function() {

			localStorage.clear();
		}
		/**
		 * 设置应用本地配置
		 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 获取应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取token状态
		 * @param {Object} id 
		 * @param {Object} token
		 */
	owner.getTokenState = function(id, token) {
			message = '';
			mui.ajax({
				url: Enjoy.service.address + 'GetTokenMessage',
				data: {
					id: id,
					token: token
				},
				type: 'post',
				async: false,
				dataType: 'text',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				success: function(data) {
					message = data;

				}
			})

			return message;
		}
		/**
		 * 检查是否登录超时
		 */
	owner.checkTime = function() {
		var state = app.getState();
		var account = state.account;
		var token = state.token;
		var msg = owner.getTokenState(account, token);
		if(msg == "无效") {
			var all = plus.webview.all();
			var curr = plus.webview.currentWebview();
			var current = plus.webview.currentWebview().id;
			for(var i = 0, len = all.length; i < all.length; i++) {
				if(all[i].id !== current && all[i].id !== "HBuilder") {
					//console.log(all[i].id);
					all[i].close();
				}
			};

			plus.nativeUI.alert("登录超时，请重新登录", function() {
				curr.close();
				Enjoy.loadingHide();
				plus.webview.open('login.html');
				return false;
			}, "提示");

		}

	}
	owner.updateTime = function() {
		var state = app.getState();
		var id = state.account;
		var token = state.token;
		mui.ajax({
			url: Enjoy.service.address + 'UpDateLastVisitTime',
			data: {
				userId: id,
				token: token
			},
			type: 'post',
			async: false,
			dataType: 'text',
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
			success: function(data) {
				console.log(data);
				if(data = 1) {
					//console.log('更新访问时间成功');
				}

			}
		})

	}

}(mui, window.app = {}));