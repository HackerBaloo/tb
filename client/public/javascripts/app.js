const route = '/api/v1/users';

function getUsers($scope, $http){
    $http.get(route)
        .success((users) => {
            $scope.usersData = users;
            $scope.formData.DisableUpdate = true;
            $scope.formData.DisableCreate = false;
            console.log(users);
        })
        .error((error) => {
            console.log('Error: ' + error);
        });
}

angular.module('nodeUsers', [])
    .controller('mainController', ($scope, $http) => {
        $scope.formData = {};
        $scope.usersData = {};
        $scope.filtered = false
        // Get all users
        getUsers($scope, $http);
        // Create a new user
        $scope.createUser = () => {
            $http.post(route, $scope.formData)
                .success((data) => {
                    $scope.formData = {};
                    $scope.formData.DisableUpdate = true;
                    $scope.formData.DisableCreate = false;
                    $scope.usersData = data;
                    console.log(data);
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
        // Update a user
        $scope.updateUser = (userId) => {
            console.log('Updating Userid:' + userId)
            console.log('Updating User:' + $scope.formData.name)
            $http.put(route + '/' + userId, $scope.formData)
                .success((data) => {
                    $scope.formData = {};
                    $scope.formData.DisableUpdate = true;
                    $scope.formData.DisableCreate = false;
                    $scope.usersData = data;
                    console.log(data);
                })
                .error((error) => {
                    console.log('Error: ' + error);
                });
        };
        // Delete a user
        $scope.deleteUser = (userID) => {
            $http.delete(route + '/' + userID)
                .success((data) => {
                    $scope.usersData = data;
                    console.log(data);
                })
                .error((data) => {
                    console.log('Error: ' + data);
                });
        };
        // Select a user
        $scope.selectUser = (userID) => {
            console.log('Select UserId:' + userID)
            for (i = 0; i < $scope.usersData.length; i++) {
                console.log('Checking UserId:' + $scope.usersData[i].id)
                if (userID == $scope.usersData[i].id) {
                    user = $scope.usersData[i];
                    console.log('Selected:' + user.name)
                    $scope.formData = user;
                    console.log('Selected formData:' + $scope.formData.id)
                    $scope.formData.DisableUpdate = false;
                    $scope.formData.DisableCreate = true;
                    return;
                }
            }
        };
        // Unselect a user
        $scope.unselectUser = () => {
            console.log('UnSelect')
            $scope.formData = {};
            $scope.formData.DisableUpdate = true;
            $scope.formData.DisableCreate = false;
        };
        // Filter on age
        $scope.filterAge = (age) => {
            filtered = $scope.filtered;
            $scope.filtered = !$scope.filtered;
            if (filtered){
                console.log('clear filter: ' + filtered)
                getUsers($scope, $http);
                return;
            }
            allUsers = $scope.usersData;
            users = [];
            for(i=0; i < allUsers.length; i++){
                user = allUsers[i];
                console.log('Filter name :' + user.name + '; age: ' + user.age.years);
                if(user.age >= age.years){
                    users.push(user);
                }
            }
            $scope.usersData = users;
        };
    });

