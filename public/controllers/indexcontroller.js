var myApp = angular.module('myApp', ['ui.router', 'ngCookies']);
var controllers = {};



myApp.controller(controllers);

/*myApp.factory('AuthService', ['$q', '$http', '$location', function($q, $http, $location){
    var identity;
    var authenticated = false;
    var credentials = {};
    return{
        isIdentityResolved: function(){
            return angular.isDefined(identity);
        },
        isAuthenticated: function(){
            return authenticated;
        },
        isInRole: function(role){
            if (!authenticated || !identity.roles) return false;

            return identity.roles.indexOf(role) != -1;
        },
        isInAnyRole: function(roles){
            if (authenticated || !identity.roles) return false;

            for (var i = 0; i< roles.length; i++){
                if (this.isInRole(roles[i])) return true;
            }

            return false;
        },
        authenticate: function(identity){
            identity = identity;
            authenticated = identity !== null;
        },
        identity: function(force){
            var deferred = $q.defer();
            if (force ===true) identity = undefined;

            if (angular.isDefined(identity)){
                deferred.resolve(identity);
                return deferred.promise;
            }

            $http.post('/login', credentials).success(function(response){
                identity = response;
                authenticated = true;
                deferred.resolve(identity);
            }).error(function(){
                identity = null;
                authenticated = false;
                deferred.resolve(identity);
                console.log("failure");
            });

            return deferred.promise;
        },
        getData: function(login){
            credentials = login;
            return credentials;
        }

    };

}]);

myApp.factory('AuthFactory', ['$rootScope', '$state', 'AuthService', '$location', function($rootScope, $state, AuthService, $location){
    return{
        authorize: function(){
            return AuthService.identity().then(function(){
                var isAuthenticated = AuthService.isAuthenticated();

                if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !AuthService.isInAnyRole($rootScope.toState.data.roles)) {
                    if (isAuthenticated) alert("Access Denied");
                    else {
                        $rootScope.returnToState = $rootScope.toState;
                        $rootScope.returnToStateParams = $rootScope.toStateParams;
                        $location.path('/app');
                    }
                }
            });
        }
    };
}]);

myApp.run(['$rootScope', '$state', '$stateParams', 'AuthService', 'AuthFactory', function($rootScope, $state, $stateParams, AuthService, AuthFactory){
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams){
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
        if (AuthService.isIdentityResolved()) AuthFactory.authorize();
    });
}]);*/

myApp.config(function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/landing");
    $urlRouterProvider.when("/admin", "/admin/dashboard");
    $urlRouterProvider.when("/app", "/app/new");
    $stateProvider
    .state('landing', {
        controller: "AuthController" ,
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
        templateUrl: 'partials/app.html',

    })
    .state('app.new',{
        controller: "NewScheduleController",
        url: "/new",
        templateUrl:'partials/app/newschedule.html'
    })
    .state('app.schedules',{
        controller: "ScheduleController",
        url: "/schedules",
        templateUrl:'partials/app/schedules.html'
    });
});