(function () {
  let searchComponent = {
    templateUrl: "./app/components/search/search.html",
    controller: "SearchController"
  };

  angular.module("search")
    .component("searchPanel", searchComponent);
}());