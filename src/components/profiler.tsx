import React, { ProfilerProps, ReactNode } from "react";

//每五秒打印一次数据
type Props = {
  metadata?: any;
  phases?: ("mount" | "update")[];
  children?: ReactNode;
} & Omit<ProfilerProps, "onRender">;

let queue: unknown[] = [];
//发送性能数据
const sendProfileQueue = () => {
  if (!queue.length) return;
  const queueToSend = [...queue];
  queue = [];
  console.log("发送性能数据:", queueToSend);
};

setInterval(sendProfileQueue, 5000);

//这里是push数据
export const Profiler = ({ metadata, phases, children, ...props }: Props) => {
  const reportProfile: React.ProfilerOnRenderCallback = (
    //类型名称，React 提供的性能回调函数类型
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  ) => {
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
        metadata,
      });
    }
  };

  return (
    // 当 children 中的组件渲染时
    // React 会自动调用 reportProfile 函数
    // 把渲染的性能数据传给它
    // reportProfile 再把数据存到队列里
    <React.Profiler onRender={reportProfile} {...props}>
      {children}
    </React.Profiler>
  );
};
