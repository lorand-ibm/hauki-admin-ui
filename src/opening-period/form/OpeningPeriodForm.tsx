import React, { useEffect, useState } from 'react';
import {
  ArrayField,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { IconAlertCircle, IconPlus, IconTrash, Notification } from 'hds-react';
import {
  DatePeriod,
  Language,
  LanguageStrings,
  ResourceState,
  TimeSpanGroupFormFormat,
  UiDatePeriodConfig,
  UiFieldConfig,
  UiFormRuleConfig,
} from '../../common/lib/types';
import { isDateBefore } from '../../common/utils/date-time/compare';
import {
  parseFormDate,
  transformDateToApiFormat,
} from '../../common/utils/date-time/format';
import Datepicker from '../../components/datepicker/Datepicker';
import {
  PrimaryButton,
  SecondaryButton,
  SupplementaryButton,
} from '../../components/button/Button';
import { ErrorText } from '../../components/icon-text/IconText';
import ResourceStateSelect from '../../components/resourse-state-select/ResourceStateSelect';
import toast from '../../components/notification/Toast';
import {
  formatTimeSpanGroupsToApiFormat,
  formatTimeSpanGroupsToFormFormat,
} from './form-helpers/form-helpers';
import OpeningPeriodDescription from '../description/OpeningPeriodDescription';
import TimeSpans from '../time-span/TimeSpans';
import Rules from '../rule/Rules';
import './OpeningPeriodForm.scss';

interface OpeningPeriodFormData {
  openingPeriodTitle: LanguageStrings;
  openingPeriodOptionalDescription: LanguageStrings;
  openingPeriodBeginDate: string | undefined;
  openingPeriodEndDate: string | undefined;
  openingPeriodResourceState: ResourceState | undefined;
  timeSpanGroups: TimeSpanGroupFormFormat[];
}

const defaultTimeSpanGroup: TimeSpanGroupFormFormat = {
  timeSpans: [],
  rules: [],
};

type NotificationTexts = {
  label: string;
  text: string;
};

export type OpeningPeriodFormProps = {
  formId: string;
  datePeriod?: DatePeriod;
  forceException?: boolean;
  resourceId: number;
  datePeriodConfig: UiDatePeriodConfig;
  submitFn: (datePeriod: DatePeriod) => Promise<DatePeriod>;
  successTextAndLabel: NotificationTexts;
  errorTextAndLabel: NotificationTexts;
};

const validateEndInputWithStartDate = (start: Date | null) => (
  end: string | null
): boolean | string => {
  if (!start || !end) {
    return true;
  }

  if (isDateBefore(parseFormDate(end), start)) {
    return 'Aukiolojakson loppupäivämäärä ei voi olla ennen alkupäivämäärää.';
  }

  return true;
};

const isResourceStateSet = (state?: ResourceState): boolean =>
  !!state && state !== ResourceState.UNDEFINED;

const emptyLanguages: LanguageStrings = {
  fi: null,
  sv: null,
  en: null,
};

export default function OpeningPeriodForm({
  formId,
  datePeriod,
  forceException = false,
  resourceId,
  datePeriodConfig,
  submitFn,
  successTextAndLabel,
  errorTextAndLabel,
}: OpeningPeriodFormProps): JSX.Element {
  const language = Language.FI;

  const nameFieldConfig = datePeriodConfig.name;

  const resourceStateConfig: UiFieldConfig = {
    options: datePeriodConfig.resourceState.options.map(
      (translatedApiChoice) => ({
        value: translatedApiChoice.value,
        label: translatedApiChoice.label[language] as string,
      })
    ),
  };

  const ruleConfig: UiFormRuleConfig = {
    context: {
      required: datePeriodConfig.timeSpanGroup.rule.context.required,
      options: datePeriodConfig.timeSpanGroup.rule.context.options.map(
        (translatedApiChoice) => ({
          value: translatedApiChoice.value,
          label: translatedApiChoice.label[language] as string,
        })
      ),
    },
    subject: {
      required: datePeriodConfig.timeSpanGroup.rule.subject.required,
      options: datePeriodConfig.timeSpanGroup.rule.subject.options.map(
        (translatedApiChoice) => ({
          value: translatedApiChoice.value,
          label: translatedApiChoice.label[language] as string,
        })
      ),
    },
    frequencyModifier: {
      required: datePeriodConfig.timeSpanGroup.rule.frequencyModifier.required,
      options: datePeriodConfig.timeSpanGroup.rule.frequencyModifier.options.map(
        (translatedApiChoice) => ({
          value: translatedApiChoice.value,
          label: translatedApiChoice.label[language] as string,
        })
      ),
    },
    start: {
      required: datePeriodConfig.timeSpanGroup.rule.start.required,
    },
  };

  const [periodBeginDate, setPeriodBeginDate] = useState<Date | null>(
    datePeriod?.start_date ? new Date(datePeriod?.start_date) : null
  );

  const [periodEndDate, setPeriodEndDate] = useState<Date | null>(
    datePeriod?.end_date ? new Date(datePeriod?.end_date) : null
  );

  const openingPeriodResourceStateKey = 'openingPeriodResourceState';

  const formValues: OpeningPeriodFormData = {
    openingPeriodTitle: datePeriod?.name || emptyLanguages,
    openingPeriodOptionalDescription: datePeriod?.description || emptyLanguages,
    openingPeriodBeginDate: datePeriod?.start_date,
    openingPeriodEndDate: datePeriod?.end_date,
    openingPeriodResourceState: datePeriod?.resource_state,
    timeSpanGroups: [defaultTimeSpanGroup],
  };

  const formMethods = useForm<OpeningPeriodFormData>({
    mode: 'all',
    defaultValues: formValues,
  });

  const {
    register,
    handleSubmit,
    errors,
    clearErrors,
    control,
    setValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getValues,
    watch,
  } = formMethods;

  const clearResourceState = (): void => {
    setValue(openingPeriodResourceStateKey, 'undefined');
  };

  const resourceStateValue = watch(openingPeriodResourceStateKey);

  const timeSpanGroupFieldName = 'timeSpanGroups';

  const {
    fields: timeSpanGroupFields,
    append: appendTimeSpanGroup,
    remove: removeTimeSpanGroup,
  } = useFieldArray<TimeSpanGroupFormFormat, 'timeSpanGroupUiId'>({
    control,
    keyName: 'timeSpanGroupUiId',
    name: timeSpanGroupFieldName,
  });

  const history = useHistory();

  const returnToResourcePage = (): void =>
    history.push(`/resource/${resourceId}`);

  const onSubmit = async (data: OpeningPeriodFormData): Promise<void> => {
    try {
      const dataAsDatePeriod: DatePeriod = {
        ...(datePeriod?.id ? { id: datePeriod.id } : {}),
        resource: resourceId,
        name: data.openingPeriodTitle,
        description: data.openingPeriodOptionalDescription,
        start_date: data.openingPeriodBeginDate
          ? transformDateToApiFormat(data.openingPeriodBeginDate)
          : undefined,
        end_date: data.openingPeriodEndDate
          ? transformDateToApiFormat(data.openingPeriodEndDate)
          : undefined,
        resource_state: data.openingPeriodResourceState,
        override: forceException || datePeriod?.override || false,
        time_span_groups: isResourceStateSet(data?.openingPeriodResourceState)
          ? []
          : formatTimeSpanGroupsToApiFormat(data.timeSpanGroups),
      };
      const updatedPeriod = await submitFn(dataAsDatePeriod);
      if (updatedPeriod) {
        toast.success({
          dataTestId: 'opening-period-form-success',
          label: successTextAndLabel.label,
          text: successTextAndLabel.text,
        });
        returnToResourcePage();
      }
    } catch (err) {
      toast.error({
        dataTestId: 'opening-period-form-error',
        label: errorTextAndLabel.label,
        text: errorTextAndLabel.text,
      });
      // eslint-disable-next-line no-console
      console.error(err); // For debug purposes
    }
  };

  useEffect(() => {
    if (datePeriod) {
      setValue(
        'timeSpanGroups',
        datePeriod?.time_span_groups && datePeriod?.time_span_groups.length
          ? formatTimeSpanGroupsToFormFormat(datePeriod.time_span_groups)
          : [defaultTimeSpanGroup]
      );
    }
  }, [datePeriod, language, setValue]);

  return (
    <FormProvider {...formMethods}>
      <form
        id={formId}
        data-test={formId}
        className="opening-period-form"
        onSubmit={handleSubmit(onSubmit)}>
        <section className="form-section">
          <OpeningPeriodDescription
            register={register}
            errors={errors}
            getValues={getValues}
            clearErrors={clearErrors}
            nameFieldConfig={nameFieldConfig}
          />
        </section>
        <div className="form-multiple-sections-row">
          <section className="form-section">
            <h3 className="opening-period-section-title">Ajanjakso</h3>
            <div className="form-control">
              <section className="opening-period-time-period">
                <Datepicker
                  id="openingPeriodBeginDate"
                  dataTest="openingPeriodBeginDate"
                  labelText="Alkaa"
                  onChange={(value): void => setPeriodBeginDate(value || null)}
                  value={periodBeginDate}
                  error={errors.openingPeriodBeginDate}
                  registerFn={register}
                />
                <p className="dash-between-begin-and-end-date">—</p>
                <Datepicker
                  id="openingPeriodEndDate"
                  dataTest="openingPeriodEndDate"
                  labelText="Päättyy"
                  onChange={(value): void => setPeriodEndDate(value || null)}
                  value={periodEndDate}
                  registerFn={register}
                  customValidations={{
                    dateRange: validateEndInputWithStartDate(periodBeginDate),
                  }}
                />
              </section>
              {errors.openingPeriodEndDate?.type === 'dateRange' &&
                errors.openingPeriodEndDate?.message && (
                  <ErrorText
                    id="opening-period-date-error-text"
                    message={errors.openingPeriodEndDate.message}
                  />
                )}
            </div>
          </section>
          <section className="form-section">
            <h3 className="opening-period-section-title">
              Jakson tila (valinnainen)
            </h3>
            <div className="form-control">
              <div className="form-actions-row opening-period-resource-state">
                <ResourceStateSelect
                  control={control}
                  name={openingPeriodResourceStateKey}
                  id="opening-period-resource-state"
                  value={datePeriod?.resource_state}
                  label="Valitse koko aukiolojakson tila"
                  options={resourceStateConfig.options}
                />
                {isResourceStateSet(resourceStateValue) && (
                  <SupplementaryButton
                    className="opening-period-clear-state-button"
                    dataTest="clear-resource-state-button"
                    onClick={(): void => {
                      clearResourceState();
                    }}
                    iconLeft={<IconTrash />}>
                    Tyhjennä valinta
                  </SupplementaryButton>
                )}
              </div>
            </div>
          </section>
        </div>
        {isResourceStateSet(resourceStateValue) ? (
          <section
            key="resource-state-notification"
            data-test="resource-state-notification"
            className="form-section time-span-group">
            <Notification
              label="Aukiolojaksolle on valittu aukiolotila"
              className="opening-period-form-notification">
              Kun aukiolojaksolle on valittu aukiolotila niin se poistaa tämän
              jakson kaikki muut mahdolliset aukiolot.
            </Notification>
          </section>
        ) : (
          timeSpanGroupFields.map(
            (
              timeSpanGroup: Partial<
                ArrayField<TimeSpanGroupFormFormat, 'timeSpanGroupUiId'>
              >,
              index: number
            ) => (
              <section
                key={`time-span-group-${timeSpanGroup.timeSpanGroupUiId}`}
                data-test={`time-span-group-${timeSpanGroup.id || 'new'}`}
                className="form-section time-span-group">
                <div className="form-actions-row">
                  <h3 className="opening-period-section-title">Aukioloryhmä</h3>
                  <SupplementaryButton
                    dataTest="remove-time-span-group"
                    onClick={(): void => {
                      removeTimeSpanGroup(index);
                    }}
                    iconLeft={<IconTrash />}>
                    Poista aukioloryhmä
                  </SupplementaryButton>
                </div>
                <input
                  type="hidden"
                  name={`${timeSpanGroupFieldName}[${index}].id`}
                  defaultValue={timeSpanGroup.id}
                  ref={register()}
                />
                <input
                  type="hidden"
                  name={`${timeSpanGroupFieldName}[${index}].period`}
                  defaultValue={timeSpanGroup.period}
                  ref={register()}
                />
                <TimeSpans
                  groupIndex={index}
                  groupId={timeSpanGroup.id}
                  namePrefix={timeSpanGroupFieldName}
                  resourceStateConfig={resourceStateConfig}
                  errors={errors.timeSpanGroups}
                />
                <Rules
                  groupIndex={index}
                  groupId={timeSpanGroup.id}
                  namePrefix={timeSpanGroupFieldName}
                  ruleConfig={ruleConfig}
                  errors={errors.timeSpanGroups}
                />
              </section>
            )
          )
        )}
        <div className="form-actions-row form-actions-row-condensed">
          <SupplementaryButton
            dataTest="add-time-span-group"
            onClick={(): void => appendTimeSpanGroup(defaultTimeSpanGroup)}
            iconLeft={<IconPlus />}>
            Luo uusi aukioloryhmä tähän jaksoon
          </SupplementaryButton>
          <p className="opening-period-notification-text">
            <IconAlertCircle
              area-hidden="true"
              aria-labelledby="opening-period-group-info"
            />
            <span id="opening-period-group-info">
              Lisää uusi ryhmä tähän aukiolojaksoon jos haluat lisätä
              aukioloaikoja useammilla eri säännöillä
            </span>
          </p>
        </div>
        <div className="opening-period-final-action-row-container">
          <PrimaryButton
            dataTest="publish-opening-period-button"
            className="opening-period-final-action-button"
            type="submit">
            Julkaise
          </PrimaryButton>
          <SecondaryButton
            className="opening-period-final-action-button"
            onClick={(): void => returnToResourcePage()}>
            Peruuta ja palaa
          </SecondaryButton>
        </div>
      </form>
    </FormProvider>
  );
}
