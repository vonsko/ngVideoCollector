{
	let StorageService = function (localStorageService) {
		function getVideoList () {
			return localStorageService.get("videosList") || [];
		}
		function updateVideoList (videoList) {
			localStorageService.set("videosList", videoList);
		}

		function clearStorage () {
			localStorageService.clearAll();
		}
		function addVideo (video) {
			let videoList = getVideoList();
			let newObj = {
				id: video.id.videoId,
				type: video.id.kind,
				name: video.snippet.title,
				thumbnails: video.snippet.thumbnails,
				description: video.snippet.description,
				dateAdd: moment().toDate().getTime(),
				fav: false
			};

			console.log("video", newObj, video);

			// @todo pass thru checkfordupes func
			videoList.push(newObj);
			updateVideoList(videoList);
		}

		return {
			getVideoList,
			addVideo,
			clearStorage
		};
	};

	angular.module("storage")
		.factory("StorageService", StorageService);
}