import * as yup from 'yup';

export const signInSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export const signUpSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),

  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 4 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),

  occupation: yup
    .string()
    .required('Occupation is required')
    .min(2, 'Occupation must be at least 2 characters')
    .max(50, 'Occupation must be less than 50 characters'),
});

export const appointmentSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 4 characters')
    .max(30, 'Title must be less than 20 characters'),
  description: yup
    .string()
    .required()
    .min(5, 'Username must be at least 4 characters')
    .max(50, 'Username must be less than 20 characters'),
  date: yup.string().required('Date is required'),
  time: yup.string().required('Time is required'),
});
