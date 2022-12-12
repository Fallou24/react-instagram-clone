import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import { bdd } from "../firebase-config";

export const handleFollow = async (currentUserId,id) => {
  await updateDoc(doc(bdd, "users", currentUserId), {
    followings: arrayUnion(id),
  });
  await updateDoc(doc(bdd, "users", id), {
    followers: arrayUnion(currentUserId),
  });
};
