import React from 'react';
import { Select } from 'hds-react';
import { Control, Controller } from 'react-hook-form';
import { InputOption } from '../../common/lib/types';
import './ResourceStateSelect.scss';

type ResourceSelectProps = {
  control: Control;
  name: string;
  value?: string;
  id: string;
  options: InputOption[];
};

export default function ResourceStateSelect({
  control,
  name,
  value,
  id,
  options,
}: ResourceSelectProps): JSX.Element {
  return (
    <div className="resource-state-select-container">
      <Controller
        control={control}
        name={name}
        defaultValue={value}
        render={({ onChange, value: innerValue }): JSX.Element => (
          <Select
            id={id}
            onChange={(selected: InputOption): void => {
              onChange(selected.value);
            }}
            className="resource-state-select"
            value={options.find(
              (option: InputOption): boolean => option.value === innerValue
            )}
            options={options}
            label="Tyyppi"
            placeholder="Valitse tyyppi"
          />
        )}
      />
    </div>
  );
}
