import React from 'react';
import {
  DatePeriod,
  Language,
  LanguageStrings,
  ResourceState,
  TimeSpan,
  UiDatePeriodConfig,
  UiFieldConfig,
  Weekdays,
  WeekdayTypes,
} from '../../../common/lib/types';
import { dropMilliseconds } from '../../../common/utils/date-time/format';
import './PeriodOpeningHours.scss';

type WeekdayIndexToShortNameMappings = {
  [language in Language]: {
    [weekdayType in WeekdayTypes]: string;
  };
};

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
  return resourceState.options.find(
    (resourceStateOption) => resourceStateOption.value === value
  )?.label;
}

type WeekdaySpan = {
  startIndex: number;
  lastInsertedIndex: number;
  endIndex?: number;
};

function createWeekdaysStringFromIndices(
  weekdayIndexArray: Weekdays | null,
  language: Language
): string {
  if (!weekdayIndexArray) {
    return '';
  }

  const weekdaySpans: WeekdaySpan[] = [];
  let first = true;
  weekdayIndexArray.forEach((weekdayIndex) => {
    if (first) {
      weekdaySpans.push({
        startIndex: weekdayIndex,
        lastInsertedIndex: weekdayIndex,
      });
      first = false;
    } else {
      const currentObject = weekdaySpans[weekdaySpans.length - 1];
      if (weekdayIndex - 1 === currentObject.lastInsertedIndex) {
        currentObject.endIndex = weekdayIndex;
        currentObject.lastInsertedIndex = weekdayIndex;
      } else {
        weekdaySpans.push({
          startIndex: weekdayIndex,
          lastInsertedIndex: weekdayIndex,
        });
      }
    }
  });

  let weekdaysString = '';
  weekdaySpans.forEach((weekdaySpanObject: WeekdaySpan, index: number) => {
    if (weekdaySpanObject.endIndex) {
      weekdaysString += `${getWeekdayShortNameByIndexAndLang({
        weekdayIndex: weekdaySpanObject.startIndex,
        language,
      })} - ${getWeekdayShortNameByIndexAndLang({
        weekdayIndex: weekdaySpanObject.endIndex,
        language,
      })}`;
    } else {
      weekdaysString += `${getWeekdayShortNameByIndexAndLang({
        weekdayIndex: weekdaySpanObject.startIndex,
        language,
      })}`;
    }

    if (!(index === weekdaySpans.length - 1)) {
      weekdaysString += `, `;
    }
  });

  return weekdaysString;
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
