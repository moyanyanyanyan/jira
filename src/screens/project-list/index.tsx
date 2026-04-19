import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useEffect, useState } from "react";
import { User, Project } from "../../types";
import React from "react";
import { useDebounce, useMount, cleanObject } from "utils";
import qs from "qs";

const apiUrl = process.env.REACT_APP_API_URL;
console.log("当前API URL:", apiUrl); // 看看打印出来是什么
export const ProjectListScreen = () => {
  const [param, setParam] = useState(
    //这部分使用state
    {
      name: "",
      personId: "",
    },
  );
  const debouncedParam = useDebounce(param, 300);
  const [list, setList] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  //第二部分：定义首次渲染逻辑和重渲染条件的代码
  useEffect(() => {
    //首次渲染时做的事情，以及什么值改变时重新渲染
    fetch(
      `${apiUrl}/projects?${qs.stringify(cleanObject(debouncedParam))}`,
    ).then(async (response) => {
      if (response.ok) {
        const searchResult = await response.json(); //response.json返回的是一个promise对象
        setList(searchResult); //每次param改变的时候都会重新请求然后setList,所以在搜索的时候只会看到搜索的东西
      }
    });
  }, [debouncedParam]);

  useMount(() => {
    fetch(`${apiUrl}/users`).then(async (response) => {
      if (response.ok) {
        const data: User[] = await response.json();
        setUsers(data); //response.json返回的是一个promise对象
      }
    });
  });

  return (
    <div>
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </div>
  );
};
