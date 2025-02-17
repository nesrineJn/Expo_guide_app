import { BaseHttpClient } from './http-client';
const googleAuthConfig = {
  issuer: 'https://accounts.google.com',
  clientId: '200611208175-o0vj3146dof3tf21418lp8nbjpa9armr.apps.googleusercontent.com',
  redirectUrl: 'com.gofield.mobileapp:/oauth2redirect/google',
  scopes: ['openid', 'profile', 'email'],
};
export class AuthService extends BaseHttpClient {
  public constructor() {
    super();
  }
  public login(email: string, password: string): Promise<any> {
    const body = { email, password };
    return this.instance.post('/auth/signin', body);
  }
  public async register(
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string,
  ): Promise<any> {
    const body = { email, password, fullName, phoneNumber };
    return this.instance.post('/auth/register', body);
  }
  public async signInWithGoogle(): Promise<any> {
   //to be implemented
  }
  public async VerifyCode(userEmail: string, verificationCode: string): Promise<any> {
    const body = { userEmail, verificationCode };
    return this.instance.post('auth/register/verifycode', body);
  }
}