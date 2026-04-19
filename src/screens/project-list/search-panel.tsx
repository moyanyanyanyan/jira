import { useEffect, useState } from "react";
import React from "react";
import { User, Project } from "../../types";

interface Props {
  users: User[];
  param: {
    name: string;
    personId: string;
  };
  setParam: (param: any) => void;
}

export const SearchPanel = ({ users, param, setParam }: Props) => {
  //第一部分：定义状态的代码

  //第三部分：组件实际上返回的dom
  return (
    <form>
      <input
        type="text"
        value={param.name}
        onChange={(e) => {
          setParam({
            ...param,
            name: e.target.value,
          });
        }}
      />
      <select //这个里面展示的是名字，但是筛选条件的value是id
        value={param.personId}
        onChange={(e) => {
          setParam({
            ...param,
            personId: e.target.value,
          });
        }}
      >
        <option value={""}>负责人</option>
        {users.map((user) => (
          <option value={user.id}>{user.name}</option>
        ))}
      </select>
    </form>
  );
};
