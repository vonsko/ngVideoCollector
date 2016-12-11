{
	angular.module("ngVideoCollector", [
		"ngMaterial",
		"components",
		"common"
	]);
}
{
	materialThemeConfig.$inject = ["$mdThemingProvider"];
	materialIconConfig.$inject = ["$mdIconProvider"];
	function materialThemeConfig ($mdThemingProvider) {
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

	function materialIconConfig ($mdIconProvider) {
		$mdIconProvider
			.defaultFontSet("material-icons");
	}

	angular.module("ngVideoCollector")
		.config(materialThemeConfig)
		.config(materialIconConfig);
}


// youtube api key [ AIzaSyDjMxSP8blKtpsjZ_C6Yk5Eu-u-bugif3M ]
{
	angular.module("components", [
		"videos",
		"search",
		"storage"
	]);
}
{
	angular.module("videos", []);
}
{
	let VideosService = function (StorageService) {
		return {
			getVideosList() {
				return StorageService.getVideoList();
			}
		};
	};
	VideosService.$inject = ["StorageService"];

	angular.module("videos")
		.factory("VideosService", VideosService);
}
{
	angular.module("search", []);
}
{
	let searchComponent = {
		templateUrl: "./app/components/search/search.html",
		controller: "SearchController"
	};

	angular.module("search")
		.component("searchPanel", searchComponent);
}
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
	SearchController.$inject = ["SearchService", "StorageService"];
	
	angular.module("search")
		.controller("SearchController", SearchController);
}

