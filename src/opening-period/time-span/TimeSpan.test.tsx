import React, { ReactNode } from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { datePeriod } from '../../../test/fixtures/api-date-period';
import { TimeSpanFormFormat } from '../../common/lib/types';
import TimeSpan from './TimeSpan';

function renderWithReactHookForm(
  component: JSX.Element,
  { defaultValues = {} } = {}
): RenderResult {
  const Wrapper = ({ children }: { children?: ReactNode }): JSX.Element => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  return {
    ...render(component, { wrapper: Wrapper }),
  };
}

describe(`<TimeSpan />`, () => {
  it('should disable time input fields if full day is checked', async () => {
    const item = (datePeriod.time_span_groups[0]
      .time_spans[0] as unknown) as Partial<Record<string, TimeSpanFormFormat>>;

    const resourceStateConfig = {
      options: [
        {
          value: 'open',
          label: 'Auki',
        },
        {
          value: 'self_service',
          label: 'Itsepalvelu',
        },
      ],
    };

    const removeMock = jest.fn();

    const { container } = renderWithReactHookForm(
      <TimeSpan
        item={item}
        resourceStateConfig={resourceStateConfig}
        index={0}
        groupIndex={0}
        remove={removeMock}
        errors={undefined}
      />
    );

    await act(async () => {
      const fullDayCheckbox = container.querySelector(
        '[id="timeSpanGroups.0.timeSpans.0.fullDay"]'
      );

      if (!fullDayCheckbox) {
        throw new Error('fullDayCheckbox not found');
      }
      await fireEvent.click(fullDayCheckbox);
    });

    expect(
      await container.querySelector(
        'input[data-test="time-span-start-time-0-0"]'
      )
    ).toHaveAttribute('disabled');

    expect(
      await container.querySelector('input[data-test="time-span-end-time-0-0"]')
    ).toHaveAttribute('disabled');
  });
});
