'use strict';

angular.module('storyApp')
  .controller('PlayCtrl', function ($scope, User, Auth, $stateParams, $http, $timeout, socket, PieService, ngAudio) {

    $scope.errors = {};
    $scope.gameid = $stateParams.id

    $scope.audio = ngAudio.load('assets/audio/wheel.mp3');

    $http.get('/api/games/' + $scope.gameid).success(function (c) {
      $scope.game = c;

      $http.get('/api/bribes?game=' + $scope.gameid).success(function (bribes) {
        $scope.bribes = bribes;
        socket.syncUpdates('bribe', $scope.bribes);

        $scope.outcomes = [];

        $http.get('/api/outcomes?game=' + $scope.gameid).success(function (outcomes) {
          $scope.outcomes = outcomes;

          var o = $scope.outcomes;
          for (var i = 0; i < $scope.outcomes.length; i++) {
            var outcome = $scope.outcomes[i];
            outcome.color = PieService.colors[i % PieService.colors.length];
            outcome.bribevalue = 1;
            var bribename = 'Not assigned';
            for (var j = 0; j < $scope.bribes.length; j++) {
              var bribe = $scope.bribes[j];
              if (outcome.bribe == bribe._id) {
                if (bribe.value) {
                  outcome.bribevalue = bribe.value;
                } else {

                }
                outcome.bribename = bribe.name;
              }
            }
          }

          window.hideLoader();
          $timeout(function () {
            $scope.audio.play();
            $scope.play();
          }, 1000);
        });
      });

      socket.syncUpdates('outcome', $scope.outcomes);
    });


    $scope.play = function () {
      var params = {};
      var items = [];

      for (var i = 0; i < $scope.outcomes.length; i++) {
        var outcome = $scope.outcomes[i];
        var item = {
          name: outcome.name,
          weight: Number(outcome.bribevalue),
          color: outcome.color,
        };
        items.push(item);
      }
      params.items = items;

      if (!$scope.game.winner) {
        $http.post('/api/decision/runDecisionSimulation', params).success(function (result) {
          $scope.winner = result.results[0].name;
          $scope.game.winner = $scope.winner;
          $http.put('/api/games/' + $scope.gameid, $scope.game).then(function () {
            $scope.renderPie(items);
          }, function (response) {
            //TODO: display some kind of error that the game was not played and should try again.
          });
        });
      } else {
        $scope.winner = $scope.game.winner;
        $scope.renderPie(items);
      }
    };

    $scope.renderPie = function (items) {
      var winPos = 0;
      for (var i = 0, len = items.length; i < len; i++) {
        if (items[i].name === $scope.winner) {
          winPos = i;
        }
      }
      var pieChart = PieService.render('holder', items);
      pieChart.spin(winPos, function () {
        jQuery('html').addClass('md-show');
        $scope.showWinner = true;
        $scope.$apply();
      });
    }
  });
