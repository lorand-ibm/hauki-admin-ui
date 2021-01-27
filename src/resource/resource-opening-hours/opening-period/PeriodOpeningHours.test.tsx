import React from 'react';
import { render } from '@testing-library/react';
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

const closedResourceState = {
  value: 'closed',
  label: 'Suljettu',
};

const testDatePeriodOptions: UiDatePeriodConfig = {
  resourceState: {
    options: [
      {
        value: 'open',
        label: 'Auki',
      },
      { ...closedResourceState },
      {
        value: 'self_service',
        label: 'Itsepalvelu',
      },
    ],
  },
  timeSpanGroup: {
    rule: {
      context: {
        options: [
          {
            value: 'period',
            label: 'Jakso',
          },
          {
            value: 'month',
            label: 'Kuukausi',
          },
        ],
      },
      subject: {
        options: [
          {
            value: 'week',
            label: 'Viikko',
          },
          {
            value: 'month',
            label: 'Kuukausi',
          },
          {
            value: 'mon',
            label: 'Maanantai',
          },
        ],
      },
      frequencyModifier: {
        options: [
          {
            value: 'odd',
            label: 'Pariton',
          },
          {
            value: 'even',
            label: 'Parillinen',
          },
        ],
      },
    },
  },
};

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
});
