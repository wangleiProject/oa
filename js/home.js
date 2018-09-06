(function($, doc) {
				$.init();
				   $.plusReady(function(){
					var states=app.getState();
					if(states.isAdmin!='true')
					{
						document.getElementById("one").classList.add('mui-hidden');
						document.getElementById("doctorsSalarys").classList.add('mui-hidden');
						document.getElementById("nurseSalarys").classList.add('mui-hidden');
						document.getElementById("tecOthers").classList.add('mui-hidden');
						document.getElementById("tecSalarys").classList.add('mui-hidden');
						document.getElementById("asstisOthers").classList.add('mui-hidden');
						document.getElementById("fenxi").classList.add('mui-hidden');
					}
					loadNav();
					scollNav();
					//addTab();
                    
					var settingPage = $.preload({
						"id": 'setting',
						"url": 'setting.html'
					}
					);

					//设置
					var settingButton = doc.getElementById('setting');
					
					settingButton.addEventListener('tap', function(event) {
						$.openWindow({
							id: 'setting',
							show: {
								aniShow: 'pop-in'
							},
							styles: {
								popGesture: 'hide'
							},
							waiting: {
								autoShow: false
							}
						});
					});
					//--------------------奖金分析-----------------------------------------
                    var month=document.getElementById("one");
                    month.addEventListener('tap',function(event){

						Enjoy.webhref('Views/WagesList/WagesListMain.html','WagesListMain');
                    
                    });
                    document.getElementById("fenxi").addEventListener('tap',function(event){

						Enjoy.webhref('echarts.html','echart');
                    	
                    })
                    
                    // --------------------反馈-----------------------------------------------
                   document.getElementById("fankui").addEventListener('tap',function(event){

						Enjoy.webhref('/Views/Feedback/feedbackList.html','feedbackList');
                    	
                    })
                    // --------------------通知-----------------------------------------------
                   document.getElementById("tongzhi").addEventListener('tap',function(event){

						Enjoy.webhref('/Views/Message/messageList.html','messageList');
                    	
                    })
                    // --------------------投票-----------------------------------------------
                   document.getElementById("toupiao").addEventListener('tap',function(event){

						Enjoy.webhref('/Views/vote/voteList.html','voteList');
                    	
                    })
                   //----------------------医生奖金--------------------------------------------
                   document.getElementById("doctorsSalarys").addEventListener('tap',function(event){

						Enjoy.webhref('/Views/DoctorsSalarys/DoctorsSalarysMain.html','DoctorsSalarysMain');
                    	
                    })
                   
                   //----------------------护士奖金--------------------------------------------
                   document.getElementById("nurseSalarys").addEventListener('tap',function(event){

						Enjoy.webhref('/Views/NurseSalarysSum/NurseSalarysMain.html','NurseSalarysMain');
                    	
                    })
                   //----------------------非病房奖金--------------------------------------------
                   document.getElementById("tecOthers").addEventListener('tap',function(event){

						Enjoy.webhref('/Views/TecSalarysList/OtherTecMain.html','OtherTecMain');
                    	
                    })
                   //----------------------医技奖金--------------------------------------------
                   document.getElementById("tecSalarys").addEventListener('tap',function(event){

						Enjoy.webhref('/Views/TecSalarysList/TecSalarysMain.html','TecSalarysMain');
                    	
                    })
                   //----------------------医辅奖金--------------------------------------------
                   document.getElementById("asstisOthers").addEventListener('tap',function(event){

						Enjoy.webhref('/Views/TecSalarysList/AssistSalaryMain.html','AssistSalaryMain');
                    	
                    })
                    //----------------------奖金明细--------------------------------------------
                   document.getElementById("salarysDetail").addEventListener('tap',function(event){

						Enjoy.webhref('/Views/DeptSalarysSum/DeptSalarysSumMain.html','DeptSalarysSumMain');
                    	
                    })
                   
                   
					//--返回键
					$.oldBack = mui.back;
					var backButtonPress = 0;
					$.back = function(event) {
						backButtonPress++;
						if (backButtonPress > 1) {
							plus.runtime.quit();
						} else {
							plus.nativeUI.toast('再按一次退出应用');
						}
						setTimeout(function() {
							backButtonPress = 0;
						}, 1000);
						return false;
					};
			
				
			})}(mui, document));
		//获取导航菜单
        function loadNav(){
        	 var info=app.getState();
		       mui.ajax({
			url:Enjoy.service.address+'GetJsonNav',
			data: {userId:info.account,token:info.token},
			type:'get',
			dataType:'text',
			//contentType:'application/jsonp;charset=UTF-8',
			success:function(jsondata){
								if(JSON.stringify(jsondata).length>1)
								{
									var d=eval("("+jsondata+")");
					                  InitLeftMenu(d);
								}
								else{
									
									alert("没有数据查询权限");
								}
         					},
			
         	error:function(xhr,type,errorThrown){
				mui.toast('获取导航菜单失败，请退出重新登录');
		
			 }
        });
}
       //初始化菜单
	    function InitLeftMenu(data){
	    	var menulist = "";
	    	mui.each(data.menus, function (i, sm) {
	    	 
//      menulist += '<ul class="mui-table-view" >';
          menulist += '<ul class="mui-table-view mui-table-view-chevron mui-table-view-inverted" id="leftNavUi">';
        mui.each(sm.menus, function (j, o) {
            menulist += '<li class="mui-table-view-cell"><a ref="' + o.title + '" href="#" class="mui-navigate-right" rel="'
					+ o.appurl + '"><span>' + o.title
					+ '</span></a>'+
					'</li>';
               
        });
        menulist += '</ul>';
        
    });
    document.getElementById("leftNav").innerHTML=menulist;
//		var template = mui.preload({
//		url:'Views/template.html',
//		id:'template',
//		styles:{
//		popGesture:"hide"
//		}
//		});
//		// 预加载公用子页面
//		var subWebview = mui.preload({
//		url:'',
//		id:'sub_template',
//		styles:{
//		top: '45px',
//		bottom: '0px'
//		}
//		});
//		// 将子页面填充到父页面
//		template.append(subWebview);

    	mui('#leftNavUi').on('tap', '.mui-table-view-cell', function() {
				var a = $(this).children('a');
				
				var url = $(a).attr("rel");
				var title=$(a).attr("ref");
                  if(url!='')
                  {
					// 修改共用父模板的标题
//					mui.fire(template, 'updateHeader', {
//					title: title,
//					href: url
//					});
//					// 加载子页面地址
//					if(subWebview.getURL()==url){
//					subWebview.show();
//					}else{
//					subWebview.loadURL(url);
//					// 子页面加载完成显示
//					subWebview.addEventListener('loaded', function() {
//					setTimeout(function(){
//					subWebview.show(); 
//					},50);
//					}); 
//					}
//					// 显示模板父页面
//					template.show('slide-in-right', 150); 

					Enjoy.webhref(url,title);
					
					}
				});
	    };
	  
       //左侧导航滚动
       function scollNav(){
       	 if(mui.os.ios)
       	 {
	  	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005,
		indicators:false
	      });
	  	}
       	 else
       	 {
       	 	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0008,
		indicators:false
	      });
       	 }
	  }
	    	
	  
	   
	    
	

