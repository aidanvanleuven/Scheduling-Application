myApp.factory('AppFactory', function(){
    var userId;

    return{

        i: 0,

        storeId: function(response){
            userId = response._id;
            return userId;
        },

        getId: function(){
            return userId;
        }

    };
});

controllers.NewScheduleController = function($scope, $http, AppFactory, $rootScope, $cookies){
    $scope.init = function(){
        $scope.input = {};
        $scope.input.period = 1;
        $scope.lists = AppFactory.lists;
        $scope.tDisabled=true;
        $scope.cDisabled=true;
        $scope.hideDone=true;
        $scope.hideSubmit=false;
        $http.get('/getTeachers').success(function(response){
            $scope.teachers = response;
            $scope.lists = [];
            //$scope.input.trimester = 1;
        });
    };

    $scope.something = function(){
        $scope.tDisabled=false;
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
            var object = {
                period: $scope.input.period,
                teacher: response[0].lastname + ", " + response[0].firstname,
                class: response[0].classname,
                room: response[0].room,
                id: response[0]._id
            };
            $scope.lists[AppFactory.i] = object;
            AppFactory.i++;
            $scope.input.period++;
            if ($scope.lists.length == 6){
                $scope.input.period = "-";
                $scope.hideDone=false;
                $scope.hideSubmit=true;
            }
        });

        $scope.doneClick = function(){
            var teachClassObj = {};
            teachClassObj.teacherclasses = [];
            teachClassObj.userId = [];
            index = 0;
            $scope.lists.forEach(function(entry){
                var obj = {
                    id:entry.id,
                    period:entry.period
                };
                teachClassObj.teacherclasses[index] = obj;
                index++;
            });
            teachClassObj.userId[0] = {
                userId: $cookies.get('userId')
            };
            console.log(teachClassObj);
            $http.post('/submitSchedule', teachClassObj).success(function(response){
                console.log(response);
            });
        };
    };
    $scope.getUser = function(){
        $scope.userToken = AppFactory.getId;
        console.log("Hello!");
    };
};

controllers.ScheduleController = function(){

};