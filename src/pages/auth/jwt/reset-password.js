import { Helmet } from 'react-helmet-async';
// sections
import { JwtResetPasswordView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Reset Password</title>
      </Helmet>

      <JwtResetPasswordView />
    </>
  );
}
