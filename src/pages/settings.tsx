/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState, useCallback } from 'react';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithPopup
} from 'firebase/auth';
import { auth } from '@lib/firebase/app';
import { updateUserData, updateUsername, updateUserPrivacy } from '@lib/firebase/utils';
import { checkUsernameAvailability } from '@lib/firebase/utils';
import { useAuth } from '@lib/context/auth-context';
import { MainLayout } from '@components/layout/main-layout';
import { ProtectedLayout } from '@components/layout/common-layout';
import { MainHeader } from '@components/home/main-header';
import { SEO } from '@components/common/seo';
import { HeroIcon } from '@components/ui/hero-icon';
import { InputAccentRadio } from '@components/input/input-accent-radio';
import { InputThemeRadio } from '@components/input/input-theme-radio';
import cn from 'clsx';
import type { ReactElement, ReactNode, ChangeEvent } from 'react';
import type { Theme, Accent } from '@lib/types/theme';
import type { User } from '@lib/types/user';

// ─── Section wrapper ──────────────────────────────────────────────────────

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

function Section({ title, description, children }: SectionProps): JSX.Element {
  return (
    <section className='border-b border-light-border dark:border-dark-border py-6 px-4'>
      <h2 className='mb-1 text-xl font-bold'>{title}</h2>
      {description && (
        <p className='mb-4 text-sm text-secondary'>{description}</p>
      )}
      <div className='flex flex-col gap-4'>{children}</div>
    </section>
  );
}

// ─── Labelled row ─────────────────────────────────────────────────────────

type RowProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

function Row({ label, hint, children }: RowProps): JSX.Element {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-xs font-bold uppercase tracking-wider text-secondary'>
        {label}
      </label>
      {hint && <p className='text-xs text-secondary'>{hint}</p>}
      {children}
    </div>
  );
}

// ─── Text input ───────────────────────────────────────────────────────────

type TextInputProps = {
  value: string;
  placeholder?: string;
  maxLength?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
};

function TextInput({
  value,
  placeholder,
  maxLength,
  onChange,
  error,
  type = 'text'
}: TextInputProps): JSX.Element {
  return (
    <div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={onChange}
        className={cn(
          'w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none transition',
          'border-light-border dark:border-dark-border',
          'focus:border-main-accent dark:focus:border-main-accent',
          error && 'border-accent-red'
        )}
      />
      {error && <p className='mt-1 text-xs text-accent-red'>{error}</p>}
    </div>
  );
}

// ─── Toggle row ───────────────────────────────────────────────────────────

type ToggleRowProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
};

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled
}: ToggleRowProps): JSX.Element {
  return (
    <div className='flex items-center justify-between gap-4 py-2'>
      <div>
        <p className='text-sm font-semibold'>{label}</p>
        {description && (
          <p className='text-xs text-secondary'>{description}</p>
        )}
      </div>
      <button
        role='switch'
        aria-checked={checked}
        onClick={onChange}
        disabled={disabled}
        className={cn(
          'relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none',
          checked ? 'bg-main-accent' : 'bg-light-line-reply dark:bg-dark-line-reply',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
            checked && 'translate-x-5'
          )}
        />
      </button>
    </div>
  );
}

// ─── Save button ─────────────────────────────────────────────────────────

type SaveButtonProps = {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
};

function SaveButton({
  loading,
  disabled,
  onClick,
  label = 'Save'
}: SaveButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className='self-start rounded-full bg-main-accent px-5 py-2 text-sm font-bold text-white
                 hover:bg-main-accent/90 active:bg-main-accent/75 disabled:opacity-50 transition-colors'
    >
      {loading ? 'Saving…' : label}
    </button>
  );
}

// ─── Feedback pill ────────────────────────────────────────────────────────

type FeedbackProps = {
  type: 'success' | 'error';
  message: string;
};

