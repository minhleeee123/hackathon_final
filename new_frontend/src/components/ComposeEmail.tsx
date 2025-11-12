import { useState } from 'react';
import { X, Minimize2, Maximize2, Trash2, Paperclip, Send } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ComposeEmailProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
  }) => void;
  onSaveDraft: (email: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
  }) => void;
}

export default function ComposeEmail({
  isOpen,
  onClose,
  onSend,
  onSaveDraft,
}: ComposeEmailProps) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    onSend({
      to: to.split(',').map(e => e.trim()).filter(Boolean),
      cc: cc ? cc.split(',').map(e => e.trim()).filter(Boolean) : undefined,
      bcc: bcc ? bcc.split(',').map(e => e.trim()).filter(Boolean) : undefined,
      subject,
      body,
    });
    handleClose();
  };

  const handleSaveDraft = () => {
    onSaveDraft({
      to: to.split(',').map(e => e.trim()).filter(Boolean),
      cc: cc ? cc.split(',').map(e => e.trim()).filter(Boolean) : undefined,
      bcc: bcc ? bcc.split(',').map(e => e.trim()).filter(Boolean) : undefined,
      subject,
      body,
    });
    handleClose();
  };

  const handleClose = () => {
    setTo('');
    setCc('');
    setBcc('');
    setSubject('');
    setBody('');
    setShowCc(false);
    setShowBcc(false);
    onClose();
  };

  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <>
      {/* Overlay */}
      {isMaximized && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={handleClose} />
      )}

      {/* Compose Window */}
      <div
        className={`fixed bg-white shadow-2xl rounded-lg flex flex-col z-50 ${
          isMaximized
            ? 'inset-4'
            : isMinimized
            ? 'bottom-0 right-20 w-[300px] h-[48px]'
            : 'bottom-0 right-20 w-[700px] h-[600px]'
        }`}
        style={{ transition: 'all 0.2s ease' }}
      >
        {/* Header */}
        <div className="h-12 bg-gray-800 text-white rounded-t-lg flex items-center justify-between px-4 flex-shrink-0">
          <div className="font-medium">New Message</div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Form Fields */}
            <div className="border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center border-b border-gray-200">
                <label className="w-16 px-4 text-sm text-gray-600">To</label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="flex-1 py-2 px-2 outline-none text-sm"
                  placeholder="Recipients"
                />
                <div className="flex gap-2 px-2 text-sm">
                  {!showCc && (
                    <button
                      onClick={() => setShowCc(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Cc
                    </button>
                  )}
                  {!showBcc && (
                    <button
                      onClick={() => setShowBcc(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Bcc
                    </button>
                  )}
                </div>
              </div>

              {showCc && (
                <div className="flex items-center border-b border-gray-200">
                  <label className="w-16 px-4 text-sm text-gray-600">Cc</label>
                  <input
                    type="text"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="flex-1 py-2 px-2 outline-none text-sm"
                    placeholder="Cc"
                  />
                </div>
              )}

              {showBcc && (
                <div className="flex items-center border-b border-gray-200">
                  <label className="w-16 px-4 text-sm text-gray-600">Bcc</label>
                  <input
                    type="text"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    className="flex-1 py-2 px-2 outline-none text-sm"
                    placeholder="Bcc"
                  />
                </div>
              )}

              <div className="flex items-center">
                <label className="w-16 px-4 text-sm text-gray-600">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 py-2 px-2 outline-none text-sm"
                  placeholder="Subject"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="flex-1 overflow-hidden">
              <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                modules={modules}
                className="h-full"
                placeholder="Compose your email..."
              />
            </div>

            {/* Footer */}
            <div className="h-14 border-t border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={handleSend}
                  disabled={!to.trim()}
                  className="gmail-btn gmail-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 mr-2 inline" />
                  Send
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveDraft}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Trash2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
