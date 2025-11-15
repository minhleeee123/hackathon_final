import { useState, useEffect } from 'react';
import { Email, EmailFolder, GmailLabel, Task, TaskStatus, PaymentItem, AccountMode, WalletState } from './types';
import { mockEmails, mockGmailLabels } from './mockData';
import { mockBusinessEmails, mockBusinessLabels } from './mockDataBusiness';
import { mockNeoEmails } from './mockDataNeo';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import ComposeEmail from './components/ComposeEmail';
import LabelManager from './components/LabelManager';
import Header from './components/Header';
import TaskManagementPage from './components/TaskManagementPage';
import FinanceManagementPage from './components/FinanceManagementPage';
import ContractAnalyzer from './components/ContractAnalyzer';
import SettingsModal from './components/SettingsModal';
import { useTheme } from './components/ThemeProvider';
import { 
  fetchGmailEmails, 
  fetchGmailLabels,
  starEmail as gmailStarEmail, 
  markAsRead as gmailMarkAsRead, 
  deleteEmail as gmailDeleteEmail, 
  sendEmail as gmailSendEmail,
  addLabelToEmail as gmailAddLabel,
  removeLabelFromEmail as gmailRemoveLabel,
  createLabel as gmailCreateLabel,
  deleteLabel as gmailDeleteLabel,
  initializeAILabels
} from './services/gmailService';
import { BulkClassificationResult, TASK_LABEL, classifyEmailsBulk } from './services/unifiedAIService';
import { extractTasksBulk, TaskExtractionResult } from './services/unifiedAIService';
import { 
  connectNeoLineWallet, 
  disconnectWallet, 
  restoreWalletState, 
  isNeoLineInstalled 
} from './services/walletService';

