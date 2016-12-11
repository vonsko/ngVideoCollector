{
	let VideosService = function (StorageService) {
		return {
			getVideosList() {
				return StorageService.getVideoList();
			}
		};
	};

	angular.module("videos")
		.factory("VideosService", VideosService);
}