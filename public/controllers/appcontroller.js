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

controllers.NewScheduleController = function($scope, $http, AppFactory, $cookies, $location){
    $scope.init = function(){
        $scope.lists = [{period:1},{period:2},{period:3},{period:4},{period:5},{period:6}];
        console.log($scope.lists);
        $scope.tDisabled=true;
        $scope.cDisabled=true;
        $scope.hideDone=true;
        $scope.hideSubmit=false;
        $http.get('/getTeachers').success(function(response){
            $scope.teachers = response;
        });
    };

    $scope.trimesterChange = function(){
        $scope.tDisabled=false;
        $scope.input = {};
        $scope.hideDone = true;
        $scope.hideSubmit = false;
        $scope.input.period = 1;
        $scope.input.teacher = "";
        $scope.input.class = "";
        $scope.index = 0;
        $scope.input.trimester = parseInt($scope.trimester, 10);
    };

    $scope.init();

    $scope.teacherClicked = function(){
        $http.post('getClasses', $scope.input).success(function(response){
            $scope.classes = response;
            $scope.cDisabled=false;

        });

    };
    $scope.submitClick = function(){
        $http.post('/getEntry', $scope.input).success(function(response){
            var object = {
                period: $scope.input.period,
                teacher: response[0].lastname + ", " + response[0].firstname,
                class: response[0].classname,
                id: response[0]._id,
                room:response[0].room,
                firstname: response[0].firstname,
                lastname: response[0].lastname,
                trimester: response[0].trimester
            };
            $scope.lists[$scope.index] = object;
            $scope.index++;
            $scope.input.period++;
            if ($scope.input.period == 7){
                $scope.input.period = "-";
                $scope.hideDone=false;
                $scope.hideSubmit=true;
                $scope.doneClick();
            }
            $scope.input.teacher = "";
            $scope.input.class = "";
        });

        $scope.doneClick = function(){
            var teachClassObj = {};
            teachClassObj.teacherclasses = [];
            teachClassObj.userId = [];
            index = 0;
            $scope.lists.forEach(function(entry){
                var obj = {
                    id:entry.id,
                    period:entry.period,
                    firstname: entry.firstname,
                    lastname: entry.lastname,
                    room: entry.room,
                    class:entry.class,
                    trimester: entry.trimester
                };
                teachClassObj.teacherclasses[index] = obj;
                index++;
            });
            teachClassObj.userId[0] = {
                userId: $cookies.get('userId')
            };
            console.log(teachClassObj);
            $http.post('/submitSchedule', teachClassObj).success(function(response){

            });

            $location.path('/app/schedules');
        };
    };
};

controllers.ScheduleController = function($scope, $http, $cookies){
    $scope.init = function(){
        $scope.showTable=false;
        var user = {};
        user = {id: $cookies.get('userId')};
        $http.post('/getTrimesters', user).success(function(response){
            console.log(response);
            $scope.schedules = response;

            if ($scope.schedules.length !== 0){
                $http.post('/getSchedules', user).success(function(response){
                    $scope.allSchedules = response;
                });
            }
            else{
                $scope.error = "Create a new schedule to get started!";
            }

        });
    };

    $scope.init();

    $scope.trimesterClicked = function(trimester){
        $scope.selectedTri = trimester;
        $scope.showTable=true;
        list = [];
        var i =0;
        $.each($scope.allSchedules, function(index, value){
            if (value.trimester == $scope.selectedTri){
                list[i] = {
                    teacher: value.lastname + ", " + value.firstname,
                    class: value.class,
                    period:value.period,
                    room:value.room
                };
                i++;
                return true;
            }
        });
        $scope.lists = list;
    };

    $scope.deleteClick = function(){
        var userTriObj = {};
        userTriObj.user = $cookies.get('userId');
        userTriObj.trimester = $scope.selectedTri;

        $http.post('deleteSchedule', userTriObj).success(function(response){
            $scope.init();
        });
    };
};