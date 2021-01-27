import React from 'react';
import {
  DatePeriod,
  Language,
  ResourceState,
  UiDatePeriodConfig,
  UiFieldConfig,
} from '../../../common/lib/types';
import {
  createWeekdaysStringFromIndices,
  dropMilliseconds,
} from '../../../common/utils/date-time/format';
import './PeriodOpeningHours.scss';

function findResourceStateLabelByValue(
  value: ResourceState | undefined,
  resourceState: UiFieldConfig
): string | undefined {
  return resourceState.options.find(
    (resourceStateOption) => resourceStateOption.value === value
  )?.label;
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
              {dropMilliseconds(timeSpan.start_time)} -{' '}
              {dropMilliseconds(timeSpan.end_time)}
            </p>
            <p data-test={`time-span-resource-state-${index}`}>
              {findResourceStateLabelByValue(
                timeSpan.resource_state,
                datePeriodConfig.resourceState
              ) || 'Auki'}
            </p>
            <p
              data-test={`time-span-description-${index}`}
              className="time-span-preview-description">
              {timeSpan.description?.fi || ''}
            </p>
          </div>
        );
      })}
    </div>
  );
}
