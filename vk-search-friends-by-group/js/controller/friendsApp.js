/**
 * FriendsAppCtrl
 */
'use strict';
app.controller('FriendsAppCtrl', function ($scope, ngToast, $timeout, cfpLoadingBar) {

    VK.api('friends.getAppUsers', {v: '5.40', https: 1}, function (friends) {
        if (friends.response) {
            VK.api('users.get', {user_ids: friends.response.join(), fields: 'photo_50', v: '5.40', https: 1}, function (users) {
                if (users.response) {
                    $scope.friendsApp = users.response;
                    $scope.$digest();
                }
            });
        }
    });

});