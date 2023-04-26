import {Item} from "./item";

export interface User {
  name: string;
  password: string;
  library: string[];
  profilePictureUrl: string;
  wishlist: string[];
  customLists: string[];
  followerLists: string[];
}
