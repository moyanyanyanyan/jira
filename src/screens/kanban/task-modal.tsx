import React from "react";
import { useTasksModal, useTasksQueryKey } from "./util";
import { useDeleteTask, useEditTask } from "utils/task";
import { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { UserSelect } from "components/user-select";
import { TaskTypeSelect } from "components/task-type-select";

//编辑任务：修改任务名称、经办人、类型
// 删除任务：点击删除按钮，确认后删除
// 自动填充：打开弹窗时自动加载当前任务信息
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const TaskModal = () => {
  const [form] = Form.useForm();
  const { editingTaskId, editingTask, close } = useTasksModal();
  const { mutateAsync: editTask, isLoading: editLoading } =
    useEditTask(useTasksQueryKey());
  const { mutate: deleteTask } = useDeleteTask(useTasksQueryKey());

  const onCancel = () => {
    close();
    form.resetFields();
  };

  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
    form.resetFields();
  };

  const startDelete = () => {
    close();
    Modal.confirm({
      title: "确定删除任务吗？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        return deleteTask({ id: Number(editingTaskId) });
      },
    });
  };
  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);

  return (
    <Modal
      forceRender
      open={!!editingTaskId}
      onCancel={onCancel}
      onOk={onOk}
      title={"编辑任务"}
      confirmLoading={editLoading}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} initialValues={editingTask} {...layout}>
        <Form.Item
          label="任务名"
          name="name"
          rules={[{ required: true, message: "请输入任务名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="经办人" name="processorId">
          <UserSelect defaultOptionName="经办人" />
        </Form.Item>
        <Form.Item label="类型" name="typeId">
          <TaskTypeSelect />
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right" }}>
        <Button style={{ fontSize: "14px" }} size="small" onClick={startDelete}>
          删除
        </Button>
      </div>
    </Modal>
  );
};
