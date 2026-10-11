import React, { useState, useEffect } from 'react';
import { 
  User, 
  School, 
  Mail, 
  Phone, 
  Calendar, 
  Save, 
  CheckCircle2, 
  X, 
  FileText,
  Sparkles,
  Award,
  BookOpen,
  Sliders,
  RotateCcw,
  Presentation,
  Download
} from 'lucide-react';
import { TeacherProfile, Subject, GradeLevel, CurriculumSeries } from '../types';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: TeacherProfile;
  onSaveProfile: (updatedProfile: TeacherProfile) => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<TeacherProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState<'profile' | 'defaults'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // ĐỒNG BỘ FORM DATA MỖI KHI MODAL MỞ RA HOẶC PROFILE THAY ĐỔI
  useEffect(() => {
    if (isOpen) {
      // Đọc từ localStorage nếu có bản mới nhất
      try {
        const saved = localStorage.getItem('edtech_teacher_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData({ ...profile, ...parsed });
          return;
        }
      } catch (err) {
        console.warn('Could not read cached profile:', err);
      }
      setFormData({ ...profile });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleChange = (field: keyof TeacherProfile, val: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleResetToDefault = () => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn khôi phục lại cấu hình ban đầu?')) {
      const defaultProfile: TeacherProfile = {
        name: 'Hồ Minh Luân',
        academicDegree: 'Thạc sĩ Sư phạm Toán',
        title: 'Giáo viên Toán - Tin học',
        school: 'Trường THPT Chuyên Nguyễn Huệ',
        department: 'Tổ Toán - Tin học',
        email: 'H.Minhluan1181@gmail.com',
        phone: '0912 345 678',
        academicYear: '2024 - 2025',
        notes: 'Phụ trách giảng dạy Toán học & Tin học THCS - THPT; bồi dưỡng đội tuyển HSG.',
        defaultSubject: 'Toán học',
        defaultGrade: 'Lớp 10',
        defaultCurriculum: 'Kết nối tri thức với cuộc sống',
        defaultSlideCount: 8,
        exportFormat: 'word',
        autoSave: true
      };
      setFormData(defaultProfile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Lưu vĩnh viễn vào LocalStorage
    try {
      localStorage.setItem('edtech_teacher_profile', JSON.stringify(formData));
      localStorage.setItem('edtech_app_settings', JSON.stringify({
        defaultSubject: formData.defaultSubject || 'Toán học',
        defaultGrade: formData.defaultGrade || 'Lớp 10',
        defaultCurriculum: formData.defaultCurriculum || 'Kết nối tri thức với cuộc sống',
        defaultSlideCount: formData.defaultSlideCount || 8,
        exportFormat: formData.exportFormat || 'word'
      }));
    } catch (err) {
      console.error('Lỗi khi lưu localStorage:', err);
    }

    // 2. Gửi state cập nhật lên Workspace App
    onSaveProfile(formData);

    // 3. Hiển thị thông báo xác nhận thành công
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Cài Đặt Cấu Hình & Hồ Sơ Giáo Viên
                </h3>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                  Hệ Thống Sư Phạm
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tự động áp dụng lên bìa KHBD 5512, Slide bài giảng 16:9, Đề thi 7991 và Kho học liệu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Hồ Sơ Cá Nhân & Đơn Vị</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('defaults')}
            className={`pb-2.5 px-3 font-bold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'defaults'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. Cấu Hình Mặc Định Giảng Dạy</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Thông báo cập nhật */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>Lưu ý:</strong> Cấu hình khi lưu sẽ được mã hóa và lưu trữ cố định trên trình duyệt của Thầy/Cô. Mọi văn bản xuất ra (Word, PDF, PPTX) sẽ tự động mang tên <strong>{formData.name || 'Thầy/Cô'}</strong>.
            </p>
          </div>

          {activeTab === 'profile' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Họ và tên */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Họ và Tên Giáo viên *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="VD: Hồ Minh Luân"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Học vị / Chức danh khoa học */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>Học vị / Danh xưng</span>
                  </label>
                  <input
                    type="text"
                    value={formData.academicDegree || ''}
                    onChange={(e) => handleChange('academicDegree', e.target.value)}
                    placeholder="VD: Thạc sĩ Sư phạm Toán, Cử nhân..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Chức danh chuyên môn */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Vị trí / Chức danh chuyên môn</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="VD: Giáo viên Toán - Tin học / Tổ trưởng CM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Trường học */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-blue-600" />
                    <span>Đơn vị công tác (Trường học) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.school || ''}
                    onChange={(e) => handleChange('school', e.target.value)}
                    placeholder="VD: TRƯỜNG THPT CHUYÊN NGUYỄN HUỆ"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tổ bộ môn */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tổ Bộ Môn *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department || ''}
                    onChange={(e) => handleChange('department', e.target.value)}
                    placeholder="VD: TỔ TOÁN - TIN HỌC"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Năm học */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Năm học hiện tại</span>
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear || ''}
                    onChange={(e) => handleChange('academicYear', e.target.value)}
                    placeholder="VD: 2024 - 2025"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email liên hệ */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email công vụ / Liên hệ</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="VD: H.Minhluan1181@gmail.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Số điện thoại */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Số điện thoại (tùy chọn)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="VD: 0912 345 678"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Ghi chú */}
              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-slate-800 block">
                  Ghi chú chuyên môn hoặc phân công giảng dạy
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="VD: Phụ trách dạy các lớp 10A1, 10A2; bồi dưỡng đội tuyển HSG môn Toán."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {activeTab === 'defaults' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Môn học mặc định */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    Môn học giảng dạy chính:
                  </label>
                  <select
                    value={formData.defaultSubject || 'Toán học'}
                    onChange={(e) => handleChange('defaultSubject', e.target.value as Subject)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white"
                  >
                    <optgroup label="Cấp THCS & THPT">
                      <option value="Toán học">Toán học</option>
                      <option value="Ngữ văn">Ngữ văn</option>
                      <option value="Tiếng Anh">Tiếng Anh</option>
                      <option value="Tin học">Tin học</option>
                    </optgroup>
                    <optgroup label="Cấp THCS (GDPT 2018)">
                      <option value="Khoa học tự nhiên">Khoa học tự nhiên (KHTN)</option>
                      <option value="Lịch sử & Địa lí">Lịch sử & Địa lí</option>
                      <option value="Công nghệ">Công nghệ</option>
                      <option value="Giáo dục công dân">Giáo dục công dân</option>
                    </optgroup>
                    <optgroup label="Cấp THPT">
                      <option value="Vật lí">Vật lí</option>
                      <option value="Hoá học">Hoá học</option>
                      <option value="Sinh học">Sinh học</option>
                      <option value="Lịch sử">Lịch sử</option>
                      <option value="Địa lí">Địa lí</option>
                      <option value="Giáo dục kinh tế và pháp luật">GDKT & PL</option>
                    </optgroup>
                  </select>
                </div>

                {/* Khối lớp mặc định */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    Khối lớp giảng dạy chính:
                  </label>
                  <select
                    value={formData.defaultGrade || 'Lớp 10'}
                    onChange={(e) => handleChange('defaultGrade', e.target.value as GradeLevel)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white"
                  >
                    <optgroup label="Cấp THCS">
                      <option value="Lớp 6">Lớp 6</option>
                      <option value="Lớp 7">Lớp 7</option>
                      <option value="Lớp 8">Lớp 8</option>
                      <option value="Lớp 9">Lớp 9</option>
                    </optgroup>
                    <optgroup label="Cấp THPT">
                      <option value="Lớp 10">Lớp 10</option>
                      <option value="Lớp 11">Lớp 11</option>
                      <option value="Lớp 12">Lớp 12</option>
                    </optgroup>
                  </select>
                </div>

                {/* Bộ sách mặc định */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    Bộ sách giáo khoa ưu tiên:
                  </label>
                  <select
                    value={formData.defaultCurriculum || 'Kết nối tri thức với cuộc sống'}
                    onChange={(e) => handleChange('defaultCurriculum', e.target.value as CurriculumSeries)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white"
                  >
                    <option value="Kết nối tri thức với cuộc sống">Kết nối tri thức với cuộc sống (KNTT)</option>
                    <option value="Cánh diều">Cánh diều</option>
                    <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
                  </select>
                </div>

                {/* Số slide bài giảng mặc định */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    Số slide mặc định khi tạo bài giảng:
                  </label>
                  <select
                    value={formData.defaultSlideCount || 8}
                    onChange={(e) => handleChange('defaultSlideCount', Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white"
                  >
                    <option value={6}>6 slide (Ngắn gọn / 1 tiết)</option>
                    <option value={8}>8 slide (Chuẩn sư phạm 5512 - Khuyến nghị)</option>
                    <option value={10}>10 slide (Chi tiết / 2 tiết)</option>
                    <option value={12}>12 slide (Mở rộng chuyên đề)</option>
                  </select>
                </div>

                {/* Định dạng xuất file ưu tiên */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">
                    Định dạng tải về ưu tiên:
                  </label>
                  <select
                    value={formData.exportFormat || 'word'}
                    onChange={(e) => handleChange('exportFormat', e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white"
                  >
                    <option value="word">Văn bản Microsoft Word (.docx)</option>
                    <option value="pdf">Tài liệu chuẩn in PDF (.pdf)</option>
                    <option value="pptx">Bài giảng PowerPoint (.pptx)</option>
                  </select>
                </div>

                {/* Tự động lưu cấu hình */}
                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100/70">
                    <input
                      type="checkbox"
                      checked={formData.autoSave ?? true}
                      onChange={(e) => handleChange('autoSave', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">
                      Tự động đồng bộ và lưu cấu hình vĩnh viễn
                    </span>
                  </label>
                </div>

              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định ban đầu</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Đã Lưu Cấu Hình Thành Công!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Lưu Cấu Hình Giáo Viên</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
