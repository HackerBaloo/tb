const route = '/api/v1/users';

angular.module('nodeUsers', [])
    .controller('mainController', ($scope, $http) => {
        $scope.formData = {};
        $scope.userData = {};
        // Get all users
        $http.get(route)
            .success((users) => {
                $scope.usersData = users;
                console.log(users);
            })
            .error((error) => {
                console.log('Error: ' + error);
            });
        // Create a new user
        $scope.createUser = () => {
            $http.post(route, $scope.formData)
                .success((data) => {
                    $scope.formData = {};
                    $scope.userData = data;
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
                    $scope.userData = data;
                    console.log(data);
                })
                .error((data) => {
                    console.log('Error: ' + data);
                });
        };
    });

