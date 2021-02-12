import {
  FormWeekdays,
  GroupRule,
  GroupRuleFormFormat,
  Language,
  LanguageStrings,
  TimeSpan as TimeSpanApiFormat,
  TimeSpanFormFormat,
  TimeSpanGroup,
  TimeSpanGroupFormFormat,
} from '../../../common/lib/types';
import { dropMilliseconds } from '../../../common/utils/date-time/format';

const filterValidTimeSpan = (value: TimeSpanFormFormat | {}): boolean =>
  Object.keys(value).length > 0;

const handleApiLanguageStrings = (
  object?: LanguageStrings
): LanguageStrings | undefined =>
  !object
    ? undefined
    : Object.keys(object).reduce<LanguageStrings>(
        (acc: LanguageStrings, current: string): LanguageStrings => {
          const value: string | null = object[current as Language];
          return { ...acc, [current]: value || null };
        },
        { fi: null, sv: null, en: null }
      );

function formatTimeSpansToApiFormat(
  timeSpans: TimeSpanFormFormat[]
): TimeSpanApiFormat[] {
  return timeSpans.map(
    ({
      id,
      group,
      description,
      endTime,
      startTime,
      weekdays,
      resourceState,
      fullDay,
    }) => {
      return {
        ...(id && id !== '' ? { id: parseInt(id, 10) } : {}),
        ...(group && group !== '' ? { group: parseInt(group, 10) } : {}),
        description: handleApiLanguageStrings(description),
        end_time: endTime ? `${endTime}:00` : null,
        start_time: startTime ? `${startTime}:00` : null,
        resource_state: resourceState,
        full_day: fullDay,
        weekdays: weekdays.reduce(
          (acc: Array<number>, currentValue: boolean, currentIndex: number) => {
            if (currentValue) {
              acc.push(currentIndex + 1);
              return acc;
            }
            return acc;
          },
          []
        ),
      };
    }
  );
}

const getLowestWeekdayNumber = (timeSpan: TimeSpanApiFormat): number =>
  timeSpan && timeSpan.weekdays ? timeSpan.weekdays.sort()[0] : 0;

function formatApiTimeSpansToFormFormat(
  apiTimeSpans: TimeSpanApiFormat[]
): TimeSpanFormFormat[] {
  return apiTimeSpans
    .sort((a: TimeSpanApiFormat, b: TimeSpanApiFormat) => {
      return getLowestWeekdayNumber(a) - getLowestWeekdayNumber(b);
    })
    .map((apiTimeSpan) => {
      const weekdays: boolean[] = Array(7)
        .fill(false)
        .map((current, index): boolean =>
          apiTimeSpan.weekdays
            ? apiTimeSpan.weekdays.includes(index + 1)
            : false
        );

      return {
        id: apiTimeSpan.id ? apiTimeSpan.id.toString() : undefined,
        group: apiTimeSpan.group ? apiTimeSpan.group.toString() : undefined,
        description: apiTimeSpan.description?.fi || '',
        startTime: apiTimeSpan.start_time
          ? dropMilliseconds(apiTimeSpan.start_time)
          : '',
        endTime: apiTimeSpan.end_time
          ? dropMilliseconds(apiTimeSpan.end_time)
          : '',
        resourceState: apiTimeSpan?.resource_state,
        weekdays: weekdays as FormWeekdays,
        fullDay: apiTimeSpan.full_day ? apiTimeSpan.full_day : false,
      };
    });
}

function formatRulesToApiFormat(
  rules: GroupRuleFormFormat[] = []
): GroupRule[] {
  return rules.map(({ id, group, start, ...rest }) => ({
    ...rest,
    ...(id && id !== '' ? { id: parseInt(id, 10) } : {}),
    ...(group && group !== '' ? { group: parseInt(group, 10) } : {}),
    start: start ? parseInt(start, 10) : undefined,
  }));
}

function formatApiRulesToFormFormat(rules: GroupRule[]): GroupRuleFormFormat[] {
  return rules.map(({ id, group, start, ...rest }) => ({
    ...rest,
    id: id ? id.toString() : '',
    group: group ? group.toString() : '',
    start: start ? start.toString() : '',
  }));
}

export function formatTimeSpanGroupsToApiFormat(
  timeSpanGroups: TimeSpanGroupFormFormat[] = []
): TimeSpanGroup[] {
  return timeSpanGroups.map(({ rules = [], timeSpans = [], id, period }) => ({
    ...(id && id !== '' ? { id: parseInt(id, 10) } : {}),
    ...(period && period !== '' ? { period: parseInt(period, 10) } : {}),
    rules: formatRulesToApiFormat(rules),
    time_spans: formatTimeSpansToApiFormat(
      timeSpans.filter(filterValidTimeSpan) as TimeSpanFormFormat[]
    ),
  }));
}

export function formatTimeSpanGroupsToFormFormat(
  timeSpanGroups: TimeSpanGroup[]
): TimeSpanGroupFormFormat[] {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return timeSpanGroups.map(({ rules, time_spans, id, period }) => ({
    id: id ? id.toString() : '',
    period: period ? period.toString() : '',
    rules: formatApiRulesToFormFormat(rules),
    timeSpans: formatApiTimeSpansToFormFormat(time_spans),
  }));
}
