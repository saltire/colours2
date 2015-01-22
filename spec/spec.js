describe('colourCtrl', function () {
    // module and inject come from the angular.mock namespace
    beforeEach(module('colourApp'));

    it('should convert RGB to hex', inject(function ($controller) {
        var $scope = {};
        var ctrl = $controller('colourCtrl', {$scope: $scope});

        expect($scope.hex(0, 255, 0)).toBe('#00ff00');
    }));

    it('should convert RGB to HSV', inject(function ($controller) {
        var $scope = {};
        $controller('colourCtrl', {$scope: $scope});

        expect($scope.rgb2hsv(179, 153, 204)).toEqual([270, 25, 80]);
    }));

    it('should convert HSV to RGB', inject(function ($controller) {
        var $scope = {};
        $controller('colourCtrl', {$scope: $scope});

        expect($scope.hsv2rgb(270, 25, 80)).toEqual([178, 153, 204]);
    }));
});
