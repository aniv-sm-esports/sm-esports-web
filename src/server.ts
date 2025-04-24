import {ChatController} from './server/controller/chat.controller';
import {ChatRoomController} from './server/controller/chat-room.controller';

// Contains primary nodejs / express components
import {ServerApplication} from './server/server.application';
import {AuthLoginMiddleware} from './server/middleware/auth/auth-login.middleware';
import {HttpMethod} from './server/middleware/base.middleware';
import {AuthCreateMiddleware } from './server/middleware/auth/auth-create.middleware';
import { AuthGetSessionMiddleware } from './server/middleware/auth/auth-getSession.middleware';
import {UserRepositoryGetStateMiddleware} from './server/middleware/user/user-repository-getState.middleware';
import {UserRepositoryCheckStateMiddleware} from './server/middleware/user/user-repository-checkState.middleware';
import {UserRepositorySetStateMiddleware} from './server/middleware/user/user-repository-setState.middleware';
import {NewsRepositoryGetStateMiddleware } from './server/middleware/news/news-repository-getState.middleware';
import { NewsRepositorySetStateMiddleware } from './server/middleware/news/news-repository-setState.middleware';
import { NewsRepositoryCheckStateMiddleware } from './server/middleware/news/news-repository-checkState.middleware';
import { FileRepositoryGetStateMiddleware } from './server/middleware/file/file-repository-getState.middleware';
import { FileRepositoryCheckStateMiddleware } from './server/middleware/file/file-repository-checkState.middleware';
import { FileRepositorySetStateMiddleware } from './server/middleware/file/file-repository-setState.middleware';
import { ChatRoomRepositoryGetStateMiddleware } from './server/middleware/chatRoom/chatRoom-repository-getState.middleware';
import { ChatRoomRepositoryCheckStateMiddleware } from './server/middleware/chatRoom/chatRoom-repository-checkState.middleware';
import { ChatRoomRepositorySetStateMiddleware } from './server/middleware/chatRoom/chatRoom-repository-setState.middleware';
import { ChatRepositoryGetStateMiddleware } from './server/middleware/chat/chat-repository-getState.middleware';
import { ChatRepositoryCheckStateMiddleware } from './server/middleware/chat/chat-repository-checkState.middleware';
import { ChatRepositorySetStateMiddleware } from './server/middleware/chat/chat-repository-setState.middleware';
import { UserGetMiddleware } from './server/middleware/user/user-get.middleware';
import { UserCreateMiddleware } from './server/middleware/user/user-create.middleware';
import { UserGetAllMiddleware } from './server/middleware/user/user-getAll.middleware';
import { FileGetMiddleware } from './server/middleware/file/file-get.middleware';
import { FileCreateMiddleware } from './server/middleware/file/file-create.middleware';
import {FileGetAllMiddleware} from './server/middleware/file/file-getAll.middleware';
import { NewsGetMiddleware } from './server/middleware/news/news-get.middleware';
import { NewsGetAllMiddleware } from './server/middleware/news/news-getAll.middleware';
import { NewsCreateMiddleware } from './server/middleware/news/news-create.middleware';
import {ChatRoomGetMiddleware } from './server/middleware/chatRoom/chatRoom-get.middleware';
import { ChatRoomCreateMiddleware } from './server/middleware/chatRoom/chatRoom-create.middleware';
import { ChatRoomGetAllMiddleware } from './server/middleware/chatRoom/chatRoom-getAll.middleware';
import {createNodeRequestHandler} from '@angular/ssr/node';
import {ChatCreateMiddleware} from './server/middleware/chat/chat-create.middleware';
import {ChatGetAllMiddleware} from './server/middleware/chat/chat-getAll.middleware';
import {ChatGetMiddleware} from './server/middleware/chat/chat-get.middleware';
import {
  ChatCategoryRepositoryGetStateMiddleware
} from './server/middleware/chatCategory/chat-category-repository-getState.middleware';
import {
  ChatCategoryRepositoryCheckStateMiddleware
} from './server/middleware/chatCategory/chat-category-repository-checkState.middleware';
import {
  ChatCategoryRepositorySetStateMiddleware
} from './server/middleware/chatCategory/chat-category-repository-setState.middleware';
import {
  ChatGroupRoomMapRepositorySetStateMiddleware
} from './server/middleware/chatGroupRoomMap/chat-group-room-map-repository-setState.middleware';
import {
  ChatGroupRoomMapRepositoryCheckStateMiddleware
} from './server/middleware/chatGroupRoomMap/chat-group-room-map-repository-checkState.middleware';
import {
  ChatGroupRoomMapRepositoryGetStateMiddleware
} from './server/middleware/chatGroupRoomMap/chat-group-room-map-repository-getState.middleware';
import {
  ChatCategoryGroupMapRepositoryGetStateMiddleware
} from './server/middleware/chatCategoryGroupMap/chat-category-group-map-repository-getState.middleware';
import { ChatCategoryGroupMapRepositorySetStateMiddleware } from './server/middleware/chatCategoryGroupMap/chat-category-group-map-repository-setState.middleware';
import {
  ChatCategoryGroupMapRepositoryCheckStateMiddleware
} from './server/middleware/chatCategoryGroupMap/chat-category-group-map-repository-checkState.middleware';
import {
  ChatGroupRepositoryGetStateMiddleware
} from './server/middleware/chatGroup/chat-group-repository-getState.middleware';
import {
  ChatGroupRepositoryCheckStateMiddleware
} from './server/middleware/chatGroup/chat-group-repository-checkState.middleware';
import {
  ChatGroupRepositorySetStateMiddleware
} from './server/middleware/chatGroup/chat-group-repository-setState.middleware';
import {ChatGroupRoomMapGetMiddleware} from './server/middleware/chatGroupRoomMap/chat-group-room-map-get.middleware';
import {
  ChatGroupRoomMapGetAllMiddleware
} from './server/middleware/chatGroupRoomMap/chat-group-room-map-getAll.middleware';
import {ChatCategoryGetMiddleware} from './server/middleware/chatCategory/chat-category-get.middleware';
import { ChatCategoryCreateMiddleware } from './server/middleware/chatCategory/chat-category-create.middleware';
import {ChatGroupGetMiddleware } from './server/middleware/chatGroup/chat-group-get.middleware';
import { ChatGroupGetAllMiddleware } from './server/middleware/chatGroup/chat-group-getAll.middleware';
import {
  ChatCategoryGroupMapGetMiddleware
} from './server/middleware/chatCategoryGroupMap/chat-category-group-map-get.middleware';
import {
  ChatCategoryGroupMapGetAllMiddleware
} from './server/middleware/chatCategoryGroupMap/chat-category-group-map-getAll.middleware';
import {
  ChatCategoryGroupMapCreateMiddleware
} from './server/middleware/chatCategoryGroupMap/chat-category-group-map-create.middleware';
import {
  ChatGroupRoomMapCreateMiddleware
} from './server/middleware/chatGroupRoomMap/chat-group-room-map-create.middleware';
import {ChatGroupCreateMiddleware} from './server/middleware/chatGroup/chat-group-create.middleware';
import {ChatCategoryGetAllMiddleware} from './server/middleware/chatCategory/chat-category-getAll.middleware';

