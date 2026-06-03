/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
  increment,
  limit
} from 'firebase/firestore';
import { useAuth } from '@lib/context/auth-context';
import {
  conversationsCollection,
  conversationMessagesCollection,
  usersCollection
} from '@lib/firebase/collections';
import { formatDate } from '@lib/date';
import { MainLayout } from '@components/layout/main-layout';
import { ProtectedLayout } from '@components/layout/common-layout';
import { MainHeader } from '@components/home/main-header';
import { SEO } from '@components/common/seo';
import { HeroIcon } from '@components/ui/hero-icon';
import { UserAvatar } from '@components/user/user-avatar';
import type { ReactElement, ReactNode, KeyboardEvent } from 'react';
import cn from 'clsx';
import type { Conversation } from '@lib/types/conversation';
import type { Message } from '@lib/types/message';
import type { User } from '@lib/types/user';

// ─── New Conversation Modal ────────────────────────────────────────────────

type NewDMModalProps = {
  currentUser: User;
  onClose: () => void;
  onStartConversation: (otherUser: User) => void;
};

function NewDMModal({
  currentUser,
  onClose,
  onStartConversation
}: NewDMModalProps): JSX.Element {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    const q = query(usersCollection);
    getDocs(q)
      .then((snap) => {
        const all = snap.docs
          .map((d) => d.data())
          .filter(
            (u) =>
              u.id !== currentUser.id &&
              (search === '' ||
                u.username.toLowerCase().includes(search.toLowerCase()) ||
                u.name.toLowerCase().includes(search.toLowerCase()))
          );
        setResults(all);
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch((_err: unknown) => {});
  }, [search, currentUser.id]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='w-full max-w-sm rounded-2xl bg-main-background shadow-2xl'>
        <div className='flex items-center gap-3 border-b border-light-border p-4 dark:border-dark-border'>
          <button
            onClick={onClose}
            className='rounded-full p-1 hover:bg-light-primary/10 dark:hover:bg-dark-primary/10'
          >
            <HeroIcon className='h-5 w-5' iconName='XMarkIcon' />
          </button>
          <h2 className='text-lg font-bold'>New message</h2>
        </div>
        <div className='p-3'>
          <div className='flex items-center gap-2 rounded-full bg-search-background px-4 py-2'>
            <HeroIcon
              className='h-4 w-4 text-secondary'
              iconName='MagnifyingGlassIcon'
            />
            <input
              autoFocus
              className='flex-1 bg-transparent text-sm outline-none placeholder:text-secondary'
              placeholder='Search people'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className='max-h-72 overflow-y-auto'>
          {results.map((u) => (
            <button
              key={u.id}
              onClick={() => onStartConversation(u)}
              className='flex w-full items-center gap-3 px-4 py-3 hover:bg-main-sidebar-background transition-colors'
            >
              <UserAvatar src={u.photoURL} alt={u.name} username={u.username} />
              <div className='text-left'>
                <p className='text-sm font-bold leading-none'>{u.name}</p>
                <p className='text-xs text-secondary'>@{u.username}</p>
              </div>
            </button>
          ))}
          {results.length === 0 && (
            <p className='px-4 py-6 text-center text-sm text-secondary'>
              No people found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Conversation List Item ─────────────────────────────────────────────────

type ConvItemProps = {
  conv: Conversation;
  otherUser: User | undefined;
  active: boolean;
  currentUid: string;
  onClick: () => void;
};

function ConvItem({
  conv,
  otherUser,
  active,
  currentUid,
  onClick
}: ConvItemProps): JSX.Element {
  const unread = conv.unreadCount?.[currentUid] ?? 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-main-sidebar-background',
        active && 'bg-main-sidebar-background'
      )}
    >
      {otherUser ? (
        <UserAvatar
          src={otherUser.photoURL}
          alt={otherUser.name}
          username={otherUser.username}
        />
      ) : (
        <div className='h-10 w-10 rounded-full bg-main-sidebar-background' />
      )}
      <div className='min-w-0 flex-1 text-left'>
        <div className='flex items-center justify-between gap-1'>
          <span className='truncate text-sm font-bold'>
            {otherUser?.name ?? '…'}
          </span>
          {conv.lastMessageAt && (
            <span className='flex-shrink-0 text-xs text-secondary'>
              {formatDate(conv.lastMessageAt, 'tweet')}
            </span>
          )}
        </div>
        <p
          className={cn(
            'truncate text-xs',
            unread > 0 ? 'font-semibold text-main-primary' : 'text-secondary'
          )}
        >
          {conv.lastMessage ?? 'No messages yet'}
        </p>
      </div>
      {unread > 0 && (
        <span className='flex-shrink-0 rounded-full bg-main-accent px-1.5 py-0.5 text-[10px] font-bold text-white'>
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  );
}

// ─── Message Bubble ─────────────────────────────────────────────────────────

type BubbleProps = {
  msg: Message;
  isMine: boolean;
};

function Bubble({ msg, isMine }: BubbleProps): JSX.Element {
  return (
    <div
      className={cn('flex items-end gap-2', isMine ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2 text-sm leading-relaxed',
          isMine
            ? 'rounded-br-none bg-main-accent text-white'
            : 'rounded-bl-none bg-main-sidebar-background text-main-primary'
        )}
      >
        <p className='whitespace-pre-wrap break-words'>{msg.text}</p>
        <p
          className={cn(
            'mt-1 text-right text-[10px]',
            isMine ? 'text-white/70' : 'text-secondary'
          )}
        >
          {msg.sentAt
            ? formatDate(msg.sentAt, 'message')
            : '…'}
        </p>
      </div>
    </div>
  );
}

// ─── Thread Panel ───────────────────────────────────────────────────────────

type ThreadPanelProps = {
  conversationId: string;
  otherUser: User | undefined;
  currentUser: User;
  onBack?: () => void;
};

function ThreadPanel({
  conversationId,
  otherUser,
  currentUser,
  onBack
}: ThreadPanelProps): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Subscribe to messages
  useEffect(() => {
    const q = query(
      conversationMessagesCollection(conversationId),
      orderBy('sentAt', 'asc'),
      limit(200)
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => d.data()));
    });
    return unsub;
  }, [conversationId]);

  // Mark as read when we open the thread
  useEffect(() => {
    const convRef = doc(conversationsCollection, conversationId);
    updateDoc(convRef, {
      [`unreadCount.${currentUser.id}`]: 0
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    }).catch((_e: unknown) => {});
  }, [conversationId, currentUser.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText('');
    try {
      const convRef = doc(conversationsCollection, conversationId);
      const msgData = {
        conversationId,
        text: trimmed,
        sentBy: currentUser.id,
        sentAt: serverTimestamp(),
        readBy: [currentUser.id]
      };
      // Add message
      await addDoc(
        conversationMessagesCollection(conversationId),
        msgData as never
      );
      // Update conversation meta — increment unread for the other participant
      const otherUid = otherUser?.id;
      await updateDoc(convRef, {
        lastMessage: trimmed,
        lastMessageAt: serverTimestamp(),
        lastMessageBy: currentUser.id,
        ...(otherUid
          ? { [`unreadCount.${otherUid}`]: increment(1) }
          : {})
      });
    } catch {
      setText(trimmed);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <header className='sticky top-0 z-10 flex items-center gap-3 border-b border-light-border bg-main-background/80 px-4 py-3 backdrop-blur-md dark:border-dark-border'>
        {onBack && (
          <button
            onClick={onBack}
            className='rounded-full p-1 hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 md:hidden'
          >
            <HeroIcon className='h-5 w-5' iconName='ArrowLeftIcon' />
          </button>
        )}
        {otherUser && (
          <UserAvatar
            src={otherUser.photoURL}
            alt={otherUser.name}
            username={otherUser.username}
          />
        )}
        <div>
          <p className='text-sm font-bold leading-none'>
            {otherUser?.name ?? '…'}
          </p>
          {otherUser && (
            <p className='text-xs text-secondary'>@{otherUser.username}</p>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className='flex-1 space-y-3 overflow-y-auto px-4 py-4'>
        {messages.length === 0 && (
          <p className='text-center text-sm text-secondary pt-8'>
            No messages yet — say hello!
          </p>
        )}
        {messages.map((msg) => (
          <Bubble
            key={msg.id}
            msg={msg}
            isMine={msg.sentBy === currentUser.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className='border-t border-light-border bg-main-background px-4 py-3 dark:border-dark-border'>
        <div className='flex items-end gap-2 rounded-2xl border border-light-border bg-search-background px-4 py-2 dark:border-dark-border'>
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Start a new message'
            className='flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-secondary max-h-32'
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            onClick={() => void sendMessage()}
            disabled={!text.trim() || sending}
            className='rounded-full p-1.5 bg-main-accent text-white disabled:opacity-40 hover:brightness-110 transition-all'
          >
            <HeroIcon className='h-4 w-4' iconName='PaperAirplaneIcon' solid />
          </button>
        </div>
        <p className='mt-1 text-right text-[10px] text-secondary'>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyThread(): JSX.Element {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-4 p-8'>
      <div className='rounded-full bg-main-sidebar-background p-6'>
        <HeroIcon className='h-10 w-10 text-secondary' iconName='EnvelopeIcon' />
      </div>
      <div className='text-center'>
        <h3 className='text-xl font-bold'>Your messages</h3>
        <p className='mt-1 text-sm text-secondary'>
          Select a conversation or start a new one
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function MessagesPage(): JSX.Element {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userCache, setUserCache] = useState<Record<string, User>>({});
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [showThread, setShowThread] = useState(false); // mobile toggle
  const [showNewDM, setShowNewDM] = useState(false);

  const currentUser = user as User;

  // Subscribe to conversations
  useEffect(() => {
    if (!currentUser?.id) return;
    const q = query(
      conversationsCollection,
      where('participants', 'array-contains', currentUser.id),
      orderBy('lastMessageAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const convs = snap.docs.map((d) => d.data());
      setConversations(convs);

      // Fetch unknown users (use functional updater to avoid stale closure)
      setUserCache((prev) => {
        const unknownUids = new Set<string>();
        for (const conv of convs)
          for (const uid of conv.participants)
            if (uid !== currentUser.id && !prev[uid])
              unknownUids.add(uid);

        if (unknownUids.size === 0) return prev;

        // Fire-and-forget fetch
        void getDocs(
          query(usersCollection, where('id', 'in', Array.from(unknownUids).slice(0, 10)))
        ).then((userSnap) => {
          const fetched: Record<string, User> = {};
          userSnap.docs.forEach((d) => { fetched[d.data().id] = d.data(); });
          setUserCache((p) => ({ ...p, ...fetched }));
        });

        return prev; // return unchanged for now; will re-render after fetch
      });
    });
    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const getOtherUser = useCallback(
    (conv: Conversation): User | undefined => {
      const otherId = conv.participants.find((p) => p !== currentUser.id);
      return otherId ? userCache[otherId] : undefined;
    },
    [currentUser?.id, userCache]
  );

  async function startConversation(otherUser: User): Promise<void> {
    setShowNewDM(false);
    // Check if conversation already exists
    const existing = conversations.find((c) =>
      c.participants.includes(otherUser.id)
    );
    if (existing) {
      setActiveConvId(existing.id);
      setShowThread(true);
      return;
    }
    // Create new conversation
    const convData = {
      participants: [currentUser.id, otherUser.id],
      lastMessage: null,
      lastMessageAt: null,
      lastMessageBy: null,
      createdAt: serverTimestamp(),
      unreadCount: { [currentUser.id]: 0, [otherUser.id]: 0 }
    };
    const ref = await addDoc(conversationsCollection, convData as never);
    setUserCache((prev) => ({ ...prev, [otherUser.id]: otherUser }));
    setActiveConvId(ref.id);
    setShowThread(true);
  }

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const activeOtherUser = activeConv ? getOtherUser(activeConv) : undefined;

  return (
    <>
      <SEO title='Messages / Villa' />
      {showNewDM && (
        <NewDMModal
          currentUser={currentUser}
          onClose={() => setShowNewDM(false)}
          onStartConversation={(u): void => { void startConversation(u); }}
        />
      )}

      {/* Two-column layout: replaces the standard single-column max-w-xl */}
      <main className='hover-animation flex min-h-screen w-full max-w-2xl border-x-0 border-light-border dark:border-dark-border xs:border-x'>
        {/* Left panel — conversation list */}
        <div
          className={cn(
            'flex w-full flex-col border-r border-light-border dark:border-dark-border md:w-80 md:flex-shrink-0',
            showThread && 'hidden md:flex'
          )}
        >
          <MainHeader
            title='Messages'
            useActionButton
            iconName='PencilSquareIcon'
            tip='New message'
            action={() => setShowNewDM(true)}
          />
          <div className='flex-1 overflow-y-auto'>
            {conversations.length === 0 && (
              <div className='p-8 text-center'>
                <p className='text-sm font-bold'>No conversations yet</p>
                <p className='mt-1 text-xs text-secondary'>
                  Start a new message to get going
                </p>
              </div>
            )}
            {conversations.map((conv) => (
              <ConvItem
                key={conv.id}
                conv={conv}
                otherUser={getOtherUser(conv)}
                active={conv.id === activeConvId}
                currentUid={currentUser.id}
                onClick={(): void => {
                  setActiveConvId(conv.id);
                  setShowThread(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* Right panel — thread */}
        <div
          className={cn(
            'flex flex-1 flex-col',
            !showThread && 'hidden md:flex'
          )}
        >
          {activeConvId ? (
            <ThreadPanel
              conversationId={activeConvId}
              otherUser={activeOtherUser}
              currentUser={currentUser}
              onBack={() => setShowThread(false)}
            />
          ) : (
            <EmptyThread />
          )}
        </div>
      </main>
    </>
  );
}

MessagesPage.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>{page}</MainLayout>
  </ProtectedLayout>
);
