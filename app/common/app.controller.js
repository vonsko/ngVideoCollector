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