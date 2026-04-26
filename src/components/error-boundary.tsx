import React from "react";
type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

//用于捕获子组件中发生的 JavaScript 错误，并显示备用 UI，防止整个应用崩溃白屏

export default class Errorboundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  state = { error: null };
  //当子组件抛出异常，这里会接受到并调用
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;

    if (error) {
      return fallbackRender({ error });
    }
    return children;
  }
}
