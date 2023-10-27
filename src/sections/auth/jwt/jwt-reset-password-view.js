import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useCountdownSeconds } from 'src/hooks/use-countdown';
// auth
import { useAuthContext } from 'src/auth/hooks';
// assets
import { SentIcon } from 'src/assets/icons';
// components
import { useSnackbar } from 'src/components/snackbar';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFCode } from 'src/components/hook-form';

import { useParams } from 'react-router-dom';
import axios from 'axios';
// ----------------------------------------------------------------------

export default function JwtResetPasswordView() {
  
  
  const { enqueueSnackbar } = useSnackbar();

  // const { newToken } = useParams();


  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const newToken = urlParams.get('token');


  const { newPassword, forgotPassword } = useAuthContext();

  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const password = useBoolean();

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const VerifySchema = Yup.object().shape({
    // code: Yup.string().min(6, 'Code must be at least 6 characters').required('Code is required'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const defaultValues = {
    code: '',
    email: email || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();


  const onSubmit = handleSubmit(async (data) => {
    
    try {
      

      const formData = new URLSearchParams();
      // formData.append('token', token ? newToken : token);
      formData.append('token', newToken);
      formData.append('password', data.confirmPassword);

      console.log("wwww", newToken);

      const apiUrl = 'https://wp-services.alfaiptv.org/api/v2/account/recovery/password/verify';

      axios
        .post(apiUrl, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((response) => {


          console.log("----------->",response);
          enqueueSnackbar(response.data.message);
          // Handle a successful login
          // console.log('Sign up successful:', response.data);
          // enqueueSnackbar(response.data.message);
          // // const href = paths.auth.jwt.login;
          // // router.replace(href);
          // setRegisterSucceed(true);

          // You can redirect the user or perform other actions here
          // register?.(data.email, data.password, data.firstName, data.lastName);
          // router.push(returnTo || PATH_AFTER_LOGIN);
        })
        .catch((error) => {
          console.log(error);
          if (error.response !== undefined) {
            enqueueSnackbar(error.response.data.message);
          } else {
            enqueueSnackbar(typeof error === 'string' ? error : error.message);
          }
          // Handle login failure or errors
          // console.error('Sign up failed:', error);
          // if (error.response !== undefined) {
          //   setErrorMsg(error.response.data.message);
          // } else {
          //   setErrorMsg(typeof error === 'string' ? error : error.message);
          // }
        });






      // await newPassword?.(data.email, data.code, data.password);

      // router.push(paths.auth.amplify.login);
    } catch (error) {
      console.error(error);
    }
  });

  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      await forgotPassword?.(values.email);
    } catch (error) {
      console.error(error);
    }
  }, [forgotPassword, startCountdown, values.email]);

  const renderForm = (
    // <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} alignItems="center">
        {/* <RHFTextField
        name="email"
        label="Email"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      /> */}

        {/* <RHFCode name="code" /> */}

        <RHFTextField
          name="password"
          label="Password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label="Confirm New Password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Update Password
        </LoadingButton>

        {/* <Typography variant="body2">
          {`Don’t have a code? `}
          <Link
            variant="subtitle2"
            onClick={handleResendCode}
            sx={{
              cursor: 'pointer',
              ...(counting && {
                color: 'text.disabled',
                pointerEvents: 'none',
              }),
            }}
          >
            Resend code {counting && `(${countdown}s)`}
          </Link>
        </Typography> */}

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
    // </FormProvider>
  );

  const renderHead = (
    <>
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Request sent successfully!</Typography>

        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We&apos;ve sent a 6-digit confirmation email to your email.
          <br />
          Please enter the code in below box to verify your email.
        </Typography> */}
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
