import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IconCalendarPlus } from 'hds-react';
import { SecondaryButton } from '../../components/button/Button';
import {
  OpeningPeriodFormData,
  UiFormRuleConfig,
} from '../../common/lib/types';
import Rule from './Rule';

export default function Rules({
  groupIndex,
  groupId,
  namePrefix,
  ruleConfig,
}: {
  groupIndex: number;
  groupId?: string;
  namePrefix: 'timeSpanGroups';
  ruleConfig: UiFormRuleConfig;
}): JSX.Element {
  const { control, formState } = useFormContext<OpeningPeriodFormData>();
  const ruleNamePrefix = `${namePrefix}.${groupIndex}.rules` as const;
  const { fields, remove, append } = useFieldArray({
    control,
    name: ruleNamePrefix,
    keyName: 'ruleUiId',
  });
  const errors = formState.errors[namePrefix];

  return (
    <>
      <div className="form-group rules-group">
        <h3 className="opening-period-section-title">
          Aukioloaikojen voimassaolo
        </h3>
        <ul
          className="opening-period-field-list opening-period-rule-list"
          data-test="rule-list">
          {fields.map((rule, index: number) => (
            <li
              className="opening-period-field-list-item opening-period-rule-list-item"
              key={`rule-list-item-${rule.ruleUiId}`}
              data-test={`rule-list-item-${rule.id || index}`}>
              <Rule
                namePrefix={ruleNamePrefix}
                index={index}
                groupIndex={groupIndex}
                rule={rule}
                remove={remove}
                ruleConfig={ruleConfig}
                errors={errors ? errors[groupIndex]?.rules : undefined}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="form-group">
        <SecondaryButton
          dataTest={`add-new-rule-button-${groupIndex}`}
          onClick={(): void => append({ group: groupId ?? '' })}
          iconLeft={<IconCalendarPlus />}>
          Lisää aukioloaikojen voimassaolosääntö
        </SecondaryButton>
      </div>
    </>
  );
}
