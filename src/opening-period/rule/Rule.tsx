import React, { useEffect, useState } from 'react';
import { Button as HDSButton, IconTrash, Select } from 'hds-react';
import { ArrayField, Control, Controller } from 'react-hook-form';

import {
  InputOption,
  Frequency,
  UiRuleConfig,
  GroupRuleFormFormat,
} from '../../common/lib/types';
import './Rule.scss';

type FrequencyOption = {
  label: string;
  value: Frequency;
};

const hardCodedFrequencyOptions: FrequencyOption[] = [
  {
    label: '--',
    value: { frequency_ordinal: null, frequency_modifier: null },
  },
  {
    label: 'Jokainen',
    value: { frequency_ordinal: 1, frequency_modifier: null },
  },
  {
    label: 'Joka toinen',
    value: { frequency_ordinal: 2, frequency_modifier: null },
  },
  {
    label: 'Joka kolmas',
    value: { frequency_ordinal: 3, frequency_modifier: null },
  },
  {
    label: 'Joka neljäs',
    value: { frequency_ordinal: 4, frequency_modifier: null },
  },
  {
    label: 'Joka viides',
    value: { frequency_ordinal: 4, frequency_modifier: null },
  },
];

const frequencyToString = (frequency: Frequency): string =>
  `${frequency.frequency_ordinal} ${frequency.frequency_modifier} `;

const generateUnknownFrequencyLabel = (
  ordinal: number | null,
  modifierLabel?: string | null
): string => {
  const optionalOrdinalLabel: string | undefined =
    ordinal && ordinal > 1 ? `${ordinal}.` : undefined;

  return [optionalOrdinalLabel, modifierLabel].join(' ');
};

const convertFrequencyToInputOption = ({
  value,
  label,
}: {
  value: Frequency;
  label: string;
}): InputOption => ({
  label,
  value: frequencyToString(value),
});

const startAtOptions: InputOption[] = Array.from({ length: 10 }).map(
  (num, index) => ({
    label: `${index + 1}.`,
    value: (index + 1).toString(),
  })
);

