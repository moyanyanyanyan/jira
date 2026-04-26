import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Epic } from "types/epic";
import { useAddConfig, useDeleteConfig } from "./use-optimistic-options";

// useEpics	获取任务组列表	GET
// useAddEpic	添加任务组	POST
// useDeleteEpic	删除任务组	DELETE

export const useEpics = (param?: Partial<Epic>) => {
  const client = useHttp();
  return useQuery<Epic[]>(["epics", param], () =>
    client("epics", { data: param }),
  );
};

export const useAddEpic = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Epic>) =>
      client("epics", {
        data: params,
        method: "POST",
      }),
    useAddConfig(queryKey),
  );
};

export const useDeleteEpic = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) =>
      client(`epics/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey),
  );
};

export interface SortProps {
  // 要重新排序的 ITEM
  fromId: number;
  // 目标 ITEM
  referenceId: number;
  // 放在目标 ITEM 的前还是后
  type: "before" | "after";
  fromEpicId?: number;
  toEpicId?: number;
}
