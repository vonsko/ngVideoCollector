(function () {
  angular.module("ngVideoCollector", [
    "ngMaterial",
    "components",
    "common"
  ]);
}());
(function () {
  materialThemeConfig.$inject = ["$mdThemingProvider"];
  materialIconConfig.$inject = ["$mdIconProvider"];
  function materialThemeConfig($mdThemingProvider) {
    $mdThemingProvider
      .theme("default")
      .primaryPalette("amber")
      .accentPalette("green")
      .warnPalette("red")
      .backgroundPalette("blue-grey");

    $mdThemingProvider.theme("docs-dark", "default")
      .primaryPalette("amber").dark();

    $mdThemingProvider
      .theme("alt1")
      .primaryPalette("grey")
      .accentPalette("blue-grey");
  }

  function materialIconConfig($mdIconProvider) {
    $mdIconProvider
      .defaultFontSet("material-icons");
  }

  angular.module("ngVideoCollector")
    .config(materialThemeConfig)
    .config(materialIconConfig);
}());


// youtube api key [ AIzaSyDjMxSP8blKtpsjZ_C6Yk5Eu-u-bugif3M ]
(function () {
  angular.module("components", [
    "videos",
    "search",
    "storage"
  ]);
}());
(function () {
  angular.module("videos", []);
}());

(function () {
  let VideosService = function (StorageService) {
    let currentResults = {all: [], page: [], info: {}};

    function getPageCount (length, perPage) {
      let total = Math.ceil(length / perPage);
      return {
        allItemsLength: length,
        total,
        pages: _.times(total, (i) => i + 1)
      };
    }

    function getVideosList (paramObj) {
      currentResults = {all: [], page: [], info: {}};
      if (_.isEmpty(paramObj)) return;
      let videosList = StorageService.getVideoList();

      if (paramObj.filters === "fav") {
        videosList = videosList.filter(v => v.fav);
      }

      if (paramObj.sorts === "newest") {
        videosList = videosList.sort((a,b) => {return b.dateAdd - a.dateAdd;});
      } else if(paramObj.sorts === "oldest") {
        videosList = videosList.sort((a,b) => {return a.dateAdd - b.dateAdd;});
      }

      currentResults.all = videosList;
      currentResults.page = getPageResult(0, paramObj.videosCount).results;
      currentResults.info = getPageCount(videosList.length, paramObj.videosCount);

      return {
        results: currentResults.page,
        info: currentResults.info
      };
    }

    function getPageResult (page, pageSize) {
      let cursor = page * pageSize;
      currentResults.page = currentResults.all.slice(cursor, cursor + pageSize);
      return {
        results: currentResults.page,
        info: currentResults.info
      };
    }

    return {
      getPageCount,
      getVideosList,
      getPageResult
    };
  };
  VideosService.$inject = ["StorageService"];

  angular.module("videos")
    .factory("VideosService", VideosService);
}());
(function () {
  angular.module("search", []);
}());

(function () {
  let searchComponent = {
    templateUrl: "./app/components/search/search.html",
    controller: "SearchController"
  };

  angular.module("search")
    .component("searchPanel", searchComponent);
}());
(function () {
  let SearchController = function (SearchService, StorageService, $mdToast) {

    let ctrl = this;
    ctrl.query = {
      text: "GCp2vSNdWBA",
      engine: "youtube"
    };

    this.search = (query) => SearchService.searchByQuery(ctrl.query).then((res) => ctrl.searchResults = res.data.items);

    this.addVideo = (video) => {
      StorageService.addVideo(video);
      $mdToast.show(
        $mdToast.simple()
          .textContent(`Video ${ video.snippet.title } added to collection`)
          .position("top right")
          .hideDelay(3000)
      );
    };

    this.inStorage = (id) => StorageService.isInStorage(id);
  };
  SearchController.$inject = ["SearchService", "StorageService", "$mdToast"];

  angular.module("search")
    .controller("SearchController", SearchController);
}());

(function () {
  let SearchService = function ($http) {
    function searchByQuery(query) {
      let Service = (query.engine === "youtube") ? "YoutubeService" : "VimeoService";
      return $http.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          key: "AIzaSyDjMxSP8blKtpsjZ_C6Yk5Eu-u-bugif3M",
          type: "video",
          maxResults: "10",
          pageToken: "",
          // part: "id,snippet,contentDetails", @todo: api youtube'a nie pobiera wszystkich informacji - trzeba to dodać w drugim requeście
          part: "id,snippet",
          q: query.text
        }
      });
    }

    return {
      searchByQuery
    };
  };
  SearchService.$inject = ["$http"];

  angular.module("search")
    .factory("SearchService", SearchService);
}());
(function () {
  angular.module("storage", [
    "LocalStorageModule"
  ]);

  let localStorageConfig = function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix("ngVideoCollector")
      .setNotify(true, true);
  };
  localStorageConfig.$inject = ["localStorageServiceProvider"];
  angular.module("storage")
    .config(localStorageConfig);
}());
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
  StorageService.$inject = ["localStorageService"];

  angular.module("storage")
    .factory("StorageService", StorageService);
}());
(function () {
  let videosComponent = {
    templateUrl: "./app/components/videos/videos.html",
    controller: "VideosController"
  };

  angular.module("videos")
    .component("videos", videosComponent);
}());
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
  VideosController.$inject = ["VideosService", "StorageService", "$mdToast"];

  angular.module("videos")
    .controller("VideosController", VideosController);
}());
(function () {
  angular.module("common", ["utils"]);
}());
(function () {
  let app = {
    bindings: {
      appActions: "<"
    },
    templateUrl: "./app/common/app.html",
    controller: "AppController"
  };

  angular.module("common")
    .component("app", app);
}());

