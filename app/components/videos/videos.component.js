(function () {
  let videosComponent = {
    templateUrl: "./app/components/videos/videos.html",
    controller: "VideosController"
  };

  angular.module("videos")
    .component("videos", videosComponent);
}());