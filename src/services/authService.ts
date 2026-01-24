import { GoogleAuthProvider, signInWithPopup, type UserCredential } from "firebase/auth";
import { auth } from "../config/firebase";

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<string> => {
    try {
        const result: UserCredential = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        return token;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};
