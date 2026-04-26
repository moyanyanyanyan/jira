import React from "react";
import { Users } from "types/user";
import { Dropdown, Table, TableProps, Button, MenuProps, Modal } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import { useDeleteProject, useEditProject } from "utils/project";
import { useProjectModal, useProjectsQueryKey } from "./util";
import { Project } from "types/project";

//项目列表表格的完整功能

interface ListProps extends TableProps<Project> {
  users: Users[];
  refresh?: () => void;
}

export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());
  const { startEdit } = useProjectModal();
  const pinProject = (id: number) => (pin: boolean) => {
    mutate({ id, pin });
  };
  const editProject = (id: number) => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());
  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: "确定删除该项目吗？",
      content: "点击确定删除",
      okText: "确定",
      onOk() {
        deleteProject(id);
      },
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: <Button type="link">编辑</Button>,
    },
    {
      key: "delete",
      label: (
        <Button type="link" danger>
          删除
        </Button>
      ),
    },
  ];
  return (
    <Table
      pagination={false}
      rowKey="id"
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find(
                  (user: Users) => Number(user.id) === Number(project.personId),
                )?.name || "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          key: "created",
          render(value, project) {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return (
              <Dropdown
                menu={{
                  items,
                  onClick: ({ key }) => {
                    if (key === "edit") {
                      editProject(project.id);
                    } else if (key === "delete") {
                      confirmDelete(project.id);
                    }
                  },
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Button style={{ padding: 0 }} type={"link"}>
                    ...
                  </Button>
                </a>
              </Dropdown>
            );
          },
        },
      ]}
      {...props}
    />
  );
};
