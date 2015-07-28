myApp.factory('factory', ['$http', '$q', function($http, $q){
    return{
        users: function(){
            return $http.get('/users');
        },
        data: function(){
            return $http.get('/masterlist');
        },
        dashUsers: function(){
            return $http.get('/data/users/');
        },
        dashEntries: function(){
            return $http.get('/data/entries');
        }
    };
}]);


controllers.NavController = function ($scope, $location, $cookies){
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.url();
    };

    $scope.logOutClick = function(){
        $cookies.remove('userId');
        $location.path('/landing');
    };
};

controllers.UserCrudController = function($scope, $http, factory) {
    $scope.refresh = function(){
            factory.users().success(function(response){
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

controllers.ClassCrudController = function($scope, $http, factory){

    $scope.refresh = function(){
        factory.data().success(function(response){
            $scope.classes = response;
            //console.log($scope.classes);
            /*$scope.class.username = "";
            $scope.class.firstname = "";
            $scope.class.password = "";*/
            state = "";
            $scope.hideForm = true;
            $scope.selected = null;
            //$scope.user = "";
            if($(window).width() <764){
                $scope.desktop = false;
            }
            else {
                $scope.desktop = true;
            }
        });
    };

    $scope.refresh();

    var state = "";
    $scope.hideForm = true;

    $scope.rowClick = function(index, id){
        $scope.class._id = id;
        //console.log($scope.class);
        $scope.selected = 0;
        $scope.selected = index;
        $scope.class.firstname = $scope.classes[index].firstname;
        $scope.class.lastname = $scope.classes[index].lastname;
        $scope.class.classname = $scope.classes[index].classname;
        $scope.class.trimester = $scope.classes[index].trimester;
        $scope.class.room = $scope.classes[index].room;
        $scope.hideForm = false;
        state = "edit";
    };

    $scope.newClick = function(){
        $scope.hideForm = false;
        $scope.class = "";
        state = "new";
        $scope.selected = null;
    };

    $scope.saveClick = function() {
        console.log(state);

        if (state == "new"){
            if ($scope.class.trimester == "4"){
                $scope.class.trimester = 1;
                $http.post('/masterlist', $scope.class).success(function(){
                    $scope.class.trimester = 2;
                    $http.post('/masterlist', $scope.class).success(function(){
                        $scope.class.trimester = 3;
                        $http.post('/masterlist', $scope.class).success(function(){
                            $scope.refresh();
                        });
                    });
                });

                $scope.refresh();
            } else
                $http.post('/masterlist', $scope.class).success(function(response){
                $scope.refresh();
            });
        }

        if (state == "edit"){
                $http.put('/masterlist' , $scope.class).success(function(response){
                $scope.refresh();
            });
        }
    };

    $scope.removeUser = function(id, $event){
        $event.preventDefault();
        $event.stopPropagation();
        $http.delete('/masterlist/' + id).success(function(response){
            $scope.refresh();
        });
    };

};

controllers.DashboardController = function($http, $scope, factory){
    var init = function(){

         factory.dashUsers().success(function(response){
            $scope.users = response;
        });

       factory.dashEntries().success(function(response){
            $scope.data = response;
         });
    };

    init();
};