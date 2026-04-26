import { useCallback, useMemo } from "react";
import { useLocation } from "react-router";
import { useDebounce } from "utils";
import { useProject } from "utils/project";
import { useTask } from "utils/task";
import { useUrlQueryParam } from "utils/url";

//这个文件实现了看板（Kanban）和任务（Task）页面的核心数据逻辑，
// 包括URL参数解析、查询参数管理、弹窗状态控制等功能

//从URL路径中提取项目ID（如 /projects/123/kanban → 123）
export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

//功能：获取当前项目的完整信息
// 返回值：项目对象、loading、error等
export const useProjectInUrl = () => useProject(useProjectIdInUrl());

//看板查询参数
export const useKanbanSearchParams = () => ({
  projectId: useProjectIdInUrl(),
});

export const useKanbansQueryKey = () => ["kanbans", useKanbanSearchParams()];

//任务查询参数（支持搜索筛选）
// 功能：获取任务列表的筛选参数，支持：
// name：任务名称（自动防抖500ms）
// typeId：类型ID
// processorId：处理人ID
// tagId：标签ID
// 返回值：包含projectId和上述筛选条件的对象
export const useTasksSearchParams = () => {
  const [param, setParam] = useUrlQueryParam([
    "name",
    "typeId",
    "processorId",
    "tagId",
  ]);
  const projectId = useProjectIdInUrl();
  const debouncedName = useDebounce(param.name, 500);
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      name: debouncedName,
    }),
    [projectId, param, debouncedName],
  );
};

export const useTasksQueryKey = () => ["tasks", useTasksSearchParams()];

// 功能：控制编辑任务弹窗的显示/隐藏和当前编辑任务
export const useTasksModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    "editingTaskId",
  ]);
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId));
  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id });
    },
    [setEditingTaskId],
  );
  const close = useCallback(() => {
    setEditingTaskId({ editingTaskId: "" });
  }, [setEditingTaskId]);
  return {
    editingTask,
    editingTaskId,
    startEdit,
    close,
    isLoading,
  };
};
