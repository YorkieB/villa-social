import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';

export type Message = {
  id: string;
  conversationId: string;
  text: string;
  sentBy: string; // UID
  sentAt: Timestamp;
  readBy: string[]; // UIDs
};

export const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore(msg) {
    return { ...msg };
  },
  fromFirestore(snapshot, options) {
    const { id } = snapshot;
    const data = snapshot.data(options);
    return { id, ...data } as Message;
  }
};
