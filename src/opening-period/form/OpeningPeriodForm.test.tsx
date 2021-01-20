import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import {
  DatePeriod,
  UiDatePeriodConfig,
  ResourceState,
} from '../../common/lib/types';
import OpeningPeriodForm, { OpeningPeriodFormProps } from './OpeningPeriodForm';

const testDatePeriodOptions: UiDatePeriodConfig = {
  resourceState: {
    options: [],
  },
  timeSpanGroup: {
    rule: {
      context: {
        options: [
          {
            value: 'period',
            label: 'Jakso',
          },
        ],
      },
      subject: {
        options: [
          {
            value: 'week',
            label: 'Viikko',
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

const testResourceId = 1186;
const testDatePeriodId = 1186;
const groupIdA = 1;
const groupIdB = 2;
const timeSpanGroupA = {
  id: groupIdA,
  period: testDatePeriodId,
  rules: [
    {
      id: 1,
      group: groupIdA,
      context: 'period',
      frequency_modifier: 'odd',
      frequency_ordinal: null,
      subject: 'week',
      start: 1,
    },
  ],
  time_spans: [
    {
      id: 10,
      group: groupIdA,
      description: {
        fi: 'Pariton viikko arkiaukiolo',
        sv: null,
        en: null,
      },
      end_time: '17:00:00',
      resource_state: ResourceState.OPEN,
      start_time: '12:00:00',
      weekdays: [1, 2, 3, 4, 5],
    },
    {
      id: 20,
      group: groupIdA,
      description: {
        fi: 'Pariton viikko viikonloppuaukiolo',
        sv: null,
        en: null,
      },
      end_time: '17:00:00',
      resource_state: ResourceState.OPEN,
      start_time: '12:00:00',
      weekdays: [6, 7],
    },
  ],
};
const timeSpanGroupB = {
  id: groupIdB,
  period: testDatePeriodId,
  rules: [
    {
      id: 2,
      context: 'month',
      frequency_modifier: 'even',
      frequency_ordinal: null,
      subject: 'week',
      start: 1,
    },
  ],
  time_spans: [
    {
      id: 30,
      group: groupIdB,
      description: {
        fi: 'Parillinen arki aukiolo',
        sv: null,
        en: null,
      },
      end_time: '17:00:00',
      resource_state: ResourceState.OPEN,
      start_time: '12:00:00',
      weekdays: [1, 2, 3, 4, 5],
    },
  ],
};
const baseTestDatePeriod: DatePeriod = {
  id: testDatePeriodId,
  name: { fi: 'test opening period', sv: '', en: '' },
  description: { fi: 'test opening period description', sv: '', en: '' },
  start_date: '2020-12-18',
  end_date: '2021-01-18',
  resource_state: ResourceState.OPEN,
  override: false,
  resource: testResourceId,
  time_span_groups: [timeSpanGroupA, timeSpanGroupB],
};

const defaultProps: Partial<OpeningPeriodFormProps> = {
  formId: 'test-form',
  resourceId: testResourceId,
  datePeriodConfig: testDatePeriodOptions,
  submitFn: (data) => new Promise<DatePeriod>((resolve) => resolve(data)),
  successTextAndLabel: {
    text: 'Aukiolon tallennus onnistui',
    label: 'Tallennus onnistui',
  },
  errorTextAndLabel: {
    text: 'Aukiolon tallennus epäonnistui',
    label: 'Tallennus epäonnistui',
  },
};

const renderOpeningPeriodForm = (props: OpeningPeriodFormProps): Element => {
  const { container } = render(<OpeningPeriodForm {...props} />);

  if (!container) {
    throw new Error('Something went wrong in rendering of OpeningPeriodForm');
  }
  return container;
};

describe(`<OpeningPeriodForm />`, () => {
  describe(`TimeSpanGroups`, () => {
    it('should render time-span-groups', async () => {
      let container: Element;

      act(() => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [timeSpanGroupA, timeSpanGroupB],
          },
        } as OpeningPeriodFormProps);
      });

      act(() => {
        const timeSpanGroupElementA = container.querySelector(
          `[data-test="time-span-group-${groupIdA}"]`
        );

        if (!timeSpanGroupElementA) {
          throw new Error(
            'Something went wrong in rendering time-span-group A'
          );
        }

        // Check group A has the first time-span element
        expect(
          timeSpanGroupElementA.querySelectorAll('[data-test="time-span-0-0"]')
            .length
        ).toBe(1);

        // Check group A has the second time-span element
        expect(
          timeSpanGroupElementA.querySelectorAll('[data-test="time-span-0-1"]')
            .length
        ).toBe(1);

        // Check group A has the rule element
        expect(
          timeSpanGroupElementA.querySelectorAll('[data-test="rule-0-0"]')
            .length
        ).toBe(1);

        const timeSpanGroupElementB = container.querySelector(
          `[data-test="time-span-group-${groupIdB}"]`
        );

        if (!timeSpanGroupElementB) {
          throw new Error(
            'Something went wrong in rendering time-span-group B'
          );
        }

        // Check group B has the only one time-span element
        expect(
          timeSpanGroupElementB.querySelectorAll('[data-test="time-span-1-0"]')
            .length
        ).toBe(1);

        // Check group A has the rule element
        expect(
          timeSpanGroupElementB.querySelectorAll('[data-test="rule-1-0"]')
            .length
        ).toBe(1);
      });
    });
  });
});
