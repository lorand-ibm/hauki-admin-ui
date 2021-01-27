import React from 'react';
import { render } from '@testing-library/react';
import {
  DatePeriod,
  Language,
  ResourceState,
  UiDatePeriodConfig,
} from '../../../common/lib/types';
import OpeningPeriodDetails from './OpeningPeriodDetails';

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
            fi: '',
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
        {
          id: 14691,
          group: 5807,
          name: {
            fi: null,
            sv: null,
            en: null,
          },
          description: {
            fi: 'Viikonlopun aukiolot',
            sv: null,
            en: null,
          },
          start_time: '12:00:00',
          end_time: '16:00:00',
          full_day: false,
          weekdays: [6, 7],
          resource_state: ResourceState.OPEN,
          created: '2021-01-21T16:46:27.155479+02:00',
          modified: '2021-01-21T16:46:27.155479+02:00',
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

const testPeriodWithNonSupportedFeatures: DatePeriod = {
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
            fi: '',
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
          start: 2, // This being other than 1 is one of the non-supported features currently
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

describe(`<OpeningPeriodDetails />`, () => {
  it('should show opening hours and description of opening period', async () => {
    const { container } = render(
      <OpeningPeriodDetails
        datePeriod={testDatePeriod}
        language={Language.FI}
        datePeriodConfig={testDatePeriodOptions}
      />
    );

    expect(
      await container.querySelector(
        'div[data-test="period-opening-hours-container"]'
      )
    ).toBeInTheDocument();

    expect(
      await container.querySelector('div[data-test="date-period-description"]')
    ).toBeInTheDocument();

    expect(
      await container.querySelector(
        'p[data-test="date-period-description-text"]'
      )?.textContent
    ).toEqual('Testikuvaus');
  });

  it('should show not supported notification when opening period contains features that are currently not supported to be displayed', async () => {
    const { container } = render(
      <OpeningPeriodDetails
        datePeriod={testPeriodWithNonSupportedFeatures}
        language={Language.FI}
        datePeriodConfig={testDatePeriodOptions}
      />
    );

    expect(
      await container.querySelector(
        'p[data-test="non-supported-features-info"]'
      )
    ).toBeInTheDocument();

    expect(
      await container.querySelector(
        'p[data-test="non-supported-features-info"]'
      )?.textContent
    ).toEqual(
      'Aukiolojaksossa on tietoja joiden näyttämistä tässä näkymässä sovellus ei vielä tue:'
    );
  });
});
