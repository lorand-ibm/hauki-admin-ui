import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Notification } from 'hds-react';
import { useHistory } from 'react-router-dom';
import formatDate from 'date-fns/format';
import parse from 'date-fns/parse';
import api from '../../common/utils/api/api';
import { ResourceInfo } from '../../resource/page/ResourcePage';
import Datepicker from '../../components/datepicker/Datepicker';
import './CreateNewOpeningPeriodPage.scss';
import { Resource, ResourceState } from '../../common/lib/types';

type Inputs = {
  openingPeriodTitle: string;
  openingPeriodOptionalDescription: string;
  openingPeriodBeginDate: string;
  openingPeriodEndDate: string;
};

type SubmitStatus = 'init' | 'succeeded' | 'error';

export default function CreateNewOpeningPeriodPage({
  resourceId,
}: {
  resourceId: string;
}): JSX.Element {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    mode: 'all',
    defaultValues: {
      openingPeriodTitle: '',
      openingPeriodOptionalDescription: '',
      openingPeriodBeginDate: undefined,
      openingPeriodEndDate: undefined,
    },
  });
  const history = useHistory();
  const [resource, setResource] = useState<Resource>();
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
          parse(data.openingPeriodBeginDate, 'dd.MM.yyyy', new Date()),
          'yyyy-MM-dd'
        ),
        end_date: formatDate(
          parse(data.openingPeriodEndDate, 'dd.MM.yyyy', new Date()),
          'yyyy-MM-dd'
        ),
        resource_state: ResourceState.OPEN,
        override: false,
        time_span_groups: [],
      });
      setSubmitStatus('succeeded');
    } catch (err) {
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

  if (isLoading) {
    return <p>Sivua ladataan...</p>;
  }

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

  return (
    <>
      {submitStatus === 'succeeded' && (
        <Notification
          dataTestId="opening-period-added-successfully-notification"
          position="top-right"
          autoClose
          size="small"
          label="Aukiolojakso tallennettu onnistuneesti"
          onClose={(): void => setSubmitStatus('init')}
          type="success">
          Aukiolojakso tallennettu onnistuneesti
        </Notification>
      )}
      {submitStatus === 'error' && (
        <Notification
          position="top-right"
          autoClose
          size="small"
          label="Aukiolojakson lisääminen epäonnistui"
          onClose={(): void => setSubmitStatus('init')}
          type="error">
          Aukiolojakson lisääminen epäonnistui. Yritä myöhemmin uudestaan.
        </Notification>
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
        <div className="form-content-container">
          <h3 className="opening-period-section-title">Jakson kuvaus</h3>
          <label htmlFor="openingPeriodTitle">Aukiolojakson otsikko *</label>
          <input
            className="add-new-opening-period-title"
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
            className="opening-period-optional-description"
            id="openingPeriodOptionalDescription"
            name="openingPeriodOptionalDescription"
            ref={register({ maxLength: 255 })}
          />
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
        </div>
        <div className="add-new-opening-period-final-action-row-container">
          <Button
            data-test="publish-new-opening-period-button"
            className="add-new-opening-period-final-action-button publish-new-opening-period-button"
            type="submit"
            form="add-new-opening-period-form">
            Julkaise
          </Button>
          <Button
            onClick={(): void => history.push(`/resource/${resourceId}`)}
            className="add-new-opening-period-final-action-button cancel-creation-of-new-opening-period-button"
            variant="secondary">
            Peruuta ja palaa
          </Button>
        </div>
      </form>
    </>
  );
}
