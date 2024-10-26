import * as yup from 'yup';

export const signInSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

// export const signUpSchema = Yup.object().shape({
//   name: Yup.string()
//     .required('Name is required')
//     .min(3, 'Username must be at least 3 characters'),
//   username: Yup.string()
//     .required('Username is required')
//     .min(3, 'Username must be at least 3 characters'),
//   password: Yup.string()
//     .required('Password is required')
//     .min(6, 'Password must be at least 6 characters'),
// });

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

  image: yup
    .mixed()
    .test('fileType', 'Only image files are allowed', (value: any) => {
      if (!value) return true; // If the field is not required, skip validation when no file is uploaded
      return (
        value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
      );
    })
    .test('fileSize', 'Image must be less than 5 MB', (value: any) => {
      if (!value) return true;
      return value && value.size <= 5 * 1024 * 1024;
    }),
});
