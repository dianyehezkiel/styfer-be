export interface Account {
  _id: string;
  username: string;
  email: string;
  password_hash: string;
}

export type AccountPreview = Omit<Account, 'password_hash'>;

export type AccountPublic = Omit<AccountPreview, 'email'>;

// export interface Auth {
//   token?: string,
//   user?: AccountPublic,
// }

export interface SignupReqFromFields {
  username: unknown;
  email: unknown;
  password: unknown;
}

export interface SignupReq {
  username: string;
  email: string;
  password: string;
}

export interface LoginReqFromFields {
  username_or_email: unknown;
  password: unknown;
}

export interface LoginReq {
  username?: string;
  email?: string;
  password: string;
}

export interface PwdChangeReqFromFields {
  old_password: unknown;
  new_password: unknown;
}

export interface PwdChangeReq {
  old_password: string;
  new_password: string;
}
