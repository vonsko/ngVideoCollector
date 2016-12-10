(function () {
	let AppController = function () {
		this.currentPane = "";
		this.togglePane = (target)  => {
			this.currentPane = target === this.currentPane ? "" : target;
		};
		this.someActions = {
			action1 (what) {
				console.log("what - action1", what)
			},
			action2 (what) {
				console.log("other action")
			}
		};

		console.log("this", this.someActions);
	};

	angular.module("common")
		.controller("AppController", AppController);
}());