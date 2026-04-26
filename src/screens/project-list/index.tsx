import React from "react";
import { SearchPanel } from "screens/project-list/search-panel";
import { List } from "screens/project-list/list";
import { useDebounce, useDocumentTitle } from "utils";
import { Row, Button } from "antd";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useProjectModal, useProjectsSearchParams } from "./util";
import { ErrorBox, ScreenContainer } from "components/lib";
import { Profiler } from "components/profiler";

// import * as qs from "qs"

//项目的首页/项目列表页，展示所有项目，支持搜索筛选和创建新项目。
export const ProjectListScreen = () => {
  const { open } = useProjectModal();
  const [params, setParams] = useProjectsSearchParams();
  const {
    isLoading,
    error,
    data: list,
  } = useProjects(useDebounce(params, 200));
  const { data: users }: any = useUsers();
  useDocumentTitle("项目列表", false);
  return (
    <Profiler id={"项目列表"}>
      <ScreenContainer>
        <Row justify={"space-between"}>
          <h1>项目列表</h1>
          <Button onClick={open} type={"link"} style={{ padding: 0 }}>
            创建项目
          </Button>
        </Row>
        <SearchPanel
          params={params}
          setParams={setParams}
          users={users || []}
        />
        <ErrorBox error={error} />
        <List loading={isLoading} dataSource={list || []} users={users || []} />
      </ScreenContainer>
    </Profiler>
  );
};
