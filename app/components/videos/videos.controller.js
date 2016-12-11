{
	let VideosController = function (VideosService) {
		this.icon = "build";
		this.videosList = VideosService.getVideosList();

		console.log(this.videosList)
	};

	angular.module("videos")
		.controller("VideosController", VideosController);
}