describe('colourCtrl', function () {
    // module and inject come from the angular.mock namespace
    beforeEach(module('colourApp'));

    var $scope;
    beforeEach(inject(function($controller) {
        $scope = {};
        $controller('colourCtrl', {$scope: $scope});
    }));

    it('should convert RGB to hex', function () {
        expect($scope.hex(0, 255, 0)).toBe('#00ff00');
    });

    it('should convert RGB to HSV', function () {
        expect($scope.rgb2hsv(179, 153, 204)).toEqual([270, 25, 80]);
    });

    it('should convert HSV to RGB', function () {
        expect($scope.hsv2rgb(270, 25, 80)).toEqual([178, 153, 204]);
    });
});
