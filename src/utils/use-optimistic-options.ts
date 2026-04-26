import { QueryKey, useQueryClient } from "react-query";
import { reorder } from "./reorder";
import { Task } from "types/task";

// useConfig - 通用工厂函数，接收缓存 key 和更新逻辑，返回 onMutate（立即更新）、onError（失败回滚）、onSuccess（成功刷新）三个钩子

// useDeleteConfig - 基于 useConfig，用 filter 删除指定 id 的项

// useEditConfig - 基于 useConfig，用 map 更新匹配 id 的项

// useAddConfig - 基于 useConfig，用展开运算符追加新项

// useReorderKanbanConfig - 基于 useConfig，调用 reorder 函数重新排列看板顺序

// useReorderTaskConfig - 基于 useConfig，先 reorder 排序，再更新拖拽任务的 kanbanId（支持跨看板移动）
export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old: any[]) => any[],
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old || []);
      });
      return { previousItems };
    },
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old.filter((item) => item.id !== target.id),
  );
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old.map((item) => (item.id === target.id ? { ...item, ...target } : item)),
  );
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));

export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    const orderedList = reorder({ list: old, ...target }) as Task[];
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item,
    );
  });
