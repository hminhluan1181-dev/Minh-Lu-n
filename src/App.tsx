import React, { useState, useEffect } from 'react';
import { SAMPLE_MATH_10 } from './data/defaultData';
import { SAMPLE_PHYSICS_10 } from './data/morePresets';
import { 
  SAMPLE_KHTN_HOA_8,
  SAMPLE_KHTN_HOA_9,
  SAMPLE_KHTN_HOA_7,
  SAMPLE_KHTN_HOA_6
} from './data/khtnChemistryData';
import {
  SAMPLE_KHTN_VATLI_8,
  SAMPLE_KHTN_SINH_8,
  SAMPLE_KHTN_VATLI_9,
  SAMPLE_KHTN_SINH_9,
  SAMPLE_KHTN_SINH_7,
  SAMPLE_CONG_NGHE_7
} from './data/allCurriculumData';
import { 
  WorkspaceState, 
  LessonPlan5512, 
  SlideDeck, 
  Exam7991, 
  TeacherProfile, 
  UploadedDocument, 
  SavedCloudProject,
  Subject,
  GradeLevel,
  CurriculumSeries
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LessonPlanView } from './components/LessonPlanView';
import { SlideDeckView } from './components/SlideDeckView';
import { Exam7991View } from './components/Exam7991View';
import { MatrixSpecView } from './components/MatrixSpecView';
import { MaterialLibraryView } from './components/MaterialLibraryView';
import { CloudStorageView } from './components/CloudStorageView';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { VerificationHandoverModal } from './components/VerificationHandoverModal';
import { ChemistryUtilityModal } from './components/ChemistryUtilityModal';
import { generateStaticSlideDeck } from './utils/slideGenerator';
import { enrichLessonPlanFromRag, enrichExamFromRag } from './utils/ragEngine';
import { ALL_CURRICULUM_DOCUMENTS } from './data/allCurriculumData';