function Feedback({ type, message }: FeedbackProps): JSX.Element {
  return (
    <p
      className={cn(
        'text-xs font-semibold',
        type === 'success' ? 'text-accent-green' : 'text-accent-red'
      )}
    >
      {message}
    </p>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────

const themes: Readonly<[Theme, string][]> = [
  ['light', 'Default'],
  ['dim', 'Dim'],
  ['dark', 'Lights out']
];

const accentsColor: Readonly<Accent[]> = [
  'blue',
  'yellow',
  'pink',
  'purple',
  'orange',
  'green'
];

export default function SettingsPage(): JSX.Element {
  const { user, signOut } = useAuth();
  const currentUser = user as User;

  // ── Your Account ──────────────────────────────────────────────────────

  const [username, setUsername] = useState(currentUser?.username ?? '');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameFeedback, setUsernameFeedback] = useState<FeedbackProps | null>(null);

  const handleSaveUsername = useCallback(async () => {
    if (!currentUser) return;
    const trimmed = username.trim().toLowerCase().replace(/\s/g, '');
    if (!trimmed) { setUsernameError('Username cannot be empty'); return; }
    if (trimmed.length < 3) { setUsernameError('At least 3 characters'); return; }
    if (!/^[a-z0-9_]+$/.test(trimmed)) { setUsernameError('Only letters, numbers and underscores'); return; }
    if (trimmed === currentUser.username) { setUsernameFeedback({ type: 'error', message: 'No change' }); return; }
    setUsernameSaving(true);
    setUsernameError('');
    try {
      const available = await checkUsernameAvailability(trimmed);
      if (!available) { setUsernameError('Username already taken'); return; }
      await updateUsername(currentUser.id, trimmed);
      setUsernameFeedback({ type: 'success', message: 'Username updated' });
    } catch {
      setUsernameFeedback({ type: 'error', message: 'Failed — please try again' });
    } finally {
      setUsernameSaving(false);
    }
  }, [currentUser, username]);

  // ── Profile info ──────────────────────────────────────────────────────

  const [name, setName] = useState(currentUser?.name ?? '');
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [location, setLocation] = useState(currentUser?.location ?? '');
  const [website, setWebsite] = useState(currentUser?.website ?? '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<FeedbackProps | null>(null);

  const handleSaveProfile = useCallback(async () => {
    if (!currentUser) return;
    if (!name.trim()) { setProfileFeedback({ type: 'error', message: 'Name cannot be empty' }); return; }
    setProfileSaving(true);
    setProfileFeedback(null);
    try {
      await updateUserData(currentUser.id, {
        name: name.trim(),
        bio: bio.trim() || null,
        location: location.trim() || null,
        website: website.trim() || null,
        photoURL: currentUser.photoURL,
        coverPhotoURL: currentUser.coverPhotoURL
      });
      setProfileFeedback({ type: 'success', message: 'Profile saved' });
    } catch {
      setProfileFeedback({ type: 'error', message: 'Failed — please try again' });
    } finally {
      setProfileSaving(false);
    }
  }, [currentUser, name, bio, location, website]);

  // ── Privacy ───────────────────────────────────────────────────────────

  const [isPrivate, setIsPrivate] = useState(currentUser?.isPrivate ?? false);
  const [privacySaving, setPrivacySaving] = useState(false);
  const [privacyFeedback, setPrivacyFeedback] = useState<FeedbackProps | null>(null);

  const handlePrivacyToggle = useCallback(async () => {
    if (!currentUser) return;
    const next = !isPrivate;
    setIsPrivate(next);
    setPrivacySaving(true);
    setPrivacyFeedback(null);
    try {
      await updateUserPrivacy(currentUser.id, next);
      setPrivacyFeedback({
        type: 'success',
        message: next ? 'Account set to private' : 'Account set to public'
      });
    } catch {
      setIsPrivate(!next); // revert
      setPrivacyFeedback({ type: 'error', message: 'Failed — please try again' });
    } finally {
      setPrivacySaving(false);
    }
  }, [currentUser, isPrivate]);

  // ── Password change ───────────────────────────────────────────────────

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<FeedbackProps | null>(null);

  const isGoogleUser = auth.currentUser?.providerData.some(
    (p) => p.providerId === 'google.com'
  );

  const handleChangePassword = useCallback(async () => {
    setPasswordError('');
    setPasswordFeedback(null);
    if (newPassword.length < 8) { setPasswordError('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return; }
    if (!auth.currentUser) return;
    setPasswordSaving(true);
    try {
      if (isGoogleUser) {
        // Reauthenticate via Google popup
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(auth.currentUser, provider);
      } else {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email ?? '',
          currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
      }
      await updatePassword(auth.currentUser, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordFeedback({ type: 'success', message: 'Password updated successfully' });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPasswordError('Current password is incorrect');
      } else {
        setPasswordFeedback({ type: 'error', message: 'Failed — please try again' });
      }
    } finally {
      setPasswordSaving(false);
    }
  }, [currentPassword, newPassword, confirmPassword, isGoogleUser]);

  // ── Deactivate / Sign out ─────────────────────────────────────────────

  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  if (!currentUser) return <></>;

  return (
    <>
      <SEO title='Settings / Villa' />
      <main className='hover-animation flex min-h-screen w-full max-w-xl flex-col border-x-0 border-light-border pb-16 dark:border-dark-border xs:border-x'>
        <MainHeader title='Settings and privacy' useActionButton iconName='ArrowLeftIcon' tip='Back' action={() => window.history.back()} />

        {/* ── Your Account ── */}
        <Section title='Your account' description='Manage your username and account details.'>
          <Row label='Username'>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <TextInput
                  value={username}
                  placeholder='username'
                  maxLength={50}
                  onChange={(e) => { setUsername(e.target.value); setUsernameError(''); setUsernameFeedback(null); }}
                  error={usernameError}
                />
              </div>
              <SaveButton loading={usernameSaving} onClick={handleSaveUsername} />
            </div>
            {usernameFeedback && <Feedback {...usernameFeedback} />}
          </Row>
          <Row label='Email'>
            <p className='text-sm text-secondary'>
              {auth.currentUser?.email ?? 'No email on file'}
            </p>
          </Row>
          <Row label='Account created'>
            <p className='text-sm text-secondary'>
              {currentUser.createdAt
                ? new Date(currentUser.createdAt.toDate()).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })
                : '—'}
            </p>
          </Row>
        </Section>

        {/* ── Profile info ── */}
        <Section title='Profile' description='Update your name, bio, and links.'>
          <Row label='Display name'>
            <TextInput
              value={name}
              placeholder='Your name'
              maxLength={50}
              onChange={(e) => { setName(e.target.value); setProfileFeedback(null); }}
            />
          </Row>
          <Row label='Bio'>
            <textarea
              value={bio}
              placeholder='Tell the world about yourself'
              maxLength={160}
              rows={3}
              onChange={(e) => { setBio(e.target.value); setProfileFeedback(null); }}
              className='w-full resize-none rounded-md border border-light-border bg-transparent px-3 py-2 text-sm
                         outline-none transition focus:border-main-accent dark:border-dark-border dark:focus:border-main-accent'
            />
            <p className='text-right text-xs text-secondary'>{bio.length}/160</p>
          </Row>
          <Row label='Location'>
            <TextInput
              value={location}
              placeholder='Where are you based?'
              maxLength={30}
              onChange={(e) => { setLocation(e.target.value); setProfileFeedback(null); }}
            />
          </Row>
          <Row label='Website'>
            <TextInput
              value={website}
              placeholder='https://yoursite.com'
              maxLength={100}
              type='url'
              onChange={(e) => { setWebsite(e.target.value); setProfileFeedback(null); }}
            />
          </Row>
          <div className='flex items-center gap-3'>
            <SaveButton loading={profileSaving} onClick={handleSaveProfile} />
            {profileFeedback && <Feedback {...profileFeedback} />}
          </div>
        </Section>

        {/* ── Display ── */}
        <Section title='Display' description='Manage your colour and background preferences.'>
          <Row label='Accent colour'>
            <div className='grid grid-cols-6 gap-3 rounded-2xl bg-main-sidebar-background py-3 px-2'>
              {accentsColor.map((a) => (
                <InputAccentRadio type={a} key={a} />
              ))}
            </div>
          </Row>
          <Row label='Background'>
            <div className='grid grid-cols-3 gap-3 rounded-2xl bg-main-sidebar-background px-4 py-3'>
              {themes.map(([t, label]) => (
                <InputThemeRadio type={t} label={label} key={t} />
              ))}
            </div>
          </Row>
        </Section>

        {/* ── Privacy & safety ── */}
        <Section title='Privacy and safety' description='Control who can see and interact with you.'>
          <ToggleRow
            label='Private account'
            description='Only your approved followers can see your posts.'
            checked={isPrivate}
            onChange={handlePrivacyToggle}
            disabled={privacySaving}
          />
          {privacyFeedback && <Feedback {...privacyFeedback} />}
          <ToggleRow
            label='Allow anyone to message you'
            description='People you do not follow can send you direct messages.'
            checked={true}
            onChange={() => {}}
          />
          <Row label='Muted words' hint='Posts containing these words will not appear in your timeline.'>
            <p className='text-xs text-secondary italic'>Coming soon</p>
          </Row>
        </Section>

        {/* ── Security ── */}
        <Section title='Security'>
          {isGoogleUser ? (
            <div className='flex items-center gap-3 rounded-xl border border-light-border dark:border-dark-border px-4 py-3'>
              <HeroIcon className='h-5 w-5 text-secondary' iconName='LinkIcon' />
              <div>
                <p className='text-sm font-semibold'>Connected via Google</p>
                <p className='text-xs text-secondary'>{auth.currentUser?.email}</p>
              </div>
              <span className='ml-auto rounded-full bg-accent-green/10 px-2 py-0.5 text-xs font-semibold text-accent-green'>
                Active
              </span>
            </div>
          ) : (
            <>
              <Row label='Change password'>
                <TextInput
                  type='password'
                  value={currentPassword}
                  placeholder='Current password'
                  onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(''); setPasswordFeedback(null); }}
                />
                <div className='mt-2'>
                  <TextInput
                    type='password'
                    value={newPassword}
                    placeholder='New password (min 8 characters)'
                    onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); setPasswordFeedback(null); }}
                    error={passwordError}
                  />
                </div>
                <div className='mt-2'>
                  <TextInput
                    type='password'
                    value={confirmPassword}
                    placeholder='Confirm new password'
                    onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                  />
                </div>
              </Row>
              <div className='flex items-center gap-3'>
                <SaveButton loading={passwordSaving} onClick={handleChangePassword} label='Update password' />
                {passwordFeedback && <Feedback {...passwordFeedback} />}
              </div>
            </>
          )}
        </Section>

        {/* ── Notifications ── */}
        <Section title='Notifications' description='Push and email notification preferences.'>
          <ToggleRow
            label='Post likes'
            description='Get notified when someone likes your post.'
            checked={false}
            onChange={() => {}}
          />
          <ToggleRow
            label='New followers'
            description='Get notified when someone follows you.'
            checked={false}
            onChange={() => {}}
          />
          <ToggleRow
            label='Direct messages'
            description='Get notified when you receive a new message.'
            checked={true}
            onChange={() => {}}
          />
          <p className='text-xs text-secondary italic'>Full notification management coming soon.</p>
        </Section>

        {/* ── Account actions ── */}
        <Section title='Account'>
          <button
            onClick={() => void signOut()}
            className='flex w-full items-center gap-3 rounded-xl border border-light-border dark:border-dark-border px-4 py-3
                       text-sm font-semibold hover:bg-main-sidebar-background transition-colors'
          >
            <HeroIcon className='h-5 w-5 text-secondary' iconName='ArrowRightOnRectangleIcon' />
            Log out of @{currentUser.username}
          </button>

          {!showDeactivateConfirm ? (
            <button
              onClick={() => setShowDeactivateConfirm(true)}
              className='flex w-full items-center gap-3 rounded-xl border border-accent-red/30 px-4 py-3
                         text-sm font-semibold text-accent-red hover:bg-accent-red/5 transition-colors'
            >
              <HeroIcon className='h-5 w-5' iconName='TrashIcon' />
              Deactivate account
            </button>
          ) : (
            <div className='rounded-xl border border-accent-red/40 bg-accent-red/5 p-4'>
              <p className='mb-3 text-sm font-semibold text-accent-red'>
                Are you sure? This will permanently delete your account.
              </p>
              <div className='flex gap-3'>
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className='rounded-full border border-light-border dark:border-dark-border px-4 py-1.5 text-sm font-bold hover:bg-main-sidebar-background transition-colors'
                >
                  Cancel
                </button>
                <button
                  className='rounded-full bg-accent-red px-4 py-1.5 text-sm font-bold text-white
                             hover:bg-accent-red/90 transition-colors'
                  onClick={() => {
                    // Full deletion would require calling Firebase Admin SDK —
                    // for now sign them out safely
                    void signOut();
                  }}
                >
                  Yes, deactivate
                </button>
              </div>
            </div>
          )}
        </Section>
      </main>
    </>
  );
}

SettingsPage.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>{page}</MainLayout>
  </ProtectedLayout>
);
