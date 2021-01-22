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
    <>
      {timeSpans.map((timeSpan, index) => {
        return (
          <div className="time-span-row" key={index}>
            <p>
              {createWeekdaysStringFromIndices(timeSpan.weekdays, language)}
            </p>
            <p>
              {dropMilliseconds(timeSpan.start_time)} -{' '}
              {dropMilliseconds(timeSpan.end_time)}
            </p>
            <p>
              {findResourceStateLabelByValue(
                timeSpan.resource_state,
                datePeriodConfig.resourceState
              ) || 'Auki'}
            </p>
            <p className="time-span-preview-description">
              {timeSpan.description?.fi || ''}
            </p>
          </div>
        );
      })}
    </>
  );
}