function App() {
  const { theme } = useTheme();
  // Combine personal mock data with NEO hackathon data
  const [emails, setEmails] = useState<Email[]>([...mockNeoEmails, ...mockEmails]);
  const [gmailLabels, setGmailLabels] = useState<GmailLabel[]>(mockGmailLabels);
  const [selectedFolder, setSelectedFolder] = useState<EmailFolder>('inbox');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isManagingLabels, setIsManagingLabels] = useState(false);
  const [replyData, setReplyData] = useState<{
    to: string[];
    cc?: string[];
    subject: string;
    body: string;
    mode: 'reply' | 'replyAll' | 'forward';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [accountMode, setAccountMode] = useState<AccountMode>('personal');
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationProgress, setClassificationProgress] = useState({ current: 0, total: 0 });
  const [aiLabelsInitialized, setAiLabelsInitialized] = useState(false);
  const [mockLabelsVisible, setMockLabelsVisible] = useState(false); // Track if mock labels should be shown
  const [classifiedEmailIds, setClassifiedEmailIds] = useState<Set<string>>(new Set()); // Track which emails have been classified
  
  // Task Management state
  const [currentTab, setCurrentTab] = useState<'emails' | 'tasks' | 'finance' | 'contracts'>('emails');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExtractingTasks, setIsExtractingTasks] = useState(false);
  const [taskExtractionProgress, setTaskExtractionProgress] = useState({ current: 0, total: 0 });

  // Finance Management state
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isExtractingPayments, setIsExtractingPayments] = useState(false);
  const [paymentExtractionProgress, setPaymentExtractionProgress] = useState({ current: 0, total: 0 });

  // Contract Analyzer state
  const [contractsAnalyzed, setContractsAnalyzed] = useState(false);
  const [isAnalyzingContracts, setIsAnalyzingContracts] = useState(false);
  const [contractAnalysisProgress, setContractAnalysisProgress] = useState({ current: 0, total: 0 });

  // NEO Wallet state
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    network: null,
    balance: null
  });

  // Restore wallet state on mount
  useEffect(() => {
    const restored = restoreWalletState();
    if (restored) {
      setWalletState(restored);
    }
  }, []);

  // Removed auto-load effect - only load when user explicitly toggles to real data
  
  // Initialize AI classification labels
  useEffect(() => {
    const initLabels = async () => {
      if (useRealData && !aiLabelsInitialized) {
        try {
          const result = await initializeAILabels();
          console.log('AI labels initialized:', result);
          setAiLabelsInitialized(true);
          
          // Reload labels to get the new ones
          const labelsData = await fetchGmailLabels();
          setGmailLabels(labelsData.labels);
        } catch (error) {
          console.error('Failed to initialize AI labels:', error);
        }
      }
    };
    initLabels();
  }, [useRealData, aiLabelsInitialized]);

  const loadGmailData = async () => {
    setIsLoading(true);
    try {
      const [gmailEmails, labelsData] = await Promise.all([
        fetchGmailEmails(50),
        fetchGmailLabels()
      ]);
      setEmails(gmailEmails);
      setGmailLabels(labelsData.labels);
    } catch (error) {
      console.error('Failed to load Gmail data:', error);
      alert('Failed to load Gmail data. Using mock data instead.');
      setUseRealData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenContractAnalyzer = async () => {
    // If already analyzed, do nothing
    if (contractsAnalyzed) {
      return;
    }
    
    // Start analysis simulation
    setIsAnalyzingContracts(true);
    setContractAnalysisProgress({ current: 0, total: 6 });
    
    try {
      // Simulate AI contract analysis with progress
      for (let i = 1; i <= 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 800)); // 800ms per contract
        setContractAnalysisProgress({ current: i, total: 6 });
      }
      
      // Mark as analyzed
      setContractsAnalyzed(true);
    } catch (error) {
      console.error('Contract analysis failed:', error);
    } finally {
      setIsAnalyzingContracts(false);
    }
  };
  
  const handleToggleAccountMode = () => {
    const newMode: AccountMode = accountMode === 'personal' ? 'business' : 'personal';
    setAccountMode(newMode);
    
    // Switch to appropriate mock data
    if (!useRealData) {
      if (newMode === 'business') {
        setEmails(mockBusinessEmails);
        setGmailLabels(mockBusinessLabels);
      } else {
        // Personal mode: combine NEO emails with regular mock data
        setEmails([...mockNeoEmails, ...mockEmails]);
        setGmailLabels(mockGmailLabels);
      }
      // Reset UI state
      setSelectedEmails(new Set());
      setSelectedEmailId(null);
      setMockLabelsVisible(false);
      setClassifiedEmailIds(new Set());
    }
    // For real data, labels will be managed by Gmail API
  };

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  // For mock data demo: hide labels until classification is run
  const displayEmails = useRealData
    ? emails 
    : emails.map(email => ({
        ...email,
        labels: mockLabelsVisible || classifiedEmailIds.has(email.id) ? email.labels : []
      }));

  const filteredEmails = displayEmails.filter(email => {
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

  // NEO Wallet handlers
  const handleConnectWallet = async () => {
    if (!isNeoLineInstalled()) {
      alert('NeoLine wallet chưa được cài đặt.\n\nVui lòng cài đặt NeoLine extension từ:\n- Chrome Web Store\n- Firefox Add-ons');
      window.open('https://neoline.io/', '_blank');
      return;
    }

    try {
      const connected = await connectNeoLineWallet();
      setWalletState(connected);
      alert(`Kết nối thành công!\n\nĐịa chỉ: ${connected.address}\nMạng: ${connected.network}`);
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      alert(`Lỗi kết nối ví: ${error.message}`);
    }
  };

  const handleDisconnectWallet = () => {
    if (confirm('Bạn có chắc chắn muốn ngắt kết nối ví NEO?')) {
      disconnectWallet();
      setWalletState({
        isConnected: false,
        address: null,
        network: null,
        balance: null
      });
      alert('Đã ngắt kết nối ví NEO');
    }
  };

  const handleSendEmail = async (emailData: Partial<Email>) => {
    if (useRealData && emailData.to && emailData.subject && emailData.body) {
      try {
        await gmailSendEmail(emailData.to, emailData.subject, emailData.body);
        alert('Email sent successfully!');
        setIsComposing(false);
        setReplyData(null);
        // Reload emails to show sent email
        await loadGmailData();
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

  const handleSendReply = async (to: string[], _cc: string[] | undefined, subject: string, body: string) => {
    if (useRealData) {
      try {
        await gmailSendEmail(to, subject, body);
        alert('Reply sent successfully!');
        // Reload emails to show sent reply
        await loadGmailData();
      } catch (error) {
        console.error('Failed to send reply:', error);
        alert('Failed to send reply');
      }
    }
  };

  const handleToggleSelect = (emailId: string) => {
    console.log('handleToggleSelect called with emailId:', emailId);
    setSelectedEmails(prev => {
      const newSet = new Set(prev);
      console.log('Previous selected emails:', Array.from(prev));
      if (newSet.has(emailId)) {
        newSet.delete(emailId);
        console.log('Removing emailId from selection');
      } else {
        newSet.add(emailId);
        console.log('Adding emailId to selection');
      }
      console.log('New selected emails:', Array.from(newSet));
      return newSet;
    });
  };

  const handleSelectAll = () => {
    console.log('handleSelectAll called');
    console.log('Current selectedEmails.size:', selectedEmails.size);
    console.log('filteredEmails.length:', filteredEmails.length);
    if (selectedEmails.size === filteredEmails.length) {
      console.log('Clearing all selections');
      setSelectedEmails(new Set());
    } else {
      console.log('Selecting all filtered emails');
      const allIds = filteredEmails.map(e => e.id);
      console.log('All IDs to select:', allIds);
      setSelectedEmails(new Set(allIds));
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

  const handleMoveSpamToTrash = () => {
    const spamLabelName = 'Spam & Quảng cáo';
    const spamEmails = emails.filter(email => 
      email.labels.some(label => {
        const labelObj = gmailLabels.find(l => l.id === label);
        return labelObj?.name === spamLabelName;
      })
    );
    
    if (spamEmails.length === 0) {
      alert('Không tìm thấy email nào có tag "Spam & Quảng cáo"');
      return;
    }

    const confirmMove = window.confirm(`Bạn có chắc chắn muốn chuyển ${spamEmails.length} email spam vào thùng rác?`);
    
    if (confirmMove) {
      setEmails(prev => prev.map(email => {
        const isSpam = email.labels.some(label => {
          const labelObj = gmailLabels.find(l => l.id === label);
          return labelObj?.name === spamLabelName;
        });
        return isSpam ? { ...email, folder: 'trash' } : email;
      }));
      alert(`Đã chuyển ${spamEmails.length} email spam vào thùng rác`);
    }
  };

  // AI Classification handlers
  const handleBulkClassify = async () => {
    // For mock data: just toggle label visibility (no API call)
    if (!useRealData) {
      setIsClassifying(true);
      const emailsToClassify = Array.from(selectedEmails)
        .map(id => emails.find(e => e.id === id)!)
        .filter(Boolean);
      
      setClassificationProgress({ current: 0, total: emailsToClassify.length });
      
      // Simulate AI processing animation - update progress gradually
      for (let i = 0; i < emailsToClassify.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms per email
        setClassificationProgress({ current: i + 1, total: emailsToClassify.length });
      }
      
      // Show labels after animation completes - only for classified emails
      setClassifiedEmailIds(prev => {
        const newSet = new Set(prev);
        emailsToClassify.forEach(email => newSet.add(email.id));
        return newSet;
      });
      setIsClassifying(false);
      setClassificationProgress({ current: 0, total: 0 });
      setSelectedEmails(new Set()); // Clear selection
      return;
    }

    // For real data: call API for classification
    setIsClassifying(true);
    setClassificationProgress({ current: 0, total: selectedEmails.size });

    try {
      const emailsToClassify = Array.from(selectedEmails)
        .map(id => emails.find(e => e.id === id)!)
        .filter(Boolean);

      const results = await classifyEmailsBulk(
        emailsToClassify,
        (current, total) => {
          setClassificationProgress({ current, total });
        },
        false // useFastMode = false for real data
      );

      await handleClassificationComplete(results);
    } catch (error) {
      console.error('Classification failed:', error);
    } finally {
      setIsClassifying(false);
      setClassificationProgress({ current: 0, total: 0 });
    }
  };

  // Task Extraction handlers
  const handleBulkExtractTasks = async () => {
    setIsExtractingTasks(true);
    
    // Get only selected emails
    const emailsToExtract = Array.from(selectedEmails)
      .map(id => emails.find(e => e.id === id)!)
      .filter(Boolean);
    
    if (emailsToExtract.length === 0) {
      alert('❌ Vui lòng chọn ít nhất 1 email!');
      setIsExtractingTasks(false);
      return;
    }
    
    setTaskExtractionProgress({ current: 0, total: emailsToExtract.length });

    try {
      const results = await extractTasksBulk(
        emailsToExtract,
        (current, total) => {
          setTaskExtractionProgress({ current, total });
        }
      );

      await handleTaskExtractionComplete(results);
      
      // Switch to Tasks tab to show extracted tasks
      setCurrentTab('tasks');
    } catch (error) {
      console.error('Task extraction failed:', error);
    } finally {
      setIsExtractingTasks(false);
      setTaskExtractionProgress({ current: 0, total: 0 });
    }
  };

  const handleTaskExtractionComplete = async (resultsMap: Map<string, TaskExtractionResult>) => {
    try {
      const newTasks: Task[] = [];
      const emailIdsWithTasks: string[] = [];

      for (const [emailId, result] of resultsMap.entries()) {
        if (result.hasTask && result.tasks.length > 0) {
          // Add tasks with metadata
          result.tasks.forEach(task => {
            newTasks.push({
              ...task,
              id: `task_${Date.now()}_${Math.random()}`,
              status: 'to-do' as TaskStatus,
              source: 'ai',
              emailId: emailId,
              createdAt: new Date().toISOString()
            });
          });
          
          emailIdsWithTasks.push(emailId);
        }
      }

      // Add new tasks to state
      setTasks(prev => [...prev, ...newTasks]);

      // Apply task label to emails with extracted tasks
      if (emailIdsWithTasks.length > 0 && useRealData) {
        const taskLabelId = gmailLabels.find(l => l.name === TASK_LABEL)?.id;
        if (taskLabelId) {
          for (const emailId of emailIdsWithTasks) {
            await handleAddLabel(emailId, [taskLabelId]);
          }
        }
      }

      // Clear selection and reload
      setSelectedEmails(new Set());
      if (useRealData) {
        await loadGmailData();
      }
      
      alert(`Trích xuất thành công ${newTasks.length} task từ ${emailIdsWithTasks.length} email!`);
    } catch (error) {
      console.error('Failed to save extracted tasks:', error);
    }
  };

  // Task Management handlers
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'source'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      source: 'user',
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  // ===== Finance Management Functions =====
  const handleCreatePayment = (newPayment: Omit<PaymentItem, 'id' | 'createdAt' | 'source'>) => {
    const payment: PaymentItem = {
      ...newPayment,
      id: `payment_${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: 'user'
    };
    setPayments(prev => [payment, ...prev]);
  };

  const handleUpdatePayment = (updatedPayment: PaymentItem) => {
    setPayments(prev => prev.map(p => p.id === updatedPayment.id ? updatedPayment : p));
  };

  const handleDeletePayment = (paymentId: string) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId));
  };

  // Payment Extraction handlers
  const handleBulkExtractPayments = async () => {
    setIsExtractingPayments(true);
    
    // Get only selected emails
    const emailsToExtract = Array.from(selectedEmails)
      .map(id => emails.find(e => e.id === id)!)
      .filter(Boolean);
    
    if (emailsToExtract.length === 0) {
      alert('❌ Vui lòng chọn ít nhất 1 email!');
      setIsExtractingPayments(false);
      return;
    }
    
    setPaymentExtractionProgress({ current: 0, total: emailsToExtract.length });

    try {
      const { extractPaymentInfo } = await import('./services/aiService');
      let current = 0;

      for (const email of emailsToExtract) {
        current++;
        setPaymentExtractionProgress({ current, total: emailsToExtract.length });

        try {
          const paymentInfo = await extractPaymentInfo(email);
          
          const payment: PaymentItem = {
            id: `payment_${Date.now()}_${Math.random()}`,
            ...paymentInfo,
            status: 'unpaid',
            source: 'ai',
            emailId: email.id,
            createdAt: new Date().toISOString()
          };

          setPayments(prev => [payment, ...prev]);
        } catch (error) {
          console.error(`Failed to extract payment from email ${email.id}:`, error);
        }

        // Wait 1 second between requests to avoid rate limiting
        if (current < emailsToExtract.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Clear selection
      setSelectedEmails(new Set());
      
      // Switch to Finance tab
      setCurrentTab('finance');
      
      alert(`Trích xuất thành công ${emailsToExtract.length} khoản thanh toán từ email đã chọn!`);
    } catch (error) {
      console.error('Payment extraction failed:', error);
      alert('❌ Có lỗi xảy ra khi trích xuất payment!');
    } finally {
      setIsExtractingPayments(false);
      setPaymentExtractionProgress({ current: 0, total: 0 });
    }
  };

  const handleClassificationComplete = async (results: BulkClassificationResult[]) => {
    try {
      // For mock data, just show labels immediately without processing
      if (!useRealData) {
        setMockLabelsVisible(true);
        setSelectedEmails(new Set());
        return;
      }

      // Real data processing
      // Helper to find label ID by name
      const findLabelId = (labelName: string): string | null => {
        const label = gmailLabels.find(l => l.name === labelName);
        console.log(`Finding label "${labelName}":`, label ? `Found ID=${label.id}` : 'NOT FOUND');
        return label?.id || null;
      };

      console.log('Available labels:', gmailLabels.map(l => ({ id: l.id, name: l.name })));
      console.log('Classification results:', results);

      // Apply labels to each successfully classified email
      for (const result of results) {
        if (result.success && result.classification) {
          console.log(`Email ${result.emailId} classification:`, {
            category: result.classification.category,
            gmailLabel: result.classification.gmailLabel,
            hasTask: result.classification.hasTask,
            needsTaskLabel: result.classification.needsTaskLabel
          });

          const labelIds: string[] = [];
          
          // Add main category label
          if (result.classification.gmailLabel) {
            const labelId = findLabelId(result.classification.gmailLabel);
            if (labelId) {
              console.log(`  -> Adding category label: ${result.classification.gmailLabel} (${labelId})`);
              labelIds.push(labelId);
            }
          }
          
          // Add task label if email contains task
          if (result.classification.needsTaskLabel) {
            const taskLabelId = findLabelId(TASK_LABEL);
            if (taskLabelId) {
              console.log(`  -> Adding task label: ${TASK_LABEL} (${taskLabelId})`);
              labelIds.push(taskLabelId);
            }
          }
          
          console.log(`  -> Total labels to apply:`, labelIds);
          
          // Apply labels
          if (labelIds.length > 0) {
            await handleAddLabel(result.emailId, labelIds);
          } else {
            console.warn(`No labels found for email ${result.emailId}`);
          }
        }
      }

      // Clear selection and reload
      setSelectedEmails(new Set());
      await loadGmailData();
      
    } catch (error) {
      console.error('Failed to apply classification labels:', error);
    } finally {
      setIsClassifying(false);
    }
  };

  // Label management functions
  const handleAddLabel = async (emailId: string, labelIds: string[]) => {
    if (!useRealData) return;

    // Optimistic update
    setEmails(prev => prev.map(email => {
      if (email.id === emailId) {
        const newLabels = [...new Set([...email.labels, ...labelIds])];
        return { ...email, labels: newLabels };
      }
      return email;
    }));

    try {
      await gmailAddLabel(emailId, labelIds);
    } catch (error) {
      console.error('Failed to add label:', error);
      // Revert on error
      setEmails(prev => prev.map(email => {
        if (email.id === emailId) {
          const newLabels = email.labels.filter(id => !labelIds.includes(id));
          return { ...email, labels: newLabels };
        }
        return email;
      }));
      throw error;
    }
  };

  const handleRemoveLabel = async (emailId: string, labelIds: string[]) => {
    if (!useRealData) return;

    // Optimistic update
    setEmails(prev => prev.map(email => {
      if (email.id === emailId) {
        const newLabels = email.labels.filter(id => !labelIds.includes(id));
        return { ...email, labels: newLabels };
      }
      return email;
    }));

    try {
      await gmailRemoveLabel(emailId, labelIds);
    } catch (error) {
      console.error('Failed to remove label:', error);
      // Revert on error
      setEmails(prev => prev.map(email => {
        if (email.id === emailId) {
          const newLabels = [...new Set([...email.labels, ...labelIds])];
          return { ...email, labels: newLabels };
        }
        return email;
      }));
      throw error;
    }
  };

  const handleCreateLabel = async (name: string, backgroundColor?: string) => {
    if (!useRealData) return;

    try {
      const color = backgroundColor ? {
        backgroundColor,
        textColor: '#ffffff'
      } : undefined;
      
      const newLabel = await gmailCreateLabel(name, color);
      console.log('New label created:', newLabel);
      
      // Reload labels from Gmail to ensure sync
      const labelsData = await fetchGmailLabels();
      setGmailLabels(labelsData.labels);
      console.log('Labels reloaded from Gmail, count:', labelsData.labels.length);
    } catch (error) {
      console.error('Failed to create label:', error);
      throw error;
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    if (!useRealData) return;

    try {
      await gmailDeleteLabel(labelId);
      
      // Reload labels from Gmail to ensure sync
      const labelsData = await fetchGmailLabels();
      setGmailLabels(labelsData.labels);
      
      // Remove label from all emails
      setEmails(prev => prev.map(email => ({
        ...email,
        labels: email.labels.filter(id => id !== labelId)
      })));
      console.log('Label deleted and labels reloaded from Gmail');
    } catch (error) {
      console.error('Failed to delete label:', error);
      throw error;
    }
  };

  const unreadCount = emails.filter(e => e.folder === 'inbox' && !e.isRead).length;

  return (
    <div className="h-screen flex flex-col transition-colors" style={{ backgroundColor: theme === 'dark' ? 'var(--background)' : '#f5f3ff', color: 'var(--foreground)' }}>
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCompose={() => setIsComposing(true)}
        useRealData={useRealData}
        onToggleDataSource={() => {
          const newUseRealData = !useRealData;
          setUseRealData(newUseRealData);
          if (newUseRealData) {
            // Load real data when toggled on
            loadGmailData();
          } else {
            // Switch back to mock data based on current mode
            if (accountMode === 'business') {
              setEmails(mockBusinessEmails);
              setGmailLabels(mockBusinessLabels);
            } else {
              // Personal mode: combine NEO emails with regular mock data
              setEmails([...mockNeoEmails, ...mockEmails]);
              setGmailLabels(mockGmailLabels);
            }
            setSelectedEmails(new Set());
            setSelectedEmailId(null);
            setMockLabelsVisible(false); // Reset label visibility for demo
            setClassifiedEmailIds(new Set()); // Reset classified emails
          }
        }}
        onRefreshData={loadGmailData}
        isLoading={isLoading}
        accountMode={accountMode}
        onToggleAccountMode={handleToggleAccountMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        walletState={walletState}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      {/* Tab Navigation */}
      <div className="transition-colors" style={{ borderBottom: '1px solid var(--border)', backgroundColor: theme === 'dark' ? '#0f172a' : '#f5f3ff' }}>
        <div className="flex items-center justify-between px-6">
          <div className="flex gap-6">
          <button
            onClick={() => setCurrentTab('emails')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 ${
              currentTab === 'emails'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-gray-700'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Emails
          </button>
          <button
            onClick={() => setCurrentTab('tasks')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 ${
              currentTab === 'tasks'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-gray-700'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Tasks
            {tasks.length > 0 && (
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">
                {tasks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('finance')}
            className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 ${
              currentTab === 'finance'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-gray-700'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            Finance
            {payments.length > 0 && (
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">
                {payments.length}
              </span>
            )}
          </button>
          {accountMode === 'business' && (
            <button
              onClick={() => setCurrentTab('contracts')}
              className={`py-3 px-4 font-medium transition-colors border-b-2 flex items-center gap-2 ${
                currentTab === 'contracts'
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-gray-700'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Contracts
              {contractsAnalyzed && (
                <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs">
                  6
                </span>
              )}
            </button>
          )}
          </div>
          
          <div className="text-xs text-gray-500 py-3">
            {emails.length} emails | {tasks.length} tasks | {payments.length} payments
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {currentTab === 'emails' ? (
          <>
            <Sidebar
              selectedFolder={selectedFolder}
              selectedLabel={selectedLabel}
              gmailLabels={gmailLabels}
              onSelectFolder={(folder: EmailFolder) => {
                setSelectedFolder(folder);
                setSelectedLabel(null);
                setSelectedEmailId(null);
              }}
              onSelectLabel={(label: string | null) => {
                setSelectedLabel(label);
                setSelectedEmailId(null);
              }}
              onManageLabels={() => setIsManagingLabels(true)}
              onCompose={() => setIsComposing(true)}
              unreadCount={unreadCount}
            />

            <EmailList
              emails={filteredEmails}
              selectedEmailId={selectedEmailId}
              selectedEmails={selectedEmails}
              gmailLabels={gmailLabels}
              onSelectEmail={setSelectedEmailId}
              onToggleStar={handleToggleStar}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onBulkDelete={handleBulkDelete}
              onBulkMarkAsRead={handleBulkMarkAsRead}
              onBulkClassify={handleBulkClassify}
              onBulkExtractTasks={handleBulkExtractTasks}
              onBulkExtractPayments={handleBulkExtractPayments}
              onMoveSpamToTrash={handleMoveSpamToTrash}
              onOpenContractAnalyzer={handleOpenContractAnalyzer}
              accountMode={accountMode}
              isClassifying={isClassifying}
              isExtractingTasks={isExtractingTasks}
              isExtractingPayments={isExtractingPayments}
              isAnalyzingContracts={isAnalyzingContracts}
              classificationProgress={classificationProgress}
              taskExtractionProgress={taskExtractionProgress}
              paymentExtractionProgress={paymentExtractionProgress}
              contractAnalysisProgress={contractAnalysisProgress}
            />

            {selectedEmail && (
              <EmailDetail
                email={selectedEmail}
                gmailLabels={gmailLabels}
                onClose={() => setSelectedEmailId(null)}
                onDelete={handleDeleteEmail}
                onArchive={handleArchiveEmail}
                onToggleStar={handleToggleStar}
                onMarkAsRead={handleMarkAsRead}
                onAddLabel={handleAddLabel}
                onRemoveLabel={handleRemoveLabel}
                onSendReply={handleSendReply}
              />
            )}
          </>
        ) : currentTab === 'tasks' ? (
          <TaskManagementPage
            tasks={tasks}
            emails={emails}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onCreateTask={handleCreateTask}
          />
        ) : currentTab === 'contracts' ? (
          <ContractAnalyzer 
            contractsAnalyzed={contractsAnalyzed}
            isAnalyzing={isAnalyzingContracts}
            analysisProgress={contractAnalysisProgress}
          />
        ) : currentTab === 'system-analyzer' ? (
          <SystemAnalyzer />
        ) : currentTab === 'contracts' ? (
          <ContractAnalyzer
            emails={emails}
            isAnalyzing={isAnalyzingContracts}
            onStartAnalysis={handleStartContractAnalysis}
            analysisProgress={contractAnalysisProgress}
            hasAnalyzed={contractsAnalyzed}
          />
        ) : (
          <FinanceManagementPage
            payments={payments}
            emails={emails}
            onUpdatePayment={handleUpdatePayment}
            onDeletePayment={handleDeletePayment}
            onCreatePayment={handleCreatePayment}
            walletState={walletState}
            onConnectWallet={handleConnectWallet}
          />
        )}
      </div>

      {isComposing && (
        <ComposeEmail
          isOpen={isComposing}
          onClose={() => {
            setIsComposing(false);
            setReplyData(null);
          }}
          onSend={handleSendEmail}
          onSaveDraft={handleSaveDraft}
          replyTo={replyData || undefined}
        />
      )}

      {isManagingLabels && (
        <LabelManager
          isOpen={isManagingLabels}
          onClose={() => setIsManagingLabels(false)}
          gmailLabels={gmailLabels}
          onCreateLabel={handleCreateLabel}
          onDeleteLabel={handleDeleteLabel}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
