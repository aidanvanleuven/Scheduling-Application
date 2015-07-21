controllers.NewScheduleController = function($scope, $http){

    $scope.init = function(){
        $http.get('/getTeachers').success(function(response){
            $scope.teachers = response;
        });

    };
    $scope.init();
};