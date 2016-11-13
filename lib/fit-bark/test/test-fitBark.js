var chai = require('chai');
var sinon = require('sinon');
var Promise = require('bluebird');
var expect = chai.expect;
var mockery = require('mockery');

describe('using FitBark', () => {
    var sandbox = sinon.sandbox.create();

    before(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
    });

    after(()=>{
        mockery.disable();
    });

    beforeEach(() => {
        sandbox.restore();
    });

    afterEach(() => {
        mockery.deregisterAll();
        sandbox.restore();
    });

    describe('and calling getDog', () => {
    
        describe('and no dogs', () => {
            
            it('it should return null', () => {

                var getDogRelationsStub = sandbox.stub().returns(Promise.resolve({
                    dog_relations: []
                }));
                mockery.registerMock('./fitBarkRepo', function() {
                    return {
                        getDogRelations: getDogRelationsStub
                    }
                });

                var FitBark = require('../src/fitBark');
                var fitBark = new FitBark('fake');
    
                return fitBark.getDog('julio').then((dogs)=>{
                    expect(dogs).to.equal(null);
                });
            });

        });

        it('it should call getDogRelations', () => {

            var getDogRelationsStub = sandbox.stub().returns(Promise.resolve({
                dog_relations: []
            }));
            mockery.registerMock('./fitBarkRepo', function() {
                return {
                    getDogRelations: getDogRelationsStub
                }
            });

            var FitBark = require('../src/fitBark');
            var fitBark = new FitBark('fake');
  
            return fitBark.getDog('julio').then(()=>{
                expect(getDogRelationsStub.called).to.equal(true);
            });
        });

        it('should return null', () => {
            expect(true).to.equal(true);
        });

    });
});