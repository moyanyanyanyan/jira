import React from "react";
import styled from "@emotion/styled";
import { Popover, Typography, List, Divider, Button } from "antd";
import { useProjectModal } from "screens/project-list/util";
import { useProjects } from "utils/project";

//显示收藏的项目列表，并提供创建项目的入口
export const ProjectPopover = () => {
  const { open } = useProjectModal();
  const { data: projects, refetch } = useProjects();
  const pinnedProjects = projects?.filter((project) => project.pin);
  const content = (
    <ContentContainer>
      <Typography.Text type={"secondary"}>收藏项目</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item key={project.id}>
            {/* <a href={`#/projects/${project.id}/board`}>{project.name}</a> */}
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <Button type={"link"} onClick={open} style={{ padding: 0 }}>
        创建项目
      </Button>
    </ContentContainer>
  );
  return (
    <Popover
      onOpenChange={() => refetch()}
      placement={"bottom"}
      content={content}
    >
      <span>项目</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
