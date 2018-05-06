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
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';

		if(loginInfo.account.length < 6) {
			return callback('账号最短为 6 个字符');
		}
		if(loginInfo.password.length < 8) {
			return callback('密码最短为 8 个字符');
		}
		var uuid = plus.device.uuid;
		if(uuid) {
			loginInfo.uuid = uuid;
		} else {
			return callback('设备id获取失败');
		}
		
		util.query_post(uapi.login_user,loginInfo,function(e){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			if(e.ret == 200) {
				var user = e.data;
				owner.setState(user)
				return callback();
			} else {
				util.log(e.msg)
				return callback(e.msg);
			}
		},function(xhr,type,errorThrown){
			return callback('网络超时，请重新提交')
		})
		
	
	};


	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		// 获取注册信息
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		
		if(regInfo.account.length < 6) {
			return callback('用户名最短需要 6个字符'); // 回调的函数
		}
		if(regInfo.password.length < 8) {
			return callback('密码最短需要 8 个字符');
		}
		if(!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var uuid = plus.device.uuid;
		if(uuid) {
			regInfo.uuid = uuid;
		} else {
			return callback('设备id获取失败');
		}
	
		util.query_post(uapi.reg_user,regInfo,function(e){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			if(e.ret == 200) {
				if(e.data.uid != 0) {
					return callback();
				}
				
			} else {
				return callback("注册失败服务器出错！"+e.msg);
			}
		},function(xhr,type,errorThrown){
			return callback('网络超时，请重新提交')
		})

	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = plus.storage.getItem('userinfo') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		
		state = state || {};
		plus.storage.setItem("userinfo", JSON.stringify(state));
	};
	
	/**
	 * 判断用户是否登录
	 */
	owner.isLogin = function(){
		var data = owner.getState();
		
		return data.uid && data.token ? true:false;
	}

	var checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));