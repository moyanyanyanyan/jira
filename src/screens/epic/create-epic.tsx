import React from "react";
import styled from "@emotion/styled";
import { Drawer, DrawerProps, Spin, Form, Input, Button } from "antd";
import { useAddEpic } from "utils/epic";
import { useEpicsQueryKey } from "./util";
import { ErrorBox } from "components/lib";
import { useEffect } from "react";
import { useProjectIdInUrl } from "screens/kanban/util";

//在抽屉（Drawer）中提供一个表单，用于创建新的任务组
// 提交后将任务组与当前项目关联
// 支持加载状态、错误提示和表单重置

export const CreateEpic = (
  props: Pick<DrawerProps, "open"> & { onClose: () => void },
) => {
  const { mutate: addEpic, isLoading, error } = useAddEpic(useEpicsQueryKey());
  // 创建任务组的 mutation hook，返回 mutate 函数、加载状态和错误信息
  //获取 epics 查询的缓存 key，用于 mutation 后自动刷新列表
  const [form] = Form.useForm();
  const projectId = useProjectIdInUrl();
  // 从 URL 参数中获取当前项目 ID
  const onFinish = async (values: any) => {
    await addEpic({ ...values, projectId });
    props.onClose();
  };

  useEffect(() => {
    form.resetFields();
  }, [form, props.open]);
  return (
    <Drawer
      open={props.open}
      onClose={props.onClose}
      width={"100%"}
      forceRender={true}
      destroyOnClose={true}
    >
      <Container>
        {isLoading ? (
          <Spin size={"large"} />
        ) : (
          <>
            <h1>创建任务组</h1>
            <ErrorBox error={error} />
            <Form
              form={form}
              layout={"vertical"}
              style={{ width: "40rem" }}
              onFinish={onFinish}
            >
              <Form.Item
                label={"名称"}
                name={"name"}
                rules={[{ required: true, message: "请输入任务组名称" }]}
              >
                <Input placeholder="请输入任务组名称" />
              </Form.Item>

              <Form.Item style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  提交
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
