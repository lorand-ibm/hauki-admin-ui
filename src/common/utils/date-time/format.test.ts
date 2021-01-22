/// <reference types="jest" />

import { Language } from '../../lib/types';
import { formatDateRange, createWeekdaysStringFromIndices } from './format';

describe('format', () => {
  describe('formatDateRange', () => {
    it('should return formatted date range', () => {
      expect(
        formatDateRange({ startDate: '2020-12-18', endDate: '2020-12-31' })
      ).toEqual('18.12.2020 - 31.12.2020');
    });

    it('should return formatted startDate when endDate is missing', () => {
      expect(formatDateRange({ startDate: '2020-12-18' })).toEqual(
        '18.12.2020'
      );
    });

    it('should return string when startDate is missing', () => {
      expect(formatDateRange({ endDate: '2020-12-31' })).toEqual('');
    });
  });

  describe('createWeekdaysStringFromIndices', () => {
    it('should return correct weekday span for the whole week', () => {
      const weekdayString = createWeekdaysStringFromIndices(
        [1, 2, 3, 4, 5, 6, 7],
        Language.FI
      );
      expect(weekdayString).toEqual('ma - su');
    });

    it('should return only single day', () => {
      const weekdayString = createWeekdaysStringFromIndices([6], Language.FI);
      expect(weekdayString).toEqual('la');
    });

    it('should return correct string with individual days and day spans', () => {
      const weekdayString = createWeekdaysStringFromIndices(
        [1, 2, 3, 5, 7],
        Language.FI
      );
      expect(weekdayString).toEqual('ma - ke, pe, su');
    });

    it('should return correct string with multiple day spans', () => {
      const weekdayString = createWeekdaysStringFromIndices(
        [1, 2, 3, 5, 6, 7],
        Language.FI
      );
      expect(weekdayString).toEqual('ma - ke, pe - su');
    });

    it('should return correct weekday span for the whole week with swedish language', () => {
      const weekdayString = createWeekdaysStringFromIndices(
        [1, 2, 3, 4, 5, 6, 7],
        Language.SV
      );
      expect(weekdayString).toEqual('Mån - Sön');
    });
  });
});
