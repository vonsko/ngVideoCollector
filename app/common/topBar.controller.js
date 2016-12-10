(function () {
	function topBarController () {
		this.toggleSearchPane = () => this.app.togglePane("searchPane");
	}

	angular.module("common")
		.controller("topBarController", topBarController);
}());