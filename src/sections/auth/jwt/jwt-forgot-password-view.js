import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { useState } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// auth
import { useAuthContext } from 'src/auth/hooks';
// assets
import { PasswordIcon } from 'src/assets/icons';
// components
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import axios from 'axios';
// ----------------------------------------------------------------------

export default function JwtForgotPasswordView() {
  const { enqueueSnackbar } = useSnackbar();
  // const [successfulMsg, setSuccessfulMsg] = useState('');
  const { forgotPassword } = useAuthContext();

  const router = useRouter();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // try {
    //   await forgotPassword?.(data.email);

    //   const searchParams = new URLSearchParams({
    //     email: data.email,
    //   }).toString();

    //   const href = `${paths.auth.amplify.newPassword}?${searchParams}`;
    //   router.push(href);
    // } catch (error) {
    //   console.error(error);
    // }



    // enqueueSnackbar("HelloWorld");






    console.log(data.email);
    const formData = new URLSearchParams();
    formData.append('email', data.email);
    // // formData.append('password', data.password);
    // // console.log('------->',data.email);

    const apiUrl = 'https://wp-services.alfaiptv.org/api/v2/account/recovery/password/reset';
    axios
      .post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => {
        // // Handle a successful login
        // console.log('Login successful:', response.status);
        // // console.log('response', response);

        // const nt = { ...response.data, email: data.email };

        // login?.(nt);
        // router.push(returnTo || PATH_AFTER_LOGIN);
        console.log('------->', response.data.developer_notes.token);
        enqueueSnackbar(response.data.message);
        // await forgotPassword?.(data.email);
        // setSuccessfulMsg(response.data.message);
        // const searchParams = new URLSearchParams({
        //   email: data.email,
        //   token: response.data.developer_notes.token,
        // }).toString();
        // // forgotPassword?.(data.email,response.data.token);
        // const href = `${paths.auth.jwt.resetPassword}?${searchParams}`;
        // router.push(href);
      })
      .catch((error) => {
        // Handle login failure or errors
        // reset();
        // console.log('Login failed:', error);
        // if (error.response !== undefined) {
        //   setErrorMsg(error.response.data.message);
        // } else {
        //   setErrorMsg(typeof error === 'string' ? error : error.message);
        // }
      });


















  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">

{/* {!!successfulMsg && <Alert severity="success">{successfulMsg}</Alert>} */}

      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send Request
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account and We will email you a link
          to reset your password.
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
