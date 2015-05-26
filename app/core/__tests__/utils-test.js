/*eslint no-undefined:0*/
'use strict';

import {expect} from 'chai';
import {inBetween} from '../utils';

describe('inBetween function', function() {
  describe('when beginYear and endYear are specified', function() {
    it('should return true if year is beginYear', function() {
      expect(inBetween(1995, 1995, 2010)).to.be.true;
    });

    it('should return true if year is between beginYear and endYear', function() {
      expect(inBetween(2000, 1995, 2010)).to.be.true;
    });

    it('should return true if year is endYear', function() {
      expect(inBetween(1995, 1995, 2010)).to.be.true;
    });

    it('should return false if year is before beginYear', function() {
      expect(inBetween(1890, 1995, 2010)).to.be.false;
    });

    it('should return false if year is after endYear', function() {
      expect(inBetween(2015, 1995, 2010)).to.be.false;
    });
  });

  describe('when beginYear is undefined', function() {
    it('should return true if year is endYear', function() {
      expect(inBetween(2010, undefined, 2010)).to.be.true;
    });

    it('should return true if year is before endYear', function() {
      expect(inBetween(1995, undefined, 2010)).to.be.true;
    });

    it('should return false if year is after endYear', function() {
      expect(inBetween(2015, undefined, 2010)).to.be.false;
    });
  });

  describe('when endYear is undefined', function() {
    it('should return true if year is beginYear', function() {
      expect(inBetween(1995, 1995, undefined)).to.be.true;
    });

    it('should return true if year is after beginYear', function() {
      expect(inBetween(2000, 1995, undefined)).to.be.true;
    });

    it('should return false if year is before beginYear', function() {
      expect(inBetween(1890, 1995, undefined)).to.be.false;
    });
  });
});
