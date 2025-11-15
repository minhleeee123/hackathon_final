import React, { useState } from 'react';
import { UserProfile, EmailPattern, UserRole, EmailCategory } from '../types';

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'employee', label: 'Nhân viên' },
  { value: 'manager', label: 'Quản lý' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'business_owner', label: 'Chủ doanh nghiệp' },
  { value: 'student', label: 'Sinh viên' },
  { value: 'other', label: 'Khác' },
];

const EMAIL_CATEGORIES: { value: EmailCategory; label: string }[] = [
  { value: 'work', label: 'Công việc' },
  { value: 'family', label: 'Gia đình' },
  { value: 'friends', label: 'Bạn bè' },
  { value: 'finance', label: 'Tài chính' },
  { value: 'shopping', label: 'Mua sắm' },
  { value: 'travel', label: 'Du lịch' },
  { value: 'health', label: 'Sức khỏe' },
  { value: 'education', label: 'Giáo dục' },
  { value: 'other', label: 'Khác' },
];

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit, initialProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      name: '',
      email: '',
      role: 'employee',
      occupation: '',
      industry: '',
      workingHours: '',
      emailPatterns: [],
      painPoints: [],
      goals: [],
      additionalInfo: '',
    }
  );

  const [currentPainPoint, setCurrentPainPoint] = useState('');
  const [currentGoal, setCurrentGoal] = useState('');
  const [currentPattern, setCurrentPattern] = useState<Partial<EmailPattern>>({
    category: 'work',
    frequency: 5,
    commonSenders: [],
    description: '',
  });
  const [currentSender, setCurrentSender] = useState('');

  const handleAddPainPoint = () => {
    if (currentPainPoint.trim()) {
      setProfile({
        ...profile,
        painPoints: [...profile.painPoints, currentPainPoint.trim()],
      });
      setCurrentPainPoint('');
    }
  };

  const handleRemovePainPoint = (index: number) => {
    setProfile({
      ...profile,
      painPoints: profile.painPoints.filter((_, i) => i !== index),
    });
  };

  const handleAddGoal = () => {
    if (currentGoal.trim()) {
      setProfile({
        ...profile,
        goals: [...profile.goals, currentGoal.trim()],
      });
      setCurrentGoal('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setProfile({
      ...profile,
      goals: profile.goals.filter((_, i) => i !== index),
    });
  };

  const handleAddSender = () => {
    if (currentSender.trim() && currentPattern.commonSenders) {
      setCurrentPattern({
        ...currentPattern,
        commonSenders: [...currentPattern.commonSenders, currentSender.trim()],
      });
      setCurrentSender('');
    }
  };

  const handleRemoveSender = (index: number) => {
    if (currentPattern.commonSenders) {
      setCurrentPattern({
        ...currentPattern,
        commonSenders: currentPattern.commonSenders.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddPattern = () => {
    if (currentPattern.category && currentPattern.frequency) {
      setProfile({
        ...profile,
        emailPatterns: [
          ...profile.emailPatterns,
          currentPattern as EmailPattern,
        ],
      });
      setCurrentPattern({
        category: 'work',
        frequency: 5,
        commonSenders: [],
        description: '',
      });
    }
  };

  const handleRemovePattern = (index: number) => {
    setProfile({
      ...profile,
      emailPatterns: profile.emailPatterns.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Thông tin người dùng
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ tên *
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="example@gmail.com"
            />
          </div>
        </div>

        {/* Role & Occupation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai trò *
            </label>
            <select
              required
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value as UserRole })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nghề nghiệp
            </label>
            <input
              type="text"
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Developer, Marketer, ..."
            />
          </div>
        </div>

        {/* Industry & Working Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngành nghề
            </label>
            <input
              type="text"
              value={profile.industry}
              onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="VD: IT, Finance, Healthcare, ..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giờ làm việc
            </label>
            <input
              type="text"
              value={profile.workingHours}
              onChange={(e) => setProfile({ ...profile, workingHours: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="VD: 9-17, Linh hoạt, ..."
            />
          </div>
        </div>

        {/* Email Patterns */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Loại email thường nhận
          </h3>

          {/* Current patterns list */}
          {profile.emailPatterns.length > 0 && (
            <div className="mb-4 space-y-2">
              {profile.emailPatterns.map((pattern, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium">
                      {EMAIL_CATEGORIES.find((c) => c.value === pattern.category)?.label}
                    </span>
                    <span className="text-gray-600 ml-2">
                      (~{pattern.frequency} emails/tuần)
                    </span>
                    {pattern.description && (
                      <p className="text-sm text-gray-600 mt-1">{pattern.description}</p>
                    )}
                    {pattern.commonSenders.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Người gửi: {pattern.commonSenders.join(', ')}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePattern(index)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new pattern */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại email
                </label>
                <select
                  value={currentPattern.category}
                  onChange={(e) =>
                    setCurrentPattern({
                      ...currentPattern,
                      category: e.target.value as EmailCategory,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {EMAIL_CATEGORIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tần suất (emails/tuần)
                </label>
                <input
                  type="number"
                  min="0"
                  value={currentPattern.frequency}
                  onChange={(e) =>
                    setCurrentPattern({
                      ...currentPattern,
                      frequency: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả (tùy chọn)
              </label>
              <input
                type="text"
                value={currentPattern.description}
                onChange={(e) =>
                  setCurrentPattern({ ...currentPattern, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="VD: Email từ khách hàng, báo cáo hàng ngày, ..."
              />
            </div>

            {/* Common senders */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Người gửi thường xuyên (tùy chọn)
              </label>
              {currentPattern.commonSenders && currentPattern.commonSenders.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentPattern.commonSenders.map((sender, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {sender}
                      <button
                        type="button"
                        onClick={() => handleRemoveSender(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentSender}
                  onChange={(e) => setCurrentSender(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSender();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="VD: boss@company.com, client@example.com"
                />
                <button
                  type="button"
                  onClick={handleAddSender}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Thêm
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddPattern}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              + Thêm loại email
            </button>
          </div>
        </div>

        {/* Pain Points */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Khó khăn hiện tại
          </h3>

          {profile.painPoints.length > 0 && (
            <div className="mb-3 space-y-2">
              {profile.painPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-red-50 p-3 rounded-lg"
                >
                  <span>{point}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePainPoint(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={currentPainPoint}
              onChange={(e) => setCurrentPainPoint(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPainPoint();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="VD: Quá nhiều email spam, khó tìm email quan trọng, ..."
            />
            <button
              type="button"
              onClick={handleAddPainPoint}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Thêm
            </button>
          </div>
        </div>

        {/* Goals */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Mục tiêu mong muốn
          </h3>

          {profile.goals.length > 0 && (
            <div className="mb-3 space-y-2">
              {profile.goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-green-50 p-3 rounded-lg"
                >
                  <span>{goal}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddGoal();
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="VD: Tự động phân loại email, trích xuất tasks, ..."
            />
            <button
              type="button"
              onClick={handleAddGoal}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Thêm
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Thông tin thêm
          </h3>
          <textarea
            value={profile.additionalInfo}
            onChange={(e) => setProfile({ ...profile, additionalInfo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Thêm bất kỳ thông tin nào khác bạn muốn chia sẻ về thói quen sử dụng email, nhu cầu đặc biệt, ..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Phân tích & Đề xuất Agents
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
