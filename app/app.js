(function () {
	angular.module("ngVideoCollector", [
		"ngMaterial",
		"components",
		"common"
	]);
}());
(function () {
	materialThemeConfig.$inject = ["$mdThemingProvider"];
	materialIconConfig.$inject = ["$mdIconProvider"];
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
(function () {
	angular.module("components", []);
}());
(function () {
	angular.module("common", []);
}());
(function () {
	let app = {
		templateUrl: "./app/common/app.html",
		controller: "AppController"
	};

	angular.module("common")
		.component("app", app);
}());
(function () {
	let AppController = function () {
		this.currentPane = "";
		this.togglePane = (target)  => {
			this.currentPane = target === this.currentPane ? "" : target;
		};
	};

	angular.module("common")
		.controller("AppController", AppController);
}());
(function () {
	let topBar = {
		bindings: {
			onTogglePane: "&"
		},
		require: {
			app: "^app"
		},
		templateUrl: "./app/common/topBar.html",
		controller: "topBarController"
	};

	angular.module("common")
		.component("topBar", topBar);
}());
(function () {
	function topBarController () {
		this.toggleSearchPane = () => this.app.togglePane("searchPane");
	}

	angular.module("common")
		.controller("topBarController", topBarController);
}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQyxZQUFZO0NBQ1osUUFBUSxPQUFPLG9CQUFvQjtFQUNsQztFQUNBO0VBQ0E7Ozs7O21EQUdGLENBQUMsWUFBWTtDQUNaLFNBQVMscUJBQXFCLG9CQUFvQjtFQUNqRDtJQUNFLE1BQU07SUFDTixlQUFlO0lBQ2YsY0FBYztJQUNkLFlBQVk7SUFDWixrQkFBa0I7O0VBRXBCLG1CQUFtQixNQUFNLGFBQWE7SUFDcEMsZUFBZSxTQUFTOzs7Q0FHM0IsU0FBUyxvQkFBb0IsaUJBQWlCO0VBQzdDO0lBQ0UsUUFBUSxVQUFVLG1DQUFtQztJQUNyRCxlQUFlLGlDQUFpQzs7O0NBR25ELFFBQVEsT0FBTztHQUNiLE9BQU87R0FDUCxPQUFPOztBQUVWLENBQUMsWUFBWTtDQUNaLFFBQVEsT0FBTyxjQUFjOztBQUU5QixDQUFDLFlBQVk7Q0FDWixRQUFRLE9BQU8sVUFBVTs7QUFFMUIsQ0FBQyxZQUFZO0NBQ1osSUFBSSxNQUFNO0VBQ1QsYUFBYTtFQUNiLFlBQVk7OztDQUdiLFFBQVEsT0FBTztHQUNiLFVBQVUsT0FBTzs7QUFFcEIsQ0FBQyxZQUFZO0NBQ1osSUFBSSxnQkFBZ0IsWUFBWTtFQUMvQixLQUFLLGNBQWM7RUFDbkIsS0FBSyxhQUFhOzs7OztDQUtuQixRQUFRLE9BQU87R0FDYixXQUFXLGlCQUFpQjs7QUFFL0IsQ0FBQyxZQUFZO0NBQ1osSUFBSSxTQUFTO0VBQ1osVUFBVTtHQUNULGNBQWM7O0VBRWYsU0FBUztHQUNSLEtBQUs7O0VBRU4sYUFBYTtFQUNiLFlBQVk7OztDQUdiLFFBQVEsT0FBTztHQUNiLFVBQVUsVUFBVTs7QUFFdkIsQ0FBQyxZQUFZO0NBQ1osU0FBUyxvQkFBb0I7RUFDNUIsS0FBSyxtQkFBbUI7OztDQUd6QixRQUFRLE9BQU87R0FDYixXQUFXLG9CQUFvQjtLQUM3QiIsImZpbGUiOiJhcHAvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcblx0YW5ndWxhci5tb2R1bGUoXCJuZ1ZpZGVvQ29sbGVjdG9yXCIsIFtcblx0XHRcIm5nTWF0ZXJpYWxcIixcblx0XHRcImNvbXBvbmVudHNcIixcblx0XHRcImNvbW1vblwiXG5cdF0pO1xufSgpKTtcbihmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIG1hdGVyaWFsVGhlbWVDb25maWcgKCRtZFRoZW1pbmdQcm92aWRlcikge1xuXHRcdCRtZFRoZW1pbmdQcm92aWRlclxuXHRcdFx0LnRoZW1lKFwiZGVmYXVsdFwiKVxuXHRcdFx0LnByaW1hcnlQYWxldHRlKFwiYW1iZXJcIilcblx0XHRcdC5hY2NlbnRQYWxldHRlKFwiZ3JlZW5cIilcblx0XHRcdC53YXJuUGFsZXR0ZShcInJlZFwiKVxuXHRcdFx0LmJhY2tncm91bmRQYWxldHRlKFwiYmx1ZS1ncmV5XCIpO1xuXG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKFwiZG9jcy1kYXJrXCIsIFwiZGVmYXVsdFwiKVxuXHRcdFx0LnByaW1hcnlQYWxldHRlKFwiYW1iZXJcIikuZGFyaygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbWF0ZXJpYWxJY29uQ29uZmlnICgkbWRJY29uUHJvdmlkZXIpIHtcblx0XHQkbWRJY29uUHJvdmlkZXJcblx0XHRcdC5pY29uU2V0KFwic29jaWFsXCIsIFwiaW1nL2ljb25zL3NldHMvc29jaWFsLWljb25zLnN2Z1wiLCAyNClcblx0XHRcdC5kZWZhdWx0SWNvblNldChcImltZy9pY29ucy9zZXRzL2NvcmUtaWNvbnMuc3ZnXCIsIDI0KTtcblx0fVxuXG5cdGFuZ3VsYXIubW9kdWxlKFwibmdWaWRlb0NvbGxlY3RvclwiKVxuXHRcdC5jb25maWcobWF0ZXJpYWxUaGVtZUNvbmZpZylcblx0XHQuY29uZmlnKG1hdGVyaWFsSWNvbkNvbmZpZyk7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcblx0YW5ndWxhci5tb2R1bGUoXCJjb21wb25lbnRzXCIsIFtdKTtcbn0oKSk7XG4oZnVuY3Rpb24gKCkge1xuXHRhbmd1bGFyLm1vZHVsZShcImNvbW1vblwiLCBbXSk7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcblx0bGV0IGFwcCA9IHtcblx0XHR0ZW1wbGF0ZVVybDogXCIuL2FwcC9jb21tb24vYXBwLmh0bWxcIixcblx0XHRjb250cm9sbGVyOiBcIkFwcENvbnRyb2xsZXJcIlxuXHR9O1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiY29tbW9uXCIpXG5cdFx0LmNvbXBvbmVudChcImFwcFwiLCBhcHApO1xufSgpKTtcbihmdW5jdGlvbiAoKSB7XG5cdGxldCBBcHBDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuY3VycmVudFBhbmUgPSBcIlwiO1xuXHRcdHRoaXMudG9nZ2xlUGFuZSA9ICh0YXJnZXQpICA9PiB7XG5cdFx0XHR0aGlzLmN1cnJlbnRQYW5lID0gdGFyZ2V0ID09PSB0aGlzLmN1cnJlbnRQYW5lID8gXCJcIiA6IHRhcmdldDtcblx0XHR9O1xuXHR9O1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiY29tbW9uXCIpXG5cdFx0LmNvbnRyb2xsZXIoXCJBcHBDb250cm9sbGVyXCIsIEFwcENvbnRyb2xsZXIpO1xufSgpKTtcbihmdW5jdGlvbiAoKSB7XG5cdGxldCB0b3BCYXIgPSB7XG5cdFx0YmluZGluZ3M6IHtcblx0XHRcdG9uVG9nZ2xlUGFuZTogXCImXCJcblx0XHR9LFxuXHRcdHJlcXVpcmU6IHtcblx0XHRcdGFwcDogXCJeYXBwXCJcblx0XHR9LFxuXHRcdHRlbXBsYXRlVXJsOiBcIi4vYXBwL2NvbW1vbi90b3BCYXIuaHRtbFwiLFxuXHRcdGNvbnRyb2xsZXI6IFwidG9wQmFyQ29udHJvbGxlclwiXG5cdH07XG5cblx0YW5ndWxhci5tb2R1bGUoXCJjb21tb25cIilcblx0XHQuY29tcG9uZW50KFwidG9wQmFyXCIsIHRvcEJhcik7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gdG9wQmFyQ29udHJvbGxlciAoKSB7XG5cdFx0dGhpcy50b2dnbGVTZWFyY2hQYW5lID0gKCkgPT4gdGhpcy5hcHAudG9nZ2xlUGFuZShcInNlYXJjaFBhbmVcIik7XG5cdH1cblxuXHRhbmd1bGFyLm1vZHVsZShcImNvbW1vblwiKVxuXHRcdC5jb250cm9sbGVyKFwidG9wQmFyQ29udHJvbGxlclwiLCB0b3BCYXJDb250cm9sbGVyKTtcbn0oKSk7Il19
