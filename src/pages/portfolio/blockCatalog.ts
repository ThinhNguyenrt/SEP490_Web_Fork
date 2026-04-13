import {
  User,
  Briefcase,
  BookOpen,
  Award,
  Code,
  Zap,
  Users,
  FileText,
  Target,
  Lightbulb,
  BookMarked,
  ScrollText,
  Trophy,
  LucideIcon,
} from "lucide-react";

export interface BlockVariantInfo {
  variant: string;
  label: string;
  description?: string;
  preview?: string;
}

export interface BlockInfo {
  type: string;
  label: string;
  icon: LucideIcon;
  description: string;
  variants: BlockVariantInfo[];
}

export const BLOCK_CATALOG: BlockInfo[] = [
  {
    type: "INTRO",
    label: "Giới thiệu",
    icon: User,
    description: "Thông tin cá nhân và liên hệ",
    variants: [
      { 
        variant: "INTROONE", 
        label: "Giới thiệu 1", 
        preview: "Hiển thị avatar to ở giữa, tên đầy đủ, chức danh và mô tả ngắn gọn"
      },
      { 
        variant: "INTROTWO", 
        label: "Giới thiệu 2", 
        preview: "Layout ngang: avatar bên trái, thông tin bên phải (tên, chức danh, email, phone)"
      },
      { 
        variant: "INTROTHREE", 
        label: "Giới thiệu 3", 
        preview: "Layout cột đầy đủ: avatar, tên, chức danh, trường học, học vấn"
      },
      { 
        variant: "INTROFOUR", 
        label: "Giới thiệu 4", 
        preview: "Layout học thuật: avatar, tên, học vấn chi tiết, lĩnh vực nghiên cứu"
      },
      { 
        variant: "INTROFIVE", 
        label: "Giới thiệu 5", 
        preview: "Layout y tế: avatar, tên, chuyên môn, kinh nghiệm, học vấn"
      },
    ],
  },
  {
    type: "SKILL",
    label: "Kỹ năng",
    icon: Zap,
    description: "Kỹ năng chuyên môn hoặc nền tảng",
    variants: [
      { 
        variant: "SKILLONE", 
        label: "Kỹ năng 1", 
        preview: "Danh sách kỹ năng đơn giản, mỗi công nghệ một tag"
      },
      { 
        variant: "SKILLTWO", 
        label: "Kỹ năng 2", 
        preview: "Phân loại: Ngôn ngữ, Framework, Công cụ"
      },
      { 
        variant: "SKILLTHREE", 
        label: "Kỹ năng 3", 
        preview: "Kỹ năng lâm sàn: tên kỹ năng + mô tả chi tiết"
      },
    ],
  },
  {
    type: "EDUCATION",
    label: "Học vấn",
    icon: BookOpen,
    description: "Trường học và thành tích",
    variants: [
      { 
        variant: "EDUCATIONONE", 
        label: "Học vấn 1", 
        preview: "Danh sách trường học: trường, chuyên ngành, thời gian, mô tả"
      },
      { 
        variant: "EDUCATIONTWO", 
        label: "Học vấn 2", 
        preview: "Chi tiết quá trình: trường, chuyên ngành, năm, mô tả"
      },
      { 
        variant: "EDUCATIONTHREE", 
        label: "Học vấn 3", 
        preview: "Thành tích: GPA, xét tuyển, mô tả chi tiết"
      },
    ],
  },
  {
    type: "EXPERIMENT",
    label: "Kinh nghiệm",
    icon: Briefcase,
    description: "Quá trình làm việc",
    variants: [
      { 
        variant: "EXPERIMENTONE", 
        label: "Kinh nghiệm 1", 
        preview: "Danh sách công việc: vị trí, công ty, thời gian, mô tả"
      },
    ],
  },
  {
    type: "PROJECT",
    label: "Dự án",
    icon: Code,
    description: "Dự án thực hiện",
    variants: [
      { 
        variant: "PROJECTONE", 
        label: "Dự án 1", 
        preview: "Chi tiết dự án: tên, ảnh, mô tả, vai trò, công nghệ, liên kết"
      },
      { 
        variant: "PROJECTTWO", 
        label: "Dự án 2", 
        preview: "Công bố khoa học: tên, nhà xuất bản, mô tả, trạng thái"
      },
      { 
        variant: "PROJECTTHREE", 
        label: "Dự án 3", 
        preview: "Đề tài nghiên cứu: tên, tổ chức, thời gian, mô tả"
      },
    ],
  },
  {
    type: "DIPLOMA",
    label: "Chứng chỉ",
    icon: Award,
    description: "Bằng cấp và chứng nhận",
    variants: [
      { 
        variant: "DIPLOMAONE", 
        label: "Chứng chỉ 1", 
        preview: "Danh sách chứng chỉ: bằng, nơi cấp, thời gian, mô tả"
      },
    ],
  },
  {
    type: "AWARD",
    label: "Giải thưởng",
    icon: Trophy,
    description: "Thành tựu nổi bật",
    variants: [
      { 
        variant: "AWARDONE", 
        label: "Giải thưởng 1", 
        preview: "Danh sách giải thưởng: giải, tổ chức, thời gian, mô tả"
      },
    ],
  },
  {
    type: "ACTIVITIES",
    label: "Hoạt động",
    icon: Users,
    description: "Hoạt động cộng đồng hoặc CLB",
    variants: [
      { 
        variant: "ACTIVITYONE", 
        label: "Hoạt động 1", 
        preview: "Danh sách hoạt động: tên, ngày, mô tả"
      },
      { 
        variant: "ACTIVITYTWO", 
        label: "Hoạt động 2", 
        preview: "Hoạt động ngoại khóa: tên, ngày, mô tả chi tiết"
      },
    ],
  },
  {
    type: "OTHERINFO",
    label: "Sở thích cá nhân",
    icon: Lightbulb,
    description: "Mục tiêu, tài liệu, kỹ năng mềm",
    variants: [
      { 
        variant: "OTHERONE", 
        label: "Sở thích cá nhân", 
        preview: "Danh sách sở thích: tag các hoạt động yêu thích"
      },
      { 
        variant: "OTHERTWO", 
        label: "Mục tiêu nghề nghiệp", 
        preview: "Mục tiêu dài hạn: văn bản mô tả chi tiết"
      },
      { 
        variant: "OTHERTHREE", 
        label: "Tầm nhìn và động lực", 
        preview: "Tầm nhìn: văn bản dài về kế hoạch phát triển"
      },
      { 
        variant: "OTHERFOUR", 
        label: "Giới thiệu chuyên môn", 
        preview: "Giới thiệu chuyên môn: mô tả về kinh nghiệm"
      },
      { 
        variant: "OTHERFIVE", 
        label: "Lĩnh vực nghiên cứu", 
        preview: "Danh sách lĩnh vực: các topic nghiên cứu chính"
      },
      { 
        variant: "OTHERSIX", 
        label: "Kỹ năng mềm", 
        preview: "Danh sách kỹ năng mềm: giao tiếp, lãnh đạo, v.v."
      },
      { 
        variant: "OTHERSEVEN", 
        label: "Tài liệu bổ sung", 
        preview: "Danh sách tài liệu: link tới portfolio, GitHub, v.v."
      },
      { 
        variant: "OTHEREIGHT", 
        label: "Giấy phép hành nghề", 
        preview: "Giấy phép: số hiệu, nơi cấp, ngày cấp, trạng thái"
      },
    ],
  },
  {
    type: "REFERENCE",
    label: "Người giới thiệu",
    icon: FileText,
    description: "Thông tin người giới thiệu",
    variants: [
      { 
        variant: "REFERENCEONE", 
        label: "Người giới thiệu 1", 
        preview: "Danh sách người tham chiếu: tên, công ty, email, điện thoại"
      },
    ],
  },
  {
    type: "RESEARCH",
    label: "Công bố khoa học",
    icon: BookMarked,
    description: "Công bố khoa học",
    variants: [
      { 
        variant: "RESEARCHONE", 
        label: "Công bố khoa học 1", 
        preview: "Danh sách công bố: tiêu đề, tác giả, tạp chí, DOI"
      },
    ],
  },
  {
    type: "TEACHING",
    label: "Giảng dạy",
    icon: Target,
    description: "Kinh nghiệm giảng dạy",
    variants: [
      { 
        variant: "TEACHINGONE", 
        label: "Giảng dạy 1", 
        preview: "Danh sách môn học: tên môn, trường, thời gian, mô tả"
      },
    ],
  },
  {
    type: "TYPICALCASE",
    label: "Trường hợp điển hình",
    icon: ScrollText,
    description: "Case study chuyên môn",
    variants: [
      { 
        variant: "TYPICALCASEONE", 
        label: "Trường hợp điển hình 1", 
        preview: "Case study: tiêu đề, mô tả tình huống, can thiệp, kết quả"
      },
    ],
  },
];

export const getBlockInfo = (blockType: string): BlockInfo | undefined => {
  return BLOCK_CATALOG.find((item) => item.type === blockType);
};

export const getVariantInfo = (blockType: string, variant: string): BlockVariantInfo | undefined => {
  const blockInfo = getBlockInfo(blockType);
  if (!blockInfo) return undefined;
  return blockInfo.variants.find((v) => v.variant === variant);
};
