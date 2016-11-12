window.onload = function() {
	//返回顶部事件
	var toTop = document.querySelector(".fixed_right>ul>li.four li:last-of-type>div");
	msmEvent.addHandler(toTop, "click", function() {
		toTopFun(0);
	});
	//楼层滚动事件
	//floorSlider();
	//高级搜索框对应事件
	highSearch();
	//点击菜单给予提示信息
	var menuLi = document.querySelectorAll(".menu_main li");
	var menuInfo = document.querySelector(".info_list");
	var menuMain = document.querySelector(".menu");
	(function() {
		for(var i = 1, len = menuLi.length; i < len; i++) {
			msmEvent.addHandler(menuLi[i], "mouseover", function() {
				menuInfo.style.display = "block";
			});
			msmEvent.addHandler(menuMain, "mouseleave", function() {
				menuInfo.style.display = "none";
			});
		}
	})();

	//城市选择区域选项卡
	var cityMenus = document.querySelectorAll(".city_menu>ul>li");
	(function() {
		var index = 0;
		for(var i = 0, len = cityMenus.length; i < len; i++) {
			cityMenus[i].flag = i;
			msmEvent.addHandler(cityMenus[i], "click", function() {
				cityMenus[index].removeAttribute("class");
				this.setAttribute("class", "actived");
				index = this.flag;
			});
		}
	})();
	//一楼选项卡
	var firstFloorLi = document.querySelectorAll(".first_floor_left>ul:first-of-type li");
	var firstSliderLi = document.querySelectorAll(".first_floor_left>ul:last-of-type li");
	(function() {
		var preIndex = 0;
		for(var i = 0, len = firstFloorLi.length; i < len; i++) {
			firstFloorLi[i].index = i;
			msmEvent.addHandler(firstFloorLi[i], "mouseenter", function() {
				firstSliderLi[preIndex].setAttribute("class", "hide");
				firstFloorLi[preIndex].removeAttribute("class");
				this.setAttribute("class", "checked");
				firstSliderLi[this.index].removeAttribute("class");
				preIndex = this.index;
			});
		}
	})();

	slider(); //启动轮播
	searchInput(); //中间搜索框函数
	//下方固定区域事件
	var bottomHide = document.querySelector(".fixed_bottom_hide"); //底部主区域
	var bottomVisable = document.querySelector(".fixed_bottom_visable"); //点击该区域底部出现
	var hideImg = document.querySelector(".fixed_bottom_hide>img:last-of-type"); //点击隐藏底部区域
	(function() {
		msmEvent.addHandler(bottomVisable, "click", function() {
			msm.setElementProChange(bottomHide, {
				"left": 0
			}, 20);
		});
		msmEvent.addHandler(hideImg, "click", function() {
			msm.setElementProChange(bottomHide, {
				"left": -1450
			}, 20);
		});
	})();

	function searchInput() {
		//搜索框左侧提示信息
		var proInfos = document.querySelectorAll(".pro_info li");
		var proUl = document.querySelector(".pro_info");
		(function() {
			for(var i = 0, len = proInfos.length; i < len; i++) {
				msmEvent.addHandler(proInfos[i], "click", proLiEvent);
			}

			function proLiEvent() {
				var oSpan = document.querySelector(".search_box_left>span");
				var oLi = document.createElement("li");
				oLi.innerText = oSpan.innerText;
				oSpan.innerText = this.innerText;
				msmEvent.addHandler(oLi, "click", proLiEvent);
				if(oSpan.id) {
					oLi.id = oSpan.id;
					proUl.insertBefore(oLi, proUl.children[parseInt(oSpan.id) + 1]);
				} else {
					proUl.insertBefore(oLi, proUl.children[0]);
				}
				oSpan.id = this.id;
				this.onclick = null;
				proUl.removeChild(this);
			}
		})();

		//搜索框注册事件
		var oInput = document.querySelector(".search_box_middle>input"); //输入框对象
		var input_info = document.querySelector("ul.input_info");
		var search_focus = document.querySelector(".search_focus"); //焦点提示框
		var keydownInfo = document.querySelector(".keydown_info"); //键盘提示框
		var searchBoxLeft = document.querySelector(".search_box_left"); //左侧提示框

		//移动到左侧提示框上面将焦点提示框隐藏
		msmEvent.addHandler(searchBoxLeft, "mouseenter", function() {
			search_focus.style.display = "none";
		});
		//获得焦点
		msmEvent.addHandler(oInput, "focus", function() {
			this.placeholder = "";
			input_info.style.display = "none";
			if(this.value == "") {
				search_focus.style.display = "block";
			}

		});
		//失去焦点
		msmEvent.addHandler(oInput, "blur", function() {
			if(this.value == "") {
				input_info.style.display = "block";
			}
			search_focus.style.display = "none";
			if(this.placeholder == "") {
				this.placeholder = "台湾";
			}
		});
		//键盘事件
		msmEvent.addHandler(oInput, "keyup", function() {
			if(this.value == "") {
				search_focus.style.display = "block";
				keydownInfo.style.display = "none";
			} else {
				input_info.style.display = "none";
				search_focus.style.display = "none";
				keydownInfo.style.display = "block";
			}

		});
		//点击提示框下方小叉号关闭提示框
		var delSpan = document.querySelector("span#del");
		msmEvent.addHandler(delSpan, "click", function() {
			search_focus.style.display = "none";
		});
	}
	//轮播函数
	function slider() {
		var sliderLi = document.querySelectorAll("ul.slider_pic li"); //轮播图片
		var sliderList = document.querySelectorAll(".slider_list>ul>li"); //轮播提示信息列表
		var index = 0; //当前轮播项索引
		var len = sliderLi.length;
		var oTimer = null;
		oTimer = setInterval(function() {
			picSlider(1);
		}, 3000);
		//轮播箭头控制
		var sliderArrow = document.querySelector(".slider_arrow");
		msmEvent.addHandler(sliderArrow, "mouseover", function() { //进入箭头区域清除计时器
			msm.setElementProChange(sliderArrow, {
				opacity: 50
			}, 30);
			clearInterval(oTimer);
		});
		msmEvent.addHandler(sliderArrow, "mouseleave", function() { //离开箭头区域启动计时器
			msm.setElementProChange(sliderArrow, {
				opacity: 0
			}, 30);
			oTimer = setInterval(function() {
				picSlider(1);
			}, 3000);
		});
		var arrows = sliderArrow.querySelectorAll("div");
		msmEvent.addHandler(arrows[0], "click", function() { //左箭头
			picSlider(-1);
		});
		msmEvent.addHandler(arrows[1], "click", function() { //右箭头
			picSlider(1);
		});

		//鼠标放上去控制轮播
		for(var i = 0; i < len; i++) {
			msmEvent.addHandler(sliderList[i], "mouseenter", function() {
				clearInterval(oTimer);
				index = parseInt(this.id);
				picSlider(0);
			});
			msmEvent.addHandler(sliderList[i], "mouseleave", function() {
				index = parseInt(this.id);
				oTimer = setInterval(function() {
					picSlider(1);
				}, 3000);
			});
		}

		//下方图片切换
		var oPicLi = document.querySelectorAll(".img_slider li");

		for(var y = 0, lenPic = oPicLi.length; y < lenPic; y++) {
			msmEvent.addHandler(oPicLi[y], "mouseenter", picChange);
		}
		//右侧小轮播
		var slideRight = document.querySelector(".slider_right_two ul");
		setInterval(function() {
			var top = parseInt(msm.getElementStyle(slideRight, "top"));
			top -= 60;
			if(top <= -240) {
				top = -60;
				slideRight.style.top = 0;
			}
			msm.setElementProChange(slideRight, {
				top: top
			}, 30);
		}, 3000);

		function picChange() {
			for(var i = 0; i < lenPic; i++) {
				if(oPicLi[i].className) {
					oPicLi[i].removeAttribute("class");
					msm.setElementProChange(oPicLi[i], {
						width: "97px"
					}, 10);
					msm.setElementProChange(oPicLi[i].firstElementChild, {
						left: 0
					}, 10);
				}
			}
			msm.setElementProChange(this, {
				width: "122px"
			}, 10);
			msm.setElementProChange(this.firstElementChild, {
				left: -100
			}, 10);
			this.setAttribute("class", "checked");
		}

		function picSlider(num) {
			//清除上次轮播标记
			for(var i = 0; i < len; i++) {
				if(sliderList[i].className) {
					sliderList[i].removeAttribute("class");
					sliderLi[i].style.display = "none";
					sliderLi[i].style.opacity = 0;
				}
			}
			index += num;
			index = index > len - 1 ? 0 : index;
			index = index < 0 ? len - 1 : index;
			sliderList[index].setAttribute("class", "checked");
			sliderLi[index].style.display = "block";
			msm.setElementProChange(sliderLi[index], {
				opacity: 100
			}, 100);

		}
	}

	function highSearch() {
		var highSearch = document.querySelector(".high_search a"); //高级搜索对象
		var high_search_info = document.querySelector(".high_search_info"); //高级搜索提示框
		//点击高级搜索提示框出现
		msmEvent.addHandler(highSearch, "click", function() {
			if(high_search_info.style.display == "" || high_search_info.style.display == "none") {
				high_search_info.style.display = "block";
			} else {
				high_search_info.style.display = "none";
			}
		});

		//搜索条件选择
		//类型选择
		var highSearchTwo = document.querySelectorAll(".high_search_two>a");
		var searchType = document.querySelectorAll("#search_type>a");
		var searchDays = document.querySelectorAll("#search_days>a");
		var typeIndex = 0,
			dayIndex = [];
		//类型选择
		(function() {
			for(var i = 0, len = searchType.length; i < len; i++) {
				searchType[i].index = i + 1;
				msmEvent.addHandler(searchType[i], "click", function() {
					highSearchTwo[0].removeAttribute("class");
					if(typeIndex) {
						searchType[typeIndex - 1].removeAttribute("class");
					}
					this.setAttribute("class", "checked");
					typeIndex = this.index;
				});
			}
		})();
		//天数选择
		(function() {
			for(var i = 0, len = searchDays.length; i < len; i++) {
				searchDays[i].index = i;
				msmEvent.addHandler(searchDays[i], "click", function() {
					highSearchTwo[1].removeAttribute("class");
					this.setAttribute("class", "checked");
					dayIndex.push(this.index);
				});
			}
		})();
		msmEvent.addHandler(highSearchTwo[0], "click", function() {
			this.setAttribute("class", "checked");
			if(typeIndex) {
				searchType[typeIndex - 1].removeAttribute('class');
			}
		});
		msmEvent.addHandler(highSearchTwo[1], "click", function() {
			this.setAttribute("class", "checked");
			if(dayIndex.length) {
				do {
					searchDays[dayIndex[0]].removeAttribute("class");
					dayIndex.shift();
				} while (dayIndex.length)
			}
		});
	}

	//楼层事件函数
	function floorSlider() {
		var fixedLeft = document.querySelector(".fixed_left");
		var leftLi = fixedLeft.querySelectorAll("li");
		var index = 0;
		msmEvent.addHandler(window, "scroll", function() {
			if(window.pageYOffset >= 800) {
				msm.setElementProChange(fixedLeft, {
					"top": 50
				}, 10);
				leftLi[index].removeAttribute("class");
				var floor = parseInt((window.pageYOffset - 800) / 400);
				if(floor<13){
					index = floor;
				    leftLi[index].setAttribute("class", "checked");
				}
			} else {
				msm.setElementProChange(fixedLeft, {
					"top": -600
				}, 10);
			}
		});

		msmEvent.addHandler(fixedLeft, "click", function() {
			var target = msmEvent.getTarget(msmEvent.getEvent(event));
			if(target.nodeName == "A") {
				window.event.returnValue = false;
				leftLi[index].removeAttribute("class");
				index = parseInt(target.getAttribute("name"));
				leftLi[index].setAttribute("class", "checked");
				var odiv = document.querySelectorAll(".floor_body_main_left>div")
				//console.log(msm.getElementTopOffset(odiv[index]));
				var goal = 800 + index * 400;
				toTopFun(goal);
			}
		});

	}
	//滚动条滚动函数
	function toTopFun(goal) {
		var oTimer = null;
		var top = iSpeed = 0;
		oTimer = setInterval(function() {
			top = document.documentElement.scrollTop || document.body.scrollTop;
			var distance = goal - top;
			if(distance > 0) {
				iSpeed = Math.ceil(distance / 8);
			} else {
				iSpeed = Math.floor(distance / 8)
			}
			if(top == goal) {
				clearInterval(oTimer);
			} else {
				document.documentElement.scrollTop = document.body.scrollTop = top + iSpeed;
			}
		}, 10);
	}
}