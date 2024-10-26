export type SignInFormData = {
  username: string;
  password: string;
};

export type SignUpFormData = {
  username: string;
  password: string;
  name: string;
  image: File | null;
  occupation: string;
};
