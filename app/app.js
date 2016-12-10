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
		this.someActions = {
			action1 (what) {
				console.log("what - action1", what)
			},
			action2 (what) {
				console.log("other action")
			}
		};

		console.log("this", this.someActions);
	};

	angular.module("common")
		.controller("AppController", AppController);
}());
(function () {
	let topBar = {
		bindings: {
			onTogglePane: "&",
			actions: "<"
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
		console.log("somea", this);
	}

	angular.module("common")
		.controller("topBarController", topBarController);
}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQyxZQUFZO0NBQ1osUUFBUSxPQUFPLG9CQUFvQjtFQUNsQztFQUNBO0VBQ0E7Ozs7O21EQUdGLENBQUMsWUFBWTtDQUNaLFNBQVMscUJBQXFCLG9CQUFvQjtFQUNqRDtJQUNFLE1BQU07SUFDTixlQUFlO0lBQ2YsY0FBYztJQUNkLFlBQVk7SUFDWixrQkFBa0I7O0VBRXBCLG1CQUFtQixNQUFNLGFBQWE7SUFDcEMsZUFBZSxTQUFTOzs7Q0FHM0IsU0FBUyxvQkFBb0IsaUJBQWlCO0VBQzdDO0lBQ0UsUUFBUSxVQUFVLG1DQUFtQztJQUNyRCxlQUFlLGlDQUFpQzs7O0NBR25ELFFBQVEsT0FBTztHQUNiLE9BQU87R0FDUCxPQUFPOztBQUVWLENBQUMsWUFBWTtDQUNaLFFBQVEsT0FBTyxjQUFjOztBQUU5QixDQUFDLFlBQVk7Q0FDWixRQUFRLE9BQU8sVUFBVTs7QUFFMUIsQ0FBQyxZQUFZO0NBQ1osSUFBSSxNQUFNO0VBQ1QsYUFBYTtFQUNiLFlBQVk7OztDQUdiLFFBQVEsT0FBTztHQUNiLFVBQVUsT0FBTzs7QUFFcEIsQ0FBQyxZQUFZO0NBQ1osSUFBSSxnQkFBZ0IsWUFBWTtFQUMvQixLQUFLLGNBQWM7RUFDbkIsS0FBSyxhQUFhOzs7RUFHbEIsS0FBSyxjQUFjO0dBQ2xCLFFBQVEsQ0FBQyxNQUFNO0lBQ2QsUUFBUSxJQUFJLGtCQUFrQjs7R0FFL0IsUUFBUSxDQUFDLE1BQU07SUFDZCxRQUFRLElBQUk7Ozs7RUFJZCxRQUFRLElBQUksUUFBUSxLQUFLOzs7Q0FHMUIsUUFBUSxPQUFPO0dBQ2IsV0FBVyxpQkFBaUI7O0FBRS9CLENBQUMsWUFBWTtDQUNaLElBQUksU0FBUztFQUNaLFVBQVU7R0FDVCxjQUFjO0dBQ2QsU0FBUzs7RUFFVixTQUFTO0dBQ1IsS0FBSzs7RUFFTixhQUFhO0VBQ2IsWUFBWTs7O0NBR2IsUUFBUSxPQUFPO0dBQ2IsVUFBVSxVQUFVOztBQUV2QixDQUFDLFlBQVk7Q0FDWixTQUFTLG9CQUFvQjtFQUM1QixLQUFLLG1CQUFtQjtFQUN4QixRQUFRLElBQUksU0FBUzs7O0NBR3RCLFFBQVEsT0FBTztHQUNiLFdBQVcsb0JBQW9CO0tBQzdCIiwiZmlsZSI6ImFwcC9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuXHRhbmd1bGFyLm1vZHVsZShcIm5nVmlkZW9Db2xsZWN0b3JcIiwgW1xuXHRcdFwibmdNYXRlcmlhbFwiLFxuXHRcdFwiY29tcG9uZW50c1wiLFxuXHRcdFwiY29tbW9uXCJcblx0XSk7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gbWF0ZXJpYWxUaGVtZUNvbmZpZyAoJG1kVGhlbWluZ1Byb3ZpZGVyKSB7XG5cdFx0JG1kVGhlbWluZ1Byb3ZpZGVyXG5cdFx0XHQudGhlbWUoXCJkZWZhdWx0XCIpXG5cdFx0XHQucHJpbWFyeVBhbGV0dGUoXCJhbWJlclwiKVxuXHRcdFx0LmFjY2VudFBhbGV0dGUoXCJncmVlblwiKVxuXHRcdFx0Lndhcm5QYWxldHRlKFwicmVkXCIpXG5cdFx0XHQuYmFja2dyb3VuZFBhbGV0dGUoXCJibHVlLWdyZXlcIik7XG5cblx0XHQkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoXCJkb2NzLWRhcmtcIiwgXCJkZWZhdWx0XCIpXG5cdFx0XHQucHJpbWFyeVBhbGV0dGUoXCJhbWJlclwiKS5kYXJrKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBtYXRlcmlhbEljb25Db25maWcgKCRtZEljb25Qcm92aWRlcikge1xuXHRcdCRtZEljb25Qcm92aWRlclxuXHRcdFx0Lmljb25TZXQoXCJzb2NpYWxcIiwgXCJpbWcvaWNvbnMvc2V0cy9zb2NpYWwtaWNvbnMuc3ZnXCIsIDI0KVxuXHRcdFx0LmRlZmF1bHRJY29uU2V0KFwiaW1nL2ljb25zL3NldHMvY29yZS1pY29ucy5zdmdcIiwgMjQpO1xuXHR9XG5cblx0YW5ndWxhci5tb2R1bGUoXCJuZ1ZpZGVvQ29sbGVjdG9yXCIpXG5cdFx0LmNvbmZpZyhtYXRlcmlhbFRoZW1lQ29uZmlnKVxuXHRcdC5jb25maWcobWF0ZXJpYWxJY29uQ29uZmlnKTtcbn0oKSk7XG4oZnVuY3Rpb24gKCkge1xuXHRhbmd1bGFyLm1vZHVsZShcImNvbXBvbmVudHNcIiwgW10pO1xufSgpKTtcbihmdW5jdGlvbiAoKSB7XG5cdGFuZ3VsYXIubW9kdWxlKFwiY29tbW9uXCIsIFtdKTtcbn0oKSk7XG4oZnVuY3Rpb24gKCkge1xuXHRsZXQgYXBwID0ge1xuXHRcdHRlbXBsYXRlVXJsOiBcIi4vYXBwL2NvbW1vbi9hcHAuaHRtbFwiLFxuXHRcdGNvbnRyb2xsZXI6IFwiQXBwQ29udHJvbGxlclwiXG5cdH07XG5cblx0YW5ndWxhci5tb2R1bGUoXCJjb21tb25cIilcblx0XHQuY29tcG9uZW50KFwiYXBwXCIsIGFwcCk7XG59KCkpO1xuKGZ1bmN0aW9uICgpIHtcblx0bGV0IEFwcENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5jdXJyZW50UGFuZSA9IFwiXCI7XG5cdFx0dGhpcy50b2dnbGVQYW5lID0gKHRhcmdldCkgID0+IHtcblx0XHRcdHRoaXMuY3VycmVudFBhbmUgPSB0YXJnZXQgPT09IHRoaXMuY3VycmVudFBhbmUgPyBcIlwiIDogdGFyZ2V0O1xuXHRcdH07XG5cdFx0dGhpcy5zb21lQWN0aW9ucyA9IHtcblx0XHRcdGFjdGlvbjEgKHdoYXQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJ3aGF0IC0gYWN0aW9uMVwiLCB3aGF0KVxuXHRcdFx0fSxcblx0XHRcdGFjdGlvbjIgKHdoYXQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJvdGhlciBhY3Rpb25cIilcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Y29uc29sZS5sb2coXCJ0aGlzXCIsIHRoaXMuc29tZUFjdGlvbnMpO1xuXHR9O1xuXG5cdGFuZ3VsYXIubW9kdWxlKFwiY29tbW9uXCIpXG5cdFx0LmNvbnRyb2xsZXIoXCJBcHBDb250cm9sbGVyXCIsIEFwcENvbnRyb2xsZXIpO1xufSgpKTtcbihmdW5jdGlvbiAoKSB7XG5cdGxldCB0b3BCYXIgPSB7XG5cdFx0YmluZGluZ3M6IHtcblx0XHRcdG9uVG9nZ2xlUGFuZTogXCImXCIsXG5cdFx0XHRhY3Rpb25zOiBcIjxcIlxuXHRcdH0sXG5cdFx0cmVxdWlyZToge1xuXHRcdFx0YXBwOiBcIl5hcHBcIlxuXHRcdH0sXG5cdFx0dGVtcGxhdGVVcmw6IFwiLi9hcHAvY29tbW9uL3RvcEJhci5odG1sXCIsXG5cdFx0Y29udHJvbGxlcjogXCJ0b3BCYXJDb250cm9sbGVyXCJcblx0fTtcblxuXHRhbmd1bGFyLm1vZHVsZShcImNvbW1vblwiKVxuXHRcdC5jb21wb25lbnQoXCJ0b3BCYXJcIiwgdG9wQmFyKTtcbn0oKSk7XG4oZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiB0b3BCYXJDb250cm9sbGVyICgpIHtcblx0XHR0aGlzLnRvZ2dsZVNlYXJjaFBhbmUgPSAoKSA9PiB0aGlzLmFwcC50b2dnbGVQYW5lKFwic2VhcmNoUGFuZVwiKTtcblx0XHRjb25zb2xlLmxvZyhcInNvbWVhXCIsIHRoaXMpO1xuXHR9XG5cblx0YW5ndWxhci5tb2R1bGUoXCJjb21tb25cIilcblx0XHQuY29udHJvbGxlcihcInRvcEJhckNvbnRyb2xsZXJcIiwgdG9wQmFyQ29udHJvbGxlcik7XG59KCkpOyJdfQ==
