import React from 'react';
import { FieldErrors } from 'react-hook-form/dist/types/errors.d';
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
  return (
    <>
      <h3 className="opening-period-section-title">Jakson kuvaus</h3>
      <label htmlFor="openingPeriodTitle">Aukiolojakson otsikko *</label>
      <input
        className="add-new-opening-period-title"
        type="text"
        name="openingPeriodTitle"
        data-test="openingPeriodTitle"
        id="openingPeriodTitle"
        aria-invalid={errors.openingPeriodTitle ? 'true' : 'false'}
        ref={register({ required: true, maxLength: 100 })}
      />
      {errors.openingPeriodTitle &&
        errors.openingPeriodTitle.type === 'required' && (
          <span role="alert">Aukiolojakson otsikko on pakollinen</span>
        )}

      <label htmlFor="openingPeriodOptionalDescription">
        Jakson valinnainen kuvaus
      </label>
      <textarea
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