/*
    Server Workflow:
      - Pre-work Logging of Request (beginning of middleware function)
      - Authentication
      - Work (body of middleware function)
      - Post-work Logging of Response (end of middleware function)

    Server API: Auth (non-repository) -> Repository (State) -> Repository (Data)
      - /api/auth/{api function}
      - /api/repository/.../{api function}
      - /api/{data}/.../{api function}/:{optional parameter 1}/:{optional parameter 2}/...

    Server Static:
      - Initial index.html server function / "get fallback" method (**)
        which isn't actually static.
*/

// Primary Component
const server = new ServerApplication();

// Primary Configuration:
//
// -> CORS
// -> Headers
// -> JSON
// -> State Files (/browser)
// -> Endpoints (middleware array below)
// -> Angular App (middleware) (SSR)
server.configure([

  // Auth / User Creation / User Session (JWT)
  //
  new AuthLoginMiddleware(server.getControllerManager(), '/api/auth/login', HttpMethod.POST),
  new AuthCreateMiddleware(server.getControllerManager(), '/api/auth/create', HttpMethod.POST),
  new AuthGetSessionMiddleware(server.getControllerManager(), '/api/auth/getSession', HttpMethod.GET),

  // API: Repository (User)
  new UserRepositoryGetStateMiddleware(server.getControllerManager(), '/api/repository/user/getState', HttpMethod.POST),
  new UserRepositoryCheckStateMiddleware(server.getControllerManager(), '/api/repository/user/checkState', HttpMethod.POST),
  new UserRepositorySetStateMiddleware(server.getControllerManager(), '/api/repository/user/setState', HttpMethod.POST),

  // API: Repository (News)
  new NewsRepositoryGetStateMiddleware(server.getControllerManager(), '/api/repository/news/getState', HttpMethod.POST),
  new NewsRepositoryCheckStateMiddleware(server.getControllerManager(), '/api/repository/news/checkState', HttpMethod.POST),
  new NewsRepositorySetStateMiddleware(server.getControllerManager(), '/api/repository/news/setState', HttpMethod.POST),

  // API: Repository (File)
  new FileRepositoryGetStateMiddleware(server.getControllerManager(), '/api/repository/file/getState', HttpMethod.POST),
  new FileRepositoryCheckStateMiddleware(server.getControllerManager(), '/api/repository/file/checkState', HttpMethod.POST),
  new FileRepositorySetStateMiddleware(server.getControllerManager(), '/api/repository/file/setState', HttpMethod.POST),

  // API: Repository (ChatCategory)
  new ChatCategoryRepositoryGetStateMiddleware(server.getControllerManager(), '/api/repository/chatCategory/getState', HttpMethod.POST),
  new ChatCategoryRepositoryCheckStateMiddleware(server.getControllerManager(), '/api/repository/chatCategory/checkState', HttpMethod.POST),
  new ChatCategoryRepositorySetStateMiddleware(server.getControllerManager(), '/api/repository/chatCategory/setState', HttpMethod.POST),

  // API: Repository (ChatGroup)
  new ChatGroupRepositoryGetStateMiddleware(server.getControllerManager(), '/api/repository/chatGroup/getState', HttpMethod.POST),
  new ChatGroupRepositoryCheckStateMiddleware(server.getControllerManager(), '/api/repository/chatGroup/checkState', HttpMethod.POST),
  new ChatGroupRepositorySetStateMiddleware(server.getControllerManager(), '/api/repository/chatGroup/setState', HttpMethod.POST),

  // API: Repository (ChatRoom)
  new ChatRoomRepositoryGetStateMiddleware(server.getControllerManager(), '/api/repository/chatRoom/getState', HttpMethod.POST),
  new ChatRoomRepositoryCheckStateMiddleware(server.getControllerManager(), '/api/repository/chatRoom/checkState', HttpMethod.POST),
  new ChatRoomRepositorySetStateMiddleware(server.getControllerManager(), '/api/repository/chatRoom/setState', HttpMethod.POST),

  // API: Repository (Chat)
  new ChatRepositoryGetStateMiddleware(server.getControllerManager(), '/api/repository/chat/getState/:chatRoomId', HttpMethod.POST),
  new ChatRepositoryCheckStateMiddleware(server.getControllerManager(), '/api/repository/chat/checkState/:chatRoomId', HttpMethod.POST),
  new ChatRepositorySetStateMiddleware(server.getControllerManager(), '/api/repository/chat/setState/:chatRoomId', HttpMethod.POST),

  // API: Repository (ChatCategoryGroupMap)
  new ChatCategoryGroupMapRepositoryGetStateMiddleware(server.getControllerManager(), '/api/repository/chatCategoryGroupMap/getState', HttpMethod.POST),
  new ChatCategoryGroupMapRepositoryCheckStateMiddleware(server.getControllerManager(), '/api/repository/chatCategoryGroupMap/checkState', HttpMethod.POST),
  new ChatCategoryGroupMapRepositorySetStateMiddleware(server.getControllerManager(), '/api/repository/chatCategoryGroupMap/setState', HttpMethod.POST),

  // API: Repository (ChatGroupRoomMap)
  new ChatGroupRoomMapRepositoryGetStateMiddleware(server.getControllerManager(), '/api/repository/chatGroupRoomMap/getState', HttpMethod.POST),
  new ChatGroupRoomMapRepositoryCheckStateMiddleware(server.getControllerManager(), '/api/repository/chatGroupRoomMap/checkState', HttpMethod.POST),
  new ChatGroupRoomMapRepositorySetStateMiddleware(server.getControllerManager(), '/api/repository/chatGroupRoomMap/setState', HttpMethod.POST),

  // API: User
  new UserGetMiddleware(server.getControllerManager(), '/api/user/get', HttpMethod.POST),
  new UserGetAllMiddleware(server.getControllerManager(), '/api/user/getAll', HttpMethod.POST),
  new UserCreateMiddleware(server.getControllerManager(), '/api/user/create', HttpMethod.POST),

  // API: File
  new FileGetMiddleware(server.getControllerManager(), '/api/file/get', HttpMethod.POST),
  new FileGetAllMiddleware(server.getControllerManager(), '/api/file/getAll', HttpMethod.POST),
  new FileCreateMiddleware(server.getControllerManager(), '/api/file/create', HttpMethod.POST),

  // API: News
  new NewsGetMiddleware(server.getControllerManager(), '/api/news/get', HttpMethod.POST),
  new NewsGetAllMiddleware(server.getControllerManager(), '/api/news/getAll', HttpMethod.POST),
  new NewsCreateMiddleware(server.getControllerManager(), '/api/news/create', HttpMethod.POST),

  // API: ChatCategory
  new ChatCategoryGetMiddleware(server.getControllerManager(), '/api/chatCategory/get', HttpMethod.POST),
  new ChatCategoryGetAllMiddleware(server.getControllerManager(), '/api/chatCategory/getAll', HttpMethod.POST),
  new ChatCategoryCreateMiddleware(server.getControllerManager(), '/api/chatCategory/create', HttpMethod.POST),

  // API: ChatGroup
  new ChatGroupGetMiddleware(server.getControllerManager(), '/api/chatGroup/get', HttpMethod.POST),
  new ChatGroupGetAllMiddleware(server.getControllerManager(), '/api/chatGroup/getAll', HttpMethod.POST),
  new ChatGroupCreateMiddleware(server.getControllerManager(), '/api/chatGroup/create', HttpMethod.POST),

  // API: ChatRoom
  new ChatRoomGetMiddleware(server.getControllerManager(), '/api/chatRoom/get', HttpMethod.POST),
  new ChatRoomGetAllMiddleware(server.getControllerManager(), '/api/chatRoom/getAll', HttpMethod.POST),
  new ChatRoomCreateMiddleware(server.getControllerManager(), '/api/chatRoom/create', HttpMethod.POST),

  // API: Chat
  new ChatGetMiddleware(server.getControllerManager(), '/api/chat/get/:chatRoomId', HttpMethod.POST),
  new ChatGetAllMiddleware(server.getControllerManager(), '/api/chat/getAll/:chatRoomId', HttpMethod.POST),
  new ChatCreateMiddleware(server.getControllerManager(), '/api/chat/create/:chatRoomId', HttpMethod.POST),

  // API: ChatCategoryGroupMap
  new ChatCategoryGroupMapGetMiddleware(server.getControllerManager(), '/api/chatCategoryGroupMap/get', HttpMethod.POST),
  new ChatCategoryGroupMapGetAllMiddleware(server.getControllerManager(), '/api/chatCategoryGroupMap/getAll', HttpMethod.POST),
  new ChatCategoryGroupMapCreateMiddleware(server.getControllerManager(), '/api/chatCategoryGroupMap/create', HttpMethod.POST),

  // API: ChatGroupRoomMap
  new ChatGroupRoomMapGetMiddleware(server.getControllerManager(), '/api/chatGroupRoomMap/get', HttpMethod.POST),
  new ChatGroupRoomMapGetAllMiddleware(server.getControllerManager(), '/api/chatGroupRoomMap/getAll', HttpMethod.POST),
  new ChatGroupRoomMapCreateMiddleware(server.getControllerManager(), '/api/chatGroupRoomMap/create', HttpMethod.POST),
]);

// START!
server.start();

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(server.getApp());
