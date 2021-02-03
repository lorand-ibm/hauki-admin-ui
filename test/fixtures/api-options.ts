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
        label: 'Auki',
      },
      {
        value: 'self_service',
        label: 'Itsepalvelu',
      },
    ],
  },
  timeSpanGroup: {
    rule: {
      context: {
        options: [
          {
            value: 'period',
            label: 'Jakso',
          },
          {
            value: 'month',
            label: 'Kuukausi',
          },
        ],
      },
      subject: {
        options: [
          {
            value: 'week',
            label: 'Viikko',
          },
          {
            value: 'month',
            label: 'Kuukausi',
          },
          {
            value: 'mon',
            label: 'Maanantai',
          },
        ],
      },
      frequencyModifier: {
        options: [
          {
            value: 'odd',
            label: 'Pariton',
          },
          {
            value: 'even',
            label: 'Parillinen',
          },
        ],
      },
    },
  },
};
