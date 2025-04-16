import {Injectable} from '@angular/core';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { BaseController } from './base.controller';
import {ApiData, ApiRequest, ApiResponse} from '../../app/model/service/app.model';
import {UserCredentials, UserJWT} from '../../app/model/repository/user-logon.model';
import {Chat} from '../../app/model/repository/chat.model';
import {User} from '../../app/model/repository/user.model';
import {SearchModel} from '../../app/model/service/search.model';
import {UserCreation} from '../../app/model/view/user-creation.model';
import {DataModel} from '../model/server.datamodel';
import {AuthService} from '../service/auth.service';


export class AuthController extends BaseController {

  constructor(serverDb: DataModel, authService: AuthService) {
    super(serverDb, authService);
  }

  initialize() {

  }

  // POST -> /api/login
  //
  logon(request: Request<{}, UserJWT, UserCredentials, ParsedQs, Record<string, any>>,
        response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    // Validate User Data
    if (!request.body.userName ||
         request.body.userName.trim() == '') {
      response.status(401).send(UserJWT.default());
      return;
    }

    try {

      // User Lookup
      let user= this.serverDb.users.getFirst(SearchModel.fromMap<User>({ "userName" : request.body.userName || '' }));

      // User Found
      if (user && this.serverDb.credentials.some(userCred => userCred.userName == user.name)) {

        let userCredentials = this.serverDb.credentials.find(userCred => userCred.userName == user.name);

        // Failure
        if (request.body.password != userCredentials?.password) {

          // Mark Unauthorized
          response.status(401);

          // Response with message + empty token
          response.send('Password invalid');
          return;
        }

        // JWT Token
        let userJWT = this.authService.logon(userCredentials);

        // Success -> Send JWT Token
        response.status(200).send(userJWT);
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
  }

  // GET -> /api/login/getSession
  //
  getSession(request: Request<{}, UserJWT, any, ParsedQs, Record<string, any>>,
             response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(true);

    try {

      // Success -> Send JWT Token
      if (!this.requestJWT.isDefault())
        response.send(this.requestJWT);

      // User Not Found
      else {
        response.statusMessage = 'User not found';
        response.send(UserJWT.default());
      }
    }
    catch(error) {
      console.log(error);
      response.send('An Error has occurred: See server log for details');
    }
  }

  // GET -> /api/users/exists/:userName
  //
  exists(request: Request<{ userName: string; }, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    // Parameter Validation -> Failure
    if (!request.params.userName ||
         request.params.userName.trim() == '') {
      response.status(400).send('User name not specified');
      return;
    }

    try {

      if (this.serverDb.users.any(user => user.name === request.params.userName.trim())) {
        response.status(200).send(true);
      }
      else {
        response.status(200).send(false);
      }
    }
    catch(error) {
      console.log(error);
      response.status(500).send('An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/users/create
  //
  create(request: Request<{ }, UserCreation, UserCreation, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

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

      let userId = this.serverDb.users.getSize();
      let credentialsId = this.serverDb.credentials.length;

      // User
      this.serverDb.users.append(User.from(userId, request.body.userName, request.body.email))

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
