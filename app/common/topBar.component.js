(function () {
	let topBar = {
		bindings: {
			onTogglePane: "&",
			actions: "<"
		},
		require: {
			app: "^app"
		},
		templateUrl: "./app/common/topBar.html",
		controller: "topBarController"
	};

	angular.module("common")
		.component("topBar", topBar);
}());