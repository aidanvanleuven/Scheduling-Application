controllers.AuthController = function($scope, $http, $location, AppFactory){
    $scope.login = {};

    $scope.loginClick = function(){
        $scope.showRegister = false;
        $scope.showLogin = true;
    };

    $scope.registerClick = function(){
        $scope.showRegister = true;
        $scope.showLogin = false;
    };

    $scope.submitLogin = function(){
        $http.post('/login', $scope.login).success(function(response){
            console.log(response);
            if (response === null){
                $scope.error = "Incorrect username or password.";
            }
            else {
                AppFactory.storeId(response._id);
                if (response.admin === false){
                    $location.path('/app');
                }
                if (response.admin === true){
                    $location.path('/admin');
                }
            }
        });
    };

    $scope.submitRegister = function(){
        $http.post('/register' , $scope.input).success(function(response){
            console.log(response);
            //AppFactory.storeId(response);
            $location.path('/app');
        });
    };
};