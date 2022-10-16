import { parseString } from ".";
import { NewUser, NewUserFromFields } from "../types";

export const toNewUser = ({
  username,
  email,
  password,
}: NewUserFromFields): NewUser => {
  return {
    username: parseString(username, 'username'),
    email: parseString(email, 'email'),
    password: parseString(password, 'password'),
  };
};