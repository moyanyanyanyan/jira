import React from "react";
import { Link } from "react-router-dom";
import { Route, Routes, Navigate, useLocation } from "react-router";
import { KanbanScreen } from "screens/kanban";
import { EpicScreen } from "screens/epic";
import styled from "@emotion/styled";
import { Menu } from "antd";

//在项目详情页内提供一个侧边栏菜单，
// 用于在"看板"和"任务组"两个子页面之间切换。
const useRouteType = () => {
  const units = useLocation().pathname.split("/");
  return units[units.length - 1] || "kanban";
};
export const ProjectScreen = () => {
  return (
    <Container>
      <Aside>
        <Menu mode={"inline"} selectedKeys={[useRouteType()]}>
          <Menu.Item key={"kanban"}>
            <Link to={"kanban"}>看板</Link>
          </Menu.Item>
          <Menu.Item key={"epic"}>
            <Link to={"epic"}>任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          <Route path={"/kanban"} element={<KanbanScreen />} />
          <Route path={"/epic"} element={<EpicScreen />} />
          <Route path={"/"} element={<Navigate to={"kanban"} replace />} />
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;
const Main = styled.div`
  box-shadow: -5px 0 5px rgba(214, 115, 115, 0.1);
  overflow: hidden;
  display: flex;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  overflow: hidden;
  width: 100%;
`;
