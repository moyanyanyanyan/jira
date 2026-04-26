import { useHttp } from "./http";
import { cleanObject } from "utils";
import { Users } from "types/user";
import { useQuery } from "react-query";

//获取用户列表
export const useUsers = (param?: Partial<Users>) => {
  const client = useHttp();
  return useQuery<Users[]>(["users", param], () =>
    client("users", { data: cleanObject(param || {}) }),
  );
};
