import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { getElementOrThrow, selectOption } from '../../../test/test-utils';
import { datePeriodOptions } from '../../../test/fixtures/api-options';
import {
  DatePeriod,
  ResourceState,
  UiDatePeriodConfig,
} from '../../common/lib/types';
import OpeningPeriodForm, { OpeningPeriodFormProps } from './OpeningPeriodForm';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: (): { push: jest.Mock } => ({
    push: mockHistoryPush,
  }),
}));

const testDatePeriodOptions: UiDatePeriodConfig = datePeriodOptions;
const testResourceId = 1186;
const testDatePeriodId = 1186;
const groupIdA = 100;
const groupIdB = 200;
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
      start: undefined,
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
      full_day: false,
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
      full_day: false,
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
      group: groupIdB,
      context: 'month',
      frequency_modifier: 'even',
      frequency_ordinal: null,
      subject: 'week',
      start: undefined,
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
      full_day: false,
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
  resource_state: ResourceState.UNDEFINED,
  override: false,
  resource: testResourceId,
  time_span_groups: [timeSpanGroupA, timeSpanGroupB],
};

const submitFn = jest.fn<Promise<DatePeriod>, [DatePeriod]>(
  (data) => new Promise<DatePeriod>((resolve) => resolve(data))
);

const defaultProps: Partial<OpeningPeriodFormProps> = {
  formId: 'test-form',
  forceException: false,
  resourceId: testResourceId,
  datePeriodConfig: testDatePeriodOptions,
  submitFn,
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
  describe('Validations', () => {
    it('Should show required indicator when title is not set', async () => {
      let container: Element;

      await act(async () => {
        container = renderOpeningPeriodForm(
          defaultProps as OpeningPeriodFormProps
        );
      });

      // try submit form without any input data:
      await act(async () => {
        // Try submit form
        const submitFormButton = getElementOrThrow(
          container,
          '[data-test="publish-opening-period-button"]'
        );
        fireEvent.submit(submitFormButton);
      });

      await act(async () => {
        const requiredIndicator = await screen.findByText(
          'Aukiolojaksolla on oltava otsikko ainakin yhdellä kielellä.'
        );
        expect(requiredIndicator).toBeInTheDocument();
      });
    });

    it('Should show error text when date-range is invalid', async () => {
      let container: Element;

      await act(async () => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            start_date: '2021-2-2',
            end_date: '2021-2-1',
          },
        } as OpeningPeriodFormProps);
      });

      // try submit form with invalid date range:
      await act(async () => {
        const submitFormButton = getElementOrThrow(
          container,
          '[data-test="publish-opening-period-button"]'
        );
        fireEvent.submit(submitFormButton);
      });

      await act(async () => {
        const invalidDateRangeIndicator = await screen.findByText(
          'Aukiolojakson loppupäivämäärä ei voi olla ennen alkupäivämäärää.'
        );
        expect(invalidDateRangeIndicator).toBeInTheDocument();
      });
    });

    it('Should show error messages when a rule is missing required fields', async () => {
      let container: Element;

      await act(async () => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [timeSpanGroupA],
          },
        } as OpeningPeriodFormProps);
      });

      await act(async () => {
        const addRuleButton = getElementOrThrow(
          container,
          '[data-test="add-new-rule-button-0"]'
        );
        fireEvent.click(addRuleButton);
      });

      // try submit form with invalid date range:
      await act(async () => {
        const submitFormButton = getElementOrThrow(
          container,
          '[data-test="publish-opening-period-button"]'
        );
        fireEvent.submit(submitFormButton);
      });

      await act(async () => {
        const contextRequiredIndicator = await screen.findByText(
          'Säännön aikaväli on pakollinen kenttä.'
        );
        expect(contextRequiredIndicator).toBeInTheDocument();

        const subjectRequired = await screen.findByText(
          'Säännön yksikkö on pakollinen kenttä.'
        );

        expect(subjectRequired).toBeInTheDocument();
      });
    });

    it('Should show error messages when a timespan is missing both of the time-fields', async () => {
      let container: Element;

      await act(async () => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [
              {
                ...timeSpanGroupA,
                time_spans: [
                  {
                    ...timeSpanGroupA.time_spans[0],
                    end_time: null,
                    start_time: null,
                  },
                ],
              },
            ],
          },
        } as OpeningPeriodFormProps);
      });

      // try submit form with invalid timespan:
      await act(async () => {
        const submitFormButton = getElementOrThrow(
          container,
          '[data-test="publish-opening-period-button"]'
        );
        fireEvent.submit(submitFormButton);
      });

      await act(async () => {
        const timeFieldRequiredIndicator = await screen.findByText(
          'Aukiololla on oltava vähintään alku tai loppuaika.'
        );
        expect(timeFieldRequiredIndicator).toBeInTheDocument();
      });
    });

    it('Should not show error message when a timespan is missing both of the time-fields but full day is checked', async () => {
      let container: Element;

      await act(async () => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [
              {
                ...timeSpanGroupA,
                time_spans: [
                  {
                    ...timeSpanGroupA.time_spans[0],
                    end_time: null,
                    start_time: null,
                    full_day: true,
                  },
                ],
              },
            ],
          },
        } as OpeningPeriodFormProps);
      });

      // try submit form with valid timespan:
      await act(async () => {
        const submitFormButton = getElementOrThrow(
          container,
          '[data-test="publish-opening-period-button"]'
        );
        fireEvent.submit(submitFormButton);
      });

      act(() => {
        expect(submitFn).toHaveBeenCalledWith(
          expect.objectContaining({
            time_span_groups: [
              {
                ...timeSpanGroupA,
                time_spans: [
                  {
                    ...timeSpanGroupA.time_spans[0],
                    end_time: null,
                    start_time: null,
                    full_day: true,
                  },
                ],
              },
            ],
          })
        );
      });
    });
  });

  describe('TimeSpanGroups', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render time-span-groups', async () => {
      let container: Element;

      await act(async () => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [timeSpanGroupA, timeSpanGroupB],
          },
        } as OpeningPeriodFormProps);
      });

      act(() => {
        const timeSpanGroupElementA = getElementOrThrow(
          container,
          `[data-test="time-span-group-${groupIdA}"]`
        );

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

        const timeSpanGroupElementB = getElementOrThrow(
          container,
          `[data-test="time-span-group-${groupIdB}"]`
        );

        // Check group B has only one time-span element
        expect(
          timeSpanGroupElementB.querySelectorAll('[data-test^="time-span-1-"]')
            .length
        ).toBe(1);

        // Check group A has the rule element
        expect(
          timeSpanGroupElementB.querySelectorAll('[data-test="rule-1-0"]')
            .length
        ).toBe(1);
      });
    });

    it('should save changed time-span-groups', async () => {
      let container: Element;

      await act(async () => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [timeSpanGroupA, timeSpanGroupB],
          },
        } as OpeningPeriodFormProps);
      });

      act(() => {
        const timeSpanGroupElementB = getElementOrThrow(
          container,
          `[data-test="time-span-group-${groupIdB}"]`
        );

        const fridayButton = getElementOrThrow(
          timeSpanGroupElementB,
          `[data-test=weekdays-saturday-1-0]`
        );
        fireEvent.click(fridayButton);
      });

      await act(async () => {
        const saveButton = container.querySelector(
          '[data-test="publish-opening-period-button"]'
        );
        if (!saveButton) {
          throw new Error(`Element with selector ${saveButton} not found`);
        }

        fireEvent.click(saveButton);
      });

      act(() => {
        expect(submitFn).toHaveBeenCalledWith(
          expect.objectContaining({
            time_span_groups: [
              timeSpanGroupA,
              {
                ...timeSpanGroupB,
                time_spans: [
                  {
                    ...timeSpanGroupB.time_spans[0],
                    weekdays: [1, 2, 3, 4, 5, 6],
                  },
                ],
              },
            ],
          })
        );
      });
    });

    it('should submit opening period as an exception period', async () => {
      let container: Element;

      await act(async () => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
          },
          forceException: true,
        } as OpeningPeriodFormProps);
      });

      await act(async () => {
        const saveButton = container.querySelector(
          '[data-test="publish-opening-period-button"]'
        );
        if (!saveButton) {
          throw new Error(`Element with selector ${saveButton} not found`);
        }

        fireEvent.click(saveButton);
      });

      act(() => {
        expect(submitFn).toHaveBeenCalledWith(
          expect.objectContaining({
            override: true,
          })
        );
      });
    });

    it('should submit formerly closed date period opening hours', async () => {
      let container: Element;

      await act(async () => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            resource_state: ResourceState.CLOSED,
            time_span_groups: [],
          },
        } as OpeningPeriodFormProps);
      });

      act(() => {
        const clearResourceStateButton = getElementOrThrow(
          container,
          '[data-test="clear-resource-state-button"]'
        );

        fireEvent.click(clearResourceStateButton);
      });

      act(() => {
        const mondayButton = getElementOrThrow(
          container,
          '[data-test="weekdays-monday-0-0-checkbox"]'
        );

        fireEvent.click(mondayButton);

        const tuesdayButton = getElementOrThrow(
          container,
          '[data-test="weekdays-tuesday-0-0-checkbox"]'
        );

        fireEvent.click(tuesdayButton);

        const beginTime = getElementOrThrow(
          container,
          '[data-test=time-span-start-time-0-0]'
        );
        fireEvent.input(beginTime, {
          target: {
            value: '08:00',
          },
        });

        const endTime = getElementOrThrow(
          container,
          '[data-test=time-span-end-time-0-0]'
        );

        fireEvent.input(endTime, {
          target: {
            value: '16:00',
          },
        });
      });

      await act(async () => {
        const saveButton = container.querySelector(
          '[data-test="publish-opening-period-button"]'
        );
        if (!saveButton) {
          throw new Error(`Element with selector ${saveButton} not found`);
        }

        fireEvent.click(saveButton);
      });

      act(() => {
        expect(submitFn).toHaveBeenCalledWith(
          expect.objectContaining({
            resource_state: ResourceState.UNDEFINED,
            time_span_groups: [
              {
                rules: [],
                time_spans: [
                  {
                    description: { en: null, fi: null, sv: null },
                    end_time: '16:00:00',
                    full_day: false,
                    resource_state: ResourceState.OPEN,
                    start_time: '08:00:00',
                    weekdays: [1, 2],
                  },
                ],
              },
            ],
          })
        );
      });
    });

    it('should add time-span-group', async () => {
      let container: Element;

      await act(async () => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [timeSpanGroupA],
          },
        } as OpeningPeriodFormProps);
      });

      act(() => {
        const addTimeSpanGroupButton = getElementOrThrow(
          container,
          '[data-test="add-time-span-group"]'
        );

        fireEvent.click(addTimeSpanGroupButton);
      });

      act(() => {
        expect(
          container.querySelectorAll(
            `[data-test="time-span-group-${groupIdA}"]`
          ).length
        ).toBe(1);

        expect(
          container.querySelectorAll(`[data-test="time-span-group-new"]`).length
        ).toBe(1);
      });
    });

    it('should remove time-span-group', async () => {
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
        const timeSpanGroupElementA = getElementOrThrow(
          container,
          `[data-test="time-span-group-${groupIdA}"]`
        );

        const removeGroupButton = getElementOrThrow(
          timeSpanGroupElementA,
          '[data-test="remove-time-span-group"]'
        );
        fireEvent.click(removeGroupButton);
      });

      await act(async () => {
        expect(
          container.querySelectorAll(
            `[data-test="time-span-group-${groupIdA}"]`
          ).length
        ).toBe(0);
      });

      await act(async () => {
        const saveButton = container.querySelector(
          '[data-test="publish-opening-period-button"]'
        );
        if (!saveButton) {
          throw new Error(`Element with selector ${saveButton} not found`);
        }

        fireEvent.click(saveButton);
      });

      act(() => {
        expect(submitFn).toHaveBeenCalledWith(
          expect.objectContaining({
            time_span_groups: [timeSpanGroupB],
          })
        );
      });
    });
  });

  describe('Rules', () => {
    it('should render correct time-span-group rules', async () => {
      let container: Element;
      let periodRuleFieldset: Element;
      const periodRuleId = 10;
      const monthRuleId = 20;

      act(() => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [
              {
                ...timeSpanGroupA,
                rules: [
                  {
                    id: periodRuleId,
                    group: timeSpanGroupA.id,
                    context: 'period',
                    frequency_modifier: 'even',
                    frequency_ordinal: 3,
                    subject: 'mon',
                    start: undefined,
                  },
                  {
                    id: monthRuleId,
                    group: timeSpanGroupA.id,
                    context: 'month',
                    frequency_modifier: null,
                    frequency_ordinal: null,
                    subject: 'week',
                    start: 2,
                  },
                ],
              },
            ],
          },
        } as OpeningPeriodFormProps);
      });

      await act(async () => {
        periodRuleFieldset = getElementOrThrow(
          container,
          `[data-test="rule-list-item-${periodRuleId}"]`
        );

        expect(
          periodRuleFieldset.querySelector('button[id^="rule-context"]')
        ).toHaveTextContent('Jakso');

        expect(
          periodRuleFieldset.querySelector('button[id^="rule-frequency"]')
        ).toHaveTextContent('3. Parillinen');

        expect(
          periodRuleFieldset.querySelector('button[id^="rule-subject"]')
        ).toHaveTextContent('Maanantai');

        expect(
          periodRuleFieldset.querySelector('button[id^="rule-start"]')
        ).toHaveTextContent('--');

        expect(
          periodRuleFieldset.querySelector(
            '[data-test="rule-subject-indicator"]'
          )
        ).toHaveTextContent('');

        const monthRuleFieldset = getElementOrThrow(
          container,
          `[data-test="rule-list-item-${monthRuleId}"]`
        );

        expect(
          monthRuleFieldset.querySelector('button[id^="rule-context"]')
        ).toHaveTextContent('Kuukausi');

        expect(
          monthRuleFieldset.querySelector('button[id^="rule-frequency"]')
        ).toHaveTextContent('Jokainen');

        expect(
          monthRuleFieldset.querySelector('button[id^="rule-subject"]')
        ).toHaveTextContent('Viikko');

        expect(
          monthRuleFieldset.querySelector('button[id^="rule-start"]')
        ).toHaveTextContent('2.');

        expect(
          monthRuleFieldset.querySelector(
            '[data-test="rule-subject-indicator"]'
          )
        ).toHaveTextContent('Viikko');
      });
    });

    it('should save added rules after edit', async () => {
      let container: Element;

      act(() => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [timeSpanGroupA],
          },
        } as OpeningPeriodFormProps);
      });

      await act(async () => {
        const addRuleButton = getElementOrThrow(
          container,
          '[data-test="add-new-rule-button-0"]'
        );
        fireEvent.click(addRuleButton);
      });

      await act(async () => {
        await selectOption({
          container,
          id: '#rule-context-0-1',
          value: 'Jakso',
        });
      });

      await act(async () => {
        await selectOption({
          container,
          id: '#rule-frequency-0-1',
          value: 'Joka toinen',
        });
      });

      await act(async () => {
        await selectOption({
          container,
          id: '#rule-subject-0-1',
          value: 'Viikko',
        });
      });

      await act(async () => {
        await selectOption({
          container,
          id: '#rule-start-0-1',
          value: '1.',
        });
      });

      await act(async () => {
        const saveButton = container.querySelector(
          '[data-test="publish-opening-period-button"]'
        );
        if (!saveButton) {
          throw new Error(`Element with selector ${saveButton} not found`);
        }

        fireEvent.click(saveButton);
      });

      await act(async () => {
        expect(submitFn).toHaveBeenCalledWith(
          expect.objectContaining({
            time_span_groups: [
              {
                ...timeSpanGroupA,
                rules: [
                  ...timeSpanGroupA.rules,
                  {
                    group: timeSpanGroupA.id,
                    context: 'period',
                    frequency_modifier: null,
                    frequency_ordinal: 2,
                    start: 1,
                    subject: 'week',
                  },
                ],
              },
            ],
          })
        );
      });
    });

    it('should remove rule', async () => {
      let container: Element;

      act(() => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [timeSpanGroupA],
          },
        } as OpeningPeriodFormProps);
      });

      await act(async () => {
        const periodRuleRemoveButton = getElementOrThrow(
          container,
          `[data-test="rule-list-item-${timeSpanGroupA.rules[0].id}"] [data-test^=remove-rule-button]`
        );

        fireEvent.click(periodRuleRemoveButton);
      });

      await act(async () => {
        const saveButton = container.querySelector(
          '[data-test="publish-opening-period-button"]'
        );
        if (!saveButton) {
          throw new Error(`Element with selector ${saveButton} not found`);
        }

        fireEvent.click(saveButton);
      });

      await act(async () => {
        expect(submitFn).toHaveBeenCalledWith(
          expect.objectContaining({
            time_span_groups: [
              {
                ...timeSpanGroupA,
                rules: [],
              },
            ],
          })
        );
      });
    });

    it('should disable rule start when "Parillinen" frequency is selected', async () => {
      let container: Element;
      let ruleItem: Element;

      act(() => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [timeSpanGroupA],
          },
        } as OpeningPeriodFormProps);
      });

      await act(async () => {
        ruleItem = getElementOrThrow(
          container,
          `[data-test="rule-list-item-${timeSpanGroupA.rules[0].id}"`
        );
      });

      await act(async () => {
        await selectOption({
          container: ruleItem,
          id: '#rule-frequency-0-0',
          value: 'Parillinen',
        });
      });

      await act(async () => {
        const startSelect = getElementOrThrow(
          ruleItem,
          '#rule-start-0-0-toggle-button'
        );

        expect(startSelect).toBeDisabled();

        const startUnitIndicator = getElementOrThrow(
          ruleItem,
          '[data-test="rule-subject-indicator"]'
        );
        expect(startUnitIndicator).toBeEmptyDOMElement();
      });
    });

    it('should enable rule start when "Parillinen" frequency is changed to "Jokainen"', async () => {
      let container: Element;
      let ruleItem: Element;

      act(() => {
        container = renderOpeningPeriodForm({
          ...defaultProps,
          datePeriod: {
            ...baseTestDatePeriod,
            time_span_groups: [timeSpanGroupA],
          },
        } as OpeningPeriodFormProps);
      });

      await act(async () => {
        ruleItem = getElementOrThrow(
          container,
          `[data-test="rule-list-item-${timeSpanGroupA.rules[0].id}"`
        );
      });

      await act(async () => {
        await selectOption({
          container: ruleItem,
          id: '#rule-frequency-0-0',
          value: 'Jokainen',
        });
      });

      await act(async () => {
        const startSelect = getElementOrThrow(
          ruleItem,
          '#rule-start-0-0-toggle-button'
        );

        expect(startSelect).toBeEnabled();
      });
    });
  });
});
