import React, { useState } from 'react';
import { ArrayField, useFieldArray, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  DatePeriod,
  DatePeriodOptions,
  FormWeekdays,
  Language,
  ResourceState,
  ResourceStateApiOption,
  ResourceStateOption,
  TimeSpan as TimeSpanApiFormat,
  TimeSpanFormFormat,
} from '../../common/lib/types';
import { transformToApiFormat } from '../../common/utils/date-time/format';
import Datepicker from '../../components/datepicker/Datepicker';
import { PrimaryButton, SecondaryButton } from '../../components/button/Button';
import { ErrorToast, SuccessToast } from '../../components/notification/Toast';
import OpeningPeriodDescription from '../description/OpeningPeriodDescription';
import TimeSpan from '../time-span/TimeSpan';
import './OpeningPeriodForm.scss';

type OpeningPeriodBaseData = {
  openingPeriodTitle: string;
  openingPeriodOptionalDescription: string;
  openingPeriodBeginDate: string | undefined;
  openingPeriodEndDate: string | undefined;
};

interface OpeningPeriodFormData extends OpeningPeriodBaseData {
  timeSpans: Array<TimeSpanFormFormat> | {}[];
}

export interface OpeningPeriodApiData extends OpeningPeriodBaseData {
  timeSpans: Array<TimeSpanApiFormat>;
}

type SubmitStatus = 'init' | 'succeeded' | 'error';

type NotificationTexts = {
  label: string;
  description: string;
};

