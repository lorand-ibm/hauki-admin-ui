import React from 'react';
import {
  DatePeriod,
  Language,
  LanguageStrings,
  ResourceState,
  TimeSpan,
  UiDatePeriodConfig,
  UiFieldConfig,
  WeekdayTypes,
} from '../../../common/lib/types';
import { dropMilliseconds } from '../../../common/utils/date-time/format';
import './WeekdayOpeningHours.scss';

interface WeekdayRow {
  weekdayIndex: WeekdayTypes;
  startTime: string;
  endTime: string;
  resourceState: ResourceState;
  description: LanguageStrings;
}

type WeekdayIndexToShortNameMappings = {
  [language in Language]: {
    [weekdayType in WeekdayTypes]: string;
  };
};

function createWeekdayRowsFromTimeSpans(timeSpans: TimeSpan[]): WeekdayRow[] {
  return timeSpans
    .map((timeSpan) => {
      return timeSpan.weekdays?.map((weekdayIndex) => {
        return {
          weekdayIndex,
          startTime: timeSpan.start_time,
          endTime: timeSpan.end_time,
          resourceState: timeSpan.resource_state,
          description: timeSpan.description,
        };
      });
    })
    .flat()
    .sort(
      (weekdayRowA, weekdayRowB) =>
        weekdayRowA.weekdayIndex - weekdayRowB.weekdayIndex
    );
}

const weekdays: WeekdayIndexToShortNameMappings = {
  fi: {
    1: 'ma',
    2: 'ti',
    3: 'ke',
    4: 'to',
    5: 'pe',
    6: 'la',
    7: 'su',
  },
  sv: {
    1: 'Mån',
    2: 'Tis',
    3: 'Ons',
    4: 'Tors',
    5: 'Fre',
    6: 'Lör',
    7: 'Sön',
  },
  en: {
    1: 'Mon.',
    2: 'Tue.',
    3: 'Wed.',
    4: 'Thu.',
    5: 'Fri.',
    6: 'Sat.',
    7: 'Sun.',
  },
};

function getWeekdayShortNameByIndexAndLang({
  weekdayIndex,
  language,
}: {
  weekdayIndex: WeekdayTypes;
  language: Language;
}): string {
  return weekdays[language][weekdayIndex];
}

function findResourceStateLabelByValue(
  value: ResourceState | undefined,
  resourceState: UiFieldConfig
): string | undefined {
  const resourceStateLabel = resourceState.options.find(
    (resourceStateOption) => {
      return resourceStateOption.value === value;
    }
  )?.label;

  return resourceStateLabel;
}

export default function WeekdayOpeningHours({
  datePeriod,
  datePeriodConfig,
  language,
}: {
  datePeriod: DatePeriod;
  datePeriodConfig: UiDatePeriodConfig;
  language: Language;
}): JSX.Element {
  const timeSpans = datePeriod.time_span_groups[0].time_spans;
  const weekdayRows = createWeekdayRowsFromTimeSpans(timeSpans);

  return (
    <div className="weekdays-container">
      {weekdayRows.map((weekdayRow, index) => {
        return (
          <div className="weekday-row" key={index}>
            <p>
              {getWeekdayShortNameByIndexAndLang({
                weekdayIndex: weekdayRow.weekdayIndex,
                language,
              })}
            </p>
            <p>
              {dropMilliseconds(weekdayRow.startTime)} -{' '}
              {dropMilliseconds(weekdayRow.endTime)}
            </p>
            <p>
              {findResourceStateLabelByValue(
                weekdayRow.resourceState,
                datePeriodConfig.resourceState
              ) || 'Auki'}
            </p>
            <p className="weekday-description">
              {weekdayRow.description?.fi || ''}
            </p>
          </div>
        );
      })}
    </div>
  );
}
