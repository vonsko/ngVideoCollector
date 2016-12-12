(function () {
  function materialThemeConfig($mdThemingProvider) {
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

  function materialIconConfig($mdIconProvider) {
    $mdIconProvider
      .defaultFontSet("material-icons");
  }

  angular.module("ngVideoCollector")
    .config(materialThemeConfig)
    .config(materialIconConfig);
}());


// youtube api key [ AIzaSyDjMxSP8blKtpsjZ_C6Yk5Eu-u-bugif3M ]