{
	let SearchService = function ($http) {
		function searchByQuery(query) {
			let Service = query.engine === "youtube" ? "YoutubeService" : "VimeoService";
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
}
{
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
}
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
	StorageService.$inject = ["localStorageService"];

	angular.module("storage")
		.factory("StorageService", StorageService);
}
{
	let videosComponent = {
		templateUrl: "./app/components/videos/videos.html",
		controller: "VideosController"
	};

	angular.module("videos")
		.component("videos", videosComponent);
}
{
	let VideosController = function (VideosService) {
		this.icon = "build";
		this.videosList = VideosService.getVideosList();

		console.log(this.videosList)
	};
	VideosController.$inject = ["VideosService"];

	angular.module("videos")
		.controller("VideosController", VideosController);
}
{
	angular.module("common", ["utils"]);
}
{
	let app = {
		bindings: {
			appActions: "<"
		},
		templateUrl: "./app/common/app.html",
		controller: "AppController"
	};

	angular.module("common")
		.component("app", app);
};
{
	let AppController = function () {
		let ctrl = this;
		ctrl.currentPanel = "videosPanel";

		ctrl.actions = {
			reloadVideosPanel (innerCallback) {
				ctrl.currentPanel = "";
				if(typeof innerCallback === "function") innerCallback();
				ctrl.currentPanel = "videosPanel";
			},
			togglePanels () {
				ctrl.currentPanel = ctrl.currentPanel === "searchPanel" ? "videosPanel" : "searchPanel";
			}
		};
	};

	angular.module("common")
		.controller("AppController", AppController);
}
{
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
}
{
	topBarController.$inject = ["UtilsService"];
	function topBarController (UtilsService) {
		this.toggleSearchPanel = () => this.appActions.togglePanels();

		this.openMenu = function($mdOpenMenu, e) {
			$mdOpenMenu(e);
		};

		this.clearDB = () => {
			this.appActions.reloadVideosPanel(() => {
				UtilsService.clearStorage();
			});
		};
	}

	angular.module("common")
		.controller("topBarController", topBarController);
}
{
	angular.module("utils", ["storage"]);
}
{
	let UtilsService = function (StorageService) {
		let clearStorage = function () {
			StorageService.clearStorage();
		};
		return {
			clearStorage
		};
	};
	UtilsService.$inject = ["StorageService"];
	angular.module("utils")
		.factory("UtilsService", UtilsService);
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Q0FDQyxRQUFRLE9BQU8sb0JBQW9CO0VBQ2xDO0VBQ0E7RUFDQTs7Ozs7bURBR0Y7Q0FDQyxTQUFTLHFCQUFxQixvQkFBb0I7RUFDakQ7SUFDRSxNQUFNO0lBQ04sZUFBZTtJQUNmLGNBQWM7SUFDZCxZQUFZO0lBQ1osa0JBQWtCOztFQUVwQixtQkFBbUIsTUFBTSxhQUFhO0lBQ3BDLGVBQWUsU0FBUzs7RUFFMUI7SUFDRSxNQUFNO0lBQ04sZUFBZTtJQUNmLGNBQWM7OztDQUdqQixTQUFTLG9CQUFvQixpQkFBaUI7RUFDN0M7SUFDRSxlQUFlOzs7Q0FHbEIsUUFBUSxPQUFPO0dBQ2IsT0FBTztHQUNQLE9BQU87Ozs7O0FBS1Y7Q0FDQyxRQUFRLE9BQU8sY0FBYztFQUM1QjtFQUNBO0VBQ0E7OztBQUdGO0NBQ0MsUUFBUSxPQUFPLFVBQVU7O0FBRTFCO0NBQ0MsSUFBSSxnQkFBZ0IsVUFBVSxnQkFBZ0I7RUFDN0MsT0FBTztHQUNOLGFBQWEsR0FBRztJQUNmLE9BQU8sZUFBZTs7Ozs7O0NBS3pCLFFBQVEsT0FBTztHQUNiLFFBQVEsaUJBQWlCOztBQUU1QjtDQUNDLFFBQVEsT0FBTyxVQUFVOztBQUUxQjtDQUNDLElBQUksa0JBQWtCO0VBQ3JCLGFBQWE7RUFDYixZQUFZOzs7Q0FHYixRQUFRLE9BQU87R0FDYixVQUFVLGVBQWU7O0FBRTVCO0NBQ0MsSUFBSSxtQkFBbUIsVUFBVSxlQUFlLGdCQUFnQjs7RUFFL0QsSUFBSSxPQUFPO0VBQ1gsS0FBSyxRQUFRO0dBQ1osTUFBTTtHQUNOLFFBQVE7OztFQUdULEtBQUssU0FBUyxVQUFVLE9BQU87R0FDOUIsY0FBYyxjQUFjLEtBQUssT0FBTyxLQUFLOzs7OztFQUs5QyxLQUFLLFdBQVc7Ozs7Q0FHakIsUUFBUSxPQUFPO0dBQ2IsV0FBVyxvQkFBb0I7OztBQUdsQztDQUNDLElBQUksZ0JBQWdCLFVBQVUsT0FBTztFQUNwQyxTQUFTLGNBQWMsT0FBTztHQUM3QixJQUFJLFVBQVUsTUFBTSxXQUFXLFlBQVksbUJBQW1CO0dBQzlELE9BQU8sTUFBTSxJQUFJLGdEQUFnRDtJQUNoRSxRQUFRO0tBQ1AsS0FBSztLQUNMLE1BQU07S0FDTixZQUFZO0tBQ1osV0FBVzs7S0FFWCxNQUFNO0tBQ04sR0FBRyxNQUFNOzs7OztFQUtaLE9BQU87R0FDTjs7Ozs7Q0FJRixRQUFRLE9BQU87R0FDYixRQUFRLGlCQUFpQjs7QUFFNUI7Q0FDQyxRQUFRLE9BQU8sV0FBVztFQUN6Qjs7O0NBR0QsSUFBSSxxQkFBcUIsVUFBVSw2QkFBNkI7RUFDL0Q7SUFDRSxVQUFVO0lBQ1YsVUFBVSxNQUFNOzs7Q0FFbkIsUUFBUSxPQUFPO0dBQ2IsT0FBTzs7QUFFVjtDQUNDLElBQUksaUJBQWlCLFVBQVUscUJBQXFCO0VBQ25ELFNBQVMsZ0JBQWdCO0dBQ3hCLE9BQU8sb0JBQW9CLElBQUksaUJBQWlCOztFQUVqRCxTQUFTLGlCQUFpQixXQUFXO0dBQ3BDLG9CQUFvQixJQUFJLGNBQWM7OztFQUd2QyxTQUFTLGdCQUFnQjtHQUN4QixvQkFBb0I7O0VBRXJCLFNBQVMsVUFBVSxPQUFPO0dBQ3pCLElBQUksWUFBWTtHQUNoQixJQUFJLFNBQVM7SUFDWixJQUFJLE1BQU0sR0FBRztJQUNiLE1BQU0sTUFBTSxHQUFHO0lBQ2YsTUFBTSxNQUFNLFFBQVE7SUFDcEIsWUFBWSxNQUFNLFFBQVE7SUFDMUIsYUFBYSxNQUFNLFFBQVE7SUFDM0IsU0FBUyxTQUFTLFNBQVM7SUFDM0IsS0FBSzs7O0dBR04sUUFBUSxJQUFJLFNBQVMsUUFBUTs7O0dBRzdCLFVBQVUsS0FBSztHQUNmLGdCQUFnQjs7O0VBR2pCLE9BQU87R0FDTjtHQUNBO0dBQ0E7Ozs7O0NBSUYsUUFBUSxPQUFPO0dBQ2IsUUFBUSxrQkFBa0I7O0FBRTdCO0NBQ0MsSUFBSSxrQkFBa0I7RUFDckIsYUFBYTtFQUNiLFlBQVk7OztDQUdiLFFBQVEsT0FBTztHQUNiLFVBQVUsVUFBVTs7QUFFdkI7Q0FDQyxJQUFJLG1CQUFtQixVQUFVLGVBQWU7RUFDL0MsS0FBSyxPQUFPO0VBQ1osS0FBSyxhQUFhLGNBQWM7O0VBRWhDLFFBQVEsSUFBSSxLQUFLOzs7O0NBR2xCLFFBQVEsT0FBTztHQUNiLFdBQVcsb0JBQW9COztBQUVsQztDQUNDLFFBQVEsT0FBTyxVQUFVLENBQUM7O0FBRTNCO0NBQ0MsSUFBSSxNQUFNO0VBQ1QsVUFBVTtHQUNULFlBQVk7O0VBRWIsYUFBYTtFQUNiLFlBQVk7OztDQUdiLFFBQVEsT0FBTztHQUNiLFVBQVUsT0FBTztDQUNuQjtBQUNEO0NBQ0MsSUFBSSxnQkFBZ0IsWUFBWTtFQUMvQixJQUFJLE9BQU87RUFDWCxLQUFLLGVBQWU7O0VBRXBCLEtBQUssVUFBVTtHQUNkLGtCQUFrQixDQUFDLGVBQWU7SUFDakMsS0FBSyxlQUFlO0lBQ3BCLEdBQUcsT0FBTyxrQkFBa0IsWUFBWTtJQUN4QyxLQUFLLGVBQWU7O0dBRXJCLGFBQWEsR0FBRztJQUNmLEtBQUssZUFBZSxLQUFLLGlCQUFpQixnQkFBZ0IsZ0JBQWdCOzs7OztDQUs3RSxRQUFRLE9BQU87R0FDYixXQUFXLGlCQUFpQjs7QUFFL0I7Q0FDQyxJQUFJLFNBQVM7RUFDWixVQUFVO0dBQ1QsY0FBYztHQUNkLFlBQVk7O0VBRWIsYUFBYTtFQUNiLFlBQVk7OztDQUdiLFFBQVEsT0FBTztHQUNiLFVBQVUsVUFBVTs7OzhDQUV2QjtDQUNDLFNBQVMsa0JBQWtCLGNBQWM7RUFDeEMsS0FBSyxvQkFBb0I7O0VBRXpCLEtBQUssV0FBVyxTQUFTLGFBQWEsR0FBRztHQUN4QyxZQUFZOzs7RUFHYixLQUFLLFVBQVU7Ozs7Ozs7Q0FPaEIsUUFBUSxPQUFPO0dBQ2IsV0FBVyxvQkFBb0I7O0FBRWxDO0NBQ0MsUUFBUSxPQUFPLFNBQVMsQ0FBQzs7QUFFMUI7Q0FDQyxJQUFJLGVBQWUsVUFBVSxnQkFBZ0I7RUFDNUMsSUFBSSxlQUFlLFlBQVk7R0FDOUIsZUFBZTs7RUFFaEIsT0FBTztHQUNOOzs7O0NBR0YsUUFBUSxPQUFPO0dBQ2IsUUFBUSxnQkFBZ0I7Q0FDMUIiLCJmaWxlIjoiYXBwL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIntcblx0YW5ndWxhci5tb2R1bGUoXCJuZ1ZpZGVvQ29sbGVjdG9yXCIsIFtcblx0XHRcIm5nTWF0ZXJpYWxcIixcblx0XHRcImNvbXBvbmVudHNcIixcblx0XHRcImNvbW1vblwiXG5cdF0pO1xufVxue1xuXHRmdW5jdGlvbiBtYXRlcmlhbFRoZW1lQ29uZmlnICgkbWRUaGVtaW5nUHJvdmlkZXIpIHtcblx0XHQkbWRUaGVtaW5nUHJvdmlkZXJcblx0XHRcdC50aGVtZShcImRlZmF1bHRcIilcblx0XHRcdC5wcmltYXJ5UGFsZXR0ZShcImFtYmVyXCIpXG5cdFx0XHQuYWNjZW50UGFsZXR0ZShcImdyZWVuXCIpXG5cdFx0XHQud2FyblBhbGV0dGUoXCJyZWRcIilcblx0XHRcdC5iYWNrZ3JvdW5kUGFsZXR0ZShcImJsdWUtZ3JleVwiKTtcblxuXHRcdCRtZFRoZW1pbmdQcm92aWRlci50aGVtZShcImRvY3MtZGFya1wiLCBcImRlZmF1bHRcIilcblx0XHRcdC5wcmltYXJ5UGFsZXR0ZShcImFtYmVyXCIpLmRhcmsoKTtcblxuXHRcdCRtZFRoZW1pbmdQcm92aWRlclxuXHRcdFx0LnRoZW1lKFwiYWx0MVwiKVxuXHRcdFx0LnByaW1hcnlQYWxldHRlKFwiZ3JleVwiKVxuXHRcdFx0LmFjY2VudFBhbGV0dGUoXCJibHVlLWdyZXlcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtYXRlcmlhbEljb25Db25maWcgKCRtZEljb25Qcm92aWRlcikge1xuXHRcdCRtZEljb25Qcm92aWRlclxuXHRcdFx0LmRlZmF1bHRGb250U2V0KFwibWF0ZXJpYWwtaWNvbnNcIik7XG5cdH1cblxuXHRhbmd1bGFyLm1vZHVsZShcIm5nVmlkZW9Db2xsZWN0b3JcIilcblx0XHQuY29uZmlnKG1hdGVyaWFsVGhlbWVDb25maWcpXG5cdFx0LmNvbmZpZyhtYXRlcmlhbEljb25Db25maWcpO1xufVxuXG5cbi8vIHlvdXR1YmUgYXBpIGtleSBbIEFJemFTeURqTXhTUDhibEt0cHNqWl9DNllrNUV1LXUtYnVnaWYzTSBdXG57XG5cdGFuZ3VsYXIubW9kdWxlKFwiY29tcG9uZW50c1wiLCBbXG5cdFx0XCJ2aWRlb3NcIixcblx0XHRcInNlYXJjaFwiLFxuXHRcdFwic3RvcmFnZVwiXG5cdF0pO1xufVxue1xuXHRhbmd1bGFyLm1vZHVsZShcInZpZGVvc1wiLCBbXSk7XG59XG57XG5cdGxldCBWaWRlb3NTZXJ2aWNlID0gZnVuY3Rpb24gKFN0b3JhZ2VTZXJ2aWNlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGdldFZpZGVvc0xpc3QoKSB7XG5cdFx0XHRcdHJldHVybiBTdG9yYWdlU2VydmljZS5nZXRWaWRlb0xpc3QoKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwidmlkZW9zXCIpXG5cdFx0LmZhY3RvcnkoXCJWaWRlb3NTZXJ2aWNlXCIsIFZpZGVvc1NlcnZpY2UpO1xufVxue1xuXHRhbmd1bGFyLm1vZHVsZShcInNlYXJjaFwiLCBbXSk7XG59XG57XG5cdGxldCBzZWFyY2hDb21wb25lbnQgPSB7XG5cdFx0dGVtcGxhdGVVcmw6IFwiLi9hcHAvY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLmh0bWxcIixcblx0XHRjb250cm9sbGVyOiBcIlNlYXJjaENvbnRyb2xsZXJcIlxuXHR9O1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwic2VhcmNoXCIpXG5cdFx0LmNvbXBvbmVudChcInNlYXJjaFBhbmVsXCIsIHNlYXJjaENvbXBvbmVudCk7XG59XG57XG5cdGxldCBTZWFyY2hDb250cm9sbGVyID0gZnVuY3Rpb24gKFNlYXJjaFNlcnZpY2UsIFN0b3JhZ2VTZXJ2aWNlKSB7XG5cblx0XHRsZXQgY3RybCA9IHRoaXM7XG5cdFx0Y3RybC5xdWVyeSA9IHtcblx0XHRcdHRleHQ6IFwiR0NwMnZTTmRXQkFcIixcblx0XHRcdGVuZ2luZTogXCJ5b3V0dWJlXCJcblx0XHR9O1xuXG5cdFx0dGhpcy5zZWFyY2ggPSBmdW5jdGlvbiAocXVlcnkpIHtcblx0XHRcdFNlYXJjaFNlcnZpY2Uuc2VhcmNoQnlRdWVyeShjdHJsLnF1ZXJ5KS50aGVuKChyZXMpID0+IHtcblx0XHRcdFx0Y3RybC5zZWFyY2hSZXN1bHRzID0gcmVzLmRhdGEuaXRlbXM7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0dGhpcy5hZGRWaWRlbyA9ICh2aWRlbykgPT4gU3RvcmFnZVNlcnZpY2UuYWRkVmlkZW8odmlkZW8pO1xuXHR9O1xuXHRcblx0YW5ndWxhci5tb2R1bGUoXCJzZWFyY2hcIilcblx0XHQuY29udHJvbGxlcihcIlNlYXJjaENvbnRyb2xsZXJcIiwgU2VhcmNoQ29udHJvbGxlcik7XG59XG5cbntcblx0bGV0IFNlYXJjaFNlcnZpY2UgPSBmdW5jdGlvbiAoJGh0dHApIHtcblx0XHRmdW5jdGlvbiBzZWFyY2hCeVF1ZXJ5KHF1ZXJ5KSB7XG5cdFx0XHRsZXQgU2VydmljZSA9IHF1ZXJ5LmVuZ2luZSA9PT0gXCJ5b3V0dWJlXCIgPyBcIllvdXR1YmVTZXJ2aWNlXCIgOiBcIlZpbWVvU2VydmljZVwiO1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3lvdXR1YmUvdjMvc2VhcmNoXCIsIHtcblx0XHRcdFx0cGFyYW1zOiB7XG5cdFx0XHRcdFx0a2V5OiBcIkFJemFTeURqTXhTUDhibEt0cHNqWl9DNllrNUV1LXUtYnVnaWYzTVwiLFxuXHRcdFx0XHRcdHR5cGU6IFwidmlkZW9cIixcblx0XHRcdFx0XHRtYXhSZXN1bHRzOiBcIjEwXCIsXG5cdFx0XHRcdFx0cGFnZVRva2VuOiBcIlwiLFxuXHRcdFx0XHRcdC8vIHBhcnQ6IFwiaWQsc25pcHBldCxjb250ZW50RGV0YWlsc1wiLCBAdG9kbzogYXBpIHlvdXR1YmUnYSBuaWUgcG9iaWVyYSB3c3p5c3RraWNoIGluZm9ybWFjamkgLSB0cnplYmEgdG8gZG9kYcSHIHcgZHJ1Z2ltIHJlcXVlxZtjaWVcblx0XHRcdFx0XHRwYXJ0OiBcImlkLHNuaXBwZXRcIixcblx0XHRcdFx0XHRxOiBxdWVyeS50ZXh0XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzZWFyY2hCeVF1ZXJ5XG5cdFx0fTtcblx0fTtcblxuXHRhbmd1bGFyLm1vZHVsZShcInNlYXJjaFwiKVxuXHRcdC5mYWN0b3J5KFwiU2VhcmNoU2VydmljZVwiLCBTZWFyY2hTZXJ2aWNlKTtcbn1cbntcblx0YW5ndWxhci5tb2R1bGUoXCJzdG9yYWdlXCIsIFtcblx0XHRcIkxvY2FsU3RvcmFnZU1vZHVsZVwiXG5cdF0pO1xuXG5cdGxldCBsb2NhbFN0b3JhZ2VDb25maWcgPSBmdW5jdGlvbiAobG9jYWxTdG9yYWdlU2VydmljZVByb3ZpZGVyKSB7XG5cdFx0bG9jYWxTdG9yYWdlU2VydmljZVByb3ZpZGVyXG5cdFx0XHQuc2V0UHJlZml4KFwibmdWaWRlb0NvbGxlY3RvclwiKVxuXHRcdFx0LnNldE5vdGlmeSh0cnVlLCB0cnVlKTtcblx0fTtcblx0YW5ndWxhci5tb2R1bGUoXCJzdG9yYWdlXCIpXG5cdFx0LmNvbmZpZyhsb2NhbFN0b3JhZ2VDb25maWcpO1xufVxue1xuXHRsZXQgU3RvcmFnZVNlcnZpY2UgPSBmdW5jdGlvbiAobG9jYWxTdG9yYWdlU2VydmljZSkge1xuXHRcdGZ1bmN0aW9uIGdldFZpZGVvTGlzdCAoKSB7XG5cdFx0XHRyZXR1cm4gbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoXCJ2aWRlb3NMaXN0XCIpIHx8IFtdO1xuXHRcdH1cblx0XHRmdW5jdGlvbiB1cGRhdGVWaWRlb0xpc3QgKHZpZGVvTGlzdCkge1xuXHRcdFx0bG9jYWxTdG9yYWdlU2VydmljZS5zZXQoXCJ2aWRlb3NMaXN0XCIsIHZpZGVvTGlzdCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2xlYXJTdG9yYWdlICgpIHtcblx0XHRcdGxvY2FsU3RvcmFnZVNlcnZpY2UuY2xlYXJBbGwoKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gYWRkVmlkZW8gKHZpZGVvKSB7XG5cdFx0XHRsZXQgdmlkZW9MaXN0ID0gZ2V0VmlkZW9MaXN0KCk7XG5cdFx0XHRsZXQgbmV3T2JqID0ge1xuXHRcdFx0XHRpZDogdmlkZW8uaWQudmlkZW9JZCxcblx0XHRcdFx0dHlwZTogdmlkZW8uaWQua2luZCxcblx0XHRcdFx0bmFtZTogdmlkZW8uc25pcHBldC50aXRsZSxcblx0XHRcdFx0dGh1bWJuYWlsczogdmlkZW8uc25pcHBldC50aHVtYm5haWxzLFxuXHRcdFx0XHRkZXNjcmlwdGlvbjogdmlkZW8uc25pcHBldC5kZXNjcmlwdGlvbixcblx0XHRcdFx0ZGF0ZUFkZDogbW9tZW50KCkudG9EYXRlKCkuZ2V0VGltZSgpLFxuXHRcdFx0XHRmYXY6IGZhbHNlXG5cdFx0XHR9O1xuXG5cdFx0XHRjb25zb2xlLmxvZyhcInZpZGVvXCIsIG5ld09iaiwgdmlkZW8pO1xuXG5cdFx0XHQvLyBAdG9kbyBwYXNzIHRocnUgY2hlY2tmb3JkdXBlcyBmdW5jXG5cdFx0XHR2aWRlb0xpc3QucHVzaChuZXdPYmopO1xuXHRcdFx0dXBkYXRlVmlkZW9MaXN0KHZpZGVvTGlzdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGdldFZpZGVvTGlzdCxcblx0XHRcdGFkZFZpZGVvLFxuXHRcdFx0Y2xlYXJTdG9yYWdlXG5cdFx0fTtcblx0fTtcblxuXHRhbmd1bGFyLm1vZHVsZShcInN0b3JhZ2VcIilcblx0XHQuZmFjdG9yeShcIlN0b3JhZ2VTZXJ2aWNlXCIsIFN0b3JhZ2VTZXJ2aWNlKTtcbn1cbntcblx0bGV0IHZpZGVvc0NvbXBvbmVudCA9IHtcblx0XHR0ZW1wbGF0ZVVybDogXCIuL2FwcC9jb21wb25lbnRzL3ZpZGVvcy92aWRlb3MuaHRtbFwiLFxuXHRcdGNvbnRyb2xsZXI6IFwiVmlkZW9zQ29udHJvbGxlclwiXG5cdH07XG5cblx0YW5ndWxhci5tb2R1bGUoXCJ2aWRlb3NcIilcblx0XHQuY29tcG9uZW50KFwidmlkZW9zXCIsIHZpZGVvc0NvbXBvbmVudCk7XG59XG57XG5cdGxldCBWaWRlb3NDb250cm9sbGVyID0gZnVuY3Rpb24gKFZpZGVvc1NlcnZpY2UpIHtcblx0XHR0aGlzLmljb24gPSBcImJ1aWxkXCI7XG5cdFx0dGhpcy52aWRlb3NMaXN0ID0gVmlkZW9zU2VydmljZS5nZXRWaWRlb3NMaXN0KCk7XG5cblx0XHRjb25zb2xlLmxvZyh0aGlzLnZpZGVvc0xpc3QpXG5cdH07XG5cblx0YW5ndWxhci5tb2R1bGUoXCJ2aWRlb3NcIilcblx0XHQuY29udHJvbGxlcihcIlZpZGVvc0NvbnRyb2xsZXJcIiwgVmlkZW9zQ29udHJvbGxlcik7XG59XG57XG5cdGFuZ3VsYXIubW9kdWxlKFwiY29tbW9uXCIsIFtcInV0aWxzXCJdKTtcbn1cbntcblx0bGV0IGFwcCA9IHtcblx0XHRiaW5kaW5nczoge1xuXHRcdFx0YXBwQWN0aW9uczogXCI8XCJcblx0XHR9LFxuXHRcdHRlbXBsYXRlVXJsOiBcIi4vYXBwL2NvbW1vbi9hcHAuaHRtbFwiLFxuXHRcdGNvbnRyb2xsZXI6IFwiQXBwQ29udHJvbGxlclwiXG5cdH07XG5cblx0YW5ndWxhci5tb2R1bGUoXCJjb21tb25cIilcblx0XHQuY29tcG9uZW50KFwiYXBwXCIsIGFwcCk7XG59O1xue1xuXHRsZXQgQXBwQ29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgY3RybCA9IHRoaXM7XG5cdFx0Y3RybC5jdXJyZW50UGFuZWwgPSBcInZpZGVvc1BhbmVsXCI7XG5cblx0XHRjdHJsLmFjdGlvbnMgPSB7XG5cdFx0XHRyZWxvYWRWaWRlb3NQYW5lbCAoaW5uZXJDYWxsYmFjaykge1xuXHRcdFx0XHRjdHJsLmN1cnJlbnRQYW5lbCA9IFwiXCI7XG5cdFx0XHRcdGlmKHR5cGVvZiBpbm5lckNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIGlubmVyQ2FsbGJhY2soKTtcblx0XHRcdFx0Y3RybC5jdXJyZW50UGFuZWwgPSBcInZpZGVvc1BhbmVsXCI7XG5cdFx0XHR9LFxuXHRcdFx0dG9nZ2xlUGFuZWxzICgpIHtcblx0XHRcdFx0Y3RybC5jdXJyZW50UGFuZWwgPSBjdHJsLmN1cnJlbnRQYW5lbCA9PT0gXCJzZWFyY2hQYW5lbFwiID8gXCJ2aWRlb3NQYW5lbFwiIDogXCJzZWFyY2hQYW5lbFwiO1xuXHRcdFx0fVxuXHRcdH07XG5cdH07XG5cblx0YW5ndWxhci5tb2R1bGUoXCJjb21tb25cIilcblx0XHQuY29udHJvbGxlcihcIkFwcENvbnRyb2xsZXJcIiwgQXBwQ29udHJvbGxlcik7XG59XG57XG5cdGxldCB0b3BCYXIgPSB7XG5cdFx0YmluZGluZ3M6IHtcblx0XHRcdG9uVG9nZ2xlUGFuZTogXCImXCIsXG5cdFx0XHRhcHBBY3Rpb25zOiBcIjxcIlxuXHRcdH0sXG5cdFx0dGVtcGxhdGVVcmw6IFwiLi9hcHAvY29tbW9uL3RvcEJhci5odG1sXCIsXG5cdFx0Y29udHJvbGxlcjogXCJ0b3BCYXJDb250cm9sbGVyXCJcblx0fTtcblxuXHRhbmd1bGFyLm1vZHVsZShcImNvbW1vblwiKVxuXHRcdC5jb21wb25lbnQoXCJ0b3BCYXJcIiwgdG9wQmFyKTtcbn1cbntcblx0ZnVuY3Rpb24gdG9wQmFyQ29udHJvbGxlciAoVXRpbHNTZXJ2aWNlKSB7XG5cdFx0dGhpcy50b2dnbGVTZWFyY2hQYW5lbCA9ICgpID0+IHRoaXMuYXBwQWN0aW9ucy50b2dnbGVQYW5lbHMoKTtcblxuXHRcdHRoaXMub3Blbk1lbnUgPSBmdW5jdGlvbigkbWRPcGVuTWVudSwgZSkge1xuXHRcdFx0JG1kT3Blbk1lbnUoZSk7XG5cdFx0fTtcblxuXHRcdHRoaXMuY2xlYXJEQiA9ICgpID0+IHtcblx0XHRcdHRoaXMuYXBwQWN0aW9ucy5yZWxvYWRWaWRlb3NQYW5lbCgoKSA9PiB7XG5cdFx0XHRcdFV0aWxzU2VydmljZS5jbGVhclN0b3JhZ2UoKTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdH1cblxuXHRhbmd1bGFyLm1vZHVsZShcImNvbW1vblwiKVxuXHRcdC5jb250cm9sbGVyKFwidG9wQmFyQ29udHJvbGxlclwiLCB0b3BCYXJDb250cm9sbGVyKTtcbn1cbntcblx0YW5ndWxhci5tb2R1bGUoXCJ1dGlsc1wiLCBbXCJzdG9yYWdlXCJdKTtcbn1cbntcblx0bGV0IFV0aWxzU2VydmljZSA9IGZ1bmN0aW9uIChTdG9yYWdlU2VydmljZSkge1xuXHRcdGxldCBjbGVhclN0b3JhZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRTdG9yYWdlU2VydmljZS5jbGVhclN0b3JhZ2UoKTtcblx0XHR9O1xuXHRcdHJldHVybiB7XG5cdFx0XHRjbGVhclN0b3JhZ2Vcblx0XHR9O1xuXHR9O1xuXHRhbmd1bGFyLm1vZHVsZShcInV0aWxzXCIpXG5cdFx0LmZhY3RvcnkoXCJVdGlsc1NlcnZpY2VcIiwgVXRpbHNTZXJ2aWNlKTtcbn0iXX0=
