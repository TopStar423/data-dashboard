// Reusable multi select with checkbox in the option
import React, { useState } from "react"
import Select, {
  MultiValue,
  components,
  OptionProps,
  GroupBase
} from "react-select"
import { NumberOption, BooleanOption } from "types/common"
import "./style.scss"

interface MultiSelectPropsType {
  options: NumberOption[] | BooleanOption[]
  value: NumberOption[] | BooleanOption[]
  onChange: (options: MultiValue<NumberOption | BooleanOption>) => void
}

const Option: React.ComponentType<
  OptionProps<
    NumberOption | BooleanOption,
    true,
    GroupBase<NumberOption | BooleanOption>
  >
> = (
  props: OptionProps<
    NumberOption | BooleanOption,
    true,
    GroupBase<NumberOption | BooleanOption>
  >
) => {
  const [isActive, setIsActive] = useState(false)
  const onMouseDown = () => setIsActive(true)
  const onMouseUp = () => setIsActive(false)
  const onMouseLeave = () => setIsActive(false)

  let bg = "transparent"
  if (props.isFocused) bg = "#eee"
  if (isActive) bg = "#B2D4FF"

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex "
  }

  const innerProps = {
    ...props.innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  }
  return (
    <components.Option {...props} innerProps={innerProps}>
      <input type="checkbox" checked={props.isSelected} onChange={() => null} />
      <label className="multi-select-label">{props.label}</label>
    </components.Option>
  )
}

const MultiSelect = ({ options, value, onChange }: MultiSelectPropsType) => {
  return (
    <Select
      options={options}
      value={value}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{
        Option
      }}
      onChange={onChange}
    />
  )
}

export default MultiSelect
