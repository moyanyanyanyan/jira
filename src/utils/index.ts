import { useEffect, useState } from "react";

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []);
};

export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setdouncedValue] = useState(value);

  useEffect(() => {
    //每次在value变化以后设置一个定时器
    const timeout = setTimeout(() => setdouncedValue(value), delay);
    return () => clearTimeout(timeout); //每次在上一个useEffect处理完以后再运行
  }, [value, delay]);

  return debouncedValue;
};

export const isFalsy = (value: any) => (value === 0 ? false : !value);

export const cleanObject = <T extends Record<string, any>>(object: T): T => {
  //处理返回数据的工具函数，作用是删除值为0，undefined,null,false，""的键
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key as keyof T];
    if (isFalsy(value)) {
      delete result[key as keyof T];
    }
  });
  return result;
};

export const useArray = <T>(initialArray: T[]) => {
  const [value, setValue] = useState(initialArray);
  return {
    value,
    setValue,
    add: (item: T) => setValue([...value, item]),
    removeIndex: (index: number) => {
      const copy = [...value];
      copy.splice(index, 1);
      setValue(copy);
    },
    clear: () => setValue([]),
  };
};
