controllers.AuthController = function($scope, $http, $location, $cookies){
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
            if (response === null){
                $scope.error = "Incorrect username or password.";
            }
            else {
                if (response.admin === false){
                    $cookies.put('userId', response._id);
                    $location.path('/app');
                }
                if (response.admin === true){
                    $cookies.put('userId', response._id);
                    $location.path('/admin');
                }
            }
        });
    };

    $scope.submitRegister = function(){
        $http.post('/register' , $scope.input).success(function(response){
            console.log(response);
            $cookies.put('userId', response._id);
            $location.path('/app');
        });
    };
};