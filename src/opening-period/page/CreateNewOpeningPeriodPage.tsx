import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Notification } from 'hds-react';
import { useHistory } from 'react-router-dom';
import formatDate from 'date-fns/format';
import parse from 'date-fns/parse';
import api from '../../common/utils/api/api';
import { ResourceInfo } from '../../resource/page/ResourcePage';
import Datepicker from '../../components/datepicker/Datepicker';
import { ErrorToast, SuccessToast } from '../../components/notification/Toast';
import './CreateNewOpeningPeriodPage.scss';
import {
  TimeSpan as TimeSpanApiFormat,
  TimeSpanFormFormat,
  Resource,
  ResourceStateOption,
} from '../../common/lib/types';
import {
  dateApiFormat,
  dateFormFormat,
} from '../../common/utils/date-time/format';
import { PrimaryButton, SecondaryButton } from '../../components/button/Button';
import OpeningPeriodDescription from '../description/OpeningPeriodDescription';

import TimeSpan from '../time-span/TimeSpan';

type Inputs = {
  openingPeriodTitle: string;
  openingPeriodOptionalDescription: string;
  openingPeriodBeginDate: string;
  openingPeriodEndDate: string;
  timeSpans: Array<TimeSpanFormFormat>;
};

type SubmitStatus = 'init' | 'succeeded' | 'error';

function formatTimeSpansToApiFormat(
  timeSpans: TimeSpanFormFormat[]
): TimeSpanApiFormat[] {
  return timeSpans.map((timeSpan) => {
    return {
      description: {
        fi: timeSpan.description,
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

export default function CreateNewOpeningPeriodPage({
  resourceId,
}: {
  resourceId: string;
}): JSX.Element {
  const { register, handleSubmit, errors, control, setValue } = useForm<Inputs>(
    {
      mode: 'all',
      defaultValues: {
        openingPeriodTitle: '',
        openingPeriodOptionalDescription: '',
        openingPeriodBeginDate: undefined,
        openingPeriodEndDate: undefined,
        timeSpans: [{}],
      },
    }
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'timeSpans',
  });
  const history = useHistory();
  const [resource, setResource] = useState<Resource>();
  const [resourceStateOptions, setResourceStateOptions] = useState<
    ResourceStateOption[] | undefined
  >(undefined);
  const [hasLoadingResourceError, setLoadingResourceError] = useState<
    Error | undefined
  >(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [periodBeginDate, setPeriodBeginDate] = useState<Date | null>(null);
  const [periodEndDate, setPeriodEndDate] = useState<Date | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('init');

  const onSubmit = async (data: Inputs): Promise<void> => {
    try {
      if (!resource) {
        throw new Error('This should never happen, but typescript');
      }
      await api.postDatePeriod({
        resource: resource.id,
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
        start_date: formatDate(
          parse(data.openingPeriodBeginDate, dateFormFormat, new Date()),
          dateApiFormat
        ),
        end_date: formatDate(
          parse(data.openingPeriodEndDate, dateFormFormat, new Date()),
          dateApiFormat
        ),
        override: false,
        time_span_groups: [
          {
            time_spans: formatTimeSpansToApiFormat(data.timeSpans),
            rules: [],
          },
        ],
      });
      setSubmitStatus('succeeded');
    } catch (err) {
      setSubmitStatus('error');
      // eslint-disable-next-line no-console
      console.error(err); // For debug purposes
    }
  };

  useEffect((): void => {
    // UseEffect's callbacks are synchronous to prevent a race condition.
    // We can not use an async function as an useEffect's callback because it would return Promise<void>

    Promise.all([api.getResource(resourceId), api.getDatePeriodFormOptions()])
      .then((values) => {
        setResource(values[0] as Resource);
        const resourceStateOptionsInApiFormat =
          values[1].actions.POST.resource_state.choices;
        setResourceStateOptions(
          resourceStateOptionsInApiFormat.map((optionInApiFormat) => {
            return {
              value: optionInApiFormat.value,
              label: optionInApiFormat.display_name,
            };
          })
        );
        setLoading(false);
      })
      .catch((e: Error) => {
        setLoadingResourceError(e);
        setLoading(false);
      });
  }, [resourceId]);

  if (isLoading) {
    return (
      <>
        <h1 className="resource-info-title">Aukiolojakson lisäys</h1>
        <p>Sivua ladataan...</p>
      </>
    );
  }

  if (hasLoadingResourceError) {
    return (
      <>
        <h1 className="resource-info-title">Virhe</h1>
        <Notification
          dataTestId="error-retrieving-resource-info"
          label="Toimipisteen tai lomakkeen tietoja ei saatu ladattua."
          type="error">
          Tarkista toimipiste-id ja että sinulla on riittävät oikeudet sen
          aukiolojen muokkaamiseen.
        </Notification>
      </>
    );
  }

  return (
    <>
      {submitStatus === 'succeeded' && (
        <SuccessToast
          dataTestId="opening-period-added-successfully-notification"
          label="Aukiolojakso tallennettu onnistuneesti"
          text="Aukiolojakso tallennettu onnistuneesti"
          onClose={(): void => setSubmitStatus('init')}
        />
      )}
      {submitStatus === 'error' && (
        <ErrorToast
          dataTestId="opening-period-creation-failed"
          label="Aukiolojakson lisääminen epäonnistui"
          text="Aukiolojakson lisääminen epäonnistui. Yritä myöhemmin uudestaan."
          onClose={(): void => setSubmitStatus('init')}
        />
      )}
      <div className="opening-period-page-header-row">
        <ResourceInfo resource={resource} />
        <h2 className="add-new-opening-period-page-title">
          Toimipisteen aukiolojakson lisäys
        </h2>
      </div>
      <form
        id="add-new-opening-period-form"
        data-test="add-new-opening-period-form"
        className="add-new-opening-period-form"
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
            {fields.map((item, index) => (
              <TimeSpan
                resourceStateOptions={resourceStateOptions}
                setValue={setValue}
                register={register}
                key={`time-span-${index}`}
                index={index}
                remove={remove}
              />
            ))}
          </div>
          <SecondaryButton
            dataTest="add-new-time-span-button"
            onClick={(): void => append({})}
            className="add-new-opening-period-final-action-button add-new-time-span-button">
            + Lisää aukioloaika
          </SecondaryButton>
        </section>
        <div className="add-new-opening-period-final-action-row-container">
          <PrimaryButton
            dataTest="publish-new-opening-period-button"
            className="add-new-opening-period-final-action-button"
            type="submit">
            Julkaise
          </PrimaryButton>
          <SecondaryButton
            className="add-new-opening-period-final-action-button"
            onClick={(): void => history.push(`/resource/${resourceId}`)}>
            Peruuta ja palaa
          </SecondaryButton>
        </div>
      </form>
    </>
  );
}
