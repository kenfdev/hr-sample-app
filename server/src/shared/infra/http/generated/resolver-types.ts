import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ListAllMembersResponse as ListAllMembersResponseModel } from '@/members/list-all-members/listAllMembersService';
import { ShowMemberDetailResponse as ShowMemberDetailResponseModel } from '@/members/show-member-detail/showMemberDetailService';
import { GetLoggedInUserInfoResponse as GetLoggedInUserInfoResponseModel, UserMenuItem as UserMenuItemModel } from '@/users/get-logged-in-user-info/getLoggedInUserInfoService';
import { DisplayableMember as DisplayableMemberModel } from '@/members/shared/member';
import { Department as DepartmentModel } from '@/members/shared/department';
import { EditMemberDetailRequest as EditMemberDetailRequestModel, EditMemberDetailResponse as EditMemberDetailResponseModel } from '@/members/edit-member-detail/editMemberDetailService';
import { Context } from '@/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Department = {
  __typename?: 'Department';
  id: Scalars['ID'];
  managerMemberId: Scalars['ID'];
  name: Scalars['String'];
};

export type EditMemberDetailInput = {
  age?: InputMaybe<Scalars['Int']>;
  departmentId?: InputMaybe<Scalars['ID']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  pr?: InputMaybe<Scalars['String']>;
  salary?: InputMaybe<Scalars['Int']>;
};

export type EditMemberDetailResponse = {
  __typename?: 'EditMemberDetailResponse';
  result: Scalars['Boolean'];
};

export type ListAllMembersResponse = {
  __typename?: 'ListAllMembersResponse';
  members: Array<Member>;
};

export type Member = {
  __typename?: 'Member';
  age?: Maybe<Scalars['Int']>;
  avatar?: Maybe<Scalars['String']>;
  department?: Maybe<Department>;
  editable?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isLoggedInUser?: Maybe<Scalars['Boolean']>;
  joinedAt?: Maybe<Scalars['DateTime']>;
  lastName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  pr?: Maybe<Scalars['String']>;
  salary?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  editMemberDetail: EditMemberDetailResponse;
};


export type MutationEditMemberDetailArgs = {
  input: EditMemberDetailInput;
};

export type Query = {
  __typename?: 'Query';
  listAllMembers: ListAllMembersResponse;
  showMemberDetail: ShowMemberDetailResponse;
  userInfo: UserInfo;
};


export type QueryShowMemberDetailArgs = {
  id: Scalars['ID'];
};

export type ShowMemberDetailResponse = {
  __typename?: 'ShowMemberDetailResponse';
  editableFields: Array<Scalars['String']>;
  member: Member;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  userMenu: Array<UserMenuItem>;
  username: Scalars['String'];
};

export type UserMenuItem = {
  __typename?: 'UserMenuItem';
  name: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Department: ResolverTypeWrapper<DepartmentModel>;
  EditMemberDetailInput: ResolverTypeWrapper<EditMemberDetailRequestModel>;
  EditMemberDetailResponse: ResolverTypeWrapper<EditMemberDetailResponseModel>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ListAllMembersResponse: ResolverTypeWrapper<ListAllMembersResponseModel>;
  Member: ResolverTypeWrapper<DisplayableMemberModel>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  ShowMemberDetailResponse: ResolverTypeWrapper<ShowMemberDetailResponseModel>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UserInfo: ResolverTypeWrapper<GetLoggedInUserInfoResponseModel>;
  UserMenuItem: ResolverTypeWrapper<UserMenuItemModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  DateTime: Scalars['DateTime'];
  Department: DepartmentModel;
  EditMemberDetailInput: EditMemberDetailRequestModel;
  EditMemberDetailResponse: EditMemberDetailResponseModel;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  ListAllMembersResponse: ListAllMembersResponseModel;
  Member: DisplayableMemberModel;
  Mutation: {};
  Query: {};
  ShowMemberDetailResponse: ShowMemberDetailResponseModel;
  String: Scalars['String'];
  UserInfo: GetLoggedInUserInfoResponseModel;
  UserMenuItem: UserMenuItemModel;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DepartmentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Department'] = ResolversParentTypes['Department']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  managerMemberId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EditMemberDetailResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditMemberDetailResponse'] = ResolversParentTypes['EditMemberDetailResponse']> = {
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListAllMembersResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ListAllMembersResponse'] = ResolversParentTypes['ListAllMembersResponse']> = {
  members?: Resolver<Array<ResolversTypes['Member']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = {
  age?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType>;
  editable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isLoggedInUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  joinedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pr?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  salary?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  editMemberDetail?: Resolver<ResolversTypes['EditMemberDetailResponse'], ParentType, ContextType, RequireFields<MutationEditMemberDetailArgs, 'input'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  listAllMembers?: Resolver<ResolversTypes['ListAllMembersResponse'], ParentType, ContextType>;
  showMemberDetail?: Resolver<ResolversTypes['ShowMemberDetailResponse'], ParentType, ContextType, RequireFields<QueryShowMemberDetailArgs, 'id'>>;
  userInfo?: Resolver<ResolversTypes['UserInfo'], ParentType, ContextType>;
};

export type ShowMemberDetailResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ShowMemberDetailResponse'] = ResolversParentTypes['ShowMemberDetailResponse']> = {
  editableFields?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  member?: Resolver<ResolversTypes['Member'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserInfo'] = ResolversParentTypes['UserInfo']> = {
  userMenu?: Resolver<Array<ResolversTypes['UserMenuItem']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserMenuItemResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserMenuItem'] = ResolversParentTypes['UserMenuItem']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  DateTime?: GraphQLScalarType;
  Department?: DepartmentResolvers<ContextType>;
  EditMemberDetailResponse?: EditMemberDetailResponseResolvers<ContextType>;
  ListAllMembersResponse?: ListAllMembersResponseResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ShowMemberDetailResponse?: ShowMemberDetailResponseResolvers<ContextType>;
  UserInfo?: UserInfoResolvers<ContextType>;
  UserMenuItem?: UserMenuItemResolvers<ContextType>;
};

