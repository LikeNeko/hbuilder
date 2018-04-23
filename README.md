## 测试用
## 概述 

给小伙伴们开发的聊天工具

## 待实现功能

1. 字母M换成艺术字的‘宅’
2. 首页放预览信息：被那些人@，被那些人提到，最新的私信，最近任务
3. 消息页增加个悬浮窗口用来展示状态
4. M页暂时定为，首次注册登录自身设定页
5. 个人页：自己的详细资料，主要有头像，昵称，称呼，头衔
6. 填题页：注册不是随便注册的，需要填题，类似于b站的注册填题（ps：考虑扒一下b站的题库……
7. 注册页：题通过之后跳转到注册页，提供昵称，qq号，邮箱进行绑定
8. 登录页：昵称唯一可以用昵称，qq号，邮箱，后期扩展第三方qq登录
9. 设定页：首次登录进行设定自身的‘人格’
10. 随缘扔纸条页：可以匿名向其他用户扔小纸条（ps：多点不认识的小伙伴再说吧。。。
11. 奖励机制：徽章，标签，前缀，头衔
12. 惩罚机制：徽章，标签，前缀，头衔强制为一样事物，最终措施封号

## 待解决的bug
1. 底部导航横放手机拉扁问题
2. 安卓下拉bug ：
解决方案，加入子webview页，形成index -> chat-list-main -> chat-list页结构
3. 安卓底部导航被输入法顶起 ：
解决方案：
```
window.onresize = function() {
	var heightView = document.documentElement.clientHeight || document.body.clientHeight;
	if(heightView < height) {
		plus.nativeObj.View.getViewById("tabBar").hide()
		plus.nativeObj.View.getViewById("icon").hide()
	}else{
		plus.nativeObj.View.getViewById("tabBar").show()
		plus.nativeObj.View.getViewById("icon").show()
	}
}
```
4. vue的表单绑定问题 ：解决，question.html有相关实现
5. 【安卓性能方面的优化】

## 已实现的
1. 中间的字从m改成‘宅’
2. 消息列表右划返回
3. 下拉状态的菜单
4. 注册填题系统

