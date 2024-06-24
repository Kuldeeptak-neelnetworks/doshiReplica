import React from "react";
import Select from "react-select";

const SelectElement = ({
  isLoading,
  options,
  defaultValue,
  handleChange,
  name,
  isClearable,
}) => {
  return (
    <Select
      className="react-select-custom-styling__container"
      classNamePrefix="react-select-custom-styling"
      defaultValue={defaultValue ?? null}
      isLoading={isLoading}
      isClearable={isClearable ?? true}
      isSearchable={true}
      name={name ?? null}
      onChange={({ value }) => handleChange(value)}
      options={options}
    />
  );
};

export default SelectElement;
