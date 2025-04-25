import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { BaseController } from './base.controller';
import {UserCredentials, UserJWT} from '../../app/model/service/user-logon.model';
import {User} from '../../app/model/repository/entity/user.model';
import {UserCreation} from '../../app/model/view/user-creation.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';


export class AuthController extends BaseController {

  constructor(serverDb: DataModel, authService: AuthService) {
    super(serverDb, authService);
  }

  public override initialize(): void {
  }

  public override getName() {
    return "Auth Controller";
  }

  public clone(): BaseController {
    return new AuthController(this.serverDb, this.authService);
  }

  // Middleware Pipeline ->
  //
  // -> Authenticate: Log Url, Decode Bearer Token, Lookup User (stores for this request)
  // -> (Work): Primary work method
  // -> Send: ApiResponse<T>
  //

  // Authenticate: This will try and retrieve the JWT credentials stored by
  // looking at the JWT bearer token headers. If there is information present,
  // the User will be passed along with the controller's work load.
  //
  authenticate(request: Request<{}, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>, number>) {

    // Internal Failure
    if (!request) {
      console.log('Server Request not properly formed!');
      return UserJWT.default();
    }

    let userJWT = UserJWT.default();

    try {

      // NOTE*****  The "Bearer undefined" value should not be hard coded, here. The middle ware is having
      //            problems somewhere in jwt.verify; and it is swallowing exceptions.

      // No Headers Present
      if (!request.headers.authorization ||
           request.headers.authorization == 'Bearer undefined') {
        return userJWT;
      }

      else {

        let token = request.headers.authorization.replace('Bearer ', '')!;

        // Verify
        let payload = this.authService.verify(token);

        // Default (User Not Logged On)
        if (!payload) {
          return userJWT;
        }

        // SUCCESS
        else {

          userJWT = UserJWT.fromLogon(payload.userName, token || '',
                                      payload.loginTime,
                                      payload.expirationTime);

          console.log("User Verified " + payload.userName);
        }
      }
    }
    catch (error) {
      console.log('Server Request Error: Could not verify user from auth headers (usually this means the JWT token has expired)');
      console.log(error);
    }

    return userJWT;
  }

  // POST -> /api/login
  //
  logon(request: Request<{}, UserJWT, UserCredentials, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>, number>) {

    // Validate User Data
    if (!request.body.userName ||
         request.body.userName.trim() == '') {
      response.status(401).send(UserJWT.default());
      return UserJWT.default();
    }

    try {

      // User Lookup
      let user= this.serverDb.users.first(x => x.name === request.body.userName);

      // User Found
      if (user && this.serverDb.credentials.some(userCred => userCred.userName == user.name)) {

        let userCredentials = this.serverDb.credentials.find(userCred => userCred.userName == user.name);

        // Failure
        if (request.body.password != userCredentials?.password) {

          // Mark Unauthorized
          response.status(401);

          // Response with message + empty token
          response.send('Password invalid');
          return UserJWT.default();
        }

        // JWT Token
        let userJWT = this.authService.logon(userCredentials);

        // Success -> Send JWT Token
        response.status(200).send(userJWT);

        return userJWT;
      }

      // User Not Found
      else {
        response.status(200).send(UserJWT.default());
      }
    }
    catch(error) {
      console.log(error);
      response.status(500).send(UserJWT.default());
    }

    return UserJWT.default();
  }

