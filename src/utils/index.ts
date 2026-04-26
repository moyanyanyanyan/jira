import { useEffect, useState, useRef } from "react";

export const isFalsy = (value: unknown) => {
  return value === 0 ? false : !value;
};
// 去除0的干扰

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";
//只要中一个就是true

export const cleanObject = (obj?: Record<string, unknown>) => {
  //清理对象中的空值
  if (!obj) {
    return {};
  }
  const result: any = { ...obj };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

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

//这个工具函数可以决定页签上面的title是什么，是否继承默认的title
export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true,
) => {
  const oldTitle = useRef(document.title).current;
  //页面加载时：旧title:jira
  //加载后：新title
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        //如果不指定依赖，读到的就是旧title
        //指定依赖后，读到的就是新title
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
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

export const resetRoute = () => (window.location.href = window.location.origin);
// 路由变回初始

//主要用于防止在组件卸载后更新状态，避免内存泄漏警告
export const useMountedRef = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });
  return mountedRef;
};
