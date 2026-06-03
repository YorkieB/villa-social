import { collection } from 'firebase/firestore';
import { userConverter } from '@lib/types/user';
import { tweetConverter } from '@lib/types/tweet';
import { bookmarkConverter } from '@lib/types/bookmark';
import { statsConverter } from '@lib/types/stats';
import { conversationConverter } from '@lib/types/conversation';
import { messageConverter } from '@lib/types/message';
import { db } from './app';
import type { CollectionReference } from 'firebase/firestore';
import type { Bookmark } from '@lib/types/bookmark';
import type { Stats } from '@lib/types/stats';
import type { Conversation } from '@lib/types/conversation';
import type { Message } from '@lib/types/message';

export const usersCollection = collection(db, 'users').withConverter(
  userConverter
);

export const tweetsCollection = collection(db, 'tweets').withConverter(
  tweetConverter
);

export function userBookmarksCollection(
  id: string
): CollectionReference<Bookmark> {
  return collection(db, `users/${id}/bookmarks`).withConverter(
    bookmarkConverter
  );
}

export function userStatsCollection(id: string): CollectionReference<Stats> {
  return collection(db, `users/${id}/stats`).withConverter(statsConverter);
}

export const conversationsCollection: CollectionReference<Conversation> =
  collection(db, 'conversations').withConverter(conversationConverter);

export function conversationMessagesCollection(
  conversationId: string
): CollectionReference<Message> {
  return collection(
    db,
    `conversations/${conversationId}/messages`
  ).withConverter(messageConverter);
}
