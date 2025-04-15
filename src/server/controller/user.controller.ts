import {Injectable} from '@angular/core';
import {User} from '../../app/model/user.model';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {BaseController} from './base.controller';
import {ApiRequest, ApiResponse} from '../../app/model/app.model';
import {UserCreation} from '../../app/model/user-creation.model';
import {UserCredentials} from '../../app/model/user-logon.model';
import {PageData} from '../../app/model/page.model';
import {SearchModel} from '../../app/model/search.model';

export class UserController extends BaseController {

  // GET -> /api/users/get/:userId
  //
  get(request: Request<{userName:string}, any, any, ParsedQs, Record<string, any>>,
      response: Response<any, Record<string, any>, number>) {

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      let user= this.serverDb.getUserByName(request.params.userName);

      // Success
      if (user) {
        this.sendSuccess(response, user || User.default(), undefined);
        return;
      }
      else {
        this.sendDataError(response, user, "User not found:  " + request.params.userName);
      }
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/users/getPage
  //
  getPage(request: Request<{}, ApiResponse<User[]>, ApiRequest<User>, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    try {

      // TODO: BUG! Map<string, string> Serialization
      let filteredUsers = this.serverDb.applyFilter(request.body.search || SearchModel.default<User>(), this.serverDb.users);
      let users:User[] = [];

      let indexStart = ((request.body.pageData?.pageNumber || 0) - 1) * (request.body.pageData?.pageSize || 0);
      let indexEnd = (request.body.pageData?.pageNumber || 0) * (request.body.pageData?.pageSize || 0);

      for (let index = indexStart; index < indexEnd; index++) {

        // No More Users
        if (index >= filteredUsers.length) {
          break;
        }
        else {
          users.push(filteredUsers[index]);
        }
      }

      // Success
      this.sendSuccess(response, users, PageData.fromResponse(1, (request.body.pageData?.pageSize || 0), this.serverDb.users.length));
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // POST -> /api/users/create
  //
  create(request: Request<{ }, ApiResponse<UserCreation>, UserCreation, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    console.log(request.body);

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
        this.sendDataError(response, request.body, "There was a validation error. Please check your credentials.");
        return;
      }

      // Exists:  IGNORING CASE!
      let existingUser = this.serverDb.getUserByName(request.body.userName, true);

      if (existingUser != User.default()) {
        this.sendDataError(response, request.body, 'User already exists - Please try a different user name');
        return;
      }

      let userId = this.serverDb.users.length;
      let credentialsId = this.serverDb.credentials.length;

      // User
      this.serverDb.users.push(User.from(userId, request.body.userName, request.body.email));

      // User Credentials
      this.serverDb.credentials.push(UserCredentials.fromLogon(request.body.userName, request.body.password));

      // Success
      this.sendSuccess(response, request.body, undefined);
    }
    catch(error) {
      console.log(error);
      this.sendError(response, 'An Error has occurred: See server log for details');
    }
  }

  // GET -> /api/users/exists/:userName
  //
  exists(request: Request<{ userName: string; }, any, any, ParsedQs, Record<string, any>>,
         response: Response<any, Record<string, any>, number>){

    // Pre-work settings
    this.setLogonRequired(false);

    // Parameter Validation -> Failure
    if (!request.params.userName) {
      this.sendDataError(response, request.body, 'User name not specified');
      return;
    }

    // Parameter Validation -> Failure
    if (request.params.userName.trim() == '') {
      this.sendDataError(response, request.body, 'User name not specified');
      return;
    }

    let result:boolean = false;
    let success:boolean = false;
    let message:string = '';

    try {

      this.serverDb.users.forEach((user:User) => {
        if (user.name == request.params.userName.trim()) {
          result = true;
        }
      });

      success = true;
    }
    catch(error) {
      console.log(error);
      success = false;
      message = 'An Error has occurred: See server log for details';
    }

    if (success) {
      this.sendSuccess(response, result, undefined);
    }
    else {
      this.sendError(response, message);
    }
  }
}
