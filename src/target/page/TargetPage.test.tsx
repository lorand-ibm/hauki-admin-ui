import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import api, { Target } from '../../common/utils/api/api';
import TargetPage from './TargetPage';

const TEST_TARGET: Target = {
  id: 'tprek:1000',
  name: 'Test target',
  address: 'Main street, Helsinki',
  description: 'Test target description',
};

describe(`<TargetPage />`, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show loading indicator', async () => {
    jest.spyOn(api, 'getTarget').mockImplementation(() =>
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.resolve(TEST_TARGET)
    );

    const targetPage = mount(<TargetPage id="tprek:8100" />);

    await act(async () => {
      targetPage.update(); // First tick to trigger useEffect to load
    });

    expect(targetPage.find('p').text()).toEqual(
      'Toimipisteen tietoja ladataan...'
    );
  });

  test('should show error notification', async () => {
    jest.spyOn(api, 'getTarget').mockImplementation(() =>
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject('Failed to load a target')
    );

    const targetPage = mount(<TargetPage id="tprek:8100" />);

    await act(async () => {
      targetPage.update(); // First tick for useEffect
    });

    targetPage.update(); // Second tick for useState

    expect(targetPage.text()).toContain('Toimipistettä ei saatu ladattua.');
  });

  test('should show target details', async () => {
    jest.spyOn(api, 'getTarget').mockImplementation(() =>
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.resolve(TEST_TARGET)
    );

    const targetPage = mount(<TargetPage id={TEST_TARGET.id} />);

    await act(async () => {
      targetPage.update(); // First tick for useEffect
    });

    targetPage.update(); // Second tick for useState

    expect(targetPage.find('h1').text()).toEqual(TEST_TARGET.name);
    expect(targetPage.find('address').text()).toEqual(TEST_TARGET.address);
    expect(targetPage.find('p').text()).toEqual(TEST_TARGET.description);
  });
});
