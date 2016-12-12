(function () {
  function topBarController(UtilsService) {

    this.toggleSearchPanel = () => this.appActions.togglePanels();
    this.openMenu = ($mdOpenMenu, e) => $mdOpenMenu(e);
    this.clearDB = () => this.appActions.reloadVideosPanel(() => UtilsService.clearStorage());
    this.fillTestData = () => this.appActions.reloadVideosPanel(() => UtilsService.fillTestData());
  }

  angular.module("common")
    .controller("topBarController", topBarController);
}());