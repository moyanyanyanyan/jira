export interface User {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  personId: string;
  organization: string;
  creater: string;
}
