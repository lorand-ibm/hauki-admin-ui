import React, { useEffect, useState, useCallback } from 'react';
import { Control, Controller, FieldValues, useForm } from 'react-hook-form';
import { Button, Notification, LoadingSpinner } from 'hds-react';
import { useHistory } from 'react-router-dom';
import api from '../../common/utils/api/api';
import {
  DatePeriod,
  Language,
  Resource,
  ResourceState,
} from '../../common/lib/types';
import { transformToApiFormat } from '../../common/utils/date-time/format';
import Datepicker from '../../components/datepicker/Datepicker';
import LoadingIndicator from '../../components/loadingIndicator/LoadingIndicator';
import { ErrorToast, SuccessToast } from '../../components/notification/Toast';
import { ResourceInfo } from '../../resource/page/ResourcePage';
import './EditOpeningPeriod.scss';

type FormData = {
  openingPeriodTitle: string;
  openingPeriodOptionalDescription: string;
  openingPeriodBeginDate: string;
  openingPeriodEndDate: string;
};

type SubmitStatus = 'init' | 'succeeded' | 'error';

const FormDatePicker = ({
  name,
  label,
  control,
  register,
}: {
  name: string;
  label: string;
  control: Control<FormData & FieldValues>;
  register: () => void;
}): JSX.Element => (
  <Controller
    control={control}
    name={name}
    render={({ value, onChange }): JSX.Element => (
      <Datepicker
        id={name}
        dataTest={name}
        labelText={label}
        onChange={onChange}
        value={new Date(value)}
        registerFn={register}
        required
      />
    )}
  />
);

