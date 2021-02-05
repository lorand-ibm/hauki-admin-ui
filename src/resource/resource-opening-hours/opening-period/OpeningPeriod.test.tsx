import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  DatePeriod,
  Language,
  UiDatePeriodConfig,
  ResourceState,
} from '../../../common/lib/types';
import OpeningPeriod from './OpeningPeriod';

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

describe(`<OpeningPeriod />`, () => {
  it('should show opening period', async () => {
    const { container } = render(
      <Router>
        <OpeningPeriod
          initiallyOpen={false}
          resourceId={1}
          datePeriod={testDatePeriod}
          language={Language.FI}
          datePeriodConfig={testDatePeriodOptions}
          deletePeriod={(): Promise<void> => Promise.resolve()}
        />
      </Router>
    );

    expect(
      await container.querySelector('div[data-test="openingPeriod-1"]')
    ).toBeInTheDocument();
  });

  it('should show opening hours of opening period when accordion is opened', async () => {
    const { container } = render(
      <Router>
        <OpeningPeriod
          initiallyOpen={false}
          resourceId={1}
          datePeriod={testDatePeriod}
          language={Language.FI}
          datePeriodConfig={testDatePeriodOptions}
          deletePeriod={(): Promise<void> => Promise.resolve()}
        />
      </Router>
    );
    await act(async () => {
      const openingPeriodAccordionButton = container.querySelector(
        '[data-test="openingPeriodAccordionButton-1"]'
      );
      if (!openingPeriodAccordionButton) {
        throw new Error('showOpeningHoursButton not found');
      }
      await fireEvent.click(openingPeriodAccordionButton);
    });

    await act(async () => {
      expect(
        await container.querySelector(
          'div[data-test="period-opening-hours-container"]'
        )
      ).toBeInTheDocument();

      expect(
        await container.querySelector('div[data-test="time-span-row"]')
      ).toBeInTheDocument();
    });
  });

  it('should show date period description when date period accordion is opened', async () => {
    const { container } = render(
      <Router>
        <OpeningPeriod
          initiallyOpen={false}
          resourceId={1}
          datePeriod={testDatePeriod}
          language={Language.FI}
          datePeriodConfig={testDatePeriodOptions}
          deletePeriod={(): Promise<void> => Promise.resolve()}
        />
      </Router>
    );
    await act(async () => {
      const openingPeriodAccordionButton = container.querySelector(
        '[data-test="openingPeriodAccordionButton-1"]'
      );
      if (!openingPeriodAccordionButton) {
        throw new Error('showOpeningHoursButton not found');
      }
      await fireEvent.click(openingPeriodAccordionButton);
    });

    await act(async () => {
      expect(
        await container.querySelector(
          'div[data-test="date-period-description"]'
        )
      ).toBeInTheDocument();
    });
  });
});
