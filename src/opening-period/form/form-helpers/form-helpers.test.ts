/// <reference types="jest" />
import { ResourceState } from '../../../common/lib/types';
import {
  formatTimeSpanGroupsToApiFormat,
  formatTimeSpanGroupsToFormFormat,
} from './form-helpers';

describe.only('opening-period form-helpers', () => {
  describe('formatTimeSpanGroupsToApiFormat', () => {
    it('should return time-span-groups in api-format', () => {
      expect(
        formatTimeSpanGroupsToApiFormat([
          {
            timeSpans: [
              {
                description: 'description text A',
                endTime: '18:00',
                startTime: '10:00',
                resourceState: ResourceState.OPEN,
                weekdays: [false, false, false, false, false, true, true],
              },
            ],
            rules: [
              {
                context: 'month',
                frequency_modifier: null,
                frequency_ordinal: 1,
                id: '20',
                subject: 'week',
                start: '2',
              },
              {
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
          time_spans: [
            {
              description: { en: null, fi: 'description text A', sv: null },
              end_time: '18:00:00',
              resource_state: ResourceState.OPEN,
              start_time: '10:00:00',
              weekdays: [6, 7],
            },
          ],
          rules: [
            {
              context: 'month',
              frequency_modifier: null,
              frequency_ordinal: 1,
              id: 20,
              subject: 'week',
              start: 2,
            },
            {
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
    it('should return time-span-groups in form-format (in ui-format and time-spans in sorted format)', () => {
      expect(
        formatTimeSpanGroupsToFormFormat([
          {
            time_spans: [
              {
                id: 1234,
                name: { en: null, fi: null, sv: null },
                description: { en: null, fi: 'description text A', sv: null },
                end_time: '18:00:00',
                resource_state: ResourceState.OPEN,
                start_time: '10:00:00',
                weekdays: [],
                created: '2020-12-16T12:21:37.255923+02:00',
                modified: '2020-12-16T12:21:37.255923+02:00',
                full_day: false,
                group: 1136,
              },
              {
                id: 2345,
                name: { en: null, fi: null, sv: null },
                description: { en: null, fi: 'description text B', sv: null },
                end_time: '18:00:00',
                resource_state: ResourceState.OPEN,
                start_time: '10:00:00',
                weekdays: [3, 5, 6, 7],
                created: '2020-12-16T12:21:37.255923+02:00',
                modified: '2020-12-16T12:21:37.255923+02:00',
                full_day: false,
                group: 1136,
              },
              {
                id: 3456,
                name: { en: null, fi: null, sv: null },
                description: { en: null, fi: 'description text C', sv: null },
                end_time: '18:00:00',
                resource_state: ResourceState.OPEN,
                start_time: '12:00:00',
                weekdays: [2, 3, 5, 6, 7],
                created: '2020-12-16T12:21:37.255923+02:00',
                modified: '2020-12-16T12:21:37.255923+02:00',
                full_day: false,
                group: 1136,
              },
            ],
            rules: [
              {
                context: 'month',
                frequency_modifier: null,
                frequency_ordinal: 1,
                id: 20,
                subject: 'week',
                start: 2,
              },
            ],
          },
        ])
      ).toEqual([
        {
          timeSpans: [
            {
              id: '1234',
              description: 'description text A',
              endTime: '18:00',
              resourceState: ResourceState.OPEN,
              startTime: '10:00',
              weekdays: [false, false, false, false, false, false, false],
            },
            {
              id: '3456',
              description: 'description text C',
              endTime: '18:00',
              resourceState: ResourceState.OPEN,
              startTime: '12:00',
              weekdays: [false, true, true, false, true, true, true],
            },
            {
              id: '2345',
              description: 'description text B',
              endTime: '18:00',
              resourceState: ResourceState.OPEN,
              startTime: '10:00',
              weekdays: [false, false, true, false, true, true, true],
            },
          ],
          rules: [
            {
              context: 'month',
              frequency_modifier: null,
              frequency_ordinal: 1,
              id: '20',
              subject: 'week',
              start: '2',
            },
          ],
        },
      ]);
    });
  });
});
