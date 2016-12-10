(function () {
	let AppController = function () {
		this.currentPane = "";
		this.togglePane = (target)  => {
			this.currentPane = target === this.currentPane ? "" : target;
		};
	};

	angular.module("common")
		.controller("AppController", AppController);
}());