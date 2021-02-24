import React from 'react';
import { FieldErrors } from 'react-hook-form/dist/types/errors.d';
import { Notification, TextArea, TextInput } from 'hds-react';
import './OpeningPeriodDescription.scss';
import {
  Language,
  LanguageStrings,
  TextFieldConfig,
} from '../../common/lib/types';
import {
  ErrorText,
  NotificationText,
} from '../../components/icon-text/IconText';

type TFieldValues = {
  openingPeriodTitle: LanguageStrings;
};

const titleLabelTexts: LanguageStrings = {
  fi: 'Otsikko suomeksi',
  sv: 'Otsikko ruotsiksi',
  en: 'Otsikko englanniksi',
};

const titlePlaceholderTexts: LanguageStrings = {
  fi: 'Esim. Kevään aukiolot',
  sv: 'Esim. Värets öppetider',
  en: 'Esim. Spring opening hours',
};

const descriptionLabelTexts: LanguageStrings = {
  fi: 'Valinnainen kuvaus suomeksi',
  sv: 'Valinnainen kuvaus ruotsiksi',
  en: 'Valinnainen kuvaus englanniksi',
};

const descriptionPlaceholderTexts: LanguageStrings = {
  fi: 'Esim. Kevään aukioloihin voi tulla muutoksia juhlapyhien aikaan.',
  sv: 'Esim. Värets öppetider kan ändras under helger.',
  en: 'Esim. Opening hours can change during holidays',
};

export default function OpeningPeriodDescription({
  register,
  errors,
  getValues,
  clearErrors,
  nameFieldConfig,
}: {
  register: Function;
  errors: FieldErrors<TFieldValues>;
  getValues: Function;
  clearErrors: Function;
  nameFieldConfig: TextFieldConfig;
}): JSX.Element {
  const hasError = !!errors.openingPeriodTitle;
  const titleMaxLength: number | undefined = nameFieldConfig.max_length;

  return (
    <>
      <h3 className="opening-period-section-title">Jakson kuvaus</h3>
      <div className="form-control">
        <NotificationText
          id="opening-period-title-info-text"
          className="opening-period-notification-text"
          message="Ole hyvä ja syötä otsikko ainakin yhdellä kielellä."
        />
        <div className="opening-period-text-group">
          {Object.values(Language).map((languageKey: Language) => (
            <TextInput
              key={`openingPeriodTitle-${languageKey}`}
              label={titleLabelTexts[languageKey]}
              type="text"
              name={`openingPeriodTitle[${languageKey}]`}
              data-test={`opening-period-title-${languageKey}`}
              id={`openingPeriodTitle-${languageKey}`}
              aria-invalid={errors.openingPeriodTitle ? 'true' : 'false'}
              ref={register({
                validate: {
                  requireOne: (value: string): boolean => {
                    clearErrors('openingPeriodTitle');

                    if (value) {
                      return true;
                    }
                    const allTitleTranslations: (
                      | string
                      | null
                    )[] = Object.values(getValues()?.openingPeriodTitle ?? []);

                    return !!allTitleTranslations.find(
                      (translation) => !!translation
                    );
                  },
                },
                maxLength: titleMaxLength,
              })}
              invalid={hasError}
              {...(titleMaxLength ? { maxLength: titleMaxLength } : {})}
              placeholder={titlePlaceholderTexts[languageKey] || ''}
            />
          ))}
        </div>
        {hasError && (
          <ErrorText
            id="opening-period-title-error-text"
            message="Aukiolojaksolla on oltava otsikko ainakin yhdellä kielellä."
          />
        )}
      </div>
      <div className="form-control">
        <div className="opening-period-text-group">
          {Object.values(Language).map((languageKey: Language) => (
            <TextArea
              key={`opening-period-description-${languageKey}`}
              cols={90}
              label={descriptionLabelTexts[languageKey]}
              name={`openingPeriodOptionalDescription[${languageKey}]`}
              id={`opening-period-description-${languageKey}`}
              className="opening-period-text-group-textarea"
              ref={register({ maxLength: 255 })}
              placeholder={descriptionPlaceholderTexts[languageKey] || ''}
            />
          ))}
        </div>
      </div>
    </>
  );
}
