(function () {
  angular.module("storage", [
    "LocalStorageModule"
  ]);

  let localStorageConfig = function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix("ngVideoCollector")
      .setNotify(true, true);
  };
  angular.module("storage")
    .config(localStorageConfig);
}());