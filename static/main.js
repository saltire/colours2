var colourApp = angular.module('colourApp', []);

colourApp.controller('colourCtrl', function ($scope, $log, $http) {
    $http.get('colours.json').then(function (res) {
        $scope.colours = res.data;
    });
});

// update all values in a row to match that row's RGB colour
function sync_values(scope) {
    scope.red = parseInt(scope.colour.red);
    scope.green = parseInt(scope.colour.green);
    scope.blue = parseInt(scope.colour.blue);

    var hsv = rgb2hsv(scope.colour.red, scope.colour.green, scope.colour.blue);
    scope.hue = hsv.hue;
    scope.sat = hsv.sat;
    scope.val = hsv.val;

    scope.hex = rgb2hex(scope.colour.red, scope.colour.green, scope.colour.blue);
}

// a row of input elements representing a single colour
colourApp.directive('colourRow', function () {
    return {
        link: function (scope, elem, attr) {
            sync_values(scope);
        }
    };
});

// a numeric text input element with a maximum value
colourApp.directive('colourRange', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            elem.on('keydown', function (e) {
                var max = parseInt(attrs.colourRange),
                    value = ngModel.$modelValue;
                if (value === undefined) return;

                if (e.which == 38) value += 1;       // up
                else if (e.which == 40) value -= 1;  // down
                else if (e.which == 33) value += 10; // page up
                else if (e.which == 34) value -= 10; // page down
                else return;

                if (attrs.ngModel == 'hue') {
                    // hue is cyclical, so loop the value if it goes out of range
                    if (value < 0) value += max + 1;
                    else if (value > max) value -= max + 1;
                }
                else {
                    // otherwise clamp the value to the range
                    if (value < 0) value = 0;
                    else if (value > max) value = max;
                }

                // update the view
                ngModel.$setViewValue(value.toString());
                ngModel.$render();
            });

            ngModel.$parsers.push(function (value) {
                return typeof value == 'number' ? value : parseInt(value.replace(/[^\d]/g, ''));
            });

            ngModel.$validators.max = function (modelValue, viewValue) {
                return modelValue <= parseInt(attrs.colourRange);
            };
        }
    };
});

// an input element for any RGB/HSV/hex value
colourApp.directive('colourValue', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            // sync value with colour on unfocus
            elem.on('change', function (e) {
                sync_values(scope);
                ngModel.$setViewValue(scope[attrs.ngModel]);
                ngModel.$render();
            });
        }
    };
});

// an input element for an RGB value
colourApp.directive('colourRgb', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            // sync colour with values on update, if valid
            ngModel.$viewChangeListeners.push(function () {
                if (scope.red !== undefined && scope.green !== undefined && scope.blue !== undefined) {
                    scope.colour.red = scope.red;
                    scope.colour.green = scope.green;
                    scope.colour.blue = scope.blue;
                }
            });
        }
    };
});

// an input element for an HSV value
colourApp.directive('colourHsv', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            // sync colour with values on update, if valid
            ngModel.$viewChangeListeners.push(function () {
                if (scope.hue !== undefined && scope.sat !== undefined && scope.val !== undefined) {
                    angular.extend(scope.colour, hsv2rgb(scope.hue, scope.sat, scope.val));
                }
            });
        }
    };
});

// an input element for a hex colour code
colourApp.directive('colourHex', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            // parse value on update
            ngModel.$parsers.push(function (value) {
                return value.toUpperCase()
                    .replace(/^#*/, '#')
                    .replace(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/, '#$1$1$2$2$3$3');
            });

            // validate parsed value on update
            ngModel.$validators.hex = function (modelValue, viewValue) {
                return /#?[A-F0-9]{6}/.test(modelValue);
            };

            // sync colour with value on update, if valid
            ngModel.$viewChangeListeners.push(function () {
                if (ngModel.$valid) {
                    angular.extend(scope.colour, hex2rgb(ngModel.$modelValue));
                }
            });
        }
    };
});