(function () {
  let AppController = function () {
    let ctrl = this;
    ctrl.currentPanel = "videosPanel";

    ctrl.actions = {
      reloadVideosPanel (innerCallback) {
        ctrl.currentPanel = "";
        if (typeof innerCallback === "function") innerCallback();
        ctrl.currentPanel = "videosPanel";
      },
      togglePanels () {
        ctrl.currentPanel = (ctrl.currentPanel === "searchPanel") ? "videosPanel" : "searchPanel";
      }
    };
  };

  angular.module("common")
    .controller("AppController", AppController);
}());
(function () {
  let topBar = {
    bindings: {
      onTogglePane: "&",
      appActions: "<"
    },
    templateUrl: "./app/common/topBar.html",
    controller: "topBarController"
  };

  angular.module("common")
    .component("topBar", topBar);
}());
(function () {
  topBarController.$inject = ["UtilsService"];
  function topBarController(UtilsService) {

    this.toggleSearchPanel = () => this.appActions.togglePanels();
    this.openMenu = ($mdOpenMenu, e) => $mdOpenMenu(e);
    this.clearDB = () => this.appActions.reloadVideosPanel(() => UtilsService.clearStorage());
    this.fillTestData = () => this.appActions.reloadVideosPanel(() => UtilsService.fillTestData());
  }

  angular.module("common")
    .controller("topBarController", topBarController);
}());
(function () {
  angular.module("utils", ["storage"]);
}());

