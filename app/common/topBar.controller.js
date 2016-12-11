{
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