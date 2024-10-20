import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Post {
  'id' : bigint,
  'title' : string,
  'body' : string,
  'author' : string,
  'timestamp' : bigint,
}
export interface _SERVICE {
  'createPost' : ActorMethod<[string, string, string], bigint>,
  'getPosts' : ActorMethod<[], Array<Post>>,
  'updatePost' : ActorMethod<[bigint, string, string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
