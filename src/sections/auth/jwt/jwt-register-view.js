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
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// assets
import { EmailInboxIcon } from 'src/assets/icons';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { useSnackbar } from 'src/components/snackbar';

import { useParams } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { paramName } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const [invitingUser, setInvitingUser] = useState('');
  const [inviting, setInviting] = useState(false);

  const [registerSucceed, setRegisterSucceed] = useState(false);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      console.log(inviting);
      // await register?.(data.email, data.password, data.firstName, data.lastName);
      // router.push(returnTo || PATH_AFTER_LOGIN);

      const formData = new URLSearchParams();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('firstname', data.firstName);
      formData.append('lastname', data.lastName);
      formData.append('inviting', inviting ? paramName : inviting);

      const apiUrl = 'http://194.233.175.49/api/v2/account/register';
      axios
        .post(apiUrl, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((response) => {
          // Handle a successful login
          console.log('Sign up successful:', response.data);
          enqueueSnackbar(response.data.message);
          // const href = paths.auth.jwt.login;
          // router.replace(href);
          setRegisterSucceed(true);

          // You can redirect the user or perform other actions here
          // register?.(data.email, data.password, data.firstName, data.lastName);
          // router.push(returnTo || PATH_AFTER_LOGIN);
        })
        .catch((error) => {
          // Handle login failure or errors
          console.error('Sign up failed:', error);
        });
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  useEffect(() => {
    const formData = new URLSearchParams();
    if (paramName !== undefined && paramName !== null) {
      localStorage.setItem('invitationToken', paramName);
    }
    formData.append('token', localStorage.getItem('invitationToken'));
    try {
      axios
        .post('https://wp-services.alfaiptv.org/api/v2/account/inviting', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Adjust this based on your API's requirement
          },
        })
        .then((response) => {
          // Perform actions based on the response here
          console.log('Get Users', response.data);
          setInvitingUser(response.data.result);
          setInviting(response.data.status);
        })
        .catch((error) => {
          // Handle login failure or errors
          console.error('Get Result failed:', error);
        });
    } catch (error) {
      console.error(error);
    }
  }, [paramName]);

  useEffect(() => {}, []);

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 2.5,
        typography: 'caption',
        textAlign: 'center',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

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

        {!!invitingUser && <Alert severity="success">{invitingUser} invited you.</Alert>}

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Create account
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  const renderSuccess = (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h4" sx={{ maxWidth: 480, textAlign: 'center' }}>
          Please check your email!
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      {renderHead}

      {registerSucceed ? renderSuccess : renderForm}

      {/* {renderTerms} */}
    </>
  );
}
