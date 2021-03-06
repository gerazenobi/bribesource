'use strict';

angular.module('storyApp').controller('MainCtrl', function ($scope, $http, $location, $timeout, socket, Auth) {
	// variables
	$scope.showCompletedGames = true;
  $scope.games = [];
  $scope.showHowTo = false;
	$scope.newGame = {
		name: ''
	}
	// listeners
  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('game');
  });
	
	
	// bootstrap toggle for showing completed games or now
	$scope.initializeToggle = function() {
		$('.special-toggle-checkbox').bootstrapToggle().change(function() {
			$scope.showCompletedGames = $(this).prop('checked');
			$scope.$apply();
		});
	}
	
  $scope.toggleHowTo = function(){
    $scope.showHowTo= !$scope.showHowTo;
  }
	
  $scope.getGames = function() {
    $http.get('/api/games').success(function(games) {
      $scope.games = games;
			$scope.gamesLoaded = true;
      socket.syncUpdates('game', $scope.games);
			
			$timeout(function() {
				window.hideLoader();
			},1000);
    });
  }

  $scope.checkLoggedIn = function() {
    Auth.isLoggedInAsync(function(val) {
      $scope.isLoggedIn = val;
      if($scope.isLoggedIn) {
        var cu = Auth.getCurrentUser();
        $scope.currentUserImageUrl = cu.google.image.url;
        $scope.currentUserEmail = Auth.getCurrentUser().email;
				
				if(localStorage.getItem('participateGame')) {
					$location.path('/game/' + localStorage.getItem('participateGame'));
				}   
      }
    });
  }
  
  $scope.addGame = function() {
    if($scope.newGame.name === '') {
      return;
    }
    $http.post('/api/games', { name: $scope.newGame.name, gameCreator: $scope.currentUserEmail, gameCreatorImageUrl: $scope.currentUserImageUrl }).then(function(result){
			if(result && result.data._id) {
				$location.path('/game/' + result.data._id);
			} else {
				$scope.getGames();
			}
    })
    $scope.newGame = {};
  };

  $scope.deleteGame = function(game) {
		if(confirm("Are you sure you want to delete this game?")) {
	    $http.delete('/api/games/' + game._id).then(function(){
	      $scope.getGames();
	    })
		}
  };
	
	$scope.hasPermissionToPlayGame = function(gameCreator) {
		// todo: check is product owner?
		if($scope.currentUserEmail === gameCreator) {
			return true;
		} else {
			return false;
		}
	}
	
	// initial methods called
	$scope.checkLoggedIn();
  $scope.getGames();
	$scope.initializeToggle();

});
