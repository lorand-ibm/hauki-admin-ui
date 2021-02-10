import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { datePeriodOptions } from '../../../../test/fixtures/api-options';
import { datePeriod } from '../../../../test/fixtures/api-date-period';
import {
  DatePeriod,
  Language,
  UiDatePeriodConfig,
} from '../../../common/lib/types';
import OpeningPeriod from './OpeningPeriod';

const testDatePeriod: DatePeriod = datePeriod;
const testDatePeriodOptions: UiDatePeriodConfig = datePeriodOptions;

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
