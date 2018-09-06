(function() {
		var index = 1;
		var size = null;
		var imageIndexIdNum = 0;
		var starIndex = 0;
		var feedback = {
			question: document.getElementById('question'),
			submitBtn: document.getElementById('submit')
		};
		var url = Enjoy.service.address + 'InsertFeedback';
		mui.plusReady(function() {
				/**
				 *提交成功之后，恢复表单项 
				 */
				feedback.clearForm = function() {
					feedback.question.value = '';
					index = 0;
					size = 0;
					imageIndexIdNum = 0;
					starIndex = 0;
				};

				feedback.submitBtn.addEventListener('tap', function(event) {
					if(feedback.question.value == '') {
						return mui.toast('信息填写不符合规范');
					}
					if(feedback.question.value.length > 1000) {
						return mui.toast('信息超长(超过1000字),请重新填写~')
					}
					//判断网络连接
					if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
						return mui.toast("连接网络失败，请稍后再试");
					}
					feedback.send(mui.extend({}, {
						content: feedback.question.value,

					}))
				}, false)
				feedback.send = function(content) {
					var states = app.getState();
                       console.log(content.content+states.account+states.userName);
					mui.ajax({
							url: url,
							data: {
								content: content.content,
								userid: states.account,
								userName: states.userName
							},
							type: 'get',
							dataType: 'text',
							contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
							success: function(data) {
								if(data > 0) {

									mui.alert("感谢反馈，点击确定关闭", "问题反馈", "确定", function() {
											feedback.clearForm();
											mui.back();
									});
									}

							},
							error:function(xhr, type, errorThrown){
								
								mui.toast(errorThrown);
							}
							})
					}
				
			});
		})();