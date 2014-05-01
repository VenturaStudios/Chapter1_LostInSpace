define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
    return BombTouchApp.controller('MainCtrl',
      ['$scope', '$timeout', 'socialSrv', 'localStorageSrv','settingsSrv','$location',
      function ($scope, $timeout,socialSrv, localStorageSrv,settingsSrv, $location) {
        $scope.puntos = 0;
        $scope.paused = false;
        $scope.megaShootActive = false;
        $scope.messageSender = 'dog.png';

        var nyanGame = new GAME();

        $scope.getSound = function(){
          return settingsSrv.getSound();
        }

        $scope.setSoundInGame = function(){ 
          var toSet = settingsSrv.getSound() ? false : true;
          settingsSrv.setSound(toSet);

          nyanGame.setSoundInGame(toSet);
        }

        $scope.start = function(){
          $scope.home = false;
          $scope.juego = true; 
          $scope.puntos = 0;
          $scope.gameOver = false;
          nyanGame.setSound(settingsSrv.getSound());
          nyanGame.start();
        } 

        $scope.pause = function(){
          $scope.paused = true;
          nyanGame.pause();
        }
        $scope.resume = function(){
          $scope.paused = false;
          nyanGame.resume();
        }

        //Message for levels
        function showLevel(level){
          $scope.level = level;
          $scope.showLevel = true;
          $timeout( function(){
              $scope.showLevel = false;
          },1500)
        }

        function showMessage(message,sender,timeout){
          if(!timeout){
            timeout = 2500;
          }
          $scope.message = message;
          $scope.messageSender = sender ?  sender + '.png' : 'dog.png';
          $scope.$apply();

          $timeout( function(){
            $scope.$apply();
              $scope.message = undefined;
              $scope.messageSender = 'dog.png';
          },timeout)
          
        }

        function showMessages(messages, senders, timeoutMessage, timeoutBetweenMessages){
          var message = messages.shift();
          var sender = senders.shift();
          showMessage(message, sender, timeoutMessage);
          if(messages.length > 0){
            setTimeout(function() {
              showMessages(messages, senders, timeoutMessage,timeoutBetweenMessages);
            }, timeoutMessage+timeoutBetweenMessages);
          }
        }

        
        //Observer of the game
        nyanGame.suscribeGameOver(function(){
            localStorageSrv.saveBestScore($scope.puntos);
            $location.path('/gameover');
        });

        nyanGame.suscribePoints(function(points){
            $scope.puntos = points;
            $scope.$apply();
        });

        nyanGame.suscribeMessages(function(messages,senders,timeoutMessage,timeoutBetweenMessages){
          showMessages(messages,senders,timeoutMessage,timeoutBetweenMessages);
        });

        nyanGame.suscribePower(function(power){
            $scope.power = power;
            //TODO applyhere
        });

        nyanGame.suscribeLevelUp(function(level){
          showLevel(level);
        });

        $scope.start();

      }]);
});




