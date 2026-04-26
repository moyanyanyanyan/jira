import { useMemo } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { cleanObject } from "./index";

//返回一个数组，第一个是url转换的对象，
// 第二个是url是否转换完毕的promise
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  //useSearchParams专门用来读取和修改当前页面URL中的查询参数
  // （也就是 ? 后面的部分）
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  // 这个函数在下面
  return [
    useMemo(
      // useMemo能够缓存计算结果，避免重复执行
      //这个函数的作用是从 URL 参数中批量获取指定字段的值，
      // 组成一个对象，然后返回
      () =>
        keys.reduce(
          //reduce的两个参数是回调函数和初始值
          (prev: { [key in K]: string }, key: K) => {
            return { ...prev, [key]: searchParams.get(key) || "" };
          },
          {} as { [key in K]: string },
        ),
      [searchParams],
    ),
    //第二个返回值是一个函数，接受params参数，返回一个promise
    //这个promise会在url更新完之后改变状态
    //为了让调用者能够“等待”URL 更新完成后再执行后续操作
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params);
    },
  ] as const;
};

export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  //返回一个函数，调用这个函数的时候会自动去除空值，然后设置searchParams
  return (params: { [key: string]: unknown }) => {
    const o = cleanObject({
      //fromEntries将键值对列表转换成对象
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParams(o);
  };
};