export default function Rule({
  namePrefix,
  rule,
  control,
  setValue,
  remove,
  register,
  index,
  groupIndex,
  ruleConfig,
}: {
  namePrefix: string;
  rule: Partial<ArrayField<Record<string, GroupRuleFormFormat>>>;
  control: Control;
  setValue: Function;
  remove: Function;
  register: Function;
  index: number;
  groupIndex: number;
  ruleConfig: UiRuleConfig;
}): JSX.Element {
  const ruleNamePrefix = `${namePrefix}[${index}]`;

  const {
    id,
    context,
    subject,
    start: startAt,
    frequency_modifier: frequencyModifier = null,
    frequency_ordinal: frequencyOrdinal = null,
  } = rule;

  const {
    context: { options: contextOptions },
    subject: { options: subjectOptions },
    frequencyModifier: { options: frequencyModifierOptions },
  } = ruleConfig;

  const selectedSubject = subjectOptions.find(
    ({ value }: InputOption) => value === `${subject}`
  );
  const [subjectLabel, setSubjectLabel] = useState<string>(
    selectedSubject?.label ?? ''
  );

  const currentFrequency = {
    frequency_modifier: frequencyModifier,
    frequency_ordinal: frequencyOrdinal,
  } as Frequency;

  const knownFrequencyValues: FrequencyOption[] = [
    ...hardCodedFrequencyOptions,
    ...frequencyModifierOptions.map(
      (modifierOption: InputOption): FrequencyOption => ({
        label: modifierOption.label,
        value: {
          frequency_ordinal: null,
          frequency_modifier: modifierOption.value,
        },
      })
    ),
  ];

  const isKnownFrequencySelected = knownFrequencyValues.find(
    ({ value }) =>
      value.frequency_modifier === currentFrequency.frequency_modifier &&
      value.frequency_ordinal === currentFrequency.frequency_ordinal
  );

  const allFrequencyValues: FrequencyOption[] = isKnownFrequencySelected
    ? knownFrequencyValues
    : [
        ...knownFrequencyValues,
        {
          label: generateUnknownFrequencyLabel(
            currentFrequency.frequency_ordinal,
            frequencyModifierOptions.find(
              (modifierOption: InputOption) =>
                modifierOption.value === currentFrequency.frequency_modifier
            )?.label
          ),
          value: currentFrequency,
        },
      ];

  const frequencyOptions: InputOption[] = allFrequencyValues.map(
    convertFrequencyToInputOption
  );

  const frequencyModifierField = `${ruleNamePrefix}.frequency_modifier`;
  const frequencyOrdinalField = `${ruleNamePrefix}.frequency_ordinal`;

  const onFrequencyChange = (selected: InputOption): void => {
    const selectedFrequency = allFrequencyValues.find(
      ({ label }) => label === selected.label
    );

    setValue(
      frequencyModifierField,
      selectedFrequency?.value.frequency_modifier || null
    );
    setValue(
      frequencyOrdinalField,
      selectedFrequency?.value.frequency_ordinal || null
    );
  };

  useEffect(() => {
    register({ name: frequencyModifierField });
    register({ name: frequencyOrdinalField });

    // "If you choose to not use Controller and manually register fields, you will need to update the input value with setValue." - https://react-hook-form.com/api#register
    setValue(frequencyModifierField, frequencyModifier, {
      shouldValidate: false,
    });
    setValue(frequencyOrdinalField, frequencyOrdinal, {
      shouldValidate: false,
    });
  }, [
    frequencyModifier,
    frequencyModifierField,
    frequencyOrdinal,
    frequencyOrdinalField,
    register,
    setValue,
  ]);

  return (
    <div className="opening-group-rule form-control" key={`rules-${index}`}>
      <input
        type="hidden"
        name={`${ruleNamePrefix}.id`}
        defaultValue={id}
        ref={register()}
      />
      <div className="opening-group-rule-remove">
        <HDSButton
          data-test={`remove-rule-button-${groupIndex}-${index}`}
          className="opening-period-remove-list-item-button"
          variant="supplementary"
          onClick={(): void => remove(index)}
          iconLeft={<IconTrash />}>
          Poista aukioloaikojen voimassaolosääntö
        </HDSButton>
      </div>
      <div className="opening-group-rule-fieldset">
        <Controller
          key={`rule-context-${groupIndex}-${index}`}
          name={`${ruleNamePrefix}.context`}
          control={control}
          defaultValue={`${context || ''}`}
          render={({ onChange, value }): JSX.Element => (
            <Select
              id={`rule-context-${groupIndex}-${index}`}
              className="opening-group-rule-column opening-group-rule-select"
              onChange={(selected: InputOption): void =>
                onChange(selected.value)
              }
              options={contextOptions}
              defaultValue={contextOptions.find(
                (option: InputOption): boolean => option.value === value
              )}
              label="Valitse aika"
              placeholder="Aikaväli"
            />
          )}
        />
        <Select
          key={`rule-frequency-${groupIndex}-${index}`}
          id={`rule-frequency-${groupIndex}-${index}`}
          className="opening-group-rule-column opening-group-rule-select"
          defaultValue={frequencyOptions.find(
            ({ value }) => value === frequencyToString(currentFrequency)
          )}
          onChange={(selected: InputOption): void =>
            onFrequencyChange(selected)
          }
          options={frequencyOptions}
          label="Valitse monesko"
          placeholder="Tapahtumatiheys"
        />
        <Controller
          key={`rule-subject-${groupIndex}-${index}`}
          name={`${ruleNamePrefix}.subject`}
          control={control}
          defaultValue={`${subject || ''}`}
          render={({ onChange, value }): JSX.Element => (
            <Select
              id={`rule-subject-${groupIndex}-${index}`}
              className="opening-group-rule-column opening-group-rule-select"
              defaultValue={subjectOptions.find(
                (selected: InputOption): boolean => selected.value === value
              )}
              onChange={(selected: InputOption): void => {
                onChange(selected.value);
                setSubjectLabel(selected.label);
              }}
              options={subjectOptions}
              label="Valitse ajan yksikkö"
              placeholder="päivä tai aikaväli"
            />
          )}
        />
        <div className="opening-group-rule-column opening-group-rule-column-large">
          <p key="rule-subject-divider">Alkaen</p>
          <Controller
            key={`rule-start-${groupIndex}-${index}`}
            name={`${ruleNamePrefix}.start`}
            control={control}
            defaultValue={`${startAt || ''}`}
            render={({ onChange, value }): JSX.Element => (
              <Select
                id={`rule-start-${groupIndex}-${index}`}
                className="opening-group-rule-select"
                defaultValue={startAtOptions.find(
                  (selected: InputOption): boolean => selected.value === value
                )}
                onChange={(selected: InputOption): void =>
                  onChange(selected.value)
                }
                options={startAtOptions}
                label={`Valitse monesko ${subjectLabel.toLowerCase() || ''}`}
                placeholder="Alkaen voimassa"
              />
            )}
          />
          <p
            key="rule-subject-indicator"
            data-test="rule-subject-indicator"
            className="opening-group-rule-subject-indicator">
            {subjectLabel || ''}
          </p>
        </div>
      </div>
    </div>
  );
}
