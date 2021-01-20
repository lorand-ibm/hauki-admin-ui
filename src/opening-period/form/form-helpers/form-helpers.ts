import {
  FormWeekdays,
  GroupRule,
  GroupRuleFormFormat,
  TimeSpan as TimeSpanApiFormat,
  TimeSpanFormFormat,
} from '../../../common/lib/types';
import { dropMilliseconds } from '../../../common/utils/date-time/format';

export function formatTimeSpansToApiFormat(
  timeSpans: TimeSpanFormFormat[]
): TimeSpanApiFormat[] {
  return timeSpans.map((timeSpan) => {
    return {
      id: timeSpan.id ? parseInt(timeSpan.id, 10) : undefined,
      description: {
        fi: timeSpan?.description ?? '',
        sv: null,
        en: null,
      },
      end_time: `${timeSpan.endTime}:00`,
      start_time: `${timeSpan.startTime}:00`,
      resource_state: timeSpan.resourceState,
      weekdays: timeSpan.weekdays.reduce(
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
  });
}

const getLowestWeekdayNumber = (timeSpan: TimeSpanApiFormat): number =>
  timeSpan && timeSpan.weekdays ? timeSpan.weekdays.sort()[0] : 0;

export function formatApiTimeSpansToFormFormat(
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
        description: apiTimeSpan.description?.fi || '',
        startTime: apiTimeSpan.start_time
          ? dropMilliseconds(apiTimeSpan.start_time)
          : '',
        endTime: apiTimeSpan.end_time
          ? dropMilliseconds(apiTimeSpan.end_time)
          : '',
        resourceState: apiTimeSpan?.resource_state,
        weekdays: weekdays as FormWeekdays,
      };
    });
}

export function formatRulesToApiFormat(
  rules: GroupRuleFormFormat[]
): GroupRule[] {
  return rules.map(({ id, start, ...rest }) => ({
    ...rest,
    start: parseInt(start, 10),
    ...(id && id !== '' ? { id: parseInt(id, 10) } : {}), // hidden input converts number to string
  }));
}

export function formatApiRulesToFormFormat(
  rules: GroupRule[]
): GroupRuleFormFormat[] {
  return rules.map(({ id, start, ...rest }) => ({
    ...rest,
    start: start.toString(),
    id: id ? id.toString() : '',
  }));
}
