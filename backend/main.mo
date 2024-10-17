import Bool "mo:base/Bool";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Time "mo:base/Time";
import List "mo:base/List";

actor {
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Int;
  };

  stable var posts : List.List<Post> = List.nil();
  stable var nextId : Nat = 0;

  public func createPost(title: Text, body: Text, author: Text) : async Nat {
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := List.push(post, posts);
    nextId += 1;
    nextId - 1
  };

  public query func getPosts() : async [Post] {
    List.toArray(List.reverse(posts))
  };

  public func updatePost(id: Nat, title: Text, body: Text, author: Text) : async Bool {
    let updatedPosts = List.map<Post, Post>(posts, func (post) {
      if (post.id == id) {
        {
          id = post.id;
          title = title;
          body = body;
          author = author;
          timestamp = Time.now();
        }
      } else {
        post
      }
    });
    
    if (List.size(updatedPosts) == List.size(posts)) {
      posts := updatedPosts;
      true
    } else {
      false
    }
  };
}
