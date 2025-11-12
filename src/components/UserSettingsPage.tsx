import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Save, Info } from 'lucide-react';
import { defaultUserSettings, UserSettings } from '../lib/mockData';
import { toast } from 'sonner@2.0.3';

export default function UserSettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof UserSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend/database
    toast.success('Đã lưu cài đặt cá nhân!');
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(defaultUserSettings);
    setHasChanges(true);
    toast.info('Đã reset về cài đặt mặc định');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Cài đặt cá nhân</h2>
        <p className="text-gray-600">
          Thông tin này giúp AI hiểu phong cách và ngữ cảnh của bạn để tạo email phản hồi phù hợp hơn
        </p>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              AI sẽ sử dụng thông tin này để:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Tùy chỉnh giọng văn trong email trả lời (chuyên nghiệp, thân mật, vui vẻ...)</li>
              <li>Hiểu ngữ cảnh công việc và gia đình của bạn</li>
              <li>Đưa ra các đề xuất phù hợp với vai trò và tình huống của bạn</li>
            </ul>
            <p className="mt-2">
              💡 Nếu để trống, AI sẽ sử dụng phong cách mặc định của hệ thống.
            </p>
          </div>
        </div>
      </Card>

      {/* Settings Form */}
      <Card className="p-6">
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tên của bạn</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn A"
            />
            <p className="text-sm text-gray-500">
              Tên sẽ được sử dụng trong email gửi đi
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Vai trò / Chức vụ</Label>
            <Input
              id="role"
              value={settings.role}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder="Ví dụ: Product Manager, Freelancer, Sinh viên..."
            />
            <p className="text-sm text-gray-500">
              Giúp AI hiểu vị trí công việc của bạn
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalStyle">Phong cách giao tiếp cá nhân</Label>
            <Textarea
              id="personalStyle"
              value={settings.personalStyle}
              onChange={(e) => handleChange('personalStyle', e.target.value)}
              placeholder="Ví dụ: Tôi thích giao tiếp ngắn gọn, súc tích và dùng emoji khi trò chuyện với bạn bè. Với công việc thì tôi viết email lịch sự và chuyên nghiệp."
              rows={4}
            />
            <p className="text-sm text-gray-500">
              Mô tả cách bạn thường giao tiếp qua email
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workContext">Ngữ cảnh công việc</Label>
            <Textarea
              id="workContext"
              value={settings.workContext}
              onChange={(e) => handleChange('workContext', e.target.value)}
              placeholder="Ví dụ: Tôi đang làm việc tại công ty công nghệ, quản lý team 5 người, thường xuyên trao đổi với đối tác và khách hàng. Tôi làm việc từ 9h-18h."
              rows={4}
            />
            <p className="text-sm text-gray-500">
              Thông tin về môi trường và lịch làm việc của bạn
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyContext">Ngữ cảnh gia đình</Label>
            <Textarea
              id="familyContext"
              value={settings.familyContext}
              onChange={(e) => handleChange('familyContext', e.target.value)}
              placeholder="Ví dụ: Tôi sống cùng bố mẹ và em gái. Tôi thường giúp mẹ mua đồ và làm việc nhà cuối tuần."
              rows={4}
            />
            <p className="text-sm text-gray-500">
              Thông tin về gia đình giúp AI trả lời email gia đình phù hợp hơn
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              onClick={handleSave}
              disabled={!hasChanges}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu cài đặt
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Reset về mặc định
            </Button>
          </div>
        </form>
      </Card>

      {/* Preview Card */}
      <Card className="p-6">
        <h3 className="mb-4">🔍 Xem trước thông tin của bạn</h3>
        
        {!settings.name && !settings.role && !settings.personalStyle && !settings.workContext && !settings.familyContext ? (
          <p className="text-gray-500 text-center py-8">
            Chưa có thông tin nào. AI sẽ sử dụng cài đặt mặc định của hệ thống.
          </p>
        ) : (
          <div className="space-y-4">
            {settings.name && (
              <div>
                <span className="text-gray-600">Tên:</span>
                <p className="mt-1">{settings.name}</p>
              </div>
            )}
            
            {settings.role && (
              <div>
                <span className="text-gray-600">Vai trò:</span>
                <p className="mt-1">{settings.role}</p>
              </div>
            )}
            
            {settings.personalStyle && (
              <div>
                <span className="text-gray-600">Phong cách:</span>
                <p className="mt-1 text-gray-700">{settings.personalStyle}</p>
              </div>
            )}
            
            {settings.workContext && (
              <div>
                <span className="text-gray-600">Công việc:</span>
                <p className="mt-1 text-gray-700">{settings.workContext}</p>
              </div>
            )}
            
            {settings.familyContext && (
              <div>
                <span className="text-gray-600">Gia đình:</span>
                <p className="mt-1 text-gray-700">{settings.familyContext}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
