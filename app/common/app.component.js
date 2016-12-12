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
