'use strict';

angular.module('calculator.view', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view/view.html',
    controller: 'ViewCtrl'
  });
}])

.controller('ViewCtrl', ['$scope', function($scope) {
	var operators = ['/', '*', '-', '+']; // Operators that are allowed

	var previousMethod = ''; // Storing the method so that if the user presses another method it just overwrites it...
	var previousOperator = ''; // When pressing a number after pressing an operator, need to make sure we reset the amount shown, and carry out the operation since we now know the user is committed
	var total = 0;
	var calculated = false;

	$scope.calculations = '';
	$scope.amount = '';

	// Any time the user presses a number...
	$scope.digit = function(amount) {
		$scope.calculations += amount;

		// If we have a previous operator, then we're going to clear the amount entry
		if(previousOperator !== '' || calculated) {
			$scope.amount = '';
			previousOperator = '';
			calculated = false;
		}

		$scope.amount += amount;
	}

	// Any time the user presses a method...
	$scope.method = function(method) {
		// Checking if we're operating
		if(operators.indexOf(method) >= 0) {
			if(previousOperator !== '') { // Replacing previous operator
				$scope.calculations = $scope.calculations.substr(0, $scope.calculations.length-1);
			} else { // Carrying out the operation against our array of operation methods...
				total = eval($scope.calculations);
			}

			// Showing the current total if we press an operator...
			$scope.amount = total.toString();

			// Storing the previous operator
			previousOperator = method;
			calculated = false;

			$scope.calculations += method;
		} else { // Otherwise, we need to do something special I guess...
			// Clearing
			if(method == 'clear') { 
				$scope.amount = '';
				$scope.calculations = '';
				total = 0;
			}

			// Finalising
			if(method == 'enter') {
				total = eval($scope.calculations);
				$scope.amount = total.toString();
				calculated = true;
			}

			// Undoing
			if(method == 'undo') {
				$scope.calculations = $scope.calculations.substr(0, $scope.calculations.length-1);

				if(!calculated) {
					$scope.amount = $scope.amount.substr(0, $scope.amount.length-1);
				}
			}
		}
	}

	// Watch for key presses on numpad...
}]);