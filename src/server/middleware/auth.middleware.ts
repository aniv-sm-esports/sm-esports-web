import {ServerLocals} from '../server.application';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import { AuthService } from '../service/auth.service';
import {UserJWT} from '../entity/model/UserJWT';
import { ServerLogger } from '../server.logger';
import {UserCredentialClientDTO} from '../../app/model/client-dto/UserCredentialClientDTO';
import {UserCreation} from '../../app/model/view/user-creation.model';
import { EntityController } from '../entity/entity-controller';
import { User } from '../entity/model/User';
import { UserCredential } from '../entity/model/UserCredential';
import {
  DefaultParams,
  ServerExpressEntityRequest, ServerExpressEntityResponse,
  ServerExpressRequest,
  ServerExpressResponse
} from '../server.definitions';
import { ServerResponse, ServerResponseType } from '../model/server-response.model';
import {ServerData} from '../model/server-entity-data';

export class AuthMiddleware {

  constructor(private readonly entityController:EntityController,
              private readonly authService:AuthService,
              private readonly serverLogger:ServerLogger) {
  }

  // PROBLEM WITH TYPE STRUCTURING:  See server.definitions.ts. The type inheritance doesn't find template inheritance
  //                                 AFAIK (can tell). So, the ServerExpressEntityRequest !(extends) ServerExpressRequest.
  //                                 We need this polymorphic pattern to work (!!) >_<.  So, there are (unfortunately), two
  //                                 paths for our middleware, since there is only a little code to deal with.

  // BYPASS FOR DEVELOPMENT:  Next problem is to implement the JWKS server
  public async authenticate(request: ServerExpressRequest<any, DefaultParams>, response: ServerExpressResponse<any>, next:NextFunction) {

    // INITIALIZE LOCALS! (These are available for this request pipe)
    response.locals = new ServerLocals();
    response.locals['userJWT'] = undefined;
    response.locals['userJWTValid'] = false;


    // NOTE*****  The "Bearer undefined" value should not be hard coded, here. The middle ware is having
    //            problems somewhere in jwt.verify; and it is swallowing exceptions.
    if (!request.headers.authorization ||
      request.headers.authorization == 'Bearer undefined') {
      return next();
    }

    try {

      let token = request.headers.authorization.replace('Bearer ', '')!;

      // Verify
      let verified = await Promise.resolve(this.authService.verify(token));
      let userJWT = await Promise.resolve(this.authService.getUserSession(token));

      if (verified && !!userJWT) {
        response.locals['userJWT'] = userJWT;
        response.locals['userJWTValid'] = verified;
        this.serverLogger.log("User Verified " + userJWT.User.Name);
      }
    }
    catch (error:any) {
      this.serverLogger.logError('Server Request Error: Could not verify user from auth headers (usually this means the JWT token has expired)');
      this.serverLogger.logError(error);
    }

    next();
  }

  public async getSession(request: ServerExpressRequest<UserJWT, DefaultParams>, response: ServerExpressResponse<UserJWT>, next:NextFunction) {

    try {

      let userJWT = response.locals["userJWT"] as UserJWT;

      // Logged On
      if (userJWT && userJWT !== UserJWT.default()) {
        response.status(200).send(ServerResponse.fromData(userJWT));
      }
      // Not Logged On (TODO: Update Status Codes for proper client behavior)
      else {
        response.status(200).send(ServerResponse.fromData(UserJWT.default()));
      }
    }
    catch (error:any) {
      this.serverLogger.logError(error);
    }
  }

  public async logon(request: ServerExpressRequest<UserCredentialClientDTO, DefaultParams>, response: ServerExpressResponse<UserJWT>, next:NextFunction) {

    // Validate User Data:  TODO: Fix the data input to fix the use of just the array
    if (!request.body.requestData.data[0].userName ||
        request.body.requestData.data[0].userName.trim() == '' ||
        !request.body.requestData.data[0].password ||
        request.body.requestData.data[0].password.trim() == '') {
        response.status(401).send();
        return;
    }

    try {
      let userJWT = await this.authService.logon(request.body.requestData.data[0]);
      response.status(200).send(ServerResponse.fromData(userJWT));
    }
    catch(error) {
      console.log(error);
      response.status(500).send(ServerResponse.fromError("Error logging on. Please verify user name / password"));
    }
  }

  public logoff(request: Request, response: Response, next:NextFunction) {

  }

