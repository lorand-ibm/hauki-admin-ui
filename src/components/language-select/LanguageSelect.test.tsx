import React from 'react';
import { render, screen } from '@testing-library/react';
import { Language } from '../../common/lib/types';
import LanguageSelect from './LanguageSelect';

describe(`<LanguageSelect />`, () => {
  it('should show selected language', () => {
    let selectedLanguage = Language.FI;

    // eslint-disable-next-line no-return-assign
    const onSelect = (language: Language): Language =>
      (selectedLanguage = language);

    render(
      <LanguageSelect
        id="test-select"
        label="test-select"
        selectedLanguage={selectedLanguage}
        onSelect={onSelect}
      />
    );

    expect(screen.getAllByText('FI').length).toEqual(1);
  });
});
