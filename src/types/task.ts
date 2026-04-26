export interface Task {
  id: number;
  name: string;
  //经办人
  processorId: number;
  projectId: number;
  //任务所属看板
  epicId: number;
  kanbanId: number;
  //任务类型
  typeId: number;
  note: string;
}
