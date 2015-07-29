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

controllers.NewScheduleController = function($scope, $http, AppFactory, $cookies){
    $scope.init = function(){
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

    $scope.trimesterChange = function(){
        $scope.tDisabled=false;
        $scope.input = {};
        $scope.lists = [];
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
    $scope.lists = [];
    $scope.submitClick = function(){
        $http.post('/getEntry', $scope.input).success(function(response){
            console.log(response);
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
            if ($scope.lists.length == 6){
                $scope.input.period = "-";
                $scope.hideDone=false;
                $scope.hideSubmit=true;
            }
            $scope.input.teacher = "";
            $scope.input.class = "";
            console.log($scope.lists);
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
                console.log(response);

            });
        };
    };
    $scope.getUser = function(){
        $scope.userToken = AppFactory.getId;
        console.log("Hello!");
    };
};

controllers.ScheduleController = function($scope, $http, $cookies){
    $scope.init = function(){
        var user = {};
        user = {id: $cookies.get('userId')};
        console.log(user);
        $http.post('/getSchedules', user).success(function(response){
            $scope.schedules = response;
        });
    };

    $scope.init();
};