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
  angular.module("utils")
    .factory("UtilsService", UtilsService);
}());