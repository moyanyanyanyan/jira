import React from "react";
import { ProjectListScreen } from "screens/project-list";
import { ProjectScreen } from "screens/project";
import { useAuth } from "context/auth-context";
import { Row } from "./components/lib";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import styled from "@emotion/styled";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space } from "antd";
import { Navigate, Route, Routes } from "react-router";
import { resetRoute } from "utils";
import { ProjectModal } from "screens/project-list/project-modal";
import { ProjectPopover } from "components/project-popover";
import { UserPopover } from "components/user-popover";

//组件实现了已认证用户的主应用界面
export default function AuthenticatedApp() {
  return (
    <Container>
      <PageHeader />
      <Main>
        <Routes>
          <Route path={"/projects"} element={<ProjectListScreen />} />
          <Route path={"/projects/:projectid/*"} element={<ProjectScreen />} />
          <Route path="/" element={<Navigate to={"/projects"} />} />
        </Routes>
      </Main>
      <ProjectModal />
    </Container>
  );
}

const PageHeader = () => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <Button style={{ padding: 0 }} type={"link"} onClick={resetRoute}>
          <SoftwareLogo width={"18rem"} color={"rgb(38, 132, 255)"} />
        </Button>
        <ProjectPopover />
        <UserPopover />
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};

const User = () => {
  const { logout, user } = useAuth();
  const items: MenuProps["items"] = [
    {
      key: "logout",
      danger: true,
      label: (
        <Button type="link" onClick={logout}>
          登出
        </Button>
      ),
    },
  ];
  return (
    <Dropdown menu={{ items }}>
      <Button type={"link"} onClick={(e) => e.preventDefault()}>
        <Space>Hi, {user?.name}</Space>
      </Button>
    </Dropdown>
  );
};
// temporal dead zone(暂时性死区)
const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

// grid-area 用来给grid子元素起名字
const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;
const Main = styled.main`
  display: flex;
  overflow: hidden;
`;
