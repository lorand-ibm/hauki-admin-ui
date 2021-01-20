import {
  FormWeekdays,
  GroupRule,
  GroupRuleFormFormat,
  TimeSpan as TimeSpanApiFormat,
  TimeSpanFormFormat,
  TimeSpanGroup,
  TimeSpanGroupFormFormat,
} from '../../../common/lib/types';

const filterValidTimeSpan = (value: TimeSpanFormFormat | {}): boolean =>
  Object.keys(value).length > 0;

function formatTimeSpansToApiFormat(
  timeSpans: TimeSpanFormFormat[]
): TimeSpanApiFormat[] {
  return timeSpans.map(
    ({ id, description, endTime, startTime, weekdays, resourceState }) => {
      return {
        ...(id && id !== '' ? { id: parseInt(id, 10) } : {}),
        description: {
          fi: description ?? '',
          sv: null,
          en: null,
        },
        end_time: `${endTime}:00`,
        start_time: `${startTime}:00`,
        resource_state: resourceState,
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

const dropMilliseconds = (time: string): string => time.slice(0, -3);
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

function formatRulesToApiFormat(
  rules: GroupRuleFormFormat[] = []
): GroupRule[] {
  return rules.map(({ id, start, ...rest }) => ({
    ...rest,
    ...(id && id !== '' ? { id: parseInt(id, 10) } : {}),
    start: parseInt(start, 10),
  }));
}

function formatApiRulesToFormFormat(rules: GroupRule[]): GroupRuleFormFormat[] {
  return rules.map(({ id, start, ...rest }) => ({
    ...rest,
    id: id ? id.toString() : '',
    start: start.toString(),
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
