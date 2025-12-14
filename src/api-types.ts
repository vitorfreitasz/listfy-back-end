/**
 * Tipagens de entrada e saída para todos os endpoints da API
 */

// ============================================================================
// TIPOS BASE
// ============================================================================

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ApiSuccessResponse<T = any> {
  data: T;
}

// ============================================================================
// MÓDULO: AUTH
// ============================================================================

// Entrada
export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface AuthRegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Saída de Sucesso
export interface AuthLoginResponse {
  name: string;
  access_token: string;
}

export interface AuthRegisterResponse {
  name: string;
  access_token: string;
}

export interface AuthGetProfileResponse {
  id: number;
  name: string;
  sub: number;
}

// Saída de Erro
export type AuthLoginError = ApiErrorResponse;
export type AuthRegisterError = ApiErrorResponse;
export type AuthGetProfileError = ApiErrorResponse;

// ============================================================================
// MÓDULO: USERS
// ============================================================================

// Entrada
export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
}

// Saída de Sucesso
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface UserCreateResponse extends UserResponse {}

export interface UserFindAllResponse extends Array<UserResponse> {}

export interface UserFindByIdResponse extends UserResponse {}

export interface UserUpdateResponse extends UserResponse {}

export interface UserRemoveResponse {
  message: string;
}

// Saída de Erro
export type UserCreateError = ApiErrorResponse;
export type UserFindAllError = ApiErrorResponse;
export type UserFindByIdError = ApiErrorResponse;
export type UserUpdateError = ApiErrorResponse;
export type UserRemoveError = ApiErrorResponse;

// ============================================================================
// MÓDULO: LISTS
// ============================================================================

// Entrada
export interface ListCreateRequest {
  name: string;
  description?: string;
}

export interface ListUpdateRequest {
  name?: string;
  description?: string;
}

// Saída de Sucesso
export interface ListOwnerResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Usuário sem senha e sem datas (para findOne)
export interface ListUserSafeResponse {
  id: number;
  name: string;
  email: string;
}

export interface ListNestedItemResponse {
  id: number;
  name: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  assignedTo?: ListOwnerResponse;
}

// Item com assignedTo formatado (sem senha e sem datas do usuário)
export interface ListItemWithAssignedResponse {
  id: number;
  name: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  assignedTo?: ListUserSafeResponse;
}

