import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import api, { Target, LinkTypes } from '../../common/utils/api/api';
import TargetPage from './TargetPage';

const testTarget: Target = {
  id: 'tprek:1000',
  name: 'Test target',
  address: 'Main street, Helsinki',
  description: 'Test target description',
  // eslint-disable-next-line @typescript-eslint/camelcase
  links: [{ link_type: LinkTypes.ADMIN, url: 'http://local.trek:3001' }],
};

describe(`<TargetPage />`, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should show loading indicator', async () => {
    jest
      .spyOn(api, 'getTarget')
      .mockImplementation(() => Promise.resolve(testTarget));

    const targetPage = mount(<TargetPage id="tprek:8100" />);

    await act(async () => {
      targetPage.update(); // First tick to trigger useEffect to load
    });

    expect(targetPage.find('p').text()).toEqual(
      'Toimipisteen tietoja ladataan...'
    );
  });

  test('should show error notification', async () => {
    jest
      .spyOn(api, 'getTarget')
      .mockImplementation(() =>
        Promise.reject(new Error('Failed to load a target'))
      );

    const targetPage = mount(<TargetPage id="tprek:8100" />);

    await act(async () => {
      targetPage.update(); // First tick for useEffect
    });

    targetPage.update(); // Second tick for useState

    expect(targetPage.text()).toContain('Toimipistettä ei saatu ladattua.');
  });

  test('should show target details', async () => {
    jest
      .spyOn(api, 'getTarget')
      .mockImplementation(() => Promise.resolve(testTarget));

    const targetPage = mount(<TargetPage id={testTarget.id} />);

    await act(async () => {
      targetPage.update(); // First tick for useEffect
    });

    targetPage.update(); // Second tick for useState

    expect(targetPage.find('h1').text()).toEqual(testTarget.name);
    expect(targetPage.find('address').text()).toEqual(testTarget.address);
    expect(targetPage.find('#target-description p').text()).toEqual(
      testTarget.description
    );
  });

  test('should show target source link', async () => {
    jest
      .spyOn(api, 'getTarget')
      .mockImplementation(() => Promise.resolve(testTarget));

    const targetPage = mount(<TargetPage id={testTarget.id} />);

    await act(async () => {
      targetPage.update(); // First tick for useEffect
    });

    targetPage.update(); // Second tick for useState

    expect(
      targetPage.find(`a[href="${testTarget.links[0].url}"]`).exists()
    ).toBe(true);
  });
});
