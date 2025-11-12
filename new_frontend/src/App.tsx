import { useState, useEffect } from 'react';
import { Email, EmailFolder, EmailLabel } from './types';
import { mockEmails } from './mockData';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import ComposeEmail from './components/ComposeEmail';
import Header from './components/Header';
import { fetchGmailEmails, starEmail as gmailStarEmail, markAsRead as gmailMarkAsRead, deleteEmail as gmailDeleteEmail, sendEmail as gmailSendEmail } from './services/gmailService';

function App() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedFolder, setSelectedFolder] = useState<EmailFolder>('inbox');
  const [selectedLabel, setSelectedLabel] = useState<EmailLabel | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [useRealData, setUseRealData] = useState(false);

  // Load Gmail emails on mount
  useEffect(() => {
    if (useRealData) {
      loadGmailEmails();
    }
  }, [useRealData]);

  const loadGmailEmails = async () => {
    setIsLoading(true);
    try {
      const gmailEmails = await fetchGmailEmails(50);
      setEmails(gmailEmails);
    } catch (error) {
      console.error('Failed to load Gmail emails:', error);
      alert('Failed to load Gmail emails. Using mock data instead.');
      setUseRealData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  const filteredEmails = emails.filter(email => {
    // Filter by label first
    if (selectedLabel) {
      if (!email.labels.includes(selectedLabel)) return false;
    }

    // Filter by folder
    if (selectedFolder === 'all') {
      // Show all emails except trash
      if (email.folder === 'trash') return false;
    } else if (selectedFolder === 'starred') {
      // Show starred emails from all folders except trash
      if (!email.isStarred || email.folder === 'trash') return false;
    } else {
      // Show emails in specific folder
      if (email.folder !== selectedFolder) return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        email.subject.toLowerCase().includes(query) ||
        email.from.name.toLowerCase().includes(query) ||
        email.from.email.toLowerCase().includes(query) ||
        email.snippet.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleToggleStar = async (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (!email) return;

    const newStarred = !email.isStarred;
    
    // Optimistic update
    setEmails(prev => prev.map(e =>
      e.id === emailId ? { ...e, isStarred: newStarred } : e
    ));

    if (useRealData) {
      try {
        await gmailStarEmail(emailId, newStarred);
      } catch (error) {
        console.error('Failed to star email:', error);
        // Revert on error
        setEmails(prev => prev.map(e =>
          e.id === emailId ? { ...e, isStarred: !newStarred } : e
        ));
      }
    }
  };

  const handleMarkAsRead = async (emailId: string, isRead: boolean) => {
    // Optimistic update
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isRead } : email
    ));

    if (useRealData) {
      try {
        await gmailMarkAsRead(emailId, isRead);
      } catch (error) {
        console.error('Failed to mark as read:', error);
        // Revert on error
        setEmails(prev => prev.map(email =>
          email.id === emailId ? { ...email, isRead: !isRead } : email
        ));
      }
    }
  };

  const handleDeleteEmail = async (emailId: string) => {
    // Optimistic update
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, folder: 'trash' as EmailFolder } : email
    ));
    setSelectedEmailId(null);

    if (useRealData) {
      try {
        await gmailDeleteEmail(emailId);
      } catch (error) {
        console.error('Failed to delete email:', error);
      }
    }
  };

  const handleArchiveEmail = (emailId: string) => {
    // In real app, move to 'all' folder
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, folder: 'all' } : email
    ));
    setSelectedEmailId(null);
  };

  const handleSendEmail = async (emailData: Partial<Email>) => {
    if (useRealData && emailData.to && emailData.subject && emailData.body) {
      try {
        await gmailSendEmail(emailData.to, emailData.subject, emailData.body);
        alert('Email sent successfully!');
        setIsComposing(false);
        // Reload emails to show sent email
        await loadGmailEmails();
      } catch (error) {
        console.error('Failed to send email:', error);
        alert('Failed to send email');
      }
    } else {
      // Mock send
      const newEmail: Email = {
        id: `sent_${Date.now()}`,
        from: {
          name: 'Me',
          email: 'me@gmail.com',
        },
        to: emailData.to || [],
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject || '(No subject)',
        body: emailData.body || '',
        snippet: emailData.body?.replace(/<[^>]*>/g, '').substring(0, 100) || '',
        date: new Date(),
        isRead: true,
        isStarred: false,
        labels: [],
        hasAttachments: false,
        folder: 'sent'
      };

      setEmails(prev => [newEmail, ...prev]);
      setIsComposing(false);
    }
  };

  const handleSaveDraft = (emailData: Partial<Email>) => {
    const draftEmail: Email = {
      id: `draft_${Date.now()}`,
      from: {
        name: 'Me',
        email: 'me@gmail.com',
        avatar: '👤'
      },
      to: emailData.to || [],
      cc: emailData.cc,
      bcc: emailData.bcc,
      subject: emailData.subject || '(No subject)',
      body: emailData.body || '',
      snippet: emailData.body?.replace(/<[^>]*>/g, '').substring(0, 100) || '',
      date: new Date(),
      isRead: true,
      isStarred: false,
      labels: [],
      hasAttachments: false,
      folder: 'drafts',
      isDraft: true
    };

    setEmails(prev => [draftEmail, ...prev]);
    setIsComposing(false);
  };

  const handleToggleSelect = (emailId: string) => {
    setSelectedEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(emailId)) {
        newSet.delete(emailId);
      } else {
        newSet.add(emailId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedEmails.size === filteredEmails.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(filteredEmails.map(e => e.id)));
    }
  };

  const handleBulkDelete = () => {
    setEmails(prev => prev.map(email =>
      selectedEmails.has(email.id) ? { ...email, folder: 'trash' } : email
    ));
    setSelectedEmails(new Set());
    setSelectedEmailId(null);
  };

  const handleBulkMarkAsRead = (isRead: boolean) => {
    setEmails(prev => prev.map(email =>
      selectedEmails.has(email.id) ? { ...email, isRead } : email
    ));
    setSelectedEmails(new Set());
  };

  const unreadCount = emails.filter(e => e.folder === 'inbox' && !e.isRead).length;

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCompose={() => setIsComposing(true)}
      />

      {/* Toggle between Mock Data and Real Gmail Data */}
      <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Data Source:</span>
          <button
            onClick={() => {
              setUseRealData(!useRealData);
              if (!useRealData) {
                setEmails(mockEmails);
              }
            }}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
              useRealData 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {useRealData ? '✓ Gmail API (Real Data)' : 'Mock Data'}
          </button>
          {useRealData && (
            <button
              onClick={loadGmailEmails}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : '🔄 Refresh'}
            </button>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {emails.length} emails loaded
        </span>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedFolder={selectedFolder}
          selectedLabel={selectedLabel}
          onSelectFolder={(folder: EmailFolder) => {
            setSelectedFolder(folder);
            setSelectedLabel(null);
            setSelectedEmailId(null);
          }}
          onSelectLabel={(label: EmailLabel | null) => {
            setSelectedLabel(label);
            setSelectedEmailId(null);
          }}
          unreadCount={unreadCount}
        />

        <EmailList
          emails={filteredEmails}
          selectedEmailId={selectedEmailId}
          selectedEmails={selectedEmails}
          onSelectEmail={setSelectedEmailId}
          onToggleStar={handleToggleStar}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onBulkDelete={handleBulkDelete}
          onBulkMarkAsRead={handleBulkMarkAsRead}
        />

        {selectedEmail && (
          <EmailDetail
            email={selectedEmail}
            onClose={() => setSelectedEmailId(null)}
            onDelete={handleDeleteEmail}
            onArchive={handleArchiveEmail}
            onToggleStar={handleToggleStar}
            onMarkAsRead={handleMarkAsRead}
          />
        )}
      </div>

      {isComposing && (
        <ComposeEmail
          onClose={() => setIsComposing(false)}
          onSend={handleSendEmail}
          onSaveDraft={handleSaveDraft}
        />
      )}
    </div>
  );
}

export default App;