export interface ListResponse {
  id: number;
  name: string;
  description?: string;
  owner: ListOwnerResponse;
  participants?: ListOwnerResponse[];
  items?: ListNestedItemResponse[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ListCreateResponse extends ListResponse {}

export interface ListFindAllResponse extends Array<ListResponse> {}

export interface ListFindOneResponse {
  id: number;
  name: string;
  description?: string;
  owner: ListUserSafeResponse;
  participants: ListUserSafeResponse[];
  items: ListItemWithAssignedResponse[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ListUpdateResponse extends ListResponse {}

export interface ListRemoveResponse {
  // Retorna void, mas pode retornar uma mensagem de sucesso
}

// Participantes
export interface ListAddParticipantRequest {
  email: string;
}

export interface ListRemoveParticipantRequest {
  userId: number;
}

export interface ListAddParticipantResponse extends ListResponse {}

export interface ListRemoveParticipantResponse extends ListResponse {}

export interface ListGetParticipantsResponse extends Array<ListOwnerResponse> {}

// Saída de Erro
export type ListCreateError = ApiErrorResponse;
export type ListFindAllError = ApiErrorResponse;
export type ListFindOneError = ApiErrorResponse;
export type ListUpdateError = ApiErrorResponse;
export type ListRemoveError = ApiErrorResponse;
export type ListAddParticipantError = ApiErrorResponse;
export type ListRemoveParticipantError = ApiErrorResponse;
export type ListGetParticipantsError = ApiErrorResponse;

// ============================================================================
// MÓDULO: LIST ITEMS
// ============================================================================

// Entrada
export interface ListItemCreateRequest {
  name: string;
  quantity?: number;
}

export interface ListItemAssignRequest {
  userId: number;
}

export interface ListItemEditRequest {
  name?: string;
  quantity?: number;
}

// Saída de Sucesso
export interface ListItemAssignedToResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ListItemListResponse {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ListItemResponse {
  id: number;
  name: string;
  quantity: number;
  list: ListItemListResponse;
  assignedTo?: ListItemAssignedToResponse;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ListItemCreateResponse extends ListItemResponse {}

export interface ListItemAssignResponse extends ListItemResponse {}

export interface ListItemEditResponse extends ListItemResponse {}

export interface ListItemDeleteResponse {
  // Retorna void após soft delete
}

// Saída de Erro
export type ListItemCreateError = ApiErrorResponse;
export type ListItemAssignError = ApiErrorResponse;
export type ListItemEditError = ApiErrorResponse;
export type ListItemDeleteError = ApiErrorResponse;

// ============================================================================
// TIPOS UNIFICADOS POR ENDPOINT
// ============================================================================

// Auth Endpoints
export namespace AuthEndpoints {
  export namespace Login {
    export type Request = AuthLoginRequest;
    export type SuccessResponse = AuthLoginResponse;
    export type ErrorResponse = AuthLoginError;
  }

  export namespace Register {
    export type Request = AuthRegisterRequest;
    export type SuccessResponse = AuthRegisterResponse;
    export type ErrorResponse = AuthRegisterError;
  }

  export namespace GetProfile {
    export type Request = void;
    export type SuccessResponse = AuthGetProfileResponse;
    export type ErrorResponse = AuthGetProfileError;
  }
}

// User Endpoints
export namespace UserEndpoints {
  export namespace Create {
    export type Request = UserCreateRequest;
    export type SuccessResponse = UserCreateResponse;
    export type ErrorResponse = UserCreateError;
  }

  export namespace FindAll {
    export type Request = void;
    export type SuccessResponse = UserFindAllResponse;
    export type ErrorResponse = UserFindAllError;
  }

  export namespace FindById {
    export type Request = void;
    export type SuccessResponse = UserFindByIdResponse;
    export type ErrorResponse = UserFindByIdError;
  }

  export namespace Update {
    export type Request = UserUpdateRequest;
    export type SuccessResponse = UserUpdateResponse;
    export type ErrorResponse = UserUpdateError;
  }

  export namespace Remove {
    export type Request = void;
    export type SuccessResponse = UserRemoveResponse;
    export type ErrorResponse = UserRemoveError;
  }
}

// List Endpoints
export namespace ListEndpoints {
  export namespace Create {
    export type Request = ListCreateRequest;
    export type SuccessResponse = ListCreateResponse;
    export type ErrorResponse = ListCreateError;
  }

  export namespace FindAll {
    export type Request = void;
    export type SuccessResponse = ListFindAllResponse;
    export type ErrorResponse = ListFindAllError;
  }

  export namespace FindOne {
    export type Request = void;
    export type SuccessResponse = ListFindOneResponse;
    export type ErrorResponse = ListFindOneError;
  }

  export namespace Update {
    export type Request = ListUpdateRequest;
    export type SuccessResponse = ListUpdateResponse;
    export type ErrorResponse = ListUpdateError;
  }

  export namespace Remove {
    export type Request = void;
    export type SuccessResponse = ListRemoveResponse;
    export type ErrorResponse = ListRemoveError;
  }

  export namespace AddParticipant {
    export type Request = ListAddParticipantRequest;
    export type SuccessResponse = ListAddParticipantResponse;
    export type ErrorResponse = ListAddParticipantError;
  }

  export namespace RemoveParticipant {
    export type Request = ListRemoveParticipantRequest;
    export type SuccessResponse = ListRemoveParticipantResponse;
    export type ErrorResponse = ListRemoveParticipantError;
  }

  export namespace GetParticipants {
    export type Request = void;
    export type SuccessResponse = ListGetParticipantsResponse;
    export type ErrorResponse = ListGetParticipantsError;
  }
}

// List Item Endpoints
export namespace ListItemEndpoints {
  export namespace Create {
    export type Request = ListItemCreateRequest;
    export type SuccessResponse = ListItemCreateResponse;
    export type ErrorResponse = ListItemCreateError;
  }

  export namespace Assign {
    export type Request = ListItemAssignRequest;
    export type SuccessResponse = ListItemAssignResponse;
    export type ErrorResponse = ListItemAssignError;
  }

  export namespace Edit {
    export type Request = ListItemEditRequest;
    export type SuccessResponse = ListItemEditResponse;
    export type ErrorResponse = ListItemEditError;
  }

  export namespace Delete {
    export type Request = void;
    export type SuccessResponse = ListItemDeleteResponse;
    export type ErrorResponse = ListItemDeleteError;
  }
}
