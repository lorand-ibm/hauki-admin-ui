import React from 'react';
import {
  DatePeriod,
  Language,
  LanguageStrings,
  ResourceState,
  UiDatePeriodConfig,
  UiOptionsFieldConfig,
} from '../../../common/lib/types';
import {
  createWeekdaysStringFromIndices,
  dropMilliseconds,
} from '../../../common/utils/date-time/format';
import './PeriodOpeningHours.scss';
import { displayLangVersionNotFound } from '../../../components/language-select/LanguageSelect';

function findResourceStateLabelByValueAndLang(
  value: ResourceState | undefined,
  resourceState: UiOptionsFieldConfig,
  language: Language
): string | null {
  const resourceStateObj = resourceState.options.find(
    (resourceStateOption) => resourceStateOption.value === value
  )?.label;

  return resourceStateObj ? resourceStateObj[language] : null;
}

function renderStartAndEndTimes(
  startTime?: string | null,
  endTime?: string | null,
  fullDay?: boolean,
  resourceState?: ResourceState
): string {
  if (fullDay) {
    if (resourceState === ResourceState.CLOSED) {
      return '';
    }
    return '24h';
  }

  return `${startTime ? dropMilliseconds(startTime) : ''} - ${
    endTime ? dropMilliseconds(endTime) : ''
  }`;
}

function timeSpanHasDescription(
  timeSpanDescriptionObj: LanguageStrings | undefined
): boolean {
  if (!timeSpanDescriptionObj) {
    return false;
  }
  return !!(
    timeSpanDescriptionObj.fi ||
    timeSpanDescriptionObj.sv ||
    timeSpanDescriptionObj.en
  );
}

function renderTimeSpanDescription(
  descriptionObj: LanguageStrings | undefined,
  language: Language
): string {
  if (!descriptionObj) {
    return '';
  }

  if (!timeSpanHasDescription(descriptionObj)) {
    return '';
  }

  if (!descriptionObj[language]) {
    return displayLangVersionNotFound({
      language,
      label: 'aukiolon kuvaus',
    });
  }
  return descriptionObj[language] || '';
}

export default function PeriodOpeningHours({
  datePeriod,
  datePeriodConfig,
  language,
}: {
  datePeriod: DatePeriod;
  datePeriodConfig: UiDatePeriodConfig;
  language: Language;
}): JSX.Element {
  const timeSpans = datePeriod.time_span_groups[0].time_spans;

  return (
    <div data-test="period-opening-hours-container">
      {timeSpans.map((timeSpan, index) => {
        return (
          <div data-test="time-span-row" className="time-span-row" key={index}>
            <p data-test={`time-span-weekday-string-${index}`}>
              {createWeekdaysStringFromIndices(timeSpan.weekdays, language)}
            </p>
            <p data-test={`time-span-start-end-times-string-${index}`}>
              {renderStartAndEndTimes(
                timeSpan.start_time,
                timeSpan.end_time,
                timeSpan.full_day,
                timeSpan.resource_state
              )}
            </p>
            <p data-test={`time-span-resource-state-${index}`}>
              {findResourceStateLabelByValueAndLang(
                timeSpan.resource_state,
                datePeriodConfig.resourceState,
                language
              ) || 'Auki'}
            </p>
            <p
              data-test={`time-span-description-${index}`}
              className="time-span-preview-description">
              {renderTimeSpanDescription(timeSpan.description, language)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
