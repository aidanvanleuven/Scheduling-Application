controllers.AuthController = function($scope){
    $scope.loginClick = function(){
        $scope.showRegister = false;
        $scope.showLogin = true;
    };

    $scope.registerClick = function(){
        $scope.showRegister = true;
        $scope.showLogin = false;
    };
};