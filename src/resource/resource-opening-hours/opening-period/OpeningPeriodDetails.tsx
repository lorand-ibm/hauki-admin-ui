import React from 'react';
import PeriodOpeningHours from './PeriodOpeningHours';
import { displayLangVersionNotFound } from '../../../components/language-select/LanguageSelect';
import {
  DatePeriod,
  GroupRule,
  Language,
  LanguageStrings,
  UiDatePeriodConfig,
} from '../../../common/lib/types';

function datePeriodDescriptionExistsInSomeLanguage(
  datePeriodDescription: LanguageStrings
): boolean {
  return !!(
    datePeriodDescription.fi ||
    datePeriodDescription.sv ||
    datePeriodDescription.en
  );
}

function containsSpecialRules(rules: GroupRule[]): boolean {
  return rules.some((rule) => {
    return (
      rule.context !== 'period' || rule.subject !== 'day' || rule.start !== 1
    );
  });
}

function getNonSupportedFeatures(datePeriod: DatePeriod): string[] {
  const nonSupportedFeatures = [];
  if (datePeriod.time_span_groups.length === 0) {
    if (datePeriod.resource_state === 'undefined') {
      nonSupportedFeatures.push(
        'Jaksolta puuttuvat aukioloajat. Jaksolla ei ole aukioloryhmää, eikä statusta'
      );
      return nonSupportedFeatures;
    }
  }

  if (datePeriod.time_span_groups.length > 1) {
    nonSupportedFeatures.push('Jakso sisältää useampia aukioloryhmiä');
    return nonSupportedFeatures;
  }

  if (
    datePeriod.time_span_groups.length > 0 &&
    datePeriod.time_span_groups[0].rules.length > 0 &&
    containsSpecialRules(datePeriod.time_span_groups[0].rules)
  ) {
    nonSupportedFeatures.push(
      'Jaksossa on erikseen määriteltyjä perustapauksesta poikkeavia toistuvuussääntöjä'
    );
  }

  if (
    datePeriod.time_span_groups.length > 0 &&
    datePeriod.time_span_groups[0].time_spans.length === 0
  ) {
    nonSupportedFeatures.push('Jakso ilman päiväkohtaisia aukioloja');
  }

  return nonSupportedFeatures;
}

function NonSupportedFeatures({
  nonSupportedFeatures,
}: {
  nonSupportedFeatures: string[];
}): JSX.Element {
  return (
    <ul>
      {nonSupportedFeatures.map((nonSupportedFeature, index) => {
        return <li key={index}>{nonSupportedFeature}</li>;
      })}
    </ul>
  );
}

export default function ({
  datePeriod,
  datePeriodConfig,
  language,
}: {
  datePeriod: DatePeriod;
  datePeriodConfig: UiDatePeriodConfig;
  language: Language;
}): JSX.Element {
  const nonSupportedFeatures = getNonSupportedFeatures(datePeriod);
  const datePeriodDescription = datePeriod.description[language];

  return (
    <div className="date-period-details-container">
      {nonSupportedFeatures.length === 0 && (
        <div>
          <PeriodOpeningHours
            datePeriod={datePeriod}
            datePeriodConfig={datePeriodConfig}
            language={language}
          />
          {datePeriodDescriptionExistsInSomeLanguage(
            datePeriod.description
          ) && (
            <div
              data-test="date-period-description"
              className="date-period-description">
              <div>
                {datePeriodDescription && (
                  <p data-test="date-period-description-text">
                    {datePeriodDescription}
                  </p>
                )}
                {!datePeriodDescription && (
                  <p>
                    {displayLangVersionNotFound({
                      language,
                      label: 'aukiolojakson kuvaus',
                    })}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {nonSupportedFeatures.length > 0 && (
        <div>
          <p data-test="non-supported-features-info">
            Aukiolojaksossa on tietoja joiden näyttämistä tässä näkymässä
            sovellus ei vielä tue:
          </p>
          <NonSupportedFeatures nonSupportedFeatures={nonSupportedFeatures} />
        </div>
      )}
    </div>
  );
}
