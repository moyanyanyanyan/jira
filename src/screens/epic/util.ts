import { useProjectIdInUrl } from "screens/kanban/util";

//生成获取kanban任务组列表所需的查询参数和缓存标识
export const useEpicSearchParams = () => ({ projectId: useProjectIdInUrl() });
export const useEpicsQueryKey = () => ["epics", useEpicSearchParams()];
