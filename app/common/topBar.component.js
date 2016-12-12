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