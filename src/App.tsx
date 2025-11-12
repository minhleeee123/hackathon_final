import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Mail, CheckSquare, Settings } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import EmailInboxPage from './components/EmailInboxPage';
import TaskManagementPage from './components/TaskManagementPage';
import UserSettingsPage from './components/UserSettingsPage';
import { mockEmails, mockTasks, Email, Task } from './lib/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('emails');
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-blue-600">📧 Email AI Assistant</h1>
          <p className="text-gray-600">Hệ thống xử lý email thông minh với 3 Agent AI</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Hộp thư đến</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span>Quản lý Task</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Cài đặt cá nhân</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emails">
            <EmailInboxPage emails={emails} setEmails={setEmails} />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManagementPage tasks={tasks} setTasks={setTasks} />
          </TabsContent>

          <TabsContent value="settings">
            <UserSettingsPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
