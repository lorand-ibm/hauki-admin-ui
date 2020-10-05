import React from 'react';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import api from '../../common/utils/api/api';
import TargetPage from './TargetPage';

jest.mock('../../common/utils/api/api');
const apiMock = api as jest.Mocked<typeof api>;
jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

describe.only(`<TargetPage />`, () => {
  test('should show loading indicator', () => {
    const targetPage = shallow(<TargetPage id="tprek:8100" />);
    expect(targetPage.find('p').text()).toEqual(
      'Toimipisteen tietoja ladataan...'
    );
  });

  test('should error notification', () => {
    let targetPage: ReactWrapper | undefined;
    apiMock.getTarget.mockResolvedValue(
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject('Can not load target')
    );

    act(() => {
      targetPage = mount(<TargetPage id="tprek:8100" />);
      targetPage.setProps({});
      console.log(targetPage?.html());
    });

    expect(targetPage?.find('p').text()).toEqual(
      'Toimipisteen tietoja ei saatu ladattua....'
    );
  });
});