  public async create(request: ServerExpressRequest<UserCreation, DefaultParams>, response: ServerExpressResponse<UserCreation>, next:NextFunction) {

    try {

      let creation = request.body.requestData.data[0];

      // Reset Validation
      //
      creation.userNameInvalid = false;
      creation.emailInvalid = false;
      creation.passwordInvalid = false;
      creation.userNameValidationMessage = '';
      creation.emailValidationMessage = '';
      creation.passwordValidationMessage = '';

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
      if (!creation.userName) {
        creation.userNameInvalid = true;
        creation.userNameValidationMessage = "User name is required";
        success = false;
      }
      else if (creation.userName.includes(" ")) {
        creation.userNameInvalid = true;
        creation.userNameValidationMessage = "User name must not contain white space(s)";
        success = false;
      }
      else if (!creation.userName.match(/^[a-zA-Z0-9_]+$/)) {
        creation.userNameInvalid = true;
        creation.userNameValidationMessage = "User name must be alphanumeric";
        success = false;
      }
      else if (creation.userName.length < 8 || creation.userName.length > 15) {
        creation.userNameInvalid = true;
        creation.userNameValidationMessage = "User name must be between 8 and 15 characters";
        success = false;
      }

      // Email
      //
      let emailMatcher = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!creation.email) {
        creation.emailInvalid = true;
        creation.emailValidationMessage = "Email is required";
        success = false;
      }
      else if (creation.email.includes(" ")) {
        creation.emailInvalid = true;
        creation.emailValidationMessage = "Email cannot contain white space(s)";
        success = false;
      }
      else if (!creation.email.match(emailMatcher)) {
        creation.emailInvalid = true;
        creation.emailValidationMessage = "Email is invalid";
        success = false;
      }

      // Password
      //
      let passwordMatcher1 = /^(?=.*[A-Z])/;
      let passwordMatcher2 = /^(?=.*[!@#$&*])/;
      let passwordMatcher3 = /^(?=.*[0-9])/;
      let passwordMatcher4 = /^(?=.*[a-z]).{8}/;

      if (!creation.password) {
        creation.passwordInvalid = true;
        creation.passwordValidationMessage = "Password is required";
        success = false;
      }
      else if (creation.password.includes(" ")) {
        creation.passwordInvalid = true;
        creation.passwordValidationMessage = "Password cannot contain white space(s)";
        success = false;
      }
      else if (!creation.password.match(passwordMatcher1)) {
        creation.passwordInvalid = true;
        creation.passwordValidationMessage = "Password must contain one upper case character";
        success = false;
      }
      else if (!creation.password.match(passwordMatcher2)) {
        creation.passwordInvalid = true;
        creation.passwordValidationMessage = "Password must contain one special character";
        success = false;
      }
      else if (!creation.password.match(passwordMatcher3)) {
        creation.passwordInvalid = true;
        creation.passwordValidationMessage = "Password must contain one number";
        success = false;
      }
      else if (!creation.password.match(passwordMatcher4)) {
        creation.passwordInvalid = true;
        creation.passwordValidationMessage = "Password must contain one lower case character";
        success = false;
      }
      else if (creation.password.length < 8 || creation.password.length > 20) {
        creation.passwordInvalid = true;
        creation.passwordValidationMessage = "Password must be between 8 and 20 characters";
        success = false;
      }

      // Validation Failed
      if (!success) {
        response.status(400).send(ServerResponse.fromDataError("There was a validation error. Please check your credentials."));
        return;
      }

      // Exists:  IGNORING CASE!
      let existingUser = await this.entityController.users.first({ Name: creation.userName});

      if (!!existingUser) {
        response.status(400).send(ServerResponse.fromDataError('User already exists - Please try a different user name'));
        return;
      }

      // User (NO-INVALIDATE)
      let user = new User();
      user.Name = creation.userName;
      user.Email = creation.email;
      user.CreatedDate = new Date();
      user.UserRoleId = 0;
      user.PictureUrl = "";
      user.PersonRoleId = 0;
      user.EmailVisible = true;
      user.LongDescription = "";
      user.ShortDescription = "";

      await this.entityController.users.append(user)?.then(async (value) => {

        let userCredential = new UserCredential();
        userCredential.User = value as User;
        userCredential.Password = creation.password;
        userCredential.UserId = (value as User).Id;

        let newCredential = await this.entityController.userCredentials.append(userCredential);

        // Success
        response.status(200).send(ServerResponse.fromData(creation));
      }, (err) => {
        this.serverLogger.logError(err);
        response.status(500).send(ServerResponse.fromDataError(err));
      });
    }
    catch(error:any) {
      this.serverLogger.logError(error);
      response.status(500).send(ServerResponse.fromError('An Error has occurred: See server log for details'));
    }
  }
}
