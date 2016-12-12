(function () {
  let StorageService = function (localStorageService) {
    function getVideoList(paramObj) {
      return localStorageService.get("videosList") || [];
    }

    function updateVideoList(videoList) {
      localStorageService.set("videosList", videoList);
    }

    function clearStorage() {
      localStorageService.clearAll();
    }

    function fillStorage(data) {
      localStorageService.set("videosList", data);
    }

    function isInStorage(id) {
      let videos = localStorageService.get("videosList");
      let video = _.find(videos, (v) => v.id === id);
      return (video) ? video.dateAdd : false;
    }

    function addVideo(video) {
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

      // @todo pass thru checkfordupes func
      videoList.push(newObj);
      updateVideoList(videoList);
    }

    function deleteVideo(video) {
      let videoList = getVideoList();
      _.remove(videoList, (i) => i.id === video.id);
      updateVideoList(videoList);
    }

    function updateVideo(updateObj) {
      if (!updateObj.id) return;

      let videosList = getVideoList();
      let video = _.find(videosList, (v) => v.id === updateObj.id);

      Object.assign(video, updateObj);
      updateVideoList(videosList);
    }

    return {
      getVideoList,
      addVideo,
      clearStorage,
      fillStorage,
      isInStorage,
      updateVideo,
      deleteVideo
    };
  };

  angular.module("storage")
    .factory("StorageService", StorageService);
}());