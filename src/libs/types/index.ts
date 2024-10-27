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
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  scheduler: User;
  receiver: User;
  status: Status;
};

type Status = 'pending' | 'accepted' | 'declined' | 'cancelled';

export type AppointmentFormData = {
  title: string;
  description: string;
  date: string;
  time: string;
};
