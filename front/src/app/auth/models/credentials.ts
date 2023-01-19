export type LoginCredentials = {
  password: string;
  email: string;
};

export type SignUpCredentials = LoginCredentials & {
  name: string;
};
