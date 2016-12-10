(function () {
	function materialThemeConfig ($mdThemingProvider) {
		$mdThemingProvider
			.theme("default")
			.primaryPalette("amber")
			.accentPalette("green")
			.warnPalette("red")
			.backgroundPalette("blue-grey");

		$mdThemingProvider.theme("docs-dark", "default")
			.primaryPalette("amber").dark();
	}

	function materialIconConfig ($mdIconProvider) {
		$mdIconProvider
			.iconSet("social", "img/icons/sets/social-icons.svg", 24)
			.defaultIconSet("img/icons/sets/core-icons.svg", 24);
	}

	angular.module("ngVideoCollector")
		.config(materialThemeConfig)
		.config(materialIconConfig);
}());