(function () {
	function topBarController () {
		this.toggleSearchPane = () => this.app.togglePane("searchPane");
		console.log("somea", this);
	}

	angular.module("common")
		.controller("topBarController", topBarController);
}());