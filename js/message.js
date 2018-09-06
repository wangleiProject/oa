(function() {
		var index = 1;
		var size = null;
		var imageIndexIdNum = 0;
		var starIndex = 0;
		var feedback = {
			title:document.getElementById('title'),
			question: document.getElementById('question'),
			submitBtn: document.getElementById('submit')
		};
		var url = Enjoy.service.address + 'InsertMessage';
		mui.plusReady(function() {
				/**
				 *提交成功之后，恢复表单项 
				 */
				feedback.clearForm = function() {
					feedback.question.value = '';
					feedback.title.value = '';
					index = 0;
					size = 0;
					imageIndexIdNum = 0;
					starIndex = 0;
				};

				feedback.submitBtn.addEventListener('tap', function(event) {
					if(feedback.question.value == '') {
						return mui.toast('信息填写不符合规范');
					}
					if(feedback.title.value == '') {
						return mui.toast('信息填写不符合规范');
					}
					if(feedback.question.value.length > 2000) {
						return mui.toast('信息超长(超过2000字),请重新填写~')
					}
					//判断网络连接
					if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
						return mui.toast("连接网络失败，请稍后再试");
					}
					feedback.send(mui.extend({}, {
						content: feedback.question.value,
						title:feedback.title.value

					}))
				}, false)
				feedback.send = function(content) {
					var states = app.getState();
					mui.ajax({
							url: url,
							data: {
								content: content.content,
								title: content.title,
								userName: states.userName
							},
							type: 'get',
							dataType: 'text',
							contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
							success: function(data) {
								if(data > 0) {

									mui.alert("通知下发成功，点击确定关闭", "通知", "确定", function() {
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