(function () {
  let VideosController = function (VideosService, StorageService, $mdToast) {
    this.$onInit = function () {
      this.getVideos(this.viewSettings);
    };
    this.videosList = [];
    this.viewSettings = {
      layout: "list",
      videosCount: 10,
      sorts: "newest",
      filters: null,
      page: 0
    };
    this.openSelectVideosNumber = ($mdOpenMenu, e) => $mdOpenMenu(e);
    this.changeViewSettings = (paramObj) => {
      Object.assign(this.viewSettings, paramObj);
      this.getVideos(this.viewSettings);
    };
    this.favToggle = (video) => {
      video.fav = !video.fav;
      StorageService.updateVideo(video);
      $mdToast.show(
        $mdToast.simple()
          .textContent(`Video ${ video.name } ${ video.fav ? "added to fav" : "removed from fav"} `)
          .position("top right")
          .hideDelay(3000)
      );
    };

    this.deleteVideo = (video) => {
      StorageService.deleteVideo(video);
      this.getVideos(this.viewSettings);
      $mdToast.show(
        $mdToast.simple()
          .textContent(`Video ${ video.name } deleted `)
          .position("top right")
          .hideDelay(3000)
      );
    };

    this.getVideos = (paramObject, reset) => {
      if(reset) this.viewSettings.page = 0;
      this.videosList = VideosService.getVideosList(paramObject);
    };

    this.getPage = (page) => {
      if(!_.isUndefined(page)) { this.viewSettings.page = page; }
      this.videosList = VideosService.getPageResult(this.viewSettings.page, this.viewSettings.videosCount);
    };

    this.getNextPage = () => {
      if((this.viewSettings.page + 1) >= this.videosList.info.total) {
        $mdToast.show(
          $mdToast.simple()
            .textContent("You've reached the end")
            .position("top right")
            .hideDelay(3000)
        );
      } else {
        this.viewSettings.page++;
      }
      this.getPage();
    };

    this.getPrevPage = () => {
      if((this.viewSettings.page - 1) < 0) {
        $mdToast.show(
          $mdToast.simple()
            .textContent("You've reached the beginning")
            .position("top right")
            .hideDelay(3000)
        );
      } else {
        this.viewSettings.page--;
      }
      this.getPage();
    };
  };

  angular.module("videos")
    .controller("VideosController", VideosController);
}());