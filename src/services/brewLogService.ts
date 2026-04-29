import {BrewLogEntry} from "../types/brew";
import {addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, Unsubscribe, where} from "@firebase/firestore";
import {db} from "../../firebase/config";


const COLLECTION = "brewLogs";

export async function saveBrewLog(entry: Omit<BrewLogEntry, "id">): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), entry);
    return ref.id;
}

export function subscribeToBrewLogs(
    userId: string,
    onData: (logs: BrewLogEntry[]) => void,
    onError?: (error: Error) => void,
): Unsubscribe {
    const q = query(
        collection(db, COLLECTION),
        where("userId", "==", userId),
        orderBy("brewedAt", "desc")
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const logs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as BrewLogEntry[];
            onData(logs);
        },
        (error) => {
            console.error("Brew log sub error:", error);
            onError?.(error);
        }
    );
}

export async function deleteBrewLog(logId: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, logId));
}