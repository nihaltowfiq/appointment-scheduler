export type SignInFormData = {
  username: string;
  password: string;
};

export type SignUpFormData = {
  username: string;
  password: string;
  name: string;
  occupation: string;
};

export type User = {
  uid: string;
  username: string;
  password: string;
  name: string;
  occupation: string;
};

export type Appointment = {
  title: string;
  description: string;
  date: string;
  time: string;
};
