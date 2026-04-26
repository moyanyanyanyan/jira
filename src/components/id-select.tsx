import React from "react";
import { Select } from "antd";
type SelectProps = React.ComponentProps<typeof Select>;
interface IdSelectProps extends Omit<SelectProps, "onChange" | "value"> {
  value?: string | number | null | undefined;
  onChange?: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}
//接收 5 类参数（value、onChange、defaultOptionName、options、restProps），
// 返回一个下拉选择框，
// 核心功能是把各种类型的输入值统一转成数字 ID 来处理
// value可以传入多种类型的值
// onChange只会回调number/undefined类型的值
// 当isNaN(Number(value))为true时，说明传入的value无法转换为数字，此时onChange应该回调undefined
const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, defaultOptionName, options, ...restProps } = props;
  return (
    <Select
      value={options?.length ? toNumber(value) : 0}
      onChange={(value) => onChange?.(toNumber(value) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options?.map((option) => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};
