import { FieldProps } from "formik";
import React from "react";
import Select, { OptionsType, ValueType } from "react-select";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps extends FieldProps {
  options: OptionsType<Option>;
  isMulti?: boolean;
}

const CustomSelect = ({
  field,
  form,
  options,
  isMulti = false,
}: CustomSelectProps) => {
  function onChange(option: ValueType<Option | Option[]>) {
    form.setFieldValue(
      field.name,
      option ? (option as Option[]).map((item: Option) => item.value) : []
    );
  }

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option) => field.value.indexOf(option.value) >= 0)
        : options.find((option) => option.value === field.value);
    } else {
      return isMulti ? [] : ("" as any);
    }
  };

  return (
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      name={field.name}
      value={getValue()}
      onChange={onChange}
      options={options}
      isMulti={true}
      placeholder=" "
    />
  );
};

export default CustomSelect;
