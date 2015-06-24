var myApp = angular.module('myApp', ['ngRoute']);
var controllers = {};

controllers.NavController = function ($scope, $location){
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.url();
    };
};

controllers.UserCrudController = function($scope, $http) {
    $scope.refresh = function(){
        $http.get('/users').success(function(response){
            $scope.users = response;
            $scope.user.username = "";
            $scope.user.firstname = "";
            $scope.user.password = "";
            state = "";
            $scope.hideForm = true;
            $scope.selected = null;
            //$scope.user = "";
        });
    };

    $scope.refresh();

    var state = "";
    $scope.hideForm = true;

    $scope.rowClick = function(index, id){
        $scope.user._id = id;
        $scope.selected = 0;
        $scope.selected = index;
        $scope.user.username = $scope.users[index].username;
        $scope.user.firstname = $scope.users[index].firstname;
        $scope.user.password = $scope.users[index].password;
        $scope.user.admin = $scope.users[index].admin;
        $scope.hideForm = false;
        state = "edit";
    };

    $scope.newClick = function(){
        $scope.hideForm = false;
        $scope.user = "";
        state = "new";
        $scope.selected = null;
    };

    $scope.saveClick = function() {
        console.log(state);
        if ($scope.user.admin !== true || false){
            $scope.user.admin = false;
        }

        if (state == "new"){
                $http.post('/users', $scope.user).success(function(response){
                $scope.refresh();
            });
        }

        if (state == "edit"){
                $http.put('/users' , $scope.user).success(function(response){
                $scope.refresh();
            });
        }
    };

    $scope.removeUser = function(id, $event){
        $event.preventDefault();
        $event.stopPropagation();
        $http.delete('/users/' + id).success(function(response){
            $scope.refresh();
        });
    };

};

controllers.ClassCrudController = function($scope, $http){

    $scope.refresh = function(){
        $http.get('/classes').success(function(response){
            $scope.classes = response;
            console.log($scope.classes);
            /*$scope.class.username = "";
            $scope.class.firstname = "";
            $scope.class.password = "";*/
            state = "";
            $scope.hideForm = true;
            $scope.selected = null;
            //$scope.user = "";
        });
    };

    $scope.refresh();

    var state = "";
    $scope.hideForm = true;

    $scope.rowClick = function(index, id){
        $scope.user._id = id;
        $scope.selected = 0;
        $scope.selected = index;
        $scope.user.username = $scope.users[index].username;
        $scope.user.firstname = $scope.users[index].firstname;
        $scope.user.password = $scope.users[index].password;
        $scope.user.admin = $scope.users[index].admin;
        $scope.hideForm = false;
        state = "edit";
    };

    $scope.newClick = function(){
        $scope.hideForm = false;
        $scope.user = "";
        state = "new";
        $scope.selected = null;
    };

    $scope.saveClick = function() {
        console.log(state);
        if ($scope.user.admin !== true || false){
            $scope.user.admin = false;
        }

        if (state == "new"){
                $http.post('/classes', $scope.user).success(function(response){
                $scope.refresh();
            });
        }

        if (state == "edit"){
                $http.put('/classes' , $scope.user).success(function(response){
                $scope.refresh();
            });
        }
    };

    $scope.removeUser = function(id, $event){
        $event.preventDefault();
        $event.stopPropagation();
        $http.delete('/classes/' + id).success(function(response){
            $scope.refresh();
        });
    };

};

myApp.controller(controllers);

myApp.config(function ($routeProvider){
    $routeProvider
    .when('/dashboard', {
        controller: '' ,
        templateUrl: 'partials/dashboard.html'
    })
    .when('/masterlist', {
        controller: 'ClassCrudController',
        templateUrl: 'partials/masterlist.html'
    })
    .when('/users', {
        controller: 'UserCrudController',
        templateUrl: 'partials/users.html'
    })
    .otherwise({
        redirectTo: 'dashboard'
    });
});