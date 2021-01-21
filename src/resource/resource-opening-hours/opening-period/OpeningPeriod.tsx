import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconAngleDown,
  IconAngleUp,
  useAccordion,
  IconPenLine,
  IconTrash,
} from 'hds-react';
import {
  DatePeriod,
  GroupRule,
  Language,
  LanguageStrings,
  UiDatePeriodConfig,
} from '../../../common/lib/types';
import { formatDateRange } from '../../../common/utils/date-time/format';
import toast from '../../../components/notification/Toast';
import { displayLangVersionNotFound } from '../../../components/language-select/LanguageSelect';
import {
  ConfirmationModal,
  useModal,
} from '../../../components/modal/ConfirmationModal';
import './OpeningPeriod.scss';
import WeekdayOpeningHours from './WeekdayOpeningHours';

function containsSpecialRules(rules: GroupRule[]): boolean {
  return rules.some((rule) => {
    return (
      rule.context !== 'period' || rule.subject !== 'day' || rule.start !== 1
    );
  });
}

function getNonSupportedFeatures(datePeriod: DatePeriod): string[] {
  const nonSupportedFeatures = [];
  if (datePeriod.time_span_groups.length === 0) {
    nonSupportedFeatures.push('Jakso ilman aukioloryhmää');
    return nonSupportedFeatures;
  }

  if (datePeriod.time_span_groups.length > 1) {
    nonSupportedFeatures.push('Jakso sisältää useampia aukioloryhmiä');
    return nonSupportedFeatures;
  }

  if (
    datePeriod.time_span_groups[0].rules.length > 0 &&
    containsSpecialRules(datePeriod.time_span_groups[0].rules)
  ) {
    nonSupportedFeatures.push(
      'Jaksossa on erikseen määriteltyjä perustapauksesta poikkeavia toistuvuussääntöjä'
    );
  }

  if (datePeriod.time_span_groups[0].time_spans.length === 0) {
    nonSupportedFeatures.push('Jakso ilman päiväkohtaisia aukioloja');
  }

  return nonSupportedFeatures;
}

function datePeriodDescriptionExistsInSomeLanguage(
  datePeriodDescription: LanguageStrings
): boolean {
  return !!(
    datePeriodDescription.fi ||
    datePeriodDescription.sv ||
    datePeriodDescription.en
  );
}

function NonSupportedFeatures({
  nonSupportedFeatures,
}: {
  nonSupportedFeatures: string[];
}): JSX.Element {
  return (
    <ul>
      {nonSupportedFeatures.map((nonSupportedFeature, index) => {
        return <li key={index}>{nonSupportedFeature}</li>;
      })}
    </ul>
  );
}

export default function OpeningPeriod({
  resourceId,
  datePeriod,
  datePeriodConfig,
  language,
  deletePeriod,
}: {
  resourceId: number;
  datePeriod: DatePeriod;
  datePeriodConfig: UiDatePeriodConfig;
  language: Language;
  deletePeriod: (id: number) => Promise<void>;
}): JSX.Element {
  const datePeriodName = datePeriod.name[language];
  const datePeriodDescription = datePeriod.description[language];
  const formattedDateRange = formatDateRange({
    startDate: datePeriod.start_date,
    endDate: datePeriod.end_date,
  });
  const deleteModalTitle = 'Oletko varma että haluat poistaa aukiolojakson?';
  const DeleteModalText = (): JSX.Element => (
    <>
      <p>Olet poistamassa aukiolojakson</p>
      <p>
        <b>
          {datePeriodName}
          <br />
          {formattedDateRange}
        </b>
      </p>
    </>
  );
  const { isModalOpen, openModal, closeModal } = useModal();
  const { isOpen, toggleAccordion } = useAccordion({
    initiallyOpen: false,
  });
  const AccordionIcon = (): JSX.Element =>
    isOpen ? <IconAngleUp aria-hidden /> : <IconAngleDown aria-hidden />;

  const nonSupportedFeatures = getNonSupportedFeatures(datePeriod);

  return (
    <div
      className="opening-period"
      data-test={`openingPeriod-${datePeriod.id}`}>
      <div className="opening-period-header">
        <div className="opening-period-dates opening-period-header-column">
          <div>{formattedDateRange}</div>
        </div>
        <div className="opening-period-title opening-period-header-column">
          {datePeriodName ? (
            <h4>{datePeriodName}</h4>
          ) : (
            <h4 className="text-danger">
              {displayLangVersionNotFound({
                language,
                label: 'aukiolojakson nimi',
              })}
            </h4>
          )}
        </div>
        <div className="opening-period-actions opening-period-header-column">
          <Link
            className="opening-period-edit-link button-icon"
            data-test={`openingPeriodEditLink-${datePeriod.id}`}
            to={`/resource/${resourceId}/period/${datePeriod.id}`}>
            <IconPenLine aria-hidden="true" />
            <span className="sr-only">{`Muokkaa ${
              datePeriodName || 'nimettömän'
            } aukiolojakson tietoja`}</span>
          </Link>
          <button
            className="opening-period-delete-link button-icon"
            data-test={`openingPeriodDeleteLink-${datePeriod.id}`}
            type="button"
            onClick={(): void => openModal()}>
            <IconTrash aria-hidden="true" />
            <span className="sr-only">{`Poista ${
              datePeriodName || 'nimetön'
            } aukiolojakso`}</span>
          </button>
          <button
            className="button-icon"
            data-test={`openingPeriodAccordionButton-${datePeriod.id}`}
            type="button"
            onClick={(): void => toggleAccordion()}>
            <AccordionIcon />
            <span className="sr-only">{`Näytä aukioloajat jaksosta ${
              datePeriodName || 'nimetön'
            } aukiolojakso`}</span>
          </button>
        </div>
        <ConfirmationModal
          onConfirm={async (): Promise<void> => {
            if (datePeriod.id) {
              try {
                await deletePeriod(datePeriod.id);
                toast.success({
                  label: 'Aukiolo poistettu onnistuneesti',
                  text: `Aukiolo "${datePeriodName}" poistettu onnistuneesti.`,
                  dataTestId: 'date-period-delete-success',
                });
              } catch (_) {
                toast.error({
                  label: 'Aukiolon poisto epäonnistui',
                  text:
                    'Aukiolon poisto epäonnistui. Yritä myöhemmin uudelleen.',
                });
              }
            }
          }}
          title={deleteModalTitle}
          text={<DeleteModalText />}
          isOpen={isModalOpen}
          close={closeModal}
          confirmText="Poista"
        />
      </div>
      {isOpen && (
        <div className="date-period-details-container">
          {nonSupportedFeatures.length === 0 && (
            <div>
              <WeekdayOpeningHours
                datePeriod={datePeriod}
                datePeriodConfig={datePeriodConfig}
                language={language}
              />
              {datePeriodDescriptionExistsInSomeLanguage(
                datePeriod.description
              ) && (
                <div className="date-period-description">
                  <div>
                    {datePeriodDescription && <p>{datePeriodDescription}</p>}
                    {!datePeriodDescription && (
                      <p>
                        {displayLangVersionNotFound({
                          language,
                          label: 'aukiolojakson kuvaus',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {nonSupportedFeatures.length > 0 && (
            <div>
              <p>
                Aukiolojaksossa on tietoja joiden näyttämistä tässä näkymässä
                sovellus ei vielä tue:
              </p>
              <NonSupportedFeatures
                nonSupportedFeatures={nonSupportedFeatures}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
