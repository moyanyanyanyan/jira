import { useCallback, useState } from "react";
import { useMountedRef } from "utils";

interface State<D> {
  data: D | null;
  error: Error | null;
  stat: "idle" | "loading" | "error" | "success";
}

//初始数据类型
const defaultInitialState: State<null> = {
  data: null,
  error: null,
  stat: "idle",
};

const defaultConfig = {
  throwOnError: false,
};

export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig,
) => {
  //config是两个合起来
  const config = { ...defaultConfig, ...initialConfig };
  const [retry, setRetry] = useState(() => () => {});
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });

  //防止子组件在卸载后更新状态
  const mountedRef = useMountedRef();

  //useCallback缓存一个函数，避免每次组件重新渲染时都创建新的函数
  const setData = useCallback(
    (data: D) =>
      setState({
        data,
        stat: "success",
        error: null,
      }),
    [],
  );
  const setError = useCallback(
    (error: Error) =>
      setState({
        error,
        stat: "error",
        data: null,
      }),
    [],
  );
  //用来触发异步请求
  const run = useCallback(
    //第一个参数是一个等待解决的promise，第二个参数是runConfig
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入 Promise 类型数据");
      }

      //假设有retry重试，就设置重试函数
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });

      //设置初始状态为loading
      setState((prevState) => ({ ...prevState, stat: "loading" }));

      return (
        promise
          // 返回的是promise执行后的返回的东西，是错误就返回错误
          .then((data) => {
            if (mountedRef.current) setData(data);
            return data;
          })
          .catch(
            //catch会消化异常，如果不主动抛出，外面是接受不到异常的
            (error) => {
              setError(error);
              if (config.throwOnError) {
                return Promise.reject(error);
              }
              //主动抛出异常
              return error;
            },
          )
      );
    },

    [config.throwOnError, mountedRef, setData, setError],
    // 这行是依赖数组，只有当这行里面的东西变化时，才会重新创建这个函数
  );

  // 这个useAsync返回的是状态和各种函数
  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    //retry被调用时再跑一边run，让state刷新一遍
    retry,
    ...state,
  };
};
