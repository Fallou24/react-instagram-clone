import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { bdd } from "../firebase-config";

export const handleUnFollow = async (currentUserId, id) => {
  await updateDoc(doc(bdd, "users", currentUserId), {
    followings: arrayRemove(id),
  });
  await updateDoc(doc(bdd, "users", id), {
    followers: arrayRemove(currentUserId),
  });
};