(function () {
  let UtilsService = function (StorageService, $http) {
    function clearStorage() {
      StorageService.clearStorage();
    }

    function fillTestData() {
      $http.get("./app/temp/wujaTest1.json")
        .then((data) => StorageService.fillStorage(data.data));
    }

    return {
      clearStorage,
      fillTestData
    };
  };
  UtilsService.$inject = ["StorageService", "$http"];
  angular.module("utils")
    .factory("UtilsService", UtilsService);
}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q3BCLElBQUksT0FBTyxrQkFBa0IsWUFBWTtRQUN6QyxLQUFLLGVBQWU7O01BRXRCLGFBQWEsR0FBRztRQUNkLEtBQUssZUFBZSxDQUFDLEtBQUssaUJBQWlCLGlCQUFpQixnQkFBZ0I7Ozs7O0VBS2xGLFFBQVEsT0FBTztLQUNaLFdBQVcsaUJBQWlCOztBQUVqQyxDQUFDLFlBQVk7RUFDWCxJQUFJLFNBQVM7SUFDWCxVQUFVO01BQ1IsY0FBYztNQUNkLFlBQVk7O0lBRWQsYUFBYTtJQUNiLFlBQVk7OztFQUdkLFFBQVEsT0FBTztLQUNaLFVBQVUsVUFBVTs7OytDQUV6QixDQUFDLFlBQVk7RUFDWCxTQUFTLGlCQUFpQixjQUFjOztJQUV0QyxLQUFLLG9CQUFvQjtJQUN6QixLQUFLLFdBQVc7SUFDaEIsS0FBSyxVQUFVO0lBQ2YsS0FBSyxlQUFlOzs7RUFHdEIsUUFBUSxPQUFPO0tBQ1osV0FBVyxvQkFBb0I7O0FBRXBDLENBQUMsWUFBWTtFQUNYLFFBQVEsT0FBTyxTQUFTLENBQUM7OztBQUczQixDQUFDLFlBQVk7RUFDWCxJQUFJLGVBQWUsVUFBVSxnQkFBZ0IsT0FBTztJQUNsRCxTQUFTLGVBQWU7TUFDdEIsZUFBZTs7O0lBR2pCLFNBQVMsZUFBZTtNQUN0QixNQUFNLElBQUk7U0FDUCxLQUFLOzs7SUFHVixPQUFPO01BQ0w7TUFDQTs7OztFQUdKLFFBQVEsT0FBTztLQUNaLFFBQVEsZ0JBQWdCO0tBQ3hCIiwiZmlsZSI6ImFwcC9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZShcIm5nVmlkZW9Db2xsZWN0b3JcIiwgW1xuICAgIFwibmdNYXRlcmlhbFwiLFxuICAgIFwiY29tcG9uZW50c1wiLFxuICAgIFwiY29tbW9uXCJcbiAgXSk7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gbWF0ZXJpYWxUaGVtZUNvbmZpZygkbWRUaGVtaW5nUHJvdmlkZXIpIHtcbiAgICAkbWRUaGVtaW5nUHJvdmlkZXJcbiAgICAgIC50aGVtZShcImRlZmF1bHRcIilcbiAgICAgIC5wcmltYXJ5UGFsZXR0ZShcImFtYmVyXCIpXG4gICAgICAuYWNjZW50UGFsZXR0ZShcImdyZWVuXCIpXG4gICAgICAud2FyblBhbGV0dGUoXCJyZWRcIilcbiAgICAgIC5iYWNrZ3JvdW5kUGFsZXR0ZShcImJsdWUtZ3JleVwiKTtcblxuICAgICRtZFRoZW1pbmdQcm92aWRlci50aGVtZShcImRvY3MtZGFya1wiLCBcImRlZmF1bHRcIilcbiAgICAgIC5wcmltYXJ5UGFsZXR0ZShcImFtYmVyXCIpLmRhcmsoKTtcblxuICAgICRtZFRoZW1pbmdQcm92aWRlclxuICAgICAgLnRoZW1lKFwiYWx0MVwiKVxuICAgICAgLnByaW1hcnlQYWxldHRlKFwiZ3JleVwiKVxuICAgICAgLmFjY2VudFBhbGV0dGUoXCJibHVlLWdyZXlcIik7XG4gIH1cblxuICBmdW5jdGlvbiBtYXRlcmlhbEljb25Db25maWcoJG1kSWNvblByb3ZpZGVyKSB7XG4gICAgJG1kSWNvblByb3ZpZGVyXG4gICAgICAuZGVmYXVsdEZvbnRTZXQoXCJtYXRlcmlhbC1pY29uc1wiKTtcbiAgfVxuXG4gIGFuZ3VsYXIubW9kdWxlKFwibmdWaWRlb0NvbGxlY3RvclwiKVxuICAgIC5jb25maWcobWF0ZXJpYWxUaGVtZUNvbmZpZylcbiAgICAuY29uZmlnKG1hdGVyaWFsSWNvbkNvbmZpZyk7XG59KCkpO1xuXG5cbi8vIHlvdXR1YmUgYXBpIGtleSBbIEFJemFTeURqTXhTUDhibEt0cHNqWl9DNllrNUV1LXUtYnVnaWYzTSBdXG4oZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZShcImNvbXBvbmVudHNcIiwgW1xuICAgIFwidmlkZW9zXCIsXG4gICAgXCJzZWFyY2hcIixcbiAgICBcInN0b3JhZ2VcIlxuICBdKTtcbn0oKSk7XG4oZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZShcInZpZGVvc1wiLCBbXSk7XG59KCkpO1xuXG4oZnVuY3Rpb24gKCkge1xuICBsZXQgVmlkZW9zU2VydmljZSA9IGZ1bmN0aW9uIChTdG9yYWdlU2VydmljZSkge1xuICAgIGxldCBjdXJyZW50UmVzdWx0cyA9IHthbGw6IFtdLCBwYWdlOiBbXSwgaW5mbzoge319O1xuXG4gICAgZnVuY3Rpb24gZ2V0UGFnZUNvdW50IChsZW5ndGgsIHBlclBhZ2UpIHtcbiAgICAgIGxldCB0b3RhbCA9IE1hdGguY2VpbChsZW5ndGggLyBwZXJQYWdlKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGFsbEl0ZW1zTGVuZ3RoOiBsZW5ndGgsXG4gICAgICAgIHRvdGFsLFxuICAgICAgICBwYWdlczogXy50aW1lcyh0b3RhbCwgKGkpID0+IGkgKyAxKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRWaWRlb3NMaXN0IChwYXJhbU9iaikge1xuICAgICAgY3VycmVudFJlc3VsdHMgPSB7YWxsOiBbXSwgcGFnZTogW10sIGluZm86IHt9fTtcbiAgICAgIGlmIChfLmlzRW1wdHkocGFyYW1PYmopKSByZXR1cm47XG4gICAgICBsZXQgdmlkZW9zTGlzdCA9IFN0b3JhZ2VTZXJ2aWNlLmdldFZpZGVvTGlzdCgpO1xuXG4gICAgICBpZiAocGFyYW1PYmouZmlsdGVycyA9PT0gXCJmYXZcIikge1xuICAgICAgICB2aWRlb3NMaXN0ID0gdmlkZW9zTGlzdC5maWx0ZXIodiA9PiB2LmZhdik7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJhbU9iai5zb3J0cyA9PT0gXCJuZXdlc3RcIikge1xuICAgICAgICB2aWRlb3NMaXN0ID0gdmlkZW9zTGlzdC5zb3J0KChhLGIpID0+IHtyZXR1cm4gYi5kYXRlQWRkIC0gYS5kYXRlQWRkO30pO1xuICAgICAgfSBlbHNlIGlmKHBhcmFtT2JqLnNvcnRzID09PSBcIm9sZGVzdFwiKSB7XG4gICAgICAgIHZpZGVvc0xpc3QgPSB2aWRlb3NMaXN0LnNvcnQoKGEsYikgPT4ge3JldHVybiBhLmRhdGVBZGQgLSBiLmRhdGVBZGQ7fSk7XG4gICAgICB9XG5cbiAgICAgIGN1cnJlbnRSZXN1bHRzLmFsbCA9IHZpZGVvc0xpc3Q7XG4gICAgICBjdXJyZW50UmVzdWx0cy5wYWdlID0gZ2V0UGFnZVJlc3VsdCgwLCBwYXJhbU9iai52aWRlb3NDb3VudCkucmVzdWx0cztcbiAgICAgIGN1cnJlbnRSZXN1bHRzLmluZm8gPSBnZXRQYWdlQ291bnQodmlkZW9zTGlzdC5sZW5ndGgsIHBhcmFtT2JqLnZpZGVvc0NvdW50KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdWx0czogY3VycmVudFJlc3VsdHMucGFnZSxcbiAgICAgICAgaW5mbzogY3VycmVudFJlc3VsdHMuaW5mb1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYWdlUmVzdWx0IChwYWdlLCBwYWdlU2l6ZSkge1xuICAgICAgbGV0IGN1cnNvciA9IHBhZ2UgKiBwYWdlU2l6ZTtcbiAgICAgIGN1cnJlbnRSZXN1bHRzLnBhZ2UgPSBjdXJyZW50UmVzdWx0cy5hbGwuc2xpY2UoY3Vyc29yLCBjdXJzb3IgKyBwYWdlU2l6ZSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHRzOiBjdXJyZW50UmVzdWx0cy5wYWdlLFxuICAgICAgICBpbmZvOiBjdXJyZW50UmVzdWx0cy5pbmZvXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBnZXRQYWdlQ291bnQsXG4gICAgICBnZXRWaWRlb3NMaXN0LFxuICAgICAgZ2V0UGFnZVJlc3VsdFxuICAgIH07XG4gIH07XG5cbiAgYW5ndWxhci5tb2R1bGUoXCJ2aWRlb3NcIilcbiAgICAuZmFjdG9yeShcIlZpZGVvc1NlcnZpY2VcIiwgVmlkZW9zU2VydmljZSk7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcbiAgYW5ndWxhci5tb2R1bGUoXCJzZWFyY2hcIiwgW10pO1xufSgpKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgbGV0IHNlYXJjaENvbXBvbmVudCA9IHtcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2FwcC9jb21wb25lbnRzL3NlYXJjaC9zZWFyY2guaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiU2VhcmNoQ29udHJvbGxlclwiXG4gIH07XG5cbiAgYW5ndWxhci5tb2R1bGUoXCJzZWFyY2hcIilcbiAgICAuY29tcG9uZW50KFwic2VhcmNoUGFuZWxcIiwgc2VhcmNoQ29tcG9uZW50KTtcbn0oKSk7XG4oZnVuY3Rpb24gKCkge1xuICBsZXQgU2VhcmNoQ29udHJvbGxlciA9IGZ1bmN0aW9uIChTZWFyY2hTZXJ2aWNlLCBTdG9yYWdlU2VydmljZSwgJG1kVG9hc3QpIHtcblxuICAgIGxldCBjdHJsID0gdGhpcztcbiAgICBjdHJsLnF1ZXJ5ID0ge1xuICAgICAgdGV4dDogXCJHQ3AydlNOZFdCQVwiLFxuICAgICAgZW5naW5lOiBcInlvdXR1YmVcIlxuICAgIH07XG5cbiAgICB0aGlzLnNlYXJjaCA9IChxdWVyeSkgPT4gU2VhcmNoU2VydmljZS5zZWFyY2hCeVF1ZXJ5KGN0cmwucXVlcnkpLnRoZW4oKHJlcykgPT4gY3RybC5zZWFyY2hSZXN1bHRzID0gcmVzLmRhdGEuaXRlbXMpO1xuXG4gICAgdGhpcy5hZGRWaWRlbyA9ICh2aWRlbykgPT4ge1xuICAgICAgU3RvcmFnZVNlcnZpY2UuYWRkVmlkZW8odmlkZW8pO1xuICAgICAgJG1kVG9hc3Quc2hvdyhcbiAgICAgICAgJG1kVG9hc3Quc2ltcGxlKClcbiAgICAgICAgICAudGV4dENvbnRlbnQoYFZpZGVvICR7IHZpZGVvLnNuaXBwZXQudGl0bGUgfSBhZGRlZCB0byBjb2xsZWN0aW9uYClcbiAgICAgICAgICAucG9zaXRpb24oXCJ0b3AgcmlnaHRcIilcbiAgICAgICAgICAuaGlkZURlbGF5KDMwMDApXG4gICAgICApO1xuICAgIH07XG5cbiAgICB0aGlzLmluU3RvcmFnZSA9IChpZCkgPT4gU3RvcmFnZVNlcnZpY2UuaXNJblN0b3JhZ2UoaWQpO1xuICB9O1xuXG4gIGFuZ3VsYXIubW9kdWxlKFwic2VhcmNoXCIpXG4gICAgLmNvbnRyb2xsZXIoXCJTZWFyY2hDb250cm9sbGVyXCIsIFNlYXJjaENvbnRyb2xsZXIpO1xufSgpKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgbGV0IFNlYXJjaFNlcnZpY2UgPSBmdW5jdGlvbiAoJGh0dHApIHtcbiAgICBmdW5jdGlvbiBzZWFyY2hCeVF1ZXJ5KHF1ZXJ5KSB7XG4gICAgICBsZXQgU2VydmljZSA9IChxdWVyeS5lbmdpbmUgPT09IFwieW91dHViZVwiKSA/IFwiWW91dHViZVNlcnZpY2VcIiA6IFwiVmltZW9TZXJ2aWNlXCI7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20veW91dHViZS92My9zZWFyY2hcIiwge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBrZXk6IFwiQUl6YVN5RGpNeFNQOGJsS3Rwc2paX0M2WWs1RXUtdS1idWdpZjNNXCIsXG4gICAgICAgICAgdHlwZTogXCJ2aWRlb1wiLFxuICAgICAgICAgIG1heFJlc3VsdHM6IFwiMTBcIixcbiAgICAgICAgICBwYWdlVG9rZW46IFwiXCIsXG4gICAgICAgICAgLy8gcGFydDogXCJpZCxzbmlwcGV0LGNvbnRlbnREZXRhaWxzXCIsIEB0b2RvOiBhcGkgeW91dHViZSdhIG5pZSBwb2JpZXJhIHdzenlzdGtpY2ggaW5mb3JtYWNqaSAtIHRyemViYSB0byBkb2RhxIcgdyBkcnVnaW0gcmVxdWXFm2NpZVxuICAgICAgICAgIHBhcnQ6IFwiaWQsc25pcHBldFwiLFxuICAgICAgICAgIHE6IHF1ZXJ5LnRleHRcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNlYXJjaEJ5UXVlcnlcbiAgICB9O1xuICB9O1xuXG4gIGFuZ3VsYXIubW9kdWxlKFwic2VhcmNoXCIpXG4gICAgLmZhY3RvcnkoXCJTZWFyY2hTZXJ2aWNlXCIsIFNlYXJjaFNlcnZpY2UpO1xufSgpKTtcbihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKFwic3RvcmFnZVwiLCBbXG4gICAgXCJMb2NhbFN0b3JhZ2VNb2R1bGVcIlxuICBdKTtcblxuICBsZXQgbG9jYWxTdG9yYWdlQ29uZmlnID0gZnVuY3Rpb24gKGxvY2FsU3RvcmFnZVNlcnZpY2VQcm92aWRlcikge1xuICAgIGxvY2FsU3RvcmFnZVNlcnZpY2VQcm92aWRlclxuICAgICAgLnNldFByZWZpeChcIm5nVmlkZW9Db2xsZWN0b3JcIilcbiAgICAgIC5zZXROb3RpZnkodHJ1ZSwgdHJ1ZSk7XG4gIH07XG4gIGFuZ3VsYXIubW9kdWxlKFwic3RvcmFnZVwiKVxuICAgIC5jb25maWcobG9jYWxTdG9yYWdlQ29uZmlnKTtcbn0oKSk7XG4oZnVuY3Rpb24gKCkge1xuICBsZXQgU3RvcmFnZVNlcnZpY2UgPSBmdW5jdGlvbiAobG9jYWxTdG9yYWdlU2VydmljZSkge1xuICAgIGZ1bmN0aW9uIGdldFZpZGVvTGlzdChwYXJhbU9iaikge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KFwidmlkZW9zTGlzdFwiKSB8fCBbXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVWaWRlb0xpc3QodmlkZW9MaXN0KSB7XG4gICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldChcInZpZGVvc0xpc3RcIiwgdmlkZW9MaXN0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhclN0b3JhZ2UoKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmNsZWFyQWxsKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsbFN0b3JhZ2UoZGF0YSkge1xuICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoXCJ2aWRlb3NMaXN0XCIsIGRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzSW5TdG9yYWdlKGlkKSB7XG4gICAgICBsZXQgdmlkZW9zID0gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoXCJ2aWRlb3NMaXN0XCIpO1xuICAgICAgbGV0IHZpZGVvID0gXy5maW5kKHZpZGVvcywgKHYpID0+IHYuaWQgPT09IGlkKTtcbiAgICAgIHJldHVybiAodmlkZW8pID8gdmlkZW8uZGF0ZUFkZCA6IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFZpZGVvKHZpZGVvKSB7XG4gICAgICBsZXQgdmlkZW9MaXN0ID0gZ2V0VmlkZW9MaXN0KCk7XG4gICAgICBsZXQgbmV3T2JqID0ge1xuICAgICAgICBpZDogdmlkZW8uaWQudmlkZW9JZCxcbiAgICAgICAgdHlwZTogdmlkZW8uaWQua2luZCxcbiAgICAgICAgbmFtZTogdmlkZW8uc25pcHBldC50aXRsZSxcbiAgICAgICAgdGh1bWJuYWlsczogdmlkZW8uc25pcHBldC50aHVtYm5haWxzLFxuICAgICAgICBkZXNjcmlwdGlvbjogdmlkZW8uc25pcHBldC5kZXNjcmlwdGlvbixcbiAgICAgICAgZGF0ZUFkZDogbW9tZW50KCkudG9EYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICBmYXY6IGZhbHNlXG4gICAgICB9O1xuXG4gICAgICAvLyBAdG9kbyBwYXNzIHRocnUgY2hlY2tmb3JkdXBlcyBmdW5jXG4gICAgICB2aWRlb0xpc3QucHVzaChuZXdPYmopO1xuICAgICAgdXBkYXRlVmlkZW9MaXN0KHZpZGVvTGlzdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVsZXRlVmlkZW8odmlkZW8pIHtcbiAgICAgIGxldCB2aWRlb0xpc3QgPSBnZXRWaWRlb0xpc3QoKTtcbiAgICAgIF8ucmVtb3ZlKHZpZGVvTGlzdCwgKGkpID0+IGkuaWQgPT09IHZpZGVvLmlkKTtcbiAgICAgIHVwZGF0ZVZpZGVvTGlzdCh2aWRlb0xpc3QpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVZpZGVvKHVwZGF0ZU9iaikge1xuICAgICAgaWYgKCF1cGRhdGVPYmouaWQpIHJldHVybjtcblxuICAgICAgbGV0IHZpZGVvc0xpc3QgPSBnZXRWaWRlb0xpc3QoKTtcbiAgICAgIGxldCB2aWRlbyA9IF8uZmluZCh2aWRlb3NMaXN0LCAodikgPT4gdi5pZCA9PT0gdXBkYXRlT2JqLmlkKTtcblxuICAgICAgT2JqZWN0LmFzc2lnbih2aWRlbywgdXBkYXRlT2JqKTtcbiAgICAgIHVwZGF0ZVZpZGVvTGlzdCh2aWRlb3NMaXN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0VmlkZW9MaXN0LFxuICAgICAgYWRkVmlkZW8sXG4gICAgICBjbGVhclN0b3JhZ2UsXG4gICAgICBmaWxsU3RvcmFnZSxcbiAgICAgIGlzSW5TdG9yYWdlLFxuICAgICAgdXBkYXRlVmlkZW8sXG4gICAgICBkZWxldGVWaWRlb1xuICAgIH07XG4gIH07XG5cbiAgYW5ndWxhci5tb2R1bGUoXCJzdG9yYWdlXCIpXG4gICAgLmZhY3RvcnkoXCJTdG9yYWdlU2VydmljZVwiLCBTdG9yYWdlU2VydmljZSk7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcbiAgbGV0IHZpZGVvc0NvbXBvbmVudCA9IHtcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2FwcC9jb21wb25lbnRzL3ZpZGVvcy92aWRlb3MuaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiVmlkZW9zQ29udHJvbGxlclwiXG4gIH07XG5cbiAgYW5ndWxhci5tb2R1bGUoXCJ2aWRlb3NcIilcbiAgICAuY29tcG9uZW50KFwidmlkZW9zXCIsIHZpZGVvc0NvbXBvbmVudCk7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcbiAgbGV0IFZpZGVvc0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoVmlkZW9zU2VydmljZSwgU3RvcmFnZVNlcnZpY2UsICRtZFRvYXN0KSB7XG4gICAgdGhpcy4kb25Jbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5nZXRWaWRlb3ModGhpcy52aWV3U2V0dGluZ3MpO1xuICAgIH07XG4gICAgdGhpcy52aWRlb3NMaXN0ID0gW107XG4gICAgdGhpcy52aWV3U2V0dGluZ3MgPSB7XG4gICAgICBsYXlvdXQ6IFwibGlzdFwiLFxuICAgICAgdmlkZW9zQ291bnQ6IDEwLFxuICAgICAgc29ydHM6IFwibmV3ZXN0XCIsXG4gICAgICBmaWx0ZXJzOiBudWxsLFxuICAgICAgcGFnZTogMFxuICAgIH07XG4gICAgdGhpcy5vcGVuU2VsZWN0VmlkZW9zTnVtYmVyID0gKCRtZE9wZW5NZW51LCBlKSA9PiAkbWRPcGVuTWVudShlKTtcbiAgICB0aGlzLmNoYW5nZVZpZXdTZXR0aW5ncyA9IChwYXJhbU9iaikgPT4ge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnZpZXdTZXR0aW5ncywgcGFyYW1PYmopO1xuICAgICAgdGhpcy5nZXRWaWRlb3ModGhpcy52aWV3U2V0dGluZ3MpO1xuICAgIH07XG4gICAgdGhpcy5mYXZUb2dnbGUgPSAodmlkZW8pID0+IHtcbiAgICAgIHZpZGVvLmZhdiA9ICF2aWRlby5mYXY7XG4gICAgICBTdG9yYWdlU2VydmljZS51cGRhdGVWaWRlbyh2aWRlbyk7XG4gICAgICAkbWRUb2FzdC5zaG93KFxuICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxuICAgICAgICAgIC50ZXh0Q29udGVudChgVmlkZW8gJHsgdmlkZW8ubmFtZSB9ICR7IHZpZGVvLmZhdiA/IFwiYWRkZWQgdG8gZmF2XCIgOiBcInJlbW92ZWQgZnJvbSBmYXZcIn0gYClcbiAgICAgICAgICAucG9zaXRpb24oXCJ0b3AgcmlnaHRcIilcbiAgICAgICAgICAuaGlkZURlbGF5KDMwMDApXG4gICAgICApO1xuICAgIH07XG5cbiAgICB0aGlzLmRlbGV0ZVZpZGVvID0gKHZpZGVvKSA9PiB7XG4gICAgICBTdG9yYWdlU2VydmljZS5kZWxldGVWaWRlbyh2aWRlbyk7XG4gICAgICB0aGlzLmdldFZpZGVvcyh0aGlzLnZpZXdTZXR0aW5ncyk7XG4gICAgICAkbWRUb2FzdC5zaG93KFxuICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxuICAgICAgICAgIC50ZXh0Q29udGVudChgVmlkZW8gJHsgdmlkZW8ubmFtZSB9IGRlbGV0ZWQgYClcbiAgICAgICAgICAucG9zaXRpb24oXCJ0b3AgcmlnaHRcIilcbiAgICAgICAgICAuaGlkZURlbGF5KDMwMDApXG4gICAgICApO1xuICAgIH07XG5cbiAgICB0aGlzLmdldFZpZGVvcyA9IChwYXJhbU9iamVjdCwgcmVzZXQpID0+IHtcbiAgICAgIGlmKHJlc2V0KSB0aGlzLnZpZXdTZXR0aW5ncy5wYWdlID0gMDtcbiAgICAgIHRoaXMudmlkZW9zTGlzdCA9IFZpZGVvc1NlcnZpY2UuZ2V0VmlkZW9zTGlzdChwYXJhbU9iamVjdCk7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0UGFnZSA9IChwYWdlKSA9PiB7XG4gICAgICBpZighXy5pc1VuZGVmaW5lZChwYWdlKSkgeyB0aGlzLnZpZXdTZXR0aW5ncy5wYWdlID0gcGFnZTsgfVxuICAgICAgdGhpcy52aWRlb3NMaXN0ID0gVmlkZW9zU2VydmljZS5nZXRQYWdlUmVzdWx0KHRoaXMudmlld1NldHRpbmdzLnBhZ2UsIHRoaXMudmlld1NldHRpbmdzLnZpZGVvc0NvdW50KTtcbiAgICB9O1xuXG4gICAgdGhpcy5nZXROZXh0UGFnZSA9ICgpID0+IHtcbiAgICAgIGlmKCh0aGlzLnZpZXdTZXR0aW5ncy5wYWdlICsgMSkgPj0gdGhpcy52aWRlb3NMaXN0LmluZm8udG90YWwpIHtcbiAgICAgICAgJG1kVG9hc3Quc2hvdyhcbiAgICAgICAgICAkbWRUb2FzdC5zaW1wbGUoKVxuICAgICAgICAgICAgLnRleHRDb250ZW50KFwiWW91J3ZlIHJlYWNoZWQgdGhlIGVuZFwiKVxuICAgICAgICAgICAgLnBvc2l0aW9uKFwidG9wIHJpZ2h0XCIpXG4gICAgICAgICAgICAuaGlkZURlbGF5KDMwMDApXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXdTZXR0aW5ncy5wYWdlKys7XG4gICAgICB9XG4gICAgICB0aGlzLmdldFBhZ2UoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRQcmV2UGFnZSA9ICgpID0+IHtcbiAgICAgIGlmKCh0aGlzLnZpZXdTZXR0aW5ncy5wYWdlIC0gMSkgPCAwKSB7XG4gICAgICAgICRtZFRvYXN0LnNob3coXG4gICAgICAgICAgJG1kVG9hc3Quc2ltcGxlKClcbiAgICAgICAgICAgIC50ZXh0Q29udGVudChcIllvdSd2ZSByZWFjaGVkIHRoZSBiZWdpbm5pbmdcIilcbiAgICAgICAgICAgIC5wb3NpdGlvbihcInRvcCByaWdodFwiKVxuICAgICAgICAgICAgLmhpZGVEZWxheSgzMDAwKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52aWV3U2V0dGluZ3MucGFnZS0tO1xuICAgICAgfVxuICAgICAgdGhpcy5nZXRQYWdlKCk7XG4gICAgfTtcbiAgfTtcblxuICBhbmd1bGFyLm1vZHVsZShcInZpZGVvc1wiKVxuICAgIC5jb250cm9sbGVyKFwiVmlkZW9zQ29udHJvbGxlclwiLCBWaWRlb3NDb250cm9sbGVyKTtcbn0oKSk7XG4oZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZShcImNvbW1vblwiLCBbXCJ1dGlsc1wiXSk7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcbiAgbGV0IGFwcCA9IHtcbiAgICBiaW5kaW5nczoge1xuICAgICAgYXBwQWN0aW9uczogXCI8XCJcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vYXBwL2NvbW1vbi9hcHAuaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiQXBwQ29udHJvbGxlclwiXG4gIH07XG5cbiAgYW5ndWxhci5tb2R1bGUoXCJjb21tb25cIilcbiAgICAuY29tcG9uZW50KFwiYXBwXCIsIGFwcCk7XG59KCkpO1xuXG4oZnVuY3Rpb24gKCkge1xuICBsZXQgQXBwQ29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG4gICAgY3RybC5jdXJyZW50UGFuZWwgPSBcInZpZGVvc1BhbmVsXCI7XG5cbiAgICBjdHJsLmFjdGlvbnMgPSB7XG4gICAgICByZWxvYWRWaWRlb3NQYW5lbCAoaW5uZXJDYWxsYmFjaykge1xuICAgICAgICBjdHJsLmN1cnJlbnRQYW5lbCA9IFwiXCI7XG4gICAgICAgIGlmICh0eXBlb2YgaW5uZXJDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSBpbm5lckNhbGxiYWNrKCk7XG4gICAgICAgIGN0cmwuY3VycmVudFBhbmVsID0gXCJ2aWRlb3NQYW5lbFwiO1xuICAgICAgfSxcbiAgICAgIHRvZ2dsZVBhbmVscyAoKSB7XG4gICAgICAgIGN0cmwuY3VycmVudFBhbmVsID0gKGN0cmwuY3VycmVudFBhbmVsID09PSBcInNlYXJjaFBhbmVsXCIpID8gXCJ2aWRlb3NQYW5lbFwiIDogXCJzZWFyY2hQYW5lbFwiO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgYW5ndWxhci5tb2R1bGUoXCJjb21tb25cIilcbiAgICAuY29udHJvbGxlcihcIkFwcENvbnRyb2xsZXJcIiwgQXBwQ29udHJvbGxlcik7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcbiAgbGV0IHRvcEJhciA9IHtcbiAgICBiaW5kaW5nczoge1xuICAgICAgb25Ub2dnbGVQYW5lOiBcIiZcIixcbiAgICAgIGFwcEFjdGlvbnM6IFwiPFwiXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL2FwcC9jb21tb24vdG9wQmFyLmh0bWxcIixcbiAgICBjb250cm9sbGVyOiBcInRvcEJhckNvbnRyb2xsZXJcIlxuICB9O1xuXG4gIGFuZ3VsYXIubW9kdWxlKFwiY29tbW9uXCIpXG4gICAgLmNvbXBvbmVudChcInRvcEJhclwiLCB0b3BCYXIpO1xufSgpKTtcbihmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIHRvcEJhckNvbnRyb2xsZXIoVXRpbHNTZXJ2aWNlKSB7XG5cbiAgICB0aGlzLnRvZ2dsZVNlYXJjaFBhbmVsID0gKCkgPT4gdGhpcy5hcHBBY3Rpb25zLnRvZ2dsZVBhbmVscygpO1xuICAgIHRoaXMub3Blbk1lbnUgPSAoJG1kT3Blbk1lbnUsIGUpID0+ICRtZE9wZW5NZW51KGUpO1xuICAgIHRoaXMuY2xlYXJEQiA9ICgpID0+IHRoaXMuYXBwQWN0aW9ucy5yZWxvYWRWaWRlb3NQYW5lbCgoKSA9PiBVdGlsc1NlcnZpY2UuY2xlYXJTdG9yYWdlKCkpO1xuICAgIHRoaXMuZmlsbFRlc3REYXRhID0gKCkgPT4gdGhpcy5hcHBBY3Rpb25zLnJlbG9hZFZpZGVvc1BhbmVsKCgpID0+IFV0aWxzU2VydmljZS5maWxsVGVzdERhdGEoKSk7XG4gIH1cblxuICBhbmd1bGFyLm1vZHVsZShcImNvbW1vblwiKVxuICAgIC5jb250cm9sbGVyKFwidG9wQmFyQ29udHJvbGxlclwiLCB0b3BCYXJDb250cm9sbGVyKTtcbn0oKSk7XG4oZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZShcInV0aWxzXCIsIFtcInN0b3JhZ2VcIl0pO1xufSgpKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgbGV0IFV0aWxzU2VydmljZSA9IGZ1bmN0aW9uIChTdG9yYWdlU2VydmljZSwgJGh0dHApIHtcbiAgICBmdW5jdGlvbiBjbGVhclN0b3JhZ2UoKSB7XG4gICAgICBTdG9yYWdlU2VydmljZS5jbGVhclN0b3JhZ2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWxsVGVzdERhdGEoKSB7XG4gICAgICAkaHR0cC5nZXQoXCIuL2FwcC90ZW1wL3d1amFUZXN0MS5qc29uXCIpXG4gICAgICAgIC50aGVuKChkYXRhKSA9PiBTdG9yYWdlU2VydmljZS5maWxsU3RvcmFnZShkYXRhLmRhdGEpKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY2xlYXJTdG9yYWdlLFxuICAgICAgZmlsbFRlc3REYXRhXG4gICAgfTtcbiAgfTtcbiAgYW5ndWxhci5tb2R1bGUoXCJ1dGlsc1wiKVxuICAgIC5mYWN0b3J5KFwiVXRpbHNTZXJ2aWNlXCIsIFV0aWxzU2VydmljZSk7XG59KCkpOyJdfQ==
