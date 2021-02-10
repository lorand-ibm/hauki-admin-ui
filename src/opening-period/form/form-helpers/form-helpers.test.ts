/// <reference types="jest" />
import { ResourceState } from '../../../common/lib/types';
import {
  formatTimeSpanGroupsToApiFormat,
  formatTimeSpanGroupsToFormFormat,
} from './form-helpers';

describe('opening-period form-helpers', () => {
  describe('formatTimeSpanGroupsToApiFormat', () => {
    it('should return existing time-span-groups in api-format', () => {
      expect(
        formatTimeSpanGroupsToApiFormat([
          {
            id: '11',
            period: '1',
            timeSpans: [
              {
                group: '1100',
                description: 'description text A',
                startTime: '10:00',
                endTime: '',
                resourceState: ResourceState.OPEN,
                weekdays: [false, false, false, false, false, true, true],
              },
            ],
            rules: [
              {
                group: '1100',
                context: 'month',
                frequency_modifier: null,
                frequency_ordinal: 1,
                id: '20',
                subject: 'week',
                start: '2',
              },
              {
                group: '1100',
                context: 'month',
                frequency_modifier: null,
                frequency_ordinal: 1,
                subject: 'week',
                start: '1',
              },
            ],
          },
        ])
      ).toEqual([
        {
          id: 11,
          period: 1,
          time_spans: [
            {
              group: 1100,
              description: { en: null, fi: 'description text A', sv: null },
              start_time: '10:00:00',
              end_time: null,
              resource_state: ResourceState.OPEN,
              weekdays: [6, 7],
            },
          ],
          rules: [
            {
              group: 1100,
              context: 'month',
              frequency_modifier: null,
              frequency_ordinal: 1,
              id: 20,
              subject: 'week',
              start: 2,
            },
            {
              group: 1100,
              context: 'month',
              frequency_modifier: null,
              frequency_ordinal: 1,
              subject: 'week',
              start: 1,
            },
          ],
        },
      ]);
    });
  });

  describe('formatTimeSpanGroupsToFormFormat', () => {
    it('should return time-span-groups in form-format (with sorted time-spans)', () => {
      expect(
        formatTimeSpanGroupsToFormFormat([
          {
            id: 11,
            period: 1,
            time_spans: [
              {
                id: 1234,
                name: { en: null, fi: null, sv: null },
                description: { en: null, fi: 'description text A', sv: null },
                start_time: '10:00:00',
                end_time: '18:00:00',
                resource_state: ResourceState.OPEN,
                weekdays: [],
                created: '2020-12-16T12:21:37.255923+02:00',
                modified: '2020-12-16T12:21:37.255923+02:00',
                full_day: false,
                group: 1100,
              },
              {
                id: 2345,
                name: { en: null, fi: null, sv: null },
                description: { en: null, fi: 'description text B', sv: null },
                start_time: '10:00:00',
                end_time: '18:00:00',
                resource_state: ResourceState.OPEN,
                weekdays: [3, 5, 6, 7],
                created: '2020-12-16T12:21:37.255923+02:00',
                modified: '2020-12-16T12:21:37.255923+02:00',
                full_day: false,
                group: 1100,
              },
              {
                id: 3456,
                name: { en: null, fi: null, sv: null },
                description: { en: null, fi: 'description text C', sv: null },
                start_time: '12:00:00',
                end_time: '18:00:00',
                resource_state: ResourceState.OPEN,
                weekdays: [2, 3, 5, 6, 7],
                created: '2020-12-16T12:21:37.255923+02:00',
                modified: '2020-12-16T12:21:37.255923+02:00',
                full_day: false,
                group: 1100,
              },
            ],
            rules: [
              {
                context: 'month',
                frequency_modifier: null,
                frequency_ordinal: 1,
                id: 20,
                group: 1100,
                subject: 'week',
                start: 2,
              },
            ],
          },
        ])
      ).toEqual([
        {
          id: '11',
          period: '1',
          timeSpans: [
            {
              id: '1234',
              group: '1100',
              description: 'description text A',
              startTime: '10:00',
              endTime: '18:00',
              resourceState: ResourceState.OPEN,
              weekdays: [false, false, false, false, false, false, false],
            },
            {
              id: '3456',
              group: '1100',
              description: 'description text C',
              startTime: '12:00',
              endTime: '18:00',
              resourceState: ResourceState.OPEN,
              weekdays: [false, true, true, false, true, true, true],
            },
            {
              id: '2345',
              group: '1100',
              description: 'description text B',
              startTime: '10:00',
              endTime: '18:00',
              resourceState: ResourceState.OPEN,
              weekdays: [false, false, true, false, true, true, true],
            },
          ],
          rules: [
            {
              context: 'month',
              frequency_modifier: null,
              frequency_ordinal: 1,
              id: '20',
              group: '1100',
              subject: 'week',
              start: '2',
            },
          ],
        },
      ]);
    });
  });
});
