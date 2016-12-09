import angular from "./bower_components/angular/";

export default angular.module("starter-app", ["ngMaterial"])
	.run( () => {
		console.log("Starting app");
	});