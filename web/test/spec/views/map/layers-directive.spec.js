'use strict';

// PhantomJS doesn't support bind yet
Function.prototype.bind = Function.prototype.bind || function (thisp) {
    var fn = this;
    return function () {
        return fn.apply(thisp, arguments);
    };
};

describe('driver.views.map: Layers Directive', function () {

    beforeEach(module('ase.mock.resources'));
    beforeEach(module('ase.resources'));
    beforeEach(module('driver.mock.resources'));
    beforeEach(module('driver.resources'));
    beforeEach(module('ase.templates'));
    beforeEach(module('driver.views.map'));

    var $compile;
    var $httpBackend;
    var $rootScope;
    var $scope;
    var ResourcesMock;

    var Element;

    beforeEach(inject(function (_$compile_, _$httpBackend_, _$rootScope_, _ResourcesMock_) {
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        ResourcesMock = _ResourcesMock_;

        var recordTypeUrl = /\/api\/recordtypes\/\?active=True/;
        $httpBackend.whenGET(recordTypeUrl).respond(200, ResourcesMock.RecordTypeResponse);
        var boundaryUrl = /\/api\/boundaries\//;
        $httpBackend.whenGET(boundaryUrl).respond(200, ResourcesMock.BoundaryResponse);
        var boundaryPolygonsUrl = /api\/boundarypolygons/;
        $httpBackend.whenGET(boundaryPolygonsUrl).respond(200, ResourcesMock.BoundaryNoGeomResponse);
        var recordsUrl = new RegExp('api/records/\\?limit=50&query=true&record_type=' + 
                                    ResourcesMock.RecordTypeResponse.results[0].uuid);
        $httpBackend.whenGET(recordsUrl).respond(200, '{"query": "SELECT * FROM ashlar_records"}');

        Element = $compile('<div leaflet-map driver-map-layers></div>')($rootScope);
        $rootScope.$apply();

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should load directive', function () {
        expect(Element.find('.leaflet-tile-pane').length).toBeTruthy();
        expect(Element.find('.leaflet-control-layers-selector').length).toBeTruthy();
    });
});
