import React from 'react';
import { FieldErrors } from 'react-hook-form/dist/types/errors.d';
import { TextArea, TextInput } from 'hds-react';
import '../page/CreateNewOpeningPeriodPage.scss';
import './OpeningPeriodDescription.scss';

type TFieldValues = {
  openingPeriodTitle: string;
};

export default function OpeningPeriodDescription({
  register,
  errors,
}: {
  register: Function;
  errors: FieldErrors<TFieldValues>;
}): JSX.Element {
  const hasError =
    errors.openingPeriodTitle && errors.openingPeriodTitle.type === 'required';

  return (
    <>
      <h3 className="opening-period-section-title">Jakson kuvaus</h3>
      <label htmlFor="openingPeriodTitle">Aukiolojakson otsikko *</label>
      <TextInput
        className="add-new-opening-period-title"
        type="text"
        name="openingPeriodTitle"
        data-test="openingPeriodTitle"
        id="openingPeriodTitle"
        aria-invalid={errors.openingPeriodTitle ? 'true' : 'false'}
        ref={register({ required: true, maxLength: 100 })}
        helperText={
          hasError ? 'Aukiolojakson otsikko on pakollinen' : undefined
        }
        invalid={hasError}
      />
      <label htmlFor="openingPeriodOptionalDescription">
        Jakson valinnainen kuvaus
      </label>
      <TextArea
        cols={90}
        rows={9}
        className="opening-period-optional-description"
        id="openingPeriodOptionalDescription"
        name="openingPeriodOptionalDescription"
        ref={register({ maxLength: 255 })}
      />
    </>
  );
}
