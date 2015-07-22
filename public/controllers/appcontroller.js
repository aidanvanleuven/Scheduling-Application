myApp.factory('AppFactory', function(){
    return{
        i: 0,
    };
});

controllers.NewScheduleController = function($scope, $http, AppFactory, $rootScope){
    $scope.init = function(){
        $scope.lists = AppFactory.lists;
        $scope.tDisabled=true;
        $scope.cDisabled=true;
        $scope.hideDone=true;
        $http.get('/getTeachers').success(function(response){
            $scope.tDisabled=false;
            $scope.teachers = response;
            $scope.input = {};
            $scope.lists = [];
            $scope.input.trimester = 1;
        });

    };

    $scope.init();

    $scope.teacherClicked = function(){
        $http.post('getClasses', $scope.input).success(function(response){
            $scope.classes = response;
            $scope.cDisabled=false;

        });

    };
    $scope.lists = [];
    $scope.submitClick = function(){
        $http.post('/getEntry', $scope.input).success(function(response){
            console.log(response);
            var object = {
                period: $scope.input.period,
                teacher: response[0].lastname + ", " + response[0].firstname,
                class: response[0].classname,
                room: response[0].room,
                id: response[0]._id
            };
            $scope.lists[AppFactory.i] = object;
            AppFactory.i++;
            if ($scope.lists.length == 6){
                $scope.hideDone=false;
            }
        });
    };
};