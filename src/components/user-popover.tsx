import React from "react";
import styled from "@emotion/styled";
import { Popover, Typography, List, Divider, Button } from "antd";
import { useProjectModal } from "screens/project-list/util";
import { useUsers } from "utils/user";

//实现了组员列表弹窗
export const UserPopover = () => {
  const { open } = useProjectModal();
  const { data: users, refetch } = useUsers();
  const content = (
    <ContentContainer>
      <Typography.Text type={"secondary"}>组员列表</Typography.Text>
      <List>
        {users?.map((user) => (
          <List.Item key={user.id}>
            <List.Item.Meta title={user.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
    </ContentContainer>
  );
  return (
    <Popover
      onOpenChange={() => refetch()}
      placement={"bottom"}
      content={content}
    >
      <span>组员</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