export default function EditOpeningPeriodPage({
  resourceId,
  datePeriodId,
}: {
  resourceId: string;
  datePeriodId: string;
}): JSX.Element {
  const id = parseInt(datePeriodId, 10);
  const selectedLanguage: Language = 'fi';
  const [resource, setResource] = useState<Resource>();
  const [hasLoadingResourceError, setLoadingResourceError] = useState<
    Error | undefined
  >(undefined);
  const [hasDatePeriodLoadingError, setDatePeriodLoadingError] = useState<
    Error | undefined
  >(undefined);
  const { reset, register, handleSubmit, control, errors } = useForm<
    FormData
  >();
  const history = useHistory();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('init');
  const resetForm = useCallback(
    (datePeriod: DatePeriod): void =>
      reset({
        openingPeriodTitle: datePeriod.name[selectedLanguage] || '',
        openingPeriodOptionalDescription:
          datePeriod.description[selectedLanguage] || '',
        openingPeriodBeginDate: datePeriod.start_date || undefined,
        openingPeriodEndDate: datePeriod.end_date || undefined,
      }),
    [reset]
  );

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      if (!resource || !data) {
        throw new Error('This should never happen, but typescript');
      }

      setSaving(true);
      const updatedPeriod = await api.putDatePeriod({
        resource: resource.id,
        id,
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
        start_date: transformToApiFormat(data.openingPeriodBeginDate),
        end_date: transformToApiFormat(data.openingPeriodEndDate),
        resource_state: ResourceState.OPEN,
        override: false,
        time_span_groups: [],
      });
      resetForm(updatedPeriod);
      setSaving(false);
      setSubmitStatus('succeeded');
    } catch (err) {
      setSaving(false);
      setSubmitStatus('error');
      throw err;
    }
  };

  useEffect((): void => {
    // UseEffect's callbacks are synchronous to prevent a race condition.
    // We can not use an async function as an useEffect's callback because it would return Promise<void>
    api
      .getResource(resourceId)
      .then((r: Resource) => {
        setResource(r);
        setLoading(false);
      })
      .catch((e: Error) => {
        setLoadingResourceError(e);
        setLoading(false);
      });
  }, [resourceId]);

  useEffect((): void => {
    // UseEffect's callbacks are synchronous to prevent a race condition.
    // We can not use an async function as an useEffect's callback because it would return Promise<void>
    if (resource) {
      setLoading(true);
      api
        .getDatePeriod(id)
        .then((datePeriod: DatePeriod) => {
          if (datePeriod) {
            resetForm(datePeriod);
          }
          setLoading(false);
        })
        .catch((e: Error) => {
          setDatePeriodLoadingError(e);
          setLoading(false);
        });
    }
  }, [datePeriodId, id, reset, resetForm, resource]);

  if (hasLoadingResourceError) {
    return (
      <>
        <h1 className="resource-info-title">Virhe</h1>
        <Notification
          label="Toimipisteen tietoja ei saatu ladattua."
          type="error">
          Tarkista toimipiste-id.
        </Notification>
      </>
    );
  }

  if (hasDatePeriodLoadingError) {
    return (
      <>
        <h1 className="resource-info-title">Virhe</h1>
        <Notification
          label="Toimipisteen aukiolojaksotietoja ei saatu ladattua."
          type="error">
          Tarkista toimipisteen aukiolojakson id.
        </Notification>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <h1 className="resource-info-title">Aukiolojakson muokkaus</h1>
        <LoadingIndicator
          text="Aukiolojakson tietoja haetaan."
          readyText="Aukiolojakson tiedot haettu"
        />
      </>
    );
  }

  return (
    <>
      {submitStatus === 'succeeded' && (
        <SuccessToast
          dataTestId="opening-period-edited-successfully-notification"
          label="Aukiolojakson muutokset tallennettu onnistuneesti"
          text="Aukiolojakso muutokset tallennettu onnistuneesti"
          onClose={(): void => setSubmitStatus('init')}
        />
      )}
      {submitStatus === 'error' && (
        <ErrorToast
          label="Aukiolojakson muokkaaminen epäonnistui"
          text="Aukiolojakson muokkaaminen epäonnistui. Yritä myöhemmin uudestaan."
          onClose={(): void => setSubmitStatus('init')}
        />
      )}
      <div className="opening-period-page-header-row">
        <ResourceInfo resource={resource} />
        <h2 className="opening-period-page-title">
          Toimipisteen aukiolojakson muokkaus
        </h2>
      </div>
      <form
        id="opening-period-form"
        data-test="opening-period-form"
        className="opening-period-form"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="edit-form-content-container">
          <section className="opening-period-form-section">
            <h3 className="opening-period-section-title">Jakson kuvaus</h3>
            <label htmlFor="openingPeriodTitle">Aukiolojakson otsikko *</label>
            <input
              className="opening-period-title-input"
              type="text"
              name="openingPeriodTitle"
              data-test="openingPeriodTitle"
              id="openingPeriodTitle"
              aria-invalid={errors.openingPeriodTitle ? 'true' : 'false'}
              ref={register({ required: true, maxLength: 100 })}
            />
            {errors.openingPeriodTitle &&
              errors.openingPeriodTitle.type === 'required' && (
                <span role="alert">Aukiolojakson otsikko on pakollinen</span>
              )}

            <label htmlFor="openingPeriodOptionalDescription">
              Jakson valinnainen kuvaus
            </label>
            <textarea
              cols={90}
              className="opening-period-optional-description-input"
              id="openingPeriodOptionalDescription"
              name="openingPeriodOptionalDescription"
              ref={register({ maxLength: 255 })}
            />
          </section>
          <section className="opening-period-form-section">
            <h3 className="opening-period-section-title">Ajanjakso</h3>
            <div className="opening-period-form-dates">
              <FormDatePicker
                name="openingPeriodBeginDate"
                label="Alkaa"
                control={control}
                register={register}
              />
              <p className="dash-between-begin-and-end-date">—</p>
              <FormDatePicker
                name="openingPeriodEndDate"
                label="Päättyy"
                control={control}
                register={register}
              />
            </div>
          </section>
        </div>
        <div className="opening-period-final-action-row-container">
          <Button
            data-test="opening-period-save-button"
            className="opening-period-final-action-button publish-opening-period-button period-save-button"
            type="submit"
            form="opening-period-form"
            disabled={isSaving}>
            {isSaving && (
              <div className="period-save-button-spinner">
                <LoadingSpinner
                  small
                  loadingText="Tallentaa aukiolojakson tietoja"
                  loadingFinishedText="Aukiolojakson tiedot tallennettu"
                  theme={{
                    '--spinner-color':
                      'var(--period-save-button-spinner-color)',
                  }}
                />
              </div>
            )}
            Julkaise
          </Button>
          <Button
            onClick={(): void => history.push(`/resource/${resourceId}`)}
            className="opening-period-final-action-button cancel-opening-period-button"
            variant="secondary">
            Peruuta ja palaa
          </Button>
        </div>
      </form>
    </>
  );
}
