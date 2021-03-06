var HOST = "http://api.nekom.cc/";
var uapi = {
	question: "Questions.GetQuestion",// 获取问题列表
	set_reply:"Questions.SetReply",//提交问题
	reg_user: "User.SetUser",// 注册
	login_user:"User.Login"  // 登陆
	
}

var util = {
	options: {
		ACTIVE_COLOR: "#007aff",
		NORMAL_COLOR: "#000",
		subpages: ["html/msg/chat-list-main.html", "html/friend-list.html"],
		
	},
	/**
	 * 封装log方法
	 * @param {Object} e
	 */
	log:function(e){
		console.log(JSON.stringify(e));
	},
	/**
	 * 验证设备基本需要
	 */
	selfCheck:function(){
		if(!mui.os.plus){
			mui.alert("系统不支持5+可能会出现一些问题！",'提示')
		}
		if(!plus.device.uuid){
			mui.alert("设备唯一值获取失败！"+plus.os.uuid,'提示')
		}
		
		if(!app.isLogin()){
			util.log('no login ')// 没有登录时打开登录页
			
			mui.openWindow({
				url:"html/loginreg/login.html",
				preload:true,
				styles:{
					popGesture: 'hide'
				},
				waiting: {
					autoShow: true
				}
			})
			return false;
		}else{
			var e = app.getState()
			util.log(e)
			mui.alert('最后登陆时间：'+e.lasttime+"\n最后登陆ip："+e.lastip+"\ntoken为："+e.token,'主人，请查阅~')
		}
	},
	/**
	 *  普通的post请求方法
	 **/
	 query_post : function(api_name, data, callback, error){
		  //拼接请求的URL地址
		  var fullapi = HOST + '?service=' + api_name;
		  //执行请求
		  mui.ajax(fullapi,{
			data:data,
			type:'POST',//HTTP请求类型
			timeout:10000,//超时时间设
			success:function(rs){
			
		        //回调函数
		        callback(rs);
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				error(xhr,type,errorThrown)
			}
		});
	},

	/**
	 *  简单封装了绘制原生view控件的方法
	 *  绘制内容支持font（文本，字体图标）,图片img , 矩形区域rect
	 */
	drawNative: function(id, styles, tags) {
		var view = new plus.nativeObj.View(id, styles, tags);
		return view;
	},
	/**
	 * 初始化首个tab窗口 和 创建子webview窗口 
	 */
	initSubpage: function(aniShow) {
		var subpage_style = {
				top: 0,
				bottom: 51
			},
			subpages = util.options.subpages,
			self = plus.webview.currentWebview(),
			temp = {};
			
		//兼容安卓上添加titleNView 和 设置沉浸式模式会遮盖子webview内容
		if(mui.os.android) {
			if(plus.navigator.isImmersedStatusbar()) {
				subpage_style.top += plus.navigator.getStatusbarHeight();
			}
			if(self.getTitleNView()) {
				subpage_style.top += 40;
			}
			
		}
		
		// 初始化第一个tab项为首次显示
		temp[self.id] = "true";
		mui.extend(aniShow, temp);
		// 初始化绘制首个tab按钮
		util.toggleNview(0);

		for(var i = 0, len = subpages.length; i < len; i++) {

			if(!plus.webview.getWebviewById(subpages[i])) {
				
				var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
				//初始化隐藏
				sub.hide();
				// append到当前父webview
				self.append(sub);
			}
		}
		
		

	},
	/**	
	 * 点击切换tab窗口 
	 */
	changeSubpage: function(targetPage, activePage, aniShow) {
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetPage]) {
			plus.webview.show(targetPage);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetPage.id] = "true";
			mui.extend(aniShow, temp);
		
			plus.webview.show(targetPage, "none", 200);
		}
		
		//隐藏当前 除了第一个父窗口
		if(activePage !== plus.webview.getLaunchWebview()) {
			plus.webview.hide(activePage);
		}
	},
	/**
	 * 点击重绘底部tab （view控件）
	 */
	toggleNview: function(currIndex) {
		currIndex = currIndex * 2;
		// 重绘当前tag 包括icon和text，所以执行两个重绘操作
		util.updateSubNView(currIndex, util.options.ACTIVE_COLOR);
		util.updateSubNView(currIndex + 1, util.options.ACTIVE_COLOR);
		// 重绘兄弟tag 反之排除当前点击的icon和text
		for(var i = 0; i < 8; i++) {
			if(i !== currIndex && i !== currIndex + 1) {
				util.updateSubNView(i, util.options.NORMAL_COLOR);
			}
		}
	},
	/*
	 * 改变颜色
	 */
	changeColor: function(obj, color) {
		obj.color = color;
		return obj;
	},
	/*
	 * 利用 plus.nativeObj.View 提供的 drawText 方法更新 view 控件
	 */
	updateSubNView: function(currIndex, color) {
		var self = plus.webview.currentWebview(),
			nviewEvent = plus.nativeObj.View.getViewById("tabBar"), // 获取nview控件对象
			nviewObj = self.getStyle().subNViews[0], // 获取nview对象的属性
			currTag = nviewObj.tags[currIndex]; // 获取当前需重绘的tag

		nviewEvent.drawText(currTag.text, currTag.position, util.changeColor(currTag.textStyles, color), currTag.id);
	}
};


