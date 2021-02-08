import { UiDatePeriodConfig as DatePeriodConfig } from '../../src/common/lib/types';

// eslint-disable-next-line import/prefer-default-export
export const datePeriodOptions: DatePeriodConfig = {
  name: {
    max_length: 255,
  },
  resourceState: {
    options: [
      {
        value: 'open',
        label: {
          fi: 'Auki',
          sv: null,
          en: null,
        },
      },
      {
        value: 'self_service',
        label: {
          fi: 'Itsepalvelu',
          sv: null,
          en: null,
        },
      },
    ],
  },
  timeSpanGroup: {
    rule: {
      context: {
        options: [
          {
            value: 'period',
            label: {
              fi: 'Jakso',
              sv: null,
              en: null,
            },
          },
          {
            value: 'month',
            label: {
              fi: 'Kuukausi',
              sv: null,
              en: null,
            },
          },
        ],
      },
      subject: {
        options: [
          {
            value: 'week',
            label: {
              fi: 'Viikko',
              sv: null,
              en: null,
            },
          },
          {
            value: 'month',
            label: {
              fi: 'Kuukausi',
              sv: null,
              en: null,
            },
          },
          {
            value: 'mon',
            label: {
              fi: 'Maanantai',
              sv: null,
              en: null,
            },
          },
        ],
      },
      frequencyModifier: {
        options: [
          {
            value: 'odd',
            label: {
              fi: 'Pariton',
              sv: null,
              en: null,
            },
          },
          {
            value: 'even',
            label: {
              fi: 'Parillinen',
              sv: null,
              en: null,
            },
          },
        ],
      },
    },
  },
};
