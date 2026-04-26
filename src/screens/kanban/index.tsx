import React from "react";
import { useDocumentTitle } from "utils";
import { useKanbans, useReorderKanban } from "utils/kanban";
import {
  useKanbanSearchParams,
  useKanbansQueryKey,
  useProjectInUrl,
  useTasksQueryKey,
  useTasksSearchParams,
} from "./util";
import { KanbanColumn } from "./kanban-column";
import { SearchPanel } from "./search-panel";
import { CreateKanban } from "./create-kanban";
import styled from "@emotion/styled";
import { ScreenContainer } from "components/lib";
import { useReorderTask, useTasks } from "utils/task";
import { Spin } from "antd";
import { TaskModal } from "./task-modal";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Drag, Drop, DropChild } from "components/drag-and-drop";
import { useCallback } from "react";
import { Profiler } from "components/profiler";

//实现了看板页面（KanbanScreen） 的完整功能
export const KanbanScreen = () => {
  useDocumentTitle("看板列表");

  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans, isLoading: kanbansIsLoading } = useKanbans(
    useKanbanSearchParams(),
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());
  const isLoading = kanbansIsLoading || taskIsLoading;
  const dragEnd = useDragEnd();
  const DragDropContextComponent = DragDropContext as any;
  return (
    <Profiler id={"看板列表"}>
      <DragDropContextComponent onDragEnd={dragEnd}>
        <ScreenContainer>
          <h1>{currentProject?.name}看板</h1>
          <SearchPanel />
          {isLoading ? (
            <Spin size={"large"} />
          ) : (
            <ColumnsContainer>
              <Drop type={"COLUMN"} direction="horizontal" droppableId="kanban">
                <DropChild style={{ display: "flex" }}>
                  {kanbans?.map((kanban, index) => (
                    <Drag
                      key={kanban.id}
                      draggableId={"kanban" + kanban.id}
                      index={index}
                    >
                      <KanbanColumn key={kanban.id} kanban={kanban} />
                    </Drag>
                  ))}
                </DropChild>
              </Drop>
              <CreateKanban />
            </ColumnsContainer>
          )}
          <TaskModal />
        </ScreenContainer>
      </DragDropContextComponent>
    </Profiler>
  );
};

//拖拽逻辑
export const useDragEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { mutate: reorderKanban } = useReorderKanban(useKanbansQueryKey());
  const { mutate: reorderTask } = useReorderTask(useTasksQueryKey());
  const { data: allTasks = [] } = useTasks(useTasksSearchParams());
  return useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) {
        return;
      }
      if (type === "COLUMN") {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[destination.index].id;
        if (!fromId || !toId || fromId === toId) {
          return;
        }
        const type = destination.index > source.index ? "after" : "before";
        reorderKanban({ fromId, referenceId: toId, type });
      }
      if (type === "Row") {
        const fromKanbanId = +source.droppableId;
        const toKanbanId = +destination.droppableId;
        if (fromKanbanId === toKanbanId) {
          return;
        }
        const fromTask = allTasks.filter(
          (task) => task.kanbanId === fromKanbanId,
        )[source.index];
        const toTask = allTasks.filter((task) => task.kanbanId === toKanbanId)[
          destination.index
        ];
        if (fromTask?.id === toTask?.id) return;
        reorderTask({
          fromId: fromTask?.id,
          referenceId: toTask?.id,
          toKanbanId,
          fromKanbanId,
          type:
            fromKanbanId === toKanbanId && destination.index > source.index
              ? "after"
              : "before",
        });
      }
    },
    [kanbans, reorderKanban, reorderTask, allTasks],
  );
};

export const ColumnsContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;
