function Floor(menu, floors) {
	this.menu = document.querySelector(menu);
	this.menuChild = document.querySelectorAll(menu + ">ul>li");
	this.floors = document.querySelector(floors);
	this.floorsChild = document.querySelectorAll(floors + ">div");
	this.index = 0;
	msmEvent.addHandler(window, "scroll", this.scrollMove.bind(this));
	msmEvent.addHandler(this.menu, "click", this.menuClick.bind(this));
}

Floor.prototype = {
	scrollMove: function() {
		var top = msm.getElementTopOffset(this.floors);
		if(window.pageYOffset >= top) {
			msm.setElementProChange(this.menu, {
				"top": 50
			}, 10);
			this.menuChild[this.index].removeAttribute("class");
			if(window.pageYOffset <= this.floors.offsetHeight + top) {
				var floor = parseInt((window.pageYOffset - top) / 423);
				this.index = floor;
				this.menuChild[this.index].setAttribute("class", "checked");
			}
		} else {
			msm.setElementProChange(this.menu, {
				"top": -600
			}, 10);
		}
	},
	menuClick: function() {
		var oEvent = msmEvent.getEvent(event);
		var target = msmEvent.getTarget(oEvent);
		if(target.nodeName == "A") {
			this.menuChild[this.index].removeAttribute("class");
			this.index = msm.converToArray(this.menuChild).indexOf(target.parentElement);
			this.menuChild[this.index].setAttribute("class", "checked");
			var goal = msm.getElementTopOffset(this.floorsChild[this.index]);
			toTopFun(goal);
		}
	}
};

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