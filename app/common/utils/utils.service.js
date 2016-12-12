{
	let UtilsService = function (StorageService) {
		let clearStorage = function () {
			StorageService.clearStorage();
		};
		return {
			clearStorage
		};
	};
	angular.module("utils")
		.factory("UtilsService", UtilsService);
}