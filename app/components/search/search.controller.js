{
	let SearchController = function (SearchService, StorageService) {

		let ctrl = this;
		ctrl.query = {
			text: "GCp2vSNdWBA",
			engine: "youtube"
		};

		this.search = function (query) {
			SearchService.searchByQuery(ctrl.query).then((res) => {
				ctrl.searchResults = res.data.items;
			});
		};

		this.addVideo = (video) => StorageService.addVideo(video);
	};
	
	angular.module("search")
		.controller("SearchController", SearchController);
}
