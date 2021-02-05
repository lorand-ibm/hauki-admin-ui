import React from 'react';
import { render } from '@testing-library/react';
import { datePeriod } from '../../../../test/fixtures/api-date-period';
import {
  DatePeriod,
  Language,
  ResourceState,
  UiDatePeriodConfig,
} from '../../../common/lib/types';
import OpeningPeriodDetails from './OpeningPeriodDetails';

const testDatePeriod: DatePeriod = datePeriod;
const testPeriodWithNonSupportedFeatures: DatePeriod = {
  ...datePeriod,
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
  label: {
    fi: 'Suljettu',
    sv: null,
    en: null,
  },
};

const testDatePeriodOptions: UiDatePeriodConfig = {
  name: {
    max_length: 255,
  },
  resourceState: {
    options: [
      {
        value: 'open',
        label: {
          fi: 'Auki',
          sv: null,
          en: null,
        },
      },
      { ...closedResourceState },
      {
        value: 'self_service',
        label: {
          fi: 'Itsepalvelu',
          sv: null,
          en: null,
        },
      },
    ],
  },
  timeSpanGroup: {
    rule: {
      context: {
        options: [
          {
            value: 'period',
            label: {
              fi: 'Jakso',
              sv: null,
              en: null,
            },
          },
          {
            value: 'month',
            label: {
              fi: 'Kuukausi',
              sv: null,
              en: null,
            },
          },
        ],
      },
      subject: {
        options: [
          {
            value: 'week',
            label: {
              fi: 'Viikko',
              sv: null,
              en: null,
            },
          },
          {
            value: 'month',
            label: {
              fi: 'Kuukausi',
              sv: null,
              en: null,
            },
          },
          {
            value: 'mon',
            label: {
              fi: 'Maanantai',
              sv: null,
              en: null,
            },
          },
        ],
      },
      frequencyModifier: {
        options: [
          {
            value: 'odd',
            label: {
              fi: 'Pariton',
              sv: null,
              en: null,
            },
          },
          {
            value: 'even',
            label: {
              fi: 'Parillinen',
              sv: null,
              en: null,
            },
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
