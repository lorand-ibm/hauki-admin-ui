import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom';

configure({ adapter: new Adapter() });
