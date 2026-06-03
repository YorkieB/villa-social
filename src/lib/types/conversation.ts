import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';
import type { User } from './user';

export type Conversation = {
  id: string;
  participants: string[]; // UIDs
  lastMessage: string | null;
  lastMessageAt: Timestamp | null;
  lastMessageBy: string | null;
  createdAt: Timestamp;
  unreadCount: Record<string, number>; // uid → count
};

export type ConversationWithUser = Conversation & { otherUser: User };

export const conversationConverter: FirestoreDataConverter<Conversation> = {
  toFirestore(conv) {
    return { ...conv };
  },
  fromFirestore(snapshot, options) {
    const { id } = snapshot;
    const data = snapshot.data(options);
    return { id, ...data } as Conversation;
  }
};
