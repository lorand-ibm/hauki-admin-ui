import React from 'react';
import {
  ArrayField,
  DeepMap,
  FieldError,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { IconCalendarPlus } from 'hds-react';
import { SecondaryButton } from '../../components/button/Button';
import {
  GroupRuleFormFormat,
  TimeSpanGroupFormFormat,
  UiFormRuleConfig,
} from '../../common/lib/types';
import Rule from './Rule';

export default function Rules({
  groupIndex,
  groupId,
  namePrefix,
  ruleConfig,
  errors,
}: {
  groupIndex: number;
  groupId?: string;
  namePrefix: string;
  ruleConfig: UiFormRuleConfig;
  errors:
    | (DeepMap<TimeSpanGroupFormFormat, FieldError> | undefined)[]
    | undefined;
}): JSX.Element {
  const { control } = useFormContext();
  const ruleNamePrefix = `${namePrefix}[${groupIndex}].rules`;
  const { fields, remove, append } = useFieldArray<
    GroupRuleFormFormat,
    'ruleUiId'
  >({
    control,
    name: ruleNamePrefix,
    keyName: 'ruleUiId',
  });

  return (
    <>
      <div className="form-group rules-group">
        <h3 className="opening-period-section-title">
          Aukioloaikojen voimassaolo
        </h3>
        <ul
          className="opening-period-field-list opening-period-rule-list"
          data-test="rule-list">
          {fields.map(
            (
              rule: Partial<ArrayField<GroupRuleFormFormat, 'ruleUiId'>>,
              index: number
            ) => (
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
            )
          )}
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
