import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getElementOrThrow } from '../../../test/test-utils';
import { AppContext } from '../../App-context';
import HaukiNavigation from './HaukiNavigation';

describe('<HaukiNavigation>', () => {
  test('Should show close button if app window has a referrer', () => {
    const closeAppWindow = jest.fn();
    const { container } = render(
      <AppContext.Provider value={{ hasReferrer: true, closeAppWindow }}>
        <HaukiNavigation />
      </AppContext.Provider>
    );
    userEvent.click(
      getElementOrThrow(container, '[data-test="close-window-button"]')
    );

    expect(closeAppWindow).toHaveBeenCalled();
  });
});
