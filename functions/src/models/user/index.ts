// TODO
import { db } from '../../utils/firebase';
import { USER_COLLECTION_KEY, UserDocument , userConverter} from './user.entity';

const COLLECTION_KEY = USER_COLLECTION_KEY;
const converter = userConverter;

export const addUser = async (data : UserDocument) => {
    try {
    const docRef = db.collection(COLLECTION_KEY).doc(data.user_id).withConverter(converter);
    await docRef.set(data, { merge: true });
    return Promise.resolve();
    } catch (err) {
    return Promise.reject(err);
    }
}


export const getUser = async (email : string) => {
    try {
    const docRef = db.collection(COLLECTION_KEY).where('email', '==', email).withConverter(converter);
    const docResult = await docRef.get();
    let userDetail;
    docResult.forEach((doc) => {
        if(doc.data()){
            userDetail = doc.data();
        }
    })
    return userDetail;
    } catch (err) {
        return Promise.reject(err);
    }
} 


export const getUserByEmail = async (email : string) => {
    try {
        const docRef = db.collection(COLLECTION_KEY).where('email', '==', email).withConverter(converter);
        const docResult = await docRef.get();
        let userDetails : any = [];
        docResult.forEach((doc) => {
            if(doc.data()){
                userDetails.push(doc.data());
            }
        })
        return userDetails;
        } catch (err) {
            return Promise.reject(err);
        }
} 

export const getUserById = async (id : string) => {
    try {
        const docRef = db.collection(COLLECTION_KEY).doc(id).withConverter(converter);
        const docSnap = await docRef.get();
        return docSnap.data();
    } catch (err) {
        return Promise.reject(err);
    }
}

export const updateUserFields = async (id : string , updateSet : any) => {
    try {
        return await db.collection(COLLECTION_KEY).doc(id).update(updateSet);
    } catch (error) {
        return Promise.reject(error);
    }
} 

