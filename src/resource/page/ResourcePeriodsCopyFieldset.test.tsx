import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import api from '../../common/utils/api/api';
import toast from '../../components/notification/Toast';
import ResourcePeriodsCopyFieldset, {
  TargetResourcesProps,
} from './ResourcePeriodsCopyFieldset';

const testCopyResourceData: TargetResourcesProps = {
  mainResourceId: 1111,
  mainResourceName: 'testTargetResource',
  targetResources: ['tprek: 1122'],
};

describe(`<ResourcePeriodsCopyFieldset/>`, () => {
  const { close } = window;

  const onChange = jest.fn();

  beforeAll(() => {
    delete window.close;
    window.close = jest.fn();
  });
  afterAll(() => {
    window.close = close;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should copy targets when user clicks the copy button', async () => {
    const utcTimeString = '2022-01-24T18:00:00.000Z';
    jest.spyOn(Date.prototype, 'toJSON').mockReturnValue(utcTimeString);

    const apiCopySpy = jest
      .spyOn(api, 'copyDatePeriods')
      .mockImplementation(() => Promise.resolve(true));

    const toastSuccessSpy = jest.spyOn(toast, 'success');

    render(
      <ResourcePeriodsCopyFieldset
        {...testCopyResourceData}
        hasReferrer={false}
        onChange={onChange}
      />
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Päivitä aukiolotiedot 1 muuhun toimipisteeseen',
      })
    );

    await waitFor(async () => {
      expect(apiCopySpy).toHaveBeenCalledWith(
        testCopyResourceData.mainResourceId,
        testCopyResourceData.targetResources
      );
      expect(toastSuccessSpy).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith({
        ...testCopyResourceData,
        modified: utcTimeString,
      });
    });
  });

  it('should close app window when the app is opened from another window', async () => {
    jest
      .spyOn(api, 'copyDatePeriods')
      .mockImplementation(() => Promise.resolve(true));
    jest.spyOn(toast, 'success');

    render(
      <ResourcePeriodsCopyFieldset
        {...testCopyResourceData}
        hasReferrer
        onChange={onChange}
      />
    );

    userEvent.click(
      screen.getByRole('button', {
        name:
          'Päivitä aukiolotiedot 1 muuhun toimipisteeseen. Ikkuna sulkeutuu.',
      })
    );

    await waitFor(async () => {
      expect(window.close).toHaveBeenCalled();
    });
  });

  it('should show error notification when api copy fails', async () => {
    const error: Error = new Error('Failed to load a resource');
    const apiCopySpy = jest
      .spyOn(api, 'copyDatePeriods')
      .mockImplementation(() => Promise.reject(error));
    const toastErrorSpy = jest.spyOn(toast, 'error');
    jest.spyOn(global.console, 'error').mockImplementationOnce((e) => e);

    render(
      <ResourcePeriodsCopyFieldset
        {...testCopyResourceData}
        hasReferrer={false}
        onChange={onChange}
      />
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Päivitä aukiolotiedot 1 muuhun toimipisteeseen',
      })
    );

    await waitFor(async () => {
      expect(apiCopySpy).toHaveBeenCalled();
      expect(toastErrorSpy).toHaveBeenCalled();
    });
  });
});
