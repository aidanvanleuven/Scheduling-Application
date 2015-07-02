var myApp = angular.module('myApp', ['ui.router']);
var controllers = {};



myApp.controller(controllers);


myApp.config(function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/landing");
    $urlRouterProvider.when("/admin", "/admin/dashboard");
    $stateProvider
    .state('landing', {
        controller: "" ,
        url: "/landing",
        templateUrl: 'partials/landing.html'
    })
    .state('admin', {
        controller: "NavController",
        url: "/admin",
        templateUrl: 'partials/admin.html'
    })
    .state('admin.dashboard',{
        controller: "DashboardController",
        url: "/dashboard",
        templateUrl: 'partials/admin/dashboard.html'
    })
    .state('admin.masterlist',{
        controller: "ClassCrudController",
        url: "/masterlist",
        templateUrl: 'partials/admin/masterlist.html'
    })
    .state('admin.users',{
        controller: "UserCrudController",
        url: "/users",
        templateUrl: 'partials/admin/users.html'
    })
    .state('app', {
        controller: "",
        url: "/app",
        templateUrl: ''
    });
});