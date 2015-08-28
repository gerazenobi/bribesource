'use strict';

angular.module('storyApp')
  .controller('PlayCtrl', function ($scope, User, Auth, $stateParams , $http , socket, PieService) {

    var COLORS = ['9CE0B1', 'B9EC47', 'F7B15E', 'FB2FC8', '907A9D'].map(colr.fromHex);

    $scope.errors = {};
    $scope.gameid = $stateParams.id

    $http.get('/api/games/'+$scope.gameid).success(function(c) {
        $scope.game = c;

          $http.get('/api/bribes?game='+$scope.gameid).success(function(bribes) {
            $scope.bribes = bribes;
            socket.syncUpdates('bribe', $scope.bribes);

            $scope.outcomes = [];

            $http.get('/api/outcomes?game='+$scope.gameid).success(function(outcomes) {
            $scope.outcomes = outcomes;

            var o = $scope.outcomes;
            for(var i=0;i<$scope.outcomes.length;i++){
              var outcome = $scope.outcomes[i];
              outcome.color = COLORS[i % COLORS.length];
              outcome.bribevalue=1;
              var bribename ='Not assigned';
              for(var j=0;j<$scope.bribes.length;j++){
                var bribe = $scope.bribes[j];
                if(outcome.bribe==bribe._id){
                  if(bribe.value){
                    outcome.bribevalue = bribe.value;
                  }else{

                  }
                  outcome.bribename = bribe.name;
                }
              }
            }

            $scope.play();
          });
      });

      socket.syncUpdates('outcome', $scope.outcomes);
    });


    $scope.play = function() {

      var params = {};
      var items = []

      for(var i=0;i<$scope.outcomes.length;i++){
        var outcome = $scope.outcomes[i];
        var item = {
            name: outcome.name,
            weight: Number(outcome.bribevalue),
            color: outcome.color,
        };
        items.push(item);
      }
      params.items = items;

      $http.post('/api/decision/runDecisionSimulation',params).success(function(result){
          $scope.winner = result.results[0].name;

          var winPos = 0;
          for(var i = 0, len = items.length; i < len; i++) {
              if (items[i].name === $scope.winner) {
                  winPos = i;
              }
          }

          PieService.render('holder', items, winPos, function (){ 
            $scope.showWinner = true;
            $scope.$apply();
            $scope.game.winner = $scope.winner;
            $http.put('/api/games/'+$scope.gameid, $scope.game).then(function(gameUpdateResult){
              // TODO: sync ?
            });
          });

          //need to save the game winner
      })
    }




  });
