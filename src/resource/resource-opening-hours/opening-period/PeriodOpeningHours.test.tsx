import React from 'react';
import { render } from '@testing-library/react';
import { datePeriodOptions } from '../../../../test/fixtures/api-options';
import {
  DatePeriod,
  Language,
  ResourceState,
  UiDatePeriodConfig,
} from '../../../common/lib/types';
import PeriodOpeningHours from './PeriodOpeningHours';

const testDatePeriod: DatePeriod = {
  id: 1,
  created: '2020-11-20',
  modified: '2020-11-20',
  is_removed: false,
  name: { fi: '', sv: '', en: '' },
  description: { fi: 'Testikuvaus', sv: '', en: '' },
  start_date: '',
  end_date: '2020-11-21',
  resource_state: ResourceState.OPEN,
  override: false,
  resource: 1,
  time_span_groups: [
    {
      id: 5807,
      period: 6937,
      time_spans: [
        {
          id: 9054,
          group: 5807,
          name: {
            fi: null,
            sv: null,
            en: null,
          },
          description: {
            fi: 'Aukiolon testikuvaus',
            sv: null,
            en: null,
          },
          start_time: '08:00:00',
          end_time: '16:00:00',
          full_day: false,
          weekdays: [1, 3],
          resource_state: ResourceState.OPEN,
          created: '2021-01-14T18:28:53.391999+02:00',
          modified: '2021-01-21T16:46:27.119217+02:00',
        },
        {
          id: 14667,
          group: 5807,
          name: {
            fi: null,
            sv: null,
            en: null,
          },
          description: {
            fi: 'Auki lyhyemmän ajan',
            sv: null,
            en: null,
          },
          start_time: '10:31:00',
          end_time: '14:31:00',
          full_day: false,
          weekdays: [2, 4],
          resource_state: ResourceState.OPEN,
          created: '2021-01-21T12:31:35.754943+02:00',
          modified: '2021-01-21T16:46:27.137543+02:00',
        },
      ],
      rules: [
        {
          id: 170,
          group: 5807,
          name: {
            fi: null,
            sv: null,
            en: null,
          },
          description: {
            fi: null,
            sv: null,
            en: null,
          },
          context: 'period',
          subject: 'day',
          start: 1,
          frequency_ordinal: 1,
          frequency_modifier: null,
          created: '2021-01-14T18:28:53.409412+02:00',
          modified: '2021-01-21T16:46:27.180006+02:00',
        },
      ],
    },
  ],
};

const testDatePeriodWithMissingStartAndEndTimes: DatePeriod = {
  ...testDatePeriod,
  time_span_groups: [
    {
      ...testDatePeriod.time_span_groups[0],
      time_spans: [
        {
          ...testDatePeriod.time_span_groups[0].time_spans[0],
          start_time: null,
          end_time: null,
        },
      ],
    },
  ],
};

const testDatePeriodFullDayOpen: DatePeriod = {
  ...testDatePeriod,
  time_span_groups: [
    {
      ...testDatePeriod.time_span_groups[0],
      time_spans: [
        {
          ...testDatePeriod.time_span_groups[0].time_spans[0],
          start_time: null,
          end_time: null,
          full_day: true,
          resource_state: ResourceState.OPEN,
        },
      ],
    },
  ],
};

const testDatePeriodFullDayClosed: DatePeriod = {
  ...testDatePeriod,
  time_span_groups: [
    {
      ...testDatePeriod.time_span_groups[0],
      time_spans: [
        {
          ...testDatePeriod.time_span_groups[0].time_spans[0],
          start_time: null,
          end_time: null,
          full_day: true,
          resource_state: ResourceState.CLOSED,
        },
      ],
    },
  ],
};

const testDatePeriodOptions: UiDatePeriodConfig = datePeriodOptions;

describe(`<PeriodOpeningHours />`, () => {
  it('should show period opening hours', async () => {
    const { container } = render(
      <PeriodOpeningHours
        datePeriod={testDatePeriod}
        datePeriodConfig={testDatePeriodOptions}
        language={Language.FI}
      />
    );

    expect(
      await container?.querySelector(
        'p[data-test="time-span-weekday-string-0"]'
      )?.textContent
    ).toEqual('ma, ke');

    expect(
      await container?.querySelector(
        'p[data-test="time-span-start-end-times-string-0"]'
      )?.textContent
    ).toEqual('08:00 - 16:00');

    expect(
      await container?.querySelector(
        'p[data-test="time-span-resource-state-0"]'
      )?.textContent
    ).toEqual('Auki');

    expect(
      await container?.querySelector('p[data-test="time-span-description-0"]')
        ?.textContent
    ).toEqual('Aukiolon testikuvaus');

    expect(
      await container?.querySelector(
        'p[data-test="time-span-weekday-string-1"]'
      )?.textContent
    ).toEqual('ti, to');
  });

  it('should not crash when start and end times are missing', async () => {
    const { container } = render(
      <PeriodOpeningHours
        datePeriod={testDatePeriodWithMissingStartAndEndTimes}
        datePeriodConfig={testDatePeriodOptions}
        language={Language.FI}
      />
    );

    expect(
      await container?.querySelector(
        'p[data-test="time-span-start-end-times-string-0"]'
      )?.textContent
    ).toEqual(' - ');
  });

  it('should show time span 24h when full-day setting is on and the resource is open', async () => {
    const { container } = render(
      <PeriodOpeningHours
        datePeriod={testDatePeriodFullDayOpen}
        datePeriodConfig={testDatePeriodOptions}
        language={Language.FI}
      />
    );

    expect(
      await container?.querySelector(
        'p[data-test="time-span-start-end-times-string-0"]'
      )?.textContent
    ).toEqual('24h');
  });

  it('should show nothing in time column when full-day setting is on and the resource is closed', async () => {
    const { container } = render(
      <PeriodOpeningHours
        datePeriod={testDatePeriodFullDayClosed}
        datePeriodConfig={testDatePeriodOptions}
        language={Language.FI}
      />
    );

    expect(
      await container?.querySelector(
        'p[data-test="time-span-start-end-times-string-0"]'
      )?.textContent
    ).toEqual('');
  });
});
