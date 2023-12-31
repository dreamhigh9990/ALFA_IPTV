import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios from 'axios'; // Import Axios
import { useLocation } from 'react-router-dom';
// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const [colorMsg, setColorMsg] = useState('error');
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');
   
    console.log('token------------>',token);
    
    if (token) {
      console.log('Token:', token);

      const formData = new URLSearchParams();
      formData.append('token', token);

      const apiUrl = 'http://194.233.175.49/api/v2/account/verify';
      axios
        .post(apiUrl, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((response) => {
          // Handle a successful login
          console.log('successful:', response.status);
          enqueueSnackbar(response.data.message);
          // console.log('response', response);
  
          // const nt = { ...response.data, email: data.email };
  
          // login?.(nt);
          // router.push(returnTo || PATH_AFTER_LOGIN);
        })
        .catch((error) => {
          // Handle login failure or errors
          // reset();
          console.log('failed:', error);
  
          if (error.response !== undefined) {
            setColorMsg(error.response.data.severity);
            setErrorMsg(error.response.data.message);
          } else {
            setErrorMsg(typeof error === 'string' ? error : error.message);
          }
        });
    }
  }, [enqueueSnackbar]);

  const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    // email: 'demo@minimals.cc',
    // password: 'demo1234',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const formData = new URLSearchParams();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const apiUrl = 'http://194.233.175.49/api/v2/account/login';
    axios
      .post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => {
        // Handle a successful login
        console.log('Login successful:', response.status);
        // console.log('response', response);

        const nt = { ...response.data, email: data.email };

        login?.(nt);
        router.push(returnTo || PATH_AFTER_LOGIN);
      })
      .catch((error) => {
        // Handle login failure or errors
        // reset();
        console.log('Login failed:', error);

        if (error.response !== undefined) {
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg(typeof error === 'string' ? error : error.message);
        }
      });
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to ALFA</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity={colorMsg}>{errorMsg}</Alert>}

      <RHFTextField name="email" label="Email address" />

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

      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}> */}
      <Link component={RouterLink} href={paths.auth.jwt.forgotPassword} variant="subtitle2">
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
      </Alert> */}

      {renderForm}
    </FormProvider>
  );
}
