import React from "react";
import { Kanban } from "types/kanban";
import { useTasks } from "utils/task";
import {
  useKanbansQueryKey,
  useTasksModal,
  useTasksSearchParams,
} from "./util";
import { CreateTask } from "./create-task";
import { Mark } from "components/mark";
import taskIcon from "assets/task.svg";
import bugIcon from "../../assets/bug.svg";
import { useTaskTypes } from "utils/task-type";
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Modal } from "antd";
import type { MenuProps } from "antd";
import { Task } from "types/task";
import { Row } from "components/lib";
import { useDeleteKanban } from "utils/kanban";
import { Drag, Drop, DropChild } from "components/drag-and-drop";

// 显示看板列：展示看板名称和所属任务卡片列表
// 显示任务卡片：每个任务显示名称、类型图标（task/bug）
// 拖拽排序：支持任务在不同看板列之间拖拽移动
// 创建任务：列底部有快速创建任务的输入框
// 删除看板：点击"..."菜单可以删除整个看板
// 编辑任务：点击任务卡片打开编辑弹窗
const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) {
    return null;
  }
  return <img src={name === "task" ? taskIcon : bugIcon} alt={"taskIcon"} />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTasksModal();
  const { name: keyword } = useTasksSearchParams();
  return (
    <Card
      style={{ marginBottom: "0.5rem", cursor: "pointer" }}
      key={task.id}
      onClick={() => startEdit(task.id)}
    >
      <p>
        <Mark name={task.name} keyword={keyword} />
      </p>
      <TaskTypeIcon id={task.typeId} />
    </Card>
  );
};

export const KanbanColumn = React.forwardRef<
  HTMLDivElement,
  { kanban: Kanban }
>(({ kanban, ...props }, ref) => {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);

  return (
    <Container ref={ref} {...props}>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} key={kanban.id} />
      </Row>
      <TasksContainer>
        <Drop
          type={"Row"}
          direction={"vertical"}
          droppableId={String(kanban.id)}
        >
          <DropChild style={{ minHeight: "5px" }}>
            {tasks?.map((task, taskIndex) => (
              <Drag
                key={task.id}
                draggableId={"task" + task.id}
                index={taskIndex}
              >
                <div>
                  <TaskCard key={task.id} task={task} />
                </div>
              </Drag>
            ))}
          </DropChild>
        </Drop>
        <CreateTask kanbanId={kanban.id} />
      </TasksContainer>
    </Container>
  );
});

const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbansQueryKey());
  const stateEdit = () => {
    Modal.confirm({
      title: "确定删除看板吗？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        return mutateAsync({ id: kanban.id });
      },
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "delete",
      danger: true,
      label: (
        <Button type="link" onClick={stateEdit}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <Button type={"link"}>...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;

const TasksContainer = styled.div`
  overflow: scroll;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
`;
