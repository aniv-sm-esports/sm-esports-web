import {ParamsDictionary, Query, Request, Response } from 'express-serve-static-core';
import { Entity } from './entity/model/Entity';
import { ParsedQs } from 'qs';
import {ServerEntityResponse, ServerResponse} from './model/server-response.model';
import {ServerEntityRequest, ServerRequest} from './model/server-request.model';

// See their definition of Request / Response. These types are just pulled in to simplify the HTTP request pipe
//
export interface ServerExpressRequest<T, U extends ParamsDictionary> extends Request<U, ServerResponse<T>, ServerRequest<T>, ParsedQs, Record<string, any>> {
}
export interface ServerExpressResponse<T> extends Response<any, Record<string, any>, number> {
}

export interface ServerExpressEntityRequest<T extends Entity<T>, U extends ParamsDictionary> extends Request<U, ServerEntityResponse<T>, ServerEntityRequest<T>, ParsedQs, Record<string, any>> {
}
export interface ServerExpressEntityResponse<T extends Entity<T>> extends Response<any, Record<string, any>, number> {
}

// Specific Entity Type Extensions
export interface DefaultParams extends ParamsDictionary {
}
export interface ChatParams extends ParamsDictionary {
  chatRoomId:string;
}