  // POST -> /api/users/create
  //
  create(request: Request<{ }, UserCreation, UserCreation, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    try {

      // Reset Validation
      //
      request.body.userNameInvalid = false;
      request.body.emailInvalid = false;
      request.body.passwordInvalid = false;
      request.body.userNameValidationMessage = '';
      request.body.emailValidationMessage = '';
      request.body.passwordValidationMessage = '';

      // UserName: Must be >= 8 characters, Alpha-Numeric, and unique disregarding case (CASE IGNORED ONLY FOR DUPLICATE NAME CREATION)
      // Email: Must be a valid email, and must submit email code
      // Password:
      //
      // Regex:    ^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$
      //
      // ^                         Start anchor
      // (?=.*[A-Z])               Ensure string has one uppercase letters.
      // (?=.*[!@#$&*])            Ensure string has one special case letter.
      // (?=.*[0-9])               Ensure string has two digits.
      // (?=.*[a-z])               Ensure string has three lowercase letters.
      // .{8}                      Ensure string is of length 8.
      // $                         End anchor.

      let success = true;

      // UserName
      if (!request.body.userName) {
        request.body.userNameInvalid = true;
        request.body.userNameValidationMessage = "User name is required";
        success = false;
      }
      else if (request.body.userName.includes(" ")) {
        request.body.userNameInvalid = true;
        request.body.userNameValidationMessage = "User name must not contain white space(s)";
        success = false;
      }
      else if (!request.body.userName.match(/^[a-zA-Z0-9_]+$/)) {
        request.body.userNameInvalid = true;
        request.body.userNameValidationMessage = "User name must be alphanumeric";
        success = false;
      }
      else if (request.body.userName.length < 8 || request.body.userName.length > 15) {
        request.body.userNameInvalid = true;
        request.body.userNameValidationMessage = "User name must be between 8 and 15 characters";
        success = false;
      }

      // Email
      //
      let emailMatcher = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!request.body.email) {
        request.body.emailInvalid = true;
        request.body.emailValidationMessage = "Email is required";
        success = false;
      }
      else if (request.body.email.includes(" ")) {
        request.body.emailInvalid = true;
        request.body.emailValidationMessage = "Email cannot contain white space(s)";
        success = false;
      }
      else if (!request.body.email.match(emailMatcher)) {
        request.body.emailInvalid = true;
        request.body.emailValidationMessage = "Email is invalid";
        success = false;
      }

      // Password
      //
      let passwordMatcher1 = /^(?=.*[A-Z])/;
      let passwordMatcher2 = /^(?=.*[!@#$&*])/;
      let passwordMatcher3 = /^(?=.*[0-9])/;
      let passwordMatcher4 = /^(?=.*[a-z]).{8}/;

      if (!request.body.password) {
        request.body.passwordInvalid = true;
        request.body.passwordValidationMessage = "Password is required";
        success = false;
      }
      else if (request.body.password.includes(" ")) {
        request.body.passwordInvalid = true;
        request.body.passwordValidationMessage = "Password cannot contain white space(s)";
        success = false;
      }
      else if (!request.body.password.match(passwordMatcher1)) {
        request.body.passwordInvalid = true;
        request.body.passwordValidationMessage = "Password must contain one upper case character";
        success = false;
      }
      else if (!request.body.password.match(passwordMatcher2)) {
        request.body.passwordInvalid = true;
        request.body.passwordValidationMessage = "Password must contain one special character";
        success = false;
      }
      else if (!request.body.password.match(passwordMatcher3)) {
        request.body.passwordInvalid = true;
        request.body.passwordValidationMessage = "Password must contain one number";
        success = false;
      }
      else if (!request.body.password.match(passwordMatcher4)) {
        request.body.passwordInvalid = true;
        request.body.passwordValidationMessage = "Password must contain one lower case character";
        success = false;
      }
      else if (request.body.password.length < 8 || request.body.password.length > 20) {
        request.body.passwordInvalid = true;
        request.body.passwordValidationMessage = "Password must be between 8 and 20 characters";
        success = false;
      }

      // Validation Failed
      if (!success) {
        response.status(400).send("There was a validation error. Please check your credentials.");
        return;
      }

      // Exists:  IGNORING CASE!
      let existingUser = this.serverDb.users.first(user => user.name === request.body.userName);

      if (!!existingUser) {
        response.status(400).send('User already exists - Please try a different user name');
        return;
      }

      let userId = this.serverDb.users.getNextId();
      let credentialsId = this.serverDb.credentials.length;

      // User (NO-INVALIDATE)
      this.serverDb.users.append(User.from(userId, request.body.userName, request.body.email), false, false);

      // User Credentials
      this.serverDb.credentials.push(UserCredentials.fromLogon(request.body.userName, request.body.password));

      // Success
      response.status(200).send(request.body);
    }
    catch(error) {
      console.log(error);
      response.status(500).send('An Error has occurred: See server log for details');
    }
  }
}
