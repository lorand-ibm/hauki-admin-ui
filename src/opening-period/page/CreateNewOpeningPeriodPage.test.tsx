import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatePeriod, Resource, ResourceState } from '../../common/lib/types';
import api from '../../common/utils/api/api';
import CreateNewOpeningPeriodPage from './CreateNewOpeningPeriodPage';

const testResource: Resource = {
  id: 1186,
  name: {
    fi: 'Test resource name in finnish',
    sv: 'Test resource name in swedish',
    en: 'Test resource name in english',
  },
  address: {
    fi: 'Test address in finnish',
    sv: 'Test address in swedish',
    en: 'Test address in english',
  },
  description: {
    fi: 'Test description in finnish',
    sv: 'Test description in swedish',
    en: 'Test description in english',
  },
  extra_data: {
    citizen_url: 'kansalaisen puolen url',
    admin_url: 'admin puolen url',
  },
};

const testDatePeriod: DatePeriod = {
  id: 1,
  created: '2020-11-20',
  modified: '2020-11-20',
  is_removed: false,
  name: { fi: '', sv: '', en: '' },
  description: { fi: '', sv: '', en: '' },
  start_date: '',
  end_date: '2020-11-21',
  resource_state: ResourceState.OPEN,
  override: false,
  resource: 1,
  time_span_groups: [],
};

describe(`<CreateNewOpeningPeriodPage />`, () => {
  async function fillCompulsoryFormFields(container: Element): Promise<void> {
    // Enter title:
    const titleInput = await screen.findByRole('textbox', {
      name: 'Aukiolojakson otsikko *',
    });
    fireEvent.input(titleInput, {
      target: {
        value: 'Test title',
      },
    });

    // Enter begin date
    const beginDateButton = container
      .querySelector('[data-test="openingPeriodBeginDate"]')
      ?.querySelector('button.iconCalendar');
    if (!beginDateButton) {
      throw new Error('BeginDate button not found');
    }
    fireEvent.click(beginDateButton);
    const todayButton = container.querySelector('button.dayToday');
    if (!todayButton) {
      throw new Error('Today button not found');
    }
    fireEvent.click(todayButton);

    // Enter end date
    const endDate = container.querySelector(
      '[data-test="openingPeriodEndDate"]'
    );
    const endDateButton = endDate?.querySelector('button.iconCalendar');
    if (!endDateButton) {
      throw new Error('EndDate button not found');
    }
    fireEvent.click(endDateButton);
    const nextMonthButton = container.querySelector(
      '[data-test="show-next-month-button"]'
    );
    if (!nextMonthButton) {
      throw new Error('nextMonthButton not found');
    }
    fireEvent.click(nextMonthButton);
    // Last one requires a separate act wrapping
    await act(async () => {
      fireEvent.click(screen.getByText('01'));
    });
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading indicator while loading resource info', async () => {
    jest.spyOn(api, 'getResource').mockImplementation(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return new Promise(() => {});
    });

    render(<CreateNewOpeningPeriodPage resourceId="tprek:8100" />);

    expect(await screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Aukiolojakson lisäys'
    );
    expect(await screen.getByText('Sivua ladataan...')).toBeInTheDocument();
  });

  it('should show error notification if loading resource info on page load fails', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() =>
        Promise.reject(new Error('Failed to load a resource'))
      );

    render(<CreateNewOpeningPeriodPage resourceId="tprek:8100" />);

    await act(async () => {
      const errorHeading = await screen.getByRole('heading', { level: 1 });
      const notificationText = await screen.findByTestId(
        'error-retrieving-resource-info'
      );
      expect(errorHeading).toHaveTextContent('Virhe');
      expect(notificationText).toBeInTheDocument();
    });
  });

  it('should show error notification when form submit fails api side', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testResource));

    jest
      .spyOn(api, 'postDatePeriod')
      .mockImplementation(() =>
        Promise.reject(new Error('ApiError for test purpose'))
      );

    const { container } = render(
      <CreateNewOpeningPeriodPage resourceId="tprek:8100" />
    );

    if (!container) {
      throw new Error(
        'Something went wrong in rendering of CreateNewOpeningPeriodPage'
      );
    }

    // Have to do this in act, otherwise dom not updated from initial loadings
    await act(async () => {
      await fillCompulsoryFormFields(container);

      // Try submit form
      const submitFormButton = container.querySelector(
        '[data-test="publish-new-opening-period-button"]'
      );

      if (!submitFormButton) {
        throw new Error('submitFormButton not found!');
      }
      fireEvent.submit(submitFormButton);
    });

    expect(
      await screen.findByTestId('opening-period-creation-failed')
    ).toBeInTheDocument();
  });

  it('should show success notification on successful form submit', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testResource));

    jest
      .spyOn(api, 'postDatePeriod')
      .mockImplementation(() => Promise.resolve(testDatePeriod));

    const { container } = render(
      <CreateNewOpeningPeriodPage resourceId="tprek:8100" />
    );

    if (!container) {
      throw new Error(
        'Something went wrong in rendering of CreateNewOpeningPeriodPage'
      );
    }

    // Have to do this in act, otherwise dom not updated from initial loadings
    await act(async () => {
      await fillCompulsoryFormFields(container);

      // Try submit form
      const submitFormButton = container.querySelector(
        '[data-test="publish-new-opening-period-button"]'
      );

      if (!submitFormButton) {
        throw new Error('submitFormButton not found!');
      }
      fireEvent.submit(submitFormButton);
    });

    await act(async () => {
      expect(
        await screen.findByTestId(
          'opening-period-added-successfully-notification'
        )
      ).toBeInTheDocument();
    });
  });

  it('Should show required indicator when title is not set', async () => {
    jest
      .spyOn(api, 'getResource')
      .mockImplementation(() => Promise.resolve(testResource));

    let container: HTMLElement;

    await act(async () => {
      container = render(<CreateNewOpeningPeriodPage resourceId="tprek:8100" />)
        .container;

      if (!container) {
        throw new Error(
          'Something went wrong in rendering of CreateNewOpeningPeriodPage'
        );
      }
    });

    // try submit form without any input data:
    await act(async () => {
      // Try submit form
      const submitFormButton = container.querySelector(
        '[data-test="publish-new-opening-period-button"]'
      );
      if (!submitFormButton) {
        throw new Error('submitFormButton not found!');
      }
      fireEvent.submit(submitFormButton);
    });

    await act(async () => {
      const requiredIndicator = await screen.findByText(
        'Aukiolojakson otsikko on pakollinen'
      );
      expect(requiredIndicator).toBeInTheDocument();
    });
  });
});