function formatTimeSpansToApiFormat(
  timeSpans: TimeSpanFormFormat[]
): TimeSpanApiFormat[] {
  return timeSpans.map((timeSpan) => {
    return {
      description: {
        fi: timeSpan?.description,
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
        id: apiTimeSpan.id,
        description: apiTimeSpan.description?.fi || '',
        startTime: apiTimeSpan.start_time
          ? dropMilliseconds(apiTimeSpan.start_time)
          : '',
        endTime: apiTimeSpan.end_time
          ? dropMilliseconds(apiTimeSpan.end_time)
          : '',
        resourceState: apiTimeSpan.resource_state || ResourceState.OPEN,
        weekdays: weekdays as FormWeekdays,
      };
    });
}

const formatResourcePeriodOptionsToFormFormat = (
  resourceStateApiOptions: ResourceStateApiOption[]
): ResourceStateOption[] =>
  resourceStateApiOptions.map((optionInApiFormat: ResourceStateApiOption): {
    value: string;
    label: string;
  } => {
    return {
      value: optionInApiFormat.value,
      label: `${
        typeof optionInApiFormat.display_name === 'string'
          ? optionInApiFormat.display_name
          : optionInApiFormat.display_name.fi
      }`,
    };
  });

export default function OpeningPeriodForm({
  formId,
  datePeriod,
  resourceId,
  datePeriodOptions,
  submitFn,
  successTexts,
  errorTexts,
}: {
  formId: string;
  datePeriod?: DatePeriod;
  resourceId: number;
  datePeriodOptions: DatePeriodOptions;
  submitFn: (datePeriod: DatePeriod) => Promise<DatePeriod>;
  successTexts: NotificationTexts;
  errorTexts: NotificationTexts;
}): JSX.Element {
  const language = Language.FI;

  const resourceStateOptionsInApiFormat: ResourceStateApiOption[] =
    datePeriodOptions.actions.POST.resource_state.choices;

  const resourceStateOptions: ResourceStateOption[] = formatResourcePeriodOptionsToFormFormat(
    resourceStateOptionsInApiFormat
  );

  const spans: TimeSpanFormFormat[] | {}[] =
    datePeriod?.time_span_groups[0] &&
    datePeriod?.time_span_groups[0].time_spans
      ? formatApiTimeSpansToFormFormat(
          datePeriod?.time_span_groups[0].time_spans
        )
      : [{}];

  const [periodBeginDate, setPeriodBeginDate] = useState<Date | null>(
    datePeriod?.start_date ? new Date(datePeriod?.start_date) : null
  );
  const [periodEndDate, setPeriodEndDate] = useState<Date | null>(
    datePeriod?.end_date ? new Date(datePeriod?.end_date) : null
  );

  const formValues: OpeningPeriodFormData = {
    openingPeriodTitle: datePeriod?.name[language] || '',
    openingPeriodOptionalDescription: datePeriod?.description[language] || '',
    openingPeriodBeginDate: datePeriod?.start_date,
    openingPeriodEndDate: datePeriod?.end_date,
    timeSpans: spans,
  };

  const { register, handleSubmit, errors, control, setValue } = useForm<
    OpeningPeriodFormData
  >({
    mode: 'all',
    defaultValues: formValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    keyName: 'timeSpanUiId',
    name: 'timeSpans',
  });
  const history = useHistory();
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('init');

  const onSubmit = async (data: OpeningPeriodFormData): Promise<void> => {
    const validTimeSpans: TimeSpanFormFormat[] = data.timeSpans.filter(
      (span: TimeSpanFormFormat | {}) => Object.keys(span).length > 0
    ) as TimeSpanFormFormat[];

    try {
      const dataAsDatePeriod: DatePeriod = {
        ...(datePeriod?.id ? { id: datePeriod.id } : {}),
        resource: resourceId,
        name: {
          fi: data.openingPeriodTitle,
          sv: null,
          en: null,
        },
        description: {
          fi: data.openingPeriodOptionalDescription,
          sv: null,
          en: null,
        },
        start_date: data.openingPeriodBeginDate
          ? transformToApiFormat(data.openingPeriodBeginDate)
          : undefined,
        end_date: data.openingPeriodEndDate
          ? transformToApiFormat(data.openingPeriodEndDate)
          : undefined,
        override: datePeriod?.override || false,
        time_span_groups: [
          {
            time_spans: formatTimeSpansToApiFormat(validTimeSpans || []),
            rules: [],
          },
        ],
      };
      await submitFn(dataAsDatePeriod);
      setSubmitStatus('succeeded');
    } catch (err) {
      setSubmitStatus('error');
      // eslint-disable-next-line no-console
      console.error(err); // For debug purposes
    }
  };

  return (
    <>
      {submitStatus === 'succeeded' && (
        <SuccessToast
          dataTestId="opening-period-form-success"
          label={successTexts.label}
          text={successTexts.description}
          onClose={(): void => setSubmitStatus('init')}
        />
      )}
      {submitStatus === 'error' && (
        <ErrorToast
          dataTestId="opening-period-form-error"
          label={errorTexts.label}
          text={errorTexts.description}
          onClose={(): void => setSubmitStatus('init')}
        />
      )}
      <form
        id={formId}
        data-test={formId}
        className="opening-period-form"
        onSubmit={handleSubmit(onSubmit)}>
        <section className="form-section">
          <OpeningPeriodDescription register={register} errors={errors} />
        </section>
        <section className="form-section">
          <h3 className="opening-period-section-title">Ajanjakso</h3>
          <section className="opening-period-time-period">
            <Datepicker
              id="openingPeriodBeginDate"
              dataTest="openingPeriodBeginDate"
              labelText="Alkaa"
              onChange={(value): void => setPeriodBeginDate(value || null)}
              value={periodBeginDate}
              registerFn={register}
              required
            />
            <p className="dash-between-begin-and-end-date">—</p>
            <Datepicker
              id="openingPeriodEndDate"
              dataTest="openingPeriodEndDate"
              labelText="Päättyy"
              onChange={(value): void => setPeriodEndDate(value || null)}
              value={periodEndDate}
              registerFn={register}
              required
            />
          </section>
        </section>
        <section className="form-section time-span-group">
          <div className="time-span-list-container">
            <h3 className="opening-period-section-title">Aukioloajat</h3>
            {fields.map(
              (
                item: Partial<ArrayField<Record<string, TimeSpanFormFormat>>>,
                index
              ) => (
                <TimeSpan
                  item={item}
                  resourceStateOptions={resourceStateOptions}
                  setValue={setValue}
                  register={register}
                  key={`time-span-${item.id || index}`}
                  index={index}
                  remove={remove}
                />
              )
            )}
          </div>
          <SecondaryButton
            dataTest="add-new-time-span-button"
            onClick={(): void => append({})}
            className="opening-period-final-action-button add-new-time-span-button">
            + Lisää aukioloaika
          </SecondaryButton>
        </section>
        <div className="opening-period-final-action-row-container">
          <PrimaryButton
            dataTest="publish-opening-period-button"
            className="opening-period-final-action-button"
            type="submit">
            Julkaise
          </PrimaryButton>
          <SecondaryButton
            className="opening-period-final-action-button"
            onClick={(): void => history.push(`/resource/${resourceId}`)}>
            Peruuta ja palaa
          </SecondaryButton>
        </div>
      </form>
    </>
  );
}
