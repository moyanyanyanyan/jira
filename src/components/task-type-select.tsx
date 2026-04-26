import React from "react";
import { useTaskTypes } from "utils/task-type";
import { IdSelect } from "./id-select";

//下拉选择框组件，专门用来选择"任务类型"（比如：任务/Bug/需求）
export const TaskTypeSelect = (
  props: React.ComponentProps<typeof IdSelect>,
) => {
  const { data: taskTypes } = useTaskTypes();
  // props透传
  return <IdSelect options={taskTypes || []} {...props} />;
};
