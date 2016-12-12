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

  angular.module("search")
    .factory("SearchService", SearchService);
}());