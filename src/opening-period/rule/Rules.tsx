import React from 'react';
import {
  ArrayField,
  Control,
  DeepMap,
  FieldError,
  useFieldArray,
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
  control,
  ruleConfig,
  register,
  setValue,
  errors,
}: {
  groupIndex: number;
  groupId?: string;
  namePrefix: string;
  control: Control;
  ruleConfig: UiFormRuleConfig;
  register: Function;
  setValue: Function;
  errors:
    | (DeepMap<TimeSpanGroupFormFormat, FieldError> | undefined)[]
    | undefined;
}): JSX.Element {
  const ruleNamePrefix = `${namePrefix}[${groupIndex}].rules`;
  const { fields, remove, append } = useFieldArray({
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
              rule: Partial<ArrayField<Record<string, GroupRuleFormFormat>>>,
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
                  control={control}
                  setValue={setValue}
                  remove={remove}
                  register={register}
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
