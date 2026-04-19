import React from "react";
import { User, Project } from "../../types";

interface Props {
  users: User[]; // 声明 users 是 User[]
  list: Project[];
}

export const List = ({ users, list }: Props) => {
  if (!users || users.length === 0) {
    return <div>加载负责人信息中...</div>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>名称</th>
          <th>负责人</th>
        </tr>
      </thead>
      <tbody>
        {console.log("list数据:", list)}
        {console.log("users数据:", users)}
        {list.map((project: Project) => {
          console.log("当前users数组:", users); // 看看users是不是空的
          return (
            <tr>
              <td>{project.name}</td>
              <td>
                {console.log(typeof project.id)}
                {console.log(list)}
                {users.find((user: User) => user.id === project.personId)
                  ?.name || "未知"}
              </td>
              {/* //当find找到的为undefined时,会去显示未知 */}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
