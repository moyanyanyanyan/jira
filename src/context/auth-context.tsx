import React, { ReactNode } from "react";
import * as auth from "../auth-provider";
// 登录工具（可以自动处理错误）等的导入
import { Users } from "../types/user";
import { http } from "../utils/http";
import { useMount } from "../utils/index";
import { useAsync } from "../utils/use-async";
import { FullPageError, FullPageLoading } from "components/lib";
import { useQueryClient } from "react-query";

interface AuthForm {
  //用户输入的用户名和用户密码
  username: string;
  password: string;
}

//页面刷新保持登录
const booststrapUser = async () => {
  let user = null; //页面刷新时要让user重置为null
  const token = auth.getToken(); //然后从本地localStorage拿token
  if (token) {
    //token存在
    const data = await http("me", { token });
    //去请求me接口的data
    user = data.user;
    //然后拿到data的user
  }
  return user;
  //这个保持页面登录态的函数返回的是用户
};

//创建了新的context，并且要求类型
const AuthContext = React.createContext<
  | {
      user: Users | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<Users | null>();

  const queryClient = useQueryClient();
  //point free
  const login = (form: AuthForm) => {
    return auth.login(form).then(setUser);
  };
  const register = (form: AuthForm) => {
    return auth.register(form).then(setUser);
  };
  const logout = () =>
    auth.logout().then(() => {
      setUser(null);
      queryClient.clear();
    });

  useMount(() => {
    run(booststrapUser());
  });
  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageError error={error} />;
  }
  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

export const useAuth = () => {
  //自动调用AuthContext并且拿到结果暴露出来，
  // 这样实际使用的时候就可以只写一行代码了
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
