import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Kanban } from "types/kanban";
import { useAddConfig, useReorderKanbanConfig } from "./use-optimistic-options";

//此文件功能一览
// 钩子	作用	HTTP 方法	端点
// useKanbans	获取看板列表	GET	kanbans
// useAddKanban	新增看板	POST	kanbans
// useDeleteKanban	删除看板	DELETE	kanbans/{id}
// useReorderKanban	重新排序看板	POST	kanbans/reorder

// useQuery缓存机制一览
// 缓存（储物柜）
// ┌─────────────────────────────────┐
// │ Key                     │ Value  │
// ├─────────────────────────────────┤
// │ ["kanbans", {id:1}]    │ 看板A  │ ← 第1次请求后存入
// │ ["kanbans", {id:2}]    │ 看板B  │
// │ ["project", 123]       │ 项目X  │
// └─────────────────────────────────┘

// 第2次请求 ["kanbans", {id:1}]
// → 直接"拿"看板A（不重新请求）
export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();
  // 不同的kanban有不同的key
  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param }),
  );
};

export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Kanban>) =>
      client("kanbans", {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey),
  );
};

export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: "DELETE",
      }),
    useAddConfig(queryKey),
  );
};

export interface SortProps {
  // 要重新排序的 ITEM
  fromId: number;
  // 目标 ITEM
  referenceId: number;
  // 放在目标 ITEM 的前还是后
  type: "before" | "after";
  fromKanbanId?: number;
  toKanbanId?: number;
}
export const useReorderKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: SortProps) => {
    return client("kanbans/reorder", {
      data: params,
      method: "POST",
    });
  }, useReorderKanbanConfig(queryKey));
};