export default function App() {
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>({
    ...SAMPLE_KHTN_HOA_8,
    uploadedDocuments: ALL_CURRICULUM_DOCUMENTS
  });
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isChemistryModalOpen, setIsChemistryModalOpen] = useState(false);

  // Khôi phục hồ sơ giáo viên đã lưu từ LocalStorage khi khởi chạy
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('edtech_teacher_profile');
      if (savedProfile) {
        const parsed: TeacherProfile = JSON.parse(savedProfile);
        setWorkspaceState(prev => ({
          ...prev,
          teacherProfile: parsed,
          lessonPlan: {
            ...prev.lessonPlan,
            teacherName: parsed.name || prev.lessonPlan.teacherName,
            schoolName: parsed.school || prev.lessonPlan.schoolName,
            department: parsed.department || prev.lessonPlan.department,
            academicYear: parsed.academicYear || prev.lessonPlan.academicYear,
            subject: parsed.defaultSubject || prev.lessonPlan.subject,
            grade: parsed.defaultGrade || prev.lessonPlan.grade,
            curriculum: parsed.defaultCurriculum || prev.lessonPlan.curriculum,
          },
          slides: {
            ...prev.slides,
            author: `${parsed.name || 'Giáo viên'} · ${parsed.department || 'Tổ bộ môn'}`
          }
        }));
      }
    } catch (e) {
      console.warn('Lỗi đọc profile từ localStorage:', e);
    }
  }, []);

  // Lưu hồ sơ giáo viên mới (Cài đặt) - Đảm bảo lưu vĩnh viễn và đồng bộ ngay lập tức
  const handleSaveTeacherProfile = (updatedProfile: TeacherProfile) => {
    try {
      localStorage.setItem('edtech_teacher_profile', JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Không thể ghi localStorage:', e);
    }

    setWorkspaceState(prev => {
      const updatedSubject = updatedProfile.defaultSubject || prev.lessonPlan.subject;
      const updatedGrade = updatedProfile.defaultGrade || prev.lessonPlan.grade;
      const updatedCurriculum = updatedProfile.defaultCurriculum || prev.lessonPlan.curriculum;

      return {
        ...prev,
        teacherProfile: updatedProfile,
        lessonPlan: {
          ...prev.lessonPlan,
          teacherName: updatedProfile.name || prev.lessonPlan.teacherName,
          schoolName: updatedProfile.school || prev.lessonPlan.schoolName,
          department: updatedProfile.department || prev.lessonPlan.department,
          academicYear: updatedProfile.academicYear || prev.lessonPlan.academicYear,
          subject: updatedSubject,
          grade: updatedGrade,
          curriculum: updatedCurriculum
        },
        slides: {
          ...prev.slides,
          author: `${updatedProfile.name || 'Giáo viên'} · ${updatedProfile.department || 'Tổ bộ môn'}`
        },
        timestamp: new Date().toISOString()
      };
    });
  };

  // Tab change
  const handleTabChange = (tab: WorkspaceState['activeTab']) => {
    if (tab === 'handover') {
      setIsHandoverModalOpen(true);
    } else {
      setWorkspaceState(prev => ({ ...prev, activeTab: tab }));
    }
  };

  // Update metadata from Topbar
  const handleUpdateMetadata = (meta: {
    subject?: WorkspaceState['lessonPlan']['subject'];
    grade?: WorkspaceState['lessonPlan']['grade'];
    curriculum?: WorkspaceState['lessonPlan']['curriculum'];
    lessonName?: string;
  }) => {
    setWorkspaceState(prev => ({
      ...prev,
      lessonPlan: {
        ...prev.lessonPlan,
        subject: meta.subject || prev.lessonPlan.subject,
        grade: meta.grade || prev.lessonPlan.grade,
        curriculum: meta.curriculum || prev.lessonPlan.curriculum,
        lessonName: meta.lessonName !== undefined ? meta.lessonName : prev.lessonPlan.lessonName,
      },
      timestamp: new Date().toISOString()
    }));
  };

  // Switch subject preset - Giữ nguyên cấu hình giáo viên đã cài đặt
  const handleLoadPreset = (presetKey: 'khtn8_acid' | 'khtn9_kimloai' | 'khtn7_bth' | 'khtn6_tachchat' | 'khtn8_vatli' | 'khtn8_sinh' | 'khtn9_vatli' | 'khtn9_sinh' | 'khtn7_sinh' | 'congnghe7' | 'toan' | 'vatly') => {
    let base = SAMPLE_KHTN_HOA_8;
    if (presetKey === 'khtn9_kimloai') base = SAMPLE_KHTN_HOA_9;
    else if (presetKey === 'khtn7_bth') base = SAMPLE_KHTN_HOA_7;
    else if (presetKey === 'khtn6_tachchat') base = SAMPLE_KHTN_HOA_6;
    else if (presetKey === 'khtn8_vatli') base = SAMPLE_KHTN_VATLI_8;
    else if (presetKey === 'khtn8_sinh') base = SAMPLE_KHTN_SINH_8;
    else if (presetKey === 'khtn9_vatli') base = SAMPLE_KHTN_VATLI_9;
    else if (presetKey === 'khtn9_sinh') base = SAMPLE_KHTN_SINH_9;
    else if (presetKey === 'khtn7_sinh') base = SAMPLE_KHTN_SINH_7;
    else if (presetKey === 'congnghe7') base = SAMPLE_CONG_NGHE_7;
    else if (presetKey === 'toan') base = SAMPLE_MATH_10;
    else if (presetKey === 'vatly') base = SAMPLE_PHYSICS_10;

    const currentProfile = workspaceState.teacherProfile;

    setWorkspaceState({
      ...base,
      activeTab: workspaceState.activeTab === 'handover' ? 'library' : workspaceState.activeTab,
      teacherProfile: currentProfile,
      lessonPlan: {
        ...base.lessonPlan,
        teacherName: currentProfile.name || base.lessonPlan.teacherName,
        schoolName: currentProfile.school || base.lessonPlan.schoolName,
        department: currentProfile.department || base.lessonPlan.department,
        academicYear: currentProfile.academicYear || base.lessonPlan.academicYear,
      },
      slides: {
        ...base.slides,
        author: `${currentProfile.name || 'Giáo viên'} · ${currentProfile.department || 'Tổ bộ môn'}`
      }
    });
  };

  // Thêm tài liệu mới (SGK/SGV/SBT) vào kho
  const handleAddDocument = (newDoc: UploadedDocument) => {
    setWorkspaceState(prev => ({
      ...prev,
      uploadedDocuments: [newDoc, ...prev.uploadedDocuments],
      timestamp: new Date().toISOString()
    }));
  };

  // Xóa tài liệu khỏi kho
  const handleDeleteDocument = (id: string) => {
    setWorkspaceState(prev => ({
      ...prev,
      uploadedDocuments: prev.uploadedDocuments.filter(d => d.id !== id),
      timestamp: new Date().toISOString()
    }));
  };

  // QUY TRÌNH: Chọn bài học từ Sách -> Chuyển tiếp sang tạo KHBD / Slide / Đề thi kết nối RAG
  const handleSelectLessonForCreation = (params: {
    subject: Subject;
    grade: GradeLevel;
    curriculum: CurriculumSeries;
    lessonName: string;
    targetMode: 'khbd' | 'slides' | 'exam';
    slideCount?: number;
  }) => {
    setWorkspaceState(prev => {
      let updatedLessonPlan: LessonPlan5512 = {
        ...prev.lessonPlan,
        subject: params.subject,
        grade: params.grade,
        curriculum: params.curriculum,
        lessonName: params.lessonName,
      };

      // Tự động làm giàu KHBD từ RAG SGK Kết Nối Tri Thức (Chương trình GDPT 2018)
      const { enrichedPlan } = enrichLessonPlanFromRag(updatedLessonPlan, prev.uploadedDocuments);
      updatedLessonPlan = enrichedPlan;

      // Tự động chuyển đổi sang Slide Deck tĩnh nếu target là slide
      let updatedSlides = prev.slides;
      if (params.targetMode === 'slides') {
        updatedSlides = generateStaticSlideDeck(
          updatedLessonPlan,
          prev.teacherProfile,
          params.slideCount || 8
        );
      }

      // Tự động làm giàu Đề kiểm tra 7991 từ RAG SGK nếu target là exam
      let updatedExam = prev.exam;
      if (params.targetMode === 'exam') {
        const { enrichedExam } = enrichExamFromRag(
          prev.exam,
          prev.uploadedDocuments,
          params.subject,
          params.grade,
          params.lessonName
        );
        updatedExam = enrichedExam;
      }

      return {
        ...prev,
        lessonPlan: updatedLessonPlan,
        slides: updatedSlides,
        exam: updatedExam,
        activeTab: params.targetMode,
        timestamp: new Date().toISOString()
      };
    });
  };

  // Quản lý snapshot Cloud Storage
  const handleSaveCurrentAsSnapshot = (title: string, type: SavedCloudProject['type']) => {
    const newProj: SavedCloudProject = {
      id: `snap-${Date.now()}`,
      title,
      type,
      subject: workspaceState.lessonPlan.subject,
      grade: workspaceState.lessonPlan.grade,
      curriculum: workspaceState.lessonPlan.curriculum,
      savedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      fileSize: `${Math.floor(Math.random() * 200 + 150)} KB`,
      sourceDocName: workspaceState.uploadedDocuments[0]?.name || 'SGK',
      teacherName: workspaceState.teacherProfile.name,
      cloudSyncStatus: 'synced',
      downloadFormats: type === 'slides' ? ['pptx', 'pdf', 'json'] : ['word', 'pdf', 'json']
    };

    setWorkspaceState(prev => ({
      ...prev,
      savedProjects: [newProj, ...prev.savedProjects],
      timestamp: new Date().toISOString()
    }));
  };

  const handleDeleteSnapshot = (id: string) => {
    setWorkspaceState(prev => ({
      ...prev,
      savedProjects: prev.savedProjects.filter(p => p.id !== id),
      timestamp: new Date().toISOString()
    }));
  };

  const handleLoadSnapshot = (snapshotId: string) => {
    const found = workspaceState.savedProjects.find(p => p.id === snapshotId);
    if (!found) return;

    if (found.type === 'khbd') {
      setWorkspaceState(prev => ({ ...prev, activeTab: 'khbd' }));
    } else if (found.type === 'slides') {
      setWorkspaceState(prev => ({ ...prev, activeTab: 'slides' }));
    } else if (found.type === 'exam') {
      setWorkspaceState(prev => ({ ...prev, activeTab: 'exam' }));
    } else {
      setWorkspaceState(prev => ({ ...prev, activeTab: 'khbd' }));
    }
  };

  // Update Lesson Plan
  const handleUpdateLessonPlan = (updated: LessonPlan5512) => {
    setWorkspaceState(prev => ({
      ...prev,
      lessonPlan: updated,
      timestamp: new Date().toISOString()
    }));
  };

  // Update Slides
  const handleUpdateSlides = (updated: SlideDeck) => {
    setWorkspaceState(prev => ({
      ...prev,
      slides: updated,
      timestamp: new Date().toISOString()
    }));
  };

  // Update Exam
  const handleUpdateExam = (updated: Exam7991) => {
    setWorkspaceState(prev => ({
      ...prev,
      exam: updated,
      timestamp: new Date().toISOString()
    }));
  };

  // Chuyển đổi nhanh KHBD thành Slide Deck tĩnh
  const handleConvertKHBDToSlides = (slideCount: number = 8) => {
    const generated = generateStaticSlideDeck(
      workspaceState.lessonPlan,
      workspaceState.teacherProfile,
      slideCount
    );

    setWorkspaceState(prev => ({
      ...prev,
      slides: generated,
      activeTab: 'slides',
      timestamp: new Date().toISOString()
    }));
  };

  const handleImportState = (newState: WorkspaceState) => {
    setWorkspaceState(newState);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Top Bar with Teacher Profile and Fast Selectors */}
      <Navbar
        state={workspaceState}
        onUpdateMetadata={handleUpdateMetadata}
        onOpenHandoverModal={() => setIsHandoverModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenLibrary={() => setWorkspaceState(prev => ({ ...prev, activeTab: 'library' }))}
        onOpenCloud={() => setWorkspaceState(prev => ({ ...prev, activeTab: 'cloud' }))}
        onOpenChemistry={() => setIsChemistryModalOpen(true)}
      />

      {/* Main Split-Pane Workspace */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Control Panel: Fixed 380px as required */}
        <Sidebar
          state={workspaceState}
          onTabChange={handleTabChange}
          onLoadPreset={handleLoadPreset}
          onOpenHandoverModal={() => setIsHandoverModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenChemistry={() => setIsChemistryModalOpen(true)}
          onPrint={handlePrint}
        />

        {/* Right Flexible Visual Workspace */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50/70">
          
          {/* PHÂN HỆ 0: KHO HỌC LIỆU SỐ & TẢI SÁCH (SGK, SGV, SBT) - NGUỒN SINH NỘI DUNG */}
          {workspaceState.activeTab === 'library' && (
            <MaterialLibraryView
              documents={workspaceState.uploadedDocuments}
              currentSubject={workspaceState.lessonPlan.subject}
              currentGrade={workspaceState.lessonPlan.grade}
              currentCurriculum={workspaceState.lessonPlan.curriculum}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
              onSelectLessonForCreation={handleSelectLessonForCreation}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
            />
          )}

          {/* PHÂN HỆ 1: SOẠN KHBD 5512 */}
          {workspaceState.activeTab === 'khbd' && (
            <LessonPlanView
              lessonPlan={workspaceState.lessonPlan}
              documents={workspaceState.uploadedDocuments}
              onUpdateLessonPlan={handleUpdateLessonPlan}
              onConvertToSlides={(count) => handleConvertKHBDToSlides(count || 8)}
            />
          )}

          {/* PHÂN HỆ 2: SLIDE TRÌNH CHIẾU 16:9 DẠNG TĨNH CHUẨN */}
          {workspaceState.activeTab === 'slides' && (
            <SlideDeckView
              deck={workspaceState.slides}
              teacherProfile={workspaceState.teacherProfile}
              lessonPlan={workspaceState.lessonPlan}
              onUpdateDeck={handleUpdateSlides}
              onBackToKHBD={() => setWorkspaceState(prev => ({ ...prev, activeTab: 'khbd' }))}
              onRegenerateWithCount={(count) => handleConvertKHBDToSlides(count)}
            />
          )}

          {/* PHÂN HỆ 3: NGÂN HÀNG ĐỀ THI 7991 */}
          {workspaceState.activeTab === 'exam' && (
            <Exam7991View
              exam={workspaceState.exam}
              documents={workspaceState.uploadedDocuments}
              lessonPlan={workspaceState.lessonPlan}
              matrixRows={workspaceState.matrixRows}
              specRows={workspaceState.specRows}
              subject={workspaceState.lessonPlan.subject}
              grade={workspaceState.lessonPlan.grade}
              onUpdateExam={handleUpdateExam}
              onUpdateMatrixRows={(updated) => setWorkspaceState(prev => ({
                ...prev,
                matrixRows: updated,
                timestamp: new Date().toISOString()
              }))}
              onUpdateSpecRows={(updated) => setWorkspaceState(prev => ({
                ...prev,
                specRows: updated,
                timestamp: new Date().toISOString()
              }))}
            />
          )}

          {/* PHÂN HỆ 4: MA TRẬN & BẢN ĐẶC TẢ 7991 */}
          {workspaceState.activeTab === 'matrix_spec' && (
            <MatrixSpecView
              matrixRows={workspaceState.matrixRows}
              specRows={workspaceState.specRows}
              documents={workspaceState.uploadedDocuments}
              subject={workspaceState.lessonPlan.subject}
              grade={workspaceState.lessonPlan.grade}
              onUpdateMatrixRows={(updated) => setWorkspaceState(prev => ({ 
                ...prev, 
                matrixRows: updated, 
                timestamp: new Date().toISOString() 
              }))}
              onUpdateSpecRows={(updated) => setWorkspaceState(prev => ({ 
                ...prev, 
                specRows: updated, 
                timestamp: new Date().toISOString() 
              }))}
              onApplyNewMatrixAndSpec={(newMatrix, newSpec, newSubject, newGrade) => {
                setWorkspaceState(prev => ({
                  ...prev,
                  matrixRows: newMatrix,
                  specRows: newSpec,
                  lessonPlan: {
                    ...prev.lessonPlan,
                    subject: newSubject || prev.lessonPlan.subject,
                    grade: newGrade || prev.lessonPlan.grade
                  },
                  timestamp: new Date().toISOString()
                }));
              }}
            />
          )}

          {/* PHÂN HỆ 5: CLOUD LƯU TRỮ & XUẤT ĐA ĐỊNH DẠNG */}
          {workspaceState.activeTab === 'cloud' && (
            <CloudStorageView
              state={workspaceState}
              onSaveCurrentAsSnapshot={handleSaveCurrentAsSnapshot}
              onDeleteSnapshot={handleDeleteSnapshot}
              onLoadSnapshot={handleLoadSnapshot}
            />
          )}
        </main>
      </div>

      {/* Modal Cài Đặt Hồ Sơ Giáo Viên (Hồ Minh Luân) */}
      <TeacherSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={workspaceState.teacherProfile}
        onSaveProfile={handleSaveTeacherProfile}
      />

      {/* Modal Kiểm chứng & JSON Handover */}
      <VerificationHandoverModal
        isOpen={isHandoverModalOpen}
        onClose={() => setIsHandoverModalOpen(false)}
        state={workspaceState}
        onImportState={handleImportState}
      />

      {/* Modal Tra cứu & Tiện ích Hóa học THCS (Chuẩn GDPT 2018) */}
      <ChemistryUtilityModal
        isOpen={isChemistryModalOpen}
        onClose={() => setIsChemistryModalOpen(false)}
      />
    </div>
  );
}
