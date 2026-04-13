import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Target,
  Lightbulb,
  Users,
  FileText,
  ScrollText,
  Briefcase,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import TemplatePreviewImage from "@/assets/testImage/testImage.png";
import { BLOCK_CATALOG, getBlockInfo } from "./blockCatalog";
import VariantSelector from "./VariantSelector";
import ActivityOneEditor from "./editor/ActivityOneEditor";
import AwardEditor from "./editor/AwardEditor";
import IntroTwoEditor from "./editor/IntroTwoEditor";
import OtherFiveEditor from "./editor/OtherFiveEditor";
import OtherInfoOneEditor from "./editor/OtherInfoOneEditor";
import OtherEightEditor from "./editor/OtherEightEditor";
import OtherInfoSevenEditor from "./editor/OtherInfoSevenEditor";
import OtherInfoTwoEditor from "./editor/OtherInfoTwoEditor";
import OtherInfoSixEditor from "./editor/OtherInfoSixEditor";
import ResearchOneEditor from "./editor/ResearchOneEditor";
import ReferenceEditor from "./editor/ReferenceEditor";
import CertificateOneEditor from "@/pages/portfolio/editor/CertificateOneEditor";
import EducationOneEditor from "@/pages/portfolio/editor/EducationOneEditor";
import EducationTwoEditor from "@/pages/portfolio/editor/EducationTwoEditor";
import EducationThreeEditor from "@/pages/portfolio/editor/EducationThreeEditor";
import ExperienceOneEditor from "@/pages/portfolio/editor/ExperienceOneEditor";
import IntroOneEditor from "@/pages/portfolio/editor/IntroOneEditor";
import IntroFourEditor from "@/pages/portfolio/editor/IntroFourEditor";
import IntroFiveEditor from "@/pages/portfolio/editor/IntroFiveEditor";
import IntroThreeEditor from "@/pages/portfolio/editor/IntroThreeEditor";
import SkillOneEditor from "@/pages/portfolio/editor/SkillOneEditor";
import SkillThreeEditor from "@/pages/portfolio/editor/SkillThreeEditor";
import SkillTwoEditor from "@/pages/portfolio/editor/SkillTwoEditor";
import TeachingOneEditor from "@/pages/portfolio/editor/TeachingOneEditor";
import TypicalCaseOneEditor from "@/pages/portfolio/editor/TypicalCaseOneEditor";
import ProjectOneEditor from "./editor/ProjectOneEditor";
import ProjectTwoEditor from "./editor/ProjectTwoEditor";
import ProjectThreeEditor from "./editor/ProjectThreeEditor";
import {
  createCertificateOneDraft,
  type CertificateOneDraft,
} from "@/pages/portfolio/editor/certificateOneDraft";
import {
  createActivityOneDraft,
  type ActivityOneDraft,
} from "./editor/activityOneDraft";
import {
  createAwardOneDraft,
  type AwardOneDraft,
} from "./editor/awardOneDraft";
import {
  createOtherFiveDraft,
  type OtherFiveDraft,
} from "./editor/otherFiveDraft";
import {
  createOtherEightDraft,
  type OtherEightDraft,
} from "./editor/otherEightDraft";
import {
  createOtherInfoOneDraft,
  type OtherInfoOneDraft,
} from "./editor/otherInfoOneDraft";
import {
  createOtherInfoTwoDraft,
  type OtherInfoTwoDraft,
} from "./editor/otherInfoTwoDraft";
import {
  createOtherInfoSixDraft,
  type OtherInfoSixDraft,
} from "./editor/otherInfoSixDraft";
import {
  createOtherSevenDraft,
  type OtherSevenDraft,
} from "./editor/otherSevenDraft";
import {
  createResearchOneDraft,
  type ResearchOneDraft,
} from "./editor/researchOneDraft";
import {
  createReferenceOneDraft,
  type ReferenceOneDraft,
} from "./editor/referenceOneDraft";
import {
  createEducationOneDraft,
  type EducationOneDraft,
} from "@/pages/portfolio/editor/educationOneDraft";
import {
  createEducationTwoDraft,
  type EducationTwoDraft,
} from "@/pages/portfolio/editor/educationTwoDraft";
import {
  createEducationThreeDraft,
  createEmptyEducationThreeDraft,
  type EducationThreeDraft,
} from "@/pages/portfolio/editor/educationThreeDraft";
import {
  createExperienceOneDraft,
  splitExperienceOneTimeRange,
  type ExperienceOneDraft,
} from "@/pages/portfolio/editor/experienceOneDraft";
import {
  createIntroOneDraft,
  type IntroOneDraft,
} from "@/pages/portfolio/editor/introOneDraft";
import {
  createIntroFourDraft,
  type IntroFourDraft,
} from "@/pages/portfolio/editor/introFourDraft";
import {
  createIntroFiveDraft,
  type IntroFiveDraft,
} from "@/pages/portfolio/editor/introFiveDraft";
import {
  createIntroThreeDraft,
  type IntroThreeDraft,
} from "@/pages/portfolio/editor/introThreeDraft";
import {
  createIntroTwoDraft,
  type IntroTwoDraft,
} from "./editor/introTwoDraft";
import {
  createSkillOneDraft,
  type SkillOneDraft,
} from "@/pages/portfolio/editor/skillOneDraft";
import {
  createEmptySkillThreeDraft,
  type SkillThreeDraft,
} from "@/pages/portfolio/editor/skillThreeDraft";
import {
  createSkillTwoDraft,
  type SkillTwoDraft,
} from "@/pages/portfolio/editor/skillTwoDraft";
import {
  createEmptyTeachingOneDraft,
  type TeachingOneDraft,
} from "@/pages/portfolio/editor/teachingOneDraft";
import {
  createEmptyTypicalCaseOneDraft,
  type TypicalCaseOneDraft,
} from "@/pages/portfolio/editor/typicalCaseOneDraft";
import {
  createEmptyProjectThreeDraft,
  createProjectThreeDraft,
  type ProjectThreeDraft,
} from "./editor/projectThreeDraft";
import {
  createProjectOneDraft,
  type ProjectOneDraft,
} from "./editor/projectOneDraft";
import {
  createProjectTwoDraft,
  type ProjectTwoDraft,
} from "./editor/projectTwoDraft";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import { cn } from "@/lib/utils";
import {
  PortfolioBlock,
  PortfolioResponse,
  portfolioService,
} from "@/services/portfolio.api";
import { fetchEmployeeProfile, type EmployeeProfile } from "@/services/profile.api";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";

type EditorTab = "template" | "component";

type FieldDefinition = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
};

type EditableBlockType =
  | "INTRO"
  | "SKILL"
  | "EDUCATION"
  | "EXPERIMENT"
  | "PROJECT"
  | "AWARD"
  | "ACTIVITIES"
  | "OTHERINFO"
  | "REFERENCE"
  | "DIPLOMA";

type ExtendedEditorBlockType = EditableBlockType | "RESEARCH" | "TEACHING" | "TYPICALCASE";

type EditorSlot = {
  type: ExtendedEditorBlockType;
  label: string;
  variant?: string;
};

type EditorSlotPreset = "default" | "template2" | "template3" | "template4" | "template5";

const BLOCK_LABELS: Record<string, string> = {
  INTRO: "Giới thiệu",
  SKILL: "Kỹ năng",
  EDUCATION: "Học vấn",
  EXPERIMENT: "Kinh nghiệm",
  PROJECT: "Dự án",
  DIPLOMA: "Chứng chỉ",
  AWARD: "Giải thưởng",
  ACTIVITIES: "Hoạt động",
  OTHERINFO: "Thông tin bổ sung",
  REFERENCE: "Người tham chiếu",
  RESEARCH: "Nghiên cứu",
  TEACHING: "Giảng dạy",
  TYPICALCASE: "Ca điển hình",
};

const EDITABLE_BLOCK_TYPES: EditableBlockType[] = [
  "INTRO",
  "SKILL",
  "EDUCATION",
  "EXPERIMENT",
  "PROJECT",
  "AWARD",
  "ACTIVITIES",
  "OTHERINFO",
  "REFERENCE",
  "DIPLOMA",
];

const TEMPLATE_TWO_EDITOR_SLOTS: EditorSlot[] = [
  { type: "INTRO", variant: "INTROTWO", label: "Giới thiệu" },
  { type: "OTHERINFO", variant: "OTHERTWO", label: "Mục tiêu nghề nghiệp" },
  { type: "SKILL", variant: "SKILLTWO", label: "Kỹ năng nền tảng" },
  { type: "PROJECT", variant: "PROJECTONE", label: "Dự án nổi bật" },
  { type: "EDUCATION", variant: "EDUCATIONONE", label: "Học vấn" },
  { type: "ACTIVITIES", variant: "ACTIVITYTWO", label: "Hoạt động ngoại khóa" },
  { type: "DIPLOMA", variant: "DIPLOMAONE", label: "Chứng chỉ" },
  { type: "OTHERINFO", variant: "OTHERSIX", label: "Kỹ năng mềm" },
  { type: "OTHERINFO", variant: "OTHERONE", label: "Sở thích cá nhân" },
  { type: "REFERENCE", variant: "REFERENCEONE", label: "Người giới thiệu" },
];

const TEMPLATE_TWO_REQUIRED_VARIANTS = new Set(
  TEMPLATE_TWO_EDITOR_SLOTS.map((slot) => slot.variant?.toUpperCase()).filter(Boolean) as string[],
);

const TEMPLATE_THREE_EDITOR_SLOTS: EditorSlot[] = [
  { type: "INTRO", variant: "INTROTHREE", label: "Giới thiệu" },
  { type: "OTHERINFO", variant: "OTHERTHREE", label: "Tầm nhìn và động lực" },
  { type: "EDUCATION", variant: "EDUCATIONTHREE", label: "Thành tích học tập" },
  { type: "PROJECT", variant: "PROJECTTWO", label: "Dự án nghiên cứu" },
  { type: "ACTIVITIES", variant: "ACTIVITYONE", label: "Hoạt động" },
  { type: "DIPLOMA", variant: "DIPLOMAONE", label: "Chứng chỉ" },
  { type: "REFERENCE", variant: "REFERENCEONE", label: "Người giới thiệu" },
  { type: "OTHERINFO", variant: "OTHERSEVEN", label: "Tài liệu bổ sung" },
];

const TEMPLATE_THREE_REQUIRED_VARIANTS = new Set(
  TEMPLATE_THREE_EDITOR_SLOTS.map((slot) => slot.variant?.toUpperCase()).filter(Boolean) as string[],
);

const TEMPLATE_FOUR_EDITOR_SLOTS: EditorSlot[] = [
  { type: "INTRO", variant: "INTROFOUR", label: "Giới thiệu" },
  { type: "OTHERINFO", variant: "OTHERFOUR", label: "Giới thiệu chuyên môn" },
  { type: "OTHERINFO", variant: "OTHERFIVE", label: "Lĩnh vực nghiên cứu" },
  { type: "RESEARCH", variant: "RESEARCHONE", label: "Công bố khoa học" },
  { type: "PROJECT", variant: "PROJECTTHREE", label: "Dự án & đề tài" },
  { type: "EDUCATION", variant: "EDUCATIONTWO", label: "Quá trình đào tạo" },
  { type: "TEACHING", variant: "TEACHINGONE", label: "Giảng dạy" },
];

const TEMPLATE_FOUR_REQUIRED_VARIANTS = new Set(
  TEMPLATE_FOUR_EDITOR_SLOTS.map((slot) => slot.variant?.toUpperCase()).filter(Boolean) as string[],
);

const TEMPLATE_FIVE_EDITOR_SLOTS: EditorSlot[] = [
  { type: "INTRO", variant: "INTROFIVE", label: "Giới thiệu" },
  { type: "OTHERINFO", variant: "OTHERFOUR", label: "Giới thiệu chuyên môn" },
  { type: "SKILL", variant: "SKILLTHREE", label: "Kỹ năng lâm sàn" },
  { type: "EXPERIMENT", variant: "EXPERIMENTONE", label: "Kinh nghiệm làm việc" },
  { type: "TYPICALCASE", variant: "TYPICALCASEONE", label: "Trường hợp điển hình" },
  { type: "DIPLOMA", variant: "DIPLOMAONE", label: "Chứng chỉ" },
  { type: "OTHERINFO", variant: "OTHEREIGHT", label: "Giấy phép hành nghề" },
];

const TEMPLATE_FIVE_REQUIRED_VARIANTS = new Set(
  TEMPLATE_FIVE_EDITOR_SLOTS.map((slot) => slot.variant?.toUpperCase()).filter(Boolean) as string[],
);

const BLOCK_VARIANTS: Record<string, string[]> = {
  INTRO: ["INTROONE", "INTROTWO", "INTROTHREE", "INTROFOUR", "INTROFIVE"],
  SKILL: ["SKILLONE", "SKILLTWO", "SKILLTHREE"],
  EDUCATION: ["EDUCATIONONE", "EDUCATIONTWO", "EDUCATIONTHREE"],
  EXPERIMENT: ["EXPERIMENTONE"],
  PROJECT: ["PROJECTONE", "PROJECTTWO", "PROJECTTHREE"],
  DIPLOMA: ["DIPLOMAONE"],
  AWARD: ["AWARDONE"],
  ACTIVITIES: ["ACTIVITYONE", "ACTIVITYTWO"],
  OTHERINFO: [
    "OTHERONE",
    "OTHERTWO",
    "OTHERTHREE",
    "OTHERFOUR",
    "OTHERFIVE",
    "OTHERSIX",
    "OTHERSEVEN",
    "OTHEREIGHT",
  ],
  REFERENCE: ["REFERENCEONE"],
  RESEARCH: ["RESEARCHONE"],
  TEACHING: ["TEACHINGONE"],
  TYPICALCASE: ["TYPICALCASEONE"],
};

const OTHERINFO_OBJECT_VARIANTS = new Set([
  "OTHERTWO",
  "OTHERTHREE",
  "OTHERFOUR",
  "OTHEREIGHT",
]);

const normalizeBlockType = (type: string): string => {
  const upper = type.toUpperCase();
  if (upper === "EXPERIENCE") {
    return "EXPERIMENT";
  }

  return upper;
};

const getBlockVariantKey = (block: Pick<PortfolioBlock, "type" | "variant">): string => {
  return `${normalizeBlockType(block.type)}.${block.variant.toUpperCase()}`;
};

const getDefaultVariant = (type: string): string => {
  const normalizedType = normalizeBlockType(type);
  return BLOCK_VARIANTS[normalizedType]?.[0] ?? "INTROONE";
};

const isEditableBlockType = (type: string): type is EditableBlockType => {
  return EDITABLE_BLOCK_TYPES.includes(type as EditableBlockType);
};

const isExtendedEditorBlockType = (type: string): type is ExtendedEditorBlockType => {
  return isEditableBlockType(type) || type === "RESEARCH" || type === "TEACHING" || type === "TYPICALCASE";
};

const getPreferredEditableType = (blocks: PortfolioBlock[]): EditableBlockType => {
  for (const type of EDITABLE_BLOCK_TYPES) {
    if (blocks.some((block) => normalizeBlockType(block.type) === type)) {
      return type;
    }
  }

  return "INTRO";
};

const sortAndReindexBlocks = (blocks: PortfolioBlock[]): PortfolioBlock[] => {
  return [...blocks]
    .sort((a, b) => a.order - b.order)
    .map((block, index) => ({
      ...block,
      order: index + 1,
    }));
};

const deepClone = <T,>(value: T): T => {
  if (value === null || value === undefined) {
    return value;
  }

  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return value;
  }
};

const toRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }

  return {};
};

const toRecordArray = (value: unknown): Record<string, unknown>[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) =>
    item && typeof item === "object" && !Array.isArray(item)
      ? { ...(item as Record<string, unknown>) }
      : {},
  );
};

const toText = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
};

const createDefaultBlockData = (type: string, variant: string): unknown => {
  const normalizedType = normalizeBlockType(type);
  const normalizedVariant = variant.toUpperCase();

  switch (normalizedType) {
    case "INTRO":
      return {
        fullName: "",
        title: "",
        description: "",
        avatar: "",
        email: "",
        phone: "",
      };

    case "SKILL":
      if (normalizedVariant === "SKILLTWO") {
        return {
          languages: [],
          frameworks: [],
          tools: [],
        };
      }

      return [];

    case "EDUCATION":
      return [];

    case "EXPERIMENT":
      return [];

    case "PROJECT":
      return [];

    case "DIPLOMA":
      return [];

    case "AWARD":
      return [];

    case "ACTIVITIES":
      return [];

    case "OTHERINFO":
      if (normalizedVariant === "OTHERONE") {
        return [];
      }

      if (normalizedVariant === "OTHERTWO" || normalizedVariant === "OTHERTHREE" || normalizedVariant === "OTHERFOUR") {
        return { detail: "" };
      }

      if (normalizedVariant === "OTHERFIVE" || normalizedVariant === "OTHERSIX") {
        return [];
      }

      if (normalizedVariant === "OTHERSEVEN") {
        return [];
      }

      if (normalizedVariant === "OTHEREIGHT") {
        return {
          title: "",
          licenseNumber: "",
          issuer: "",
          status: "",
          detail: "",
        };
      }

      return [];

    case "REFERENCE":
      return [];

    case "RESEARCH":
      return [];

    case "TEACHING":
      return [];

    case "TYPICALCASE":
      return [];

    default:
      return {};
  }
};

const shouldUseObjectData = (type: string, variant: string): boolean => {
  const normalizedType = normalizeBlockType(type);
  const normalizedVariant = variant.toUpperCase();

  if (normalizedType === "INTRO") {
    return true;
  }

  if (normalizedType === "SKILL" && normalizedVariant === "SKILLTWO") {
    return true;
  }

  if (normalizedType === "OTHERINFO" && OTHERINFO_OBJECT_VARIANTS.has(normalizedVariant)) {
    return true;
  }

  return false;
};

const getTemplateName = (
  templateId: number,
  templates: PortfolioResponse[],
  templateNames: Record<number, string>,
): string => {
  const index = templates.findIndex((t) => t.portfolioId === templateId);
  if (index >= 0 && templateNames[index]) {
    return templateNames[index];
  }
  return `Template ${templateId}`;
};

const getFirstProjectLink = (item: Record<string, unknown>): string => {
  const projectLinks = Array.isArray(item.projectLinks) ? item.projectLinks : [];
  const links = Array.isArray(item.links) ? item.links : [];

  for (const candidate of projectLinks) {
    if (candidate && typeof candidate === "object") {
      const link = toText((candidate as Record<string, unknown>).link).trim();
      if (link) {
        return link;
      }
    }
  }

  for (const candidate of links) {
    if (candidate && typeof candidate === "object") {
      const link = toText((candidate as Record<string, unknown>).link).trim();
      if (link) {
        return link;
      }
    }
  }

  return "";
};

const getOrderedBlockCatalog = (): typeof BLOCK_CATALOG => {
  const catalog = [...BLOCK_CATALOG];
  
  // Define custom order: position of each block type
  const blockOrder: Record<string, number> = {
    INTRO: 0,
    SKILL: 1,
    EDUCATION: 2,
    EXPERIMENT: 3,
    PROJECT: 4,
    DIPLOMA: 5,
    AWARD: 6,
    ACTIVITIES: 7,
    REFERENCE: 8,
    RESEARCH: 9,
    TEACHING: 10,
    TYPICALCASE: 11,
  };
  
  // Sort blocks by custom order
  return catalog.sort((a, b) => {
    const orderA = blockOrder[a.type] ?? 999;
    const orderB = blockOrder[b.type] ?? 999;
    return orderA - orderB;
  });
};

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Get user authentication data
  const { user, accessToken } = useAppSelector((state) => state.auth);

  // Helper function to extract user info for auto-populating intro fields
  const getUserInfo = () => {
    if (!user) {
      return undefined;
    }
    return {
      fullName: employeeProfile?.name || (user as any).fullName || (user as any).name || undefined,
      email: user.email,
      phone: employeeProfile?.phone || (user as any).phone || undefined,
      name: employeeProfile?.name || (user as any).name || undefined,
    };
  };

  // Portfolio template display names by index
  const TEMPLATE_DISPLAY_NAMES: Record<number, string> = {
    0: "Hồ sơ xin việc",
    1: "Hồ sơ xin thực tập",
    2: "Hồ sơ xin học bổng",
    3: "Hồ sơ xin học bổng",
    4: "Hồ sơ xin thực tập",
  };

  const [activeTab, setActiveTab] = useState<EditorTab>(isEditMode ? "component" : "template");
  const [templates, setTemplates] = useState<PortfolioResponse[]>([]);
  const [employeeProfile, setEmployeeProfile] = useState<EmployeeProfile | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<number | null>(null);
  const [allowedBlockTypes, setAllowedBlockTypes] = useState<Set<string>>(new Set());
  const [portfolioName, setPortfolioName] = useState("Hồ sơ mới");
  const [activeEditorBlockType, setActiveEditorBlockType] =
    useState<ExtendedEditorBlockType>("INTRO");
  const [activeEditorBlockVariant, setActiveEditorBlockVariant] = useState<string | null>(null);
  const [editorSlotPreset, setEditorSlotPreset] = useState<EditorSlotPreset>("default");
  const [blocks, setBlocks] = useState<PortfolioBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorResetKey, setEditorResetKey] = useState(0);

  const nextTempBlockIdRef = useRef(-1);

  // Variant selector state
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedBlockTypeForVariant, setSelectedBlockTypeForVariant] = useState<string | null>(null);

  const allocateTempBlockId = (): number => {
    const nextId = nextTempBlockIdRef.current;
    nextTempBlockIdRef.current -= 1;
    return nextId;
  };

  // Fetch employee profile for auto-populating user info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !accessToken) {
          return;
        }

        console.log("📡 Fetching employee profile for user:", user.employeeId);
        const profile = await fetchEmployeeProfile(accessToken);
        console.log("✅ Employee profile fetched:", profile);
        setEmployeeProfile(profile);
      } catch (error) {
        console.warn("⚠️ Failed to fetch employee profile:", error);
        // Don't show error notification, this is optional data
      }
    };

    fetchProfile();
  }, [user, accessToken]);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch portfolio templates
        const templateData = await portfolioService.fetchPortfolioTemplates();
        setTemplates(templateData.slice(0, 5));

        if (isEditMode && id) {
          const portfolioId = Number(id);
          
          // Ensure accessToken is available
          if (!accessToken) {
            throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          }
          
          const detail = await portfolioService.fetchPortfolioByIdAPI(portfolioId, accessToken);

          if (!detail) {
            throw new Error("Không tìm thấy portfolio cần chỉnh sửa.");
          }

          const sortedBlocks = sortAndReindexBlocks(detail.blocks).map((block) => ({
            ...block,
            data: deepClone(block.data),
          }));

          const preferredType = getPreferredEditableType(sortedBlocks);
          const preferredBlock =
            sortedBlocks.find(
              (block) => normalizeBlockType(block.type) === preferredType,
            ) ?? sortedBlocks[0] ?? null;

          setBlocks(sortedBlocks);
          setActiveTab("component");
          setActiveEditorBlockType(preferredType);
          // Set the variant from the preferred block so the correct editor is shown
          setActiveEditorBlockVariant(preferredBlock?.variant?.toUpperCase() ?? null);
          setEditorSlotPreset("default");
          setSelectedBlockId(preferredBlock?.id ?? null);
          setShowBlockSelector(false);
          // Use actual portfolio name from API response, fallback to default name
          setPortfolioName(detail.portfolioName || `Portfolio ${portfolioId}`);
          return;
        }

        setBlocks([]);
        setActiveEditorBlockType("INTRO");
        setActiveEditorBlockVariant(null);
        setEditorSlotPreset("default");
        setSelectedBlockId(null);
        setShowBlockSelector(false);
        setPortfolioName("Hồ sơ mới");
        setAllowedBlockTypes(new Set()); // Create mode: no template selected yet
      } catch (initializationError) {
        const message =
          initializationError instanceof Error
            ? initializationError.message
            : "Không thể khởi tạo màn tạo hồ sơ.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [id, isEditMode, accessToken]);

  useEffect(() => {
    if (blocks.length === 0) {
      setSelectedBlockId(null);
      setShowBlockSelector(true);
      return;
    }

    if (showBlockSelector) {
      return;
    }

    const preferredBlock = blocks.find(
      (block) =>
        normalizeBlockType(block.type) === activeEditorBlockType
        && (!activeEditorBlockVariant || block.variant.toUpperCase() === activeEditorBlockVariant),
    );

    const fallbackBlock = blocks.find(
      (block) => normalizeBlockType(block.type) === activeEditorBlockType,
    );

    const targetBlock = preferredBlock ?? fallbackBlock;

    if (targetBlock) {
      if (selectedBlockId !== targetBlock.id) {
        setSelectedBlockId(targetBlock.id);
      }
      return;
    }

    if (selectedBlockId === null || !blocks.some((block) => block.id === selectedBlockId)) {
      setSelectedBlockId(blocks[0].id);
    }
  }, [activeEditorBlockType, activeEditorBlockVariant, blocks, selectedBlockId, showBlockSelector]);

  const selectedBlock = useMemo(
    () => {
      const found = blocks.find((block) => block.id === selectedBlockId) ?? null;
      console.log("📋 [selectedBlock useMemo] selectedBlockId:", selectedBlockId, "found:", found);
      if (found) {
        console.log("📋 [selectedBlock useMemo] Block data:", found.data);
      }
      return found;
    },
    [blocks, selectedBlockId],
  );

  const activeEditorBlock = useMemo(
    () =>
      blocks.find(
        (block) =>
          normalizeBlockType(block.type) === activeEditorBlockType
          && (!activeEditorBlockVariant || block.variant.toUpperCase() === activeEditorBlockVariant),
      ) ?? null,
    [activeEditorBlockType, activeEditorBlockVariant, blocks],
  );

  const isTemplateBasedEditorSlots = !isEditMode && editorSlotPreset !== "default";

  const editorSlots = useMemo<EditorSlot[]>(() => {
    if (editorSlotPreset === "template2") {
      return TEMPLATE_TWO_EDITOR_SLOTS;
    }

    if (editorSlotPreset === "template3") {
      return TEMPLATE_THREE_EDITOR_SLOTS;
    }

    if (editorSlotPreset === "template4") {
      return TEMPLATE_FOUR_EDITOR_SLOTS;
    }

    if (editorSlotPreset === "template5") {
      return TEMPLATE_FIVE_EDITOR_SLOTS;
    }

    return EDITABLE_BLOCK_TYPES.map((type) => ({
      type,
      label: BLOCK_LABELS[type],
    }));
  }, [editorSlotPreset]);

  const activeEditorSlot = useMemo(() => {
    return (
      editorSlots.find((slot) => {
        const normalizedVariant = slot.variant?.toUpperCase();

        return (
          slot.type === activeEditorBlockType
          && (!normalizedVariant || normalizedVariant === activeEditorBlockVariant)
        );
      }) ?? null
    );
  }, [activeEditorBlockType, activeEditorBlockVariant, editorSlots]);

  const activeEditorLabel = activeEditorSlot?.label ?? BLOCK_LABELS[activeEditorBlockType];

  const selectedBlockVariantKey = useMemo(() => {
    if (!selectedBlock) {
      return "";
    }

    return getBlockVariantKey(selectedBlock);
  }, [selectedBlock]);

  const isEditingIntroOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "INTRO"
      && selectedBlock.variant.toUpperCase() === "INTROONE"
    );
  }, [selectedBlock]);

  const isEditingIntroTwo = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "INTRO"
      && selectedBlock.variant.toUpperCase() === "INTROTWO"
    );
  }, [selectedBlock]);

  const isEditingIntroThree = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "INTRO"
      && selectedBlock.variant.toUpperCase() === "INTROTHREE"
    );
  }, [selectedBlock]);

  const isEditingIntroFour = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "INTRO"
      && selectedBlock.variant.toUpperCase() === "INTROFOUR"
    );
  }, [selectedBlock]);

  const isEditingIntroFive = useMemo<boolean>(() => {
    if (!selectedBlock) {
      console.log("🎯 [isEditingIntroFive useMemo] No selectedBlock");
      return false;
    }

    const result = (
      normalizeBlockType(selectedBlock.type) === "INTRO"
      && selectedBlock.variant.toUpperCase() === "INTROFIVE"
    );
    
    console.log("🎯 [isEditingIntroFive useMemo] selectedBlock type:", selectedBlock.type, "variant:", selectedBlock.variant, "result:", result);
    return result;
  }, [selectedBlock]);

  const isEditingSkillOne = selectedBlockVariantKey === "SKILL.SKILLONE";

  const isEditingSkillTwo = selectedBlockVariantKey === "SKILL.SKILLTWO";

  const isEditingSkillThree = selectedBlockVariantKey === "SKILL.SKILLTHREE";

  const isEditingEducationOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "EDUCATION"
      && selectedBlock.variant.toUpperCase() === "EDUCATIONONE"
    );
  }, [selectedBlock]);

  const isEditingEducationThree = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "EDUCATION"
      && selectedBlock.variant.toUpperCase() === "EDUCATIONTHREE"
    );
  }, [selectedBlock]);

  const isEditingEducationTwo = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "EDUCATION"
      && selectedBlock.variant.toUpperCase() === "EDUCATIONTWO"
    );
  }, [selectedBlock]);

  const isEditingExperienceOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "EXPERIMENT"
      && selectedBlock.variant.toUpperCase() === "EXPERIMENTONE"
    );
  }, [selectedBlock]);

  const isEditingProjectOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "PROJECT"
      && selectedBlock.variant.toUpperCase() === "PROJECTONE"
    );
  }, [selectedBlock]);

  const isEditingProjectTwo = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "PROJECT"
      && selectedBlock.variant.toUpperCase() === "PROJECTTWO"
    );
  }, [selectedBlock]);

  const isEditingProjectThree = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "PROJECT"
      && selectedBlock.variant.toUpperCase() === "PROJECTTHREE"
    );
  }, [selectedBlock]);

  const isEditingAwardOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "AWARD"
      && selectedBlock.variant.toUpperCase() === "AWARDONE"
    );
  }, [selectedBlock]);

  const isEditingActivityOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "ACTIVITIES"
      && selectedBlock.variant.toUpperCase() === "ACTIVITYONE"
    );
  }, [selectedBlock]);

  const isEditingOtherInfoOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "OTHERINFO"
      && selectedBlock.variant.toUpperCase() === "OTHERONE"
    );
  }, [selectedBlock]);

  const isEditingOtherInfoTwo = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "OTHERINFO"
      && selectedBlock.variant.toUpperCase() === "OTHERTWO"
    );
  }, [selectedBlock]);

  const isEditingOtherInfoSix = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "OTHERINFO"
      && selectedBlock.variant.toUpperCase() === "OTHERSIX"
    );
  }, [selectedBlock]);

  const isEditingOtherInfoSeven = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "OTHERINFO"
      && selectedBlock.variant.toUpperCase() === "OTHERSEVEN"
    );
  }, [selectedBlock]);

  const isEditingOtherInfoFive = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "OTHERINFO"
      && selectedBlock.variant.toUpperCase() === "OTHERFIVE"
    );
  }, [selectedBlock]);

  const isEditingOtherInfoEight = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "OTHERINFO"
      && selectedBlock.variant.toUpperCase() === "OTHEREIGHT"
    );
  }, [selectedBlock]);

  const isEditingReferenceOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "REFERENCE"
      && selectedBlock.variant.toUpperCase() === "REFERENCEONE"
    );
  }, [selectedBlock]);

  const isEditingCertificateOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "DIPLOMA"
      && selectedBlock.variant.toUpperCase() === "DIPLOMAONE"
    );
  }, [selectedBlock]);

  const isEditingTeachingOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "TEACHING"
      && selectedBlock.variant.toUpperCase() === "TEACHINGONE"
    );
  }, [selectedBlock]);

  const isEditingTypicalCaseOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "TYPICALCASE"
      && selectedBlock.variant.toUpperCase() === "TYPICALCASEONE"
    );
  }, [selectedBlock]);

  const isEditingResearchOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "RESEARCH"
      && selectedBlock.variant.toUpperCase() === "RESEARCHONE"
    );
  }, [selectedBlock]);

  const isUsingDedicatedEditor =
    isEditingIntroOne
    || isEditingIntroTwo
    || isEditingIntroThree
    || isEditingIntroFour
    || isEditingIntroFive
    || isEditingSkillOne
    || isEditingSkillTwo
    || isEditingSkillThree
    || isEditingEducationOne
    || isEditingEducationTwo
    || isEditingEducationThree
    || isEditingExperienceOne
    || isEditingProjectOne
    || isEditingProjectTwo
    || isEditingProjectThree
    || isEditingAwardOne
    || isEditingActivityOne
    || isEditingOtherInfoOne
    || isEditingOtherInfoTwo
    || isEditingOtherInfoFive
    || isEditingOtherInfoSix
    || isEditingOtherInfoSeven
    || isEditingOtherInfoEight
    || isEditingReferenceOne
    || isEditingCertificateOne
    || isEditingTeachingOne
    || isEditingTypicalCaseOne
    || isEditingResearchOne;

  const introOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingIntroOne) {
      return null;
    }

    return createIntroOneDraft(selectedBlock.data, getUserInfo());
  }, [isEditingIntroOne, selectedBlock, employeeProfile]);

  const introOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingIntroOne) {
      return "intro-one-editor";
    }

    return `intro-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}-${editorResetKey}`;
  }, [isEditingIntroOne, selectedBlock, editorResetKey]);

  const introTwoInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingIntroTwo) {
      return null;
    }

    return createIntroTwoDraft(selectedBlock.data, getUserInfo());
  }, [isEditingIntroTwo, selectedBlock, employeeProfile]);

  const introTwoEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingIntroTwo) {
      return "intro-two-editor";
    }

    return `intro-two-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingIntroTwo, selectedBlock]);

  const introThreeInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingIntroThree) {
      return null;
    }

    return createIntroThreeDraft(selectedBlock.data, getUserInfo());
  }, [isEditingIntroThree, selectedBlock, employeeProfile]);

  const introThreeEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingIntroThree) {
      return "intro-three-editor";
    }

    return `intro-three-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingIntroThree, selectedBlock]);

  const introFourInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingIntroFour) {
      return null;
    }

    return createIntroFourDraft(selectedBlock.data, getUserInfo());
  }, [isEditingIntroFour, selectedBlock, employeeProfile]);

  const introFourEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingIntroFour) {
      return "intro-four-editor";
    }

    return `intro-four-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingIntroFour, selectedBlock]);

  const introFiveInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingIntroFive) {
      return null;
    }

    return createIntroFiveDraft(selectedBlock.data, getUserInfo());
  }, [isEditingIntroFive, selectedBlock, employeeProfile]);

  const introFiveEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingIntroFive) {
      return "intro-five-editor";
    }

    return `intro-five-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingIntroFive, selectedBlock]);

  const educationOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingEducationOne) {
      return null;
    }

    return createEducationOneDraft(selectedBlock.data);
  }, [isEditingEducationOne, selectedBlock]);

  const educationOneListData = useMemo(() => {
    if (!selectedBlock || !isEditingEducationOne) {
      return [];
    }

    const data = selectedBlock.data;
    if (Array.isArray(data)) {
      return data.map((item) => createEducationOneDraft(item));
    }

    return [];
  }, [isEditingEducationOne, selectedBlock]);

  const educationOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingEducationOne) {
      return "education-one-editor";
    }

    return `education-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingEducationOne, selectedBlock]);

  const educationThreeInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingEducationThree) {
      return null;
    }

    return createEducationThreeDraft(selectedBlock.data);
  }, [isEditingEducationThree, selectedBlock]);

  const educationThreeEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingEducationThree) {
      return "education-three-editor";
    }

    return `education-three-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingEducationThree, selectedBlock]);

  const educationTwoInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingEducationTwo) {
      return null;
    }

    return createEducationTwoDraft(selectedBlock.data);
  }, [isEditingEducationTwo, selectedBlock]);

  const educationTwoEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingEducationTwo) {
      return "education-two-editor";
    }

    return `education-two-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingEducationTwo, selectedBlock]);

  const experienceOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingExperienceOne) {
      return null;
    }

    return createExperienceOneDraft(selectedBlock.data);
  }, [isEditingExperienceOne, selectedBlock]);

  const experienceOneListData = useMemo(() => {
    if (!selectedBlock || !isEditingExperienceOne) {
      return [];
    }

    const data = selectedBlock.data;
    if (Array.isArray(data)) {
      return data.map((item) => createExperienceOneDraft(item));
    }

    return [];
  }, [isEditingExperienceOne, selectedBlock]);

  const experienceOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingExperienceOne) {
      return "experience-one-editor";
    }

    return `experience-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingExperienceOne, selectedBlock]);

  const projectOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingProjectOne) {
      return null;
    }

    return createProjectOneDraft(selectedBlock.data);
  }, [isEditingProjectOne, selectedBlock]);

  const projectOneListData = useMemo(() => {
    if (!selectedBlock || !isEditingProjectOne) {
      return [];
    }

    const data = selectedBlock.data;
    if (Array.isArray(data)) {
      return data.map((item) => createProjectOneDraft(item));
    }

    return [];
  }, [isEditingProjectOne, selectedBlock]);

  const projectOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingProjectOne) {
      return "project-one-editor";
    }

    return `project-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingProjectOne, selectedBlock]);

  const projectTwoInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingProjectTwo) {
      return null;
    }

    return createProjectTwoDraft(selectedBlock.data);
  }, [isEditingProjectTwo, selectedBlock]);

  const projectTwoEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingProjectTwo) {
      return "project-two-editor";
    }

    return `project-two-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingProjectTwo, selectedBlock]);

  const projectThreeInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingProjectThree) {
      return null;
    }

    return createProjectThreeDraft(selectedBlock.data);
  }, [isEditingProjectThree, selectedBlock]);

  const projectThreeEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingProjectThree) {
      return "project-three-editor";
    }

    return `project-three-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingProjectThree, selectedBlock]);

  const awardOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingAwardOne) {
      return null;
    }

    return createAwardOneDraft(selectedBlock.data);
  }, [isEditingAwardOne, selectedBlock]);

  const awardOneListData = useMemo(() => {
    if (!selectedBlock || !isEditingAwardOne) {
      return [];
    }

    const data = selectedBlock.data;
    if (Array.isArray(data)) {
      return data.map((item) => createAwardOneDraft(item));
    }

    return [];
  }, [isEditingAwardOne, selectedBlock]);

  const awardOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingAwardOne) {
      return "award-one-editor";
    }

    return `award-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingAwardOne, selectedBlock]);

  const activityOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingActivityOne) {
      return null;
    }

    return createActivityOneDraft(selectedBlock.data);
  }, [isEditingActivityOne, selectedBlock]);

  const activityOneListData = useMemo(() => {
    if (!selectedBlock || !isEditingActivityOne) {
      return [];
    }

    const data = selectedBlock.data;
    if (Array.isArray(data)) {
      return data.map((item) => createActivityOneDraft(item));
    }

    return [];
  }, [isEditingActivityOne, selectedBlock]);

  const activityOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingActivityOne) {
      return "activity-one-editor";
    }

    return `activity-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingActivityOne, selectedBlock]);

  const otherInfoOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoOne) {
      return null;
    }

    return createOtherInfoOneDraft(selectedBlock.data);
  }, [isEditingOtherInfoOne, selectedBlock]);

  const otherInfoOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoOne) {
      return "otherinfo-one-editor";
    }

    return `otherinfo-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingOtherInfoOne, selectedBlock]);

  const otherInfoTwoInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoTwo) {
      return null;
    }

    return createOtherInfoTwoDraft(selectedBlock.data);
  }, [isEditingOtherInfoTwo, selectedBlock]);

  const otherInfoTwoEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoTwo) {
      return "otherinfo-two-editor";
    }

    return `otherinfo-two-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingOtherInfoTwo, selectedBlock]);

  const otherInfoFiveInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoFive) {
      return null;
    }

    return createOtherFiveDraft(selectedBlock.data);
  }, [isEditingOtherInfoFive, selectedBlock]);

  const otherInfoFiveEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoFive) {
      return "otherinfo-five-editor";
    }

    return `otherinfo-five-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingOtherInfoFive, selectedBlock]);

  const otherInfoSixInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoSix) {
      return null;
    }

    return createOtherInfoSixDraft(selectedBlock.data);
  }, [isEditingOtherInfoSix, selectedBlock]);

  const otherInfoSixEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoSix) {
      return "otherinfo-six-editor";
    }

    return `otherinfo-six-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingOtherInfoSix, selectedBlock]);

  const otherInfoSevenInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoSeven) {
      return null;
    }

    return createOtherSevenDraft(selectedBlock.data);
  }, [isEditingOtherInfoSeven, selectedBlock]);

  const otherInfoSevenEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoSeven) {
      return "otherinfo-seven-editor";
    }

    return `otherinfo-seven-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingOtherInfoSeven, selectedBlock]);

  const otherInfoEightInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoEight) {
      return null;
    }

    return createOtherEightDraft(selectedBlock.data);
  }, [isEditingOtherInfoEight, selectedBlock]);

  const otherInfoEightEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingOtherInfoEight) {
      return "otherinfo-eight-editor";
    }

    return `otherinfo-eight-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingOtherInfoEight, selectedBlock]);

  const referenceOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingReferenceOne) {
      return null;
    }

    return createReferenceOneDraft(selectedBlock.data);
  }, [isEditingReferenceOne, selectedBlock]);

  const referenceOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingReferenceOne) {
      return "reference-one-editor";
    }

    return `reference-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingReferenceOne, selectedBlock]);

  const certificateOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingCertificateOne) {
      return null;
    }

    return createCertificateOneDraft(selectedBlock.data);
  }, [isEditingCertificateOne, selectedBlock]);

  const certificateOneListData = useMemo(() => {
    if (!selectedBlock || !isEditingCertificateOne) {
      return [];
    }

    const data = selectedBlock.data;
    if (Array.isArray(data)) {
      return data.map((item) => createCertificateOneDraft(item));
    }

    return [];
  }, [isEditingCertificateOne, selectedBlock]);

  const certificateOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingCertificateOne) {
      return "certificate-one-editor";
    }

    return `certificate-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingCertificateOne, selectedBlock]);

  const skillOneInitialData = useMemo(() => {
    console.log("📊 [skillOneInitialData useMemo] isEditingSkillOne:", isEditingSkillOne, "selectedBlock:", selectedBlock);
    
    if (!selectedBlock || !isEditingSkillOne) {
      console.log("  ✗ Returning null");
      return null;
    }

    const draft = createSkillOneDraft(selectedBlock.data);
    console.log("  ✓ Created draft:", draft);
    return draft;
  }, [isEditingSkillOne, selectedBlock]);

  const skillOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingSkillOne) {
      return "skill-one-editor";
    }

    return `skill-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}-${editorResetKey}`;
  }, [isEditingSkillOne, selectedBlock, editorResetKey]);

  const skillTwoInitialData = useMemo(() => {
    console.log("📊 [skillTwoInitialData useMemo] isEditingSkillTwo:", isEditingSkillTwo, "selectedBlock:", selectedBlock);
    
    if (!selectedBlock || !isEditingSkillTwo) {
      console.log("  ✗ Returning null");
      return null;
    }

    const draft = createSkillTwoDraft(selectedBlock.data);
    console.log("  ✓ Created draft:", draft);
    return draft;
  }, [isEditingSkillTwo, selectedBlock]);

  const skillTwoEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingSkillTwo) {
      return "skill-two-editor";
    }

    return `skill-two-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingSkillTwo, selectedBlock]);

  const skillThreeEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingSkillThree) {
      return "skill-three-editor";
    }

    const entryCount = toRecordArray(selectedBlock.data).length;
    return `skill-three-${selectedBlock.id}-${entryCount}`;
  }, [isEditingSkillThree, selectedBlock]);

  const teachingOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingTeachingOne) {
      return null;
    }

    return createEmptyTeachingOneDraft();
  }, [isEditingTeachingOne, selectedBlock]);

  const teachingOneListData = useMemo(() => {
    if (!selectedBlock || !isEditingTeachingOne) {
      return [];
    }

    const data = selectedBlock.data;
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          return {
            subject: toText(record.subject),
            teachingplace: toText(record.teachingplace),
          };
        }
        return createEmptyTeachingOneDraft();
      });
    }

    return [];
  }, [isEditingTeachingOne, selectedBlock]);

  const typicalCaseOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingTypicalCaseOne) {
      return null;
    }

    return createEmptyTypicalCaseOneDraft();
  }, [isEditingTypicalCaseOne, selectedBlock]);

  const typicalCaseOneListData = useMemo(() => {
    if (!selectedBlock || !isEditingTypicalCaseOne) {
      return [];
    }

    const data = selectedBlock.data;
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>;
          return {
            patient: toText(record.patient),
            age: toText(record.age),
            caseName: toText(record.caseName),
            stage: toText(record.stage),
            regiment: toText(record.regiment),
          };
        }
        return createEmptyTypicalCaseOneDraft();
      });
    }

    return [];
  }, [isEditingTypicalCaseOne, selectedBlock]);

  const researchOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingResearchOne) {
      return null;
    }

    return createResearchOneDraft(selectedBlock.data);
  }, [isEditingResearchOne, selectedBlock]);

  const researchOneListData = useMemo(() => {
    if (!selectedBlock || !isEditingResearchOne) {
      return [];
    }

    const data = selectedBlock.data;
    if (Array.isArray(data)) {
      return data.map((item) => createResearchOneDraft(item));
    }

    return [];
  }, [isEditingResearchOne, selectedBlock]);

  const teachingOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingTeachingOne) {
      return "teaching-one-editor";
    }

    const entryCount = toRecordArray(selectedBlock.data).length;
    return `teaching-one-${selectedBlock.id}-${entryCount}`;
  }, [isEditingTeachingOne, selectedBlock]);

  const typicalCaseOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingTypicalCaseOne) {
      return "typical-case-one-editor";
    }

    const entryCount = toRecordArray(selectedBlock.data).length;
    return `typical-case-one-${selectedBlock.id}-${entryCount}`;
  }, [isEditingTypicalCaseOne, selectedBlock]);

  const researchOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingResearchOne) {
      return "research-one-editor";
    }

    const entryCount = toRecordArray(selectedBlock.data).length;
    return `research-one-${selectedBlock.id}-${entryCount}`;
  }, [isEditingResearchOne, selectedBlock]);

  const updateSelectedBlockData = (updater: (current: unknown) => unknown) => {
    console.log("🔵 [updateSelectedBlockData] Called - selectedBlockId:", selectedBlockId);
    if (selectedBlockId === null) {
      console.log("🔴 [updateSelectedBlockData] selectedBlockId is null, returning");
      return;
    }

    console.log("🟡 [updateSelectedBlockData] Current blocks before update:", blocks);
    
    setBlocks((prevBlocks) => {
      const blockFound = prevBlocks.some(b => b.id === selectedBlockId);
      console.log("🟡 [updateSelectedBlockData] Looking for block with id", selectedBlockId, "found:", blockFound);
      
      const newBlocks = prevBlocks.map((block) => {
        if (block.id === selectedBlockId) {
          console.log("🟡 [updateSelectedBlockData] Found matching block:", block.id);
          const deepClonedData = deepClone(block.data);
          console.log("🟡 [updateSelectedBlockData] Deep cloned data:", deepClonedData);
          const updatedData = updater(deepClonedData);
          console.log("🟡 [updateSelectedBlockData] After updater, new data:", updatedData);
          return {
            ...block,
            data: updatedData,
          };
        }
        return block;
      });
      
      // Verify the update actually happened
      const updatedBlockFound = newBlocks.some(b => b.id === selectedBlockId);
      console.log("🟢 [updateSelectedBlockData] After mapping, block found:", updatedBlockFound);
      if (updatedBlockFound) {
        const updatedBlock = newBlocks.find(b => b.id === selectedBlockId);
        console.log("🟢 [updateSelectedBlockData] Updated block data:", updatedBlock?.data);
      }
      console.log("🟢 [updateSelectedBlockData] New blocks array:", newBlocks);
      return newBlocks;
    });
  };

  // Helper function to reset editor form after saving
  const resetEditorFormAfterSave = () => {
    setEditorResetKey((prev) => prev + 1);
  };

  const updateSelectedObjectField = (field: string, value: string) => {
    updateSelectedBlockData((current) => {
      const nextData = toRecord(current);
      nextData[field] = value;
      return nextData;
    });
  };

  const updateSelectedArrayItemField = (
    index: number,
    field: string,
    value: string,
  ) => {
    updateSelectedBlockData((current) => {
      const nextData = toRecordArray(current);
      const currentItem = nextData[index] ?? {};
      nextData[index] = {
        ...currentItem,
        [field]: value,
      };
      return nextData;
    });
  };

  const updateSelectedArrayItem = (
    index: number,
    updater: (currentItem: Record<string, unknown>) => Record<string, unknown>,
  ) => {
    updateSelectedBlockData((current) => {
      const nextData = toRecordArray(current);
      const currentItem = nextData[index] ?? {};
      nextData[index] = updater(currentItem);
      return nextData;
    });
  };

  const addSelectedArrayItem = (factory: () => Record<string, unknown>) => {
    updateSelectedBlockData((current) => {
      const nextData = toRecordArray(current);
      nextData.push(factory());
      return nextData;
    });
  };

  const removeSelectedArrayItem = (index: number) => {
    updateSelectedBlockData((current) => {
      const nextData = toRecordArray(current);
      return nextData.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const applyTemplate = (template: PortfolioResponse) => {
    // Extract allowed block types from template (for filtering component catalog)
    const blockTypes = new Set(
      template.blocks.map((block) => normalizeBlockType(block.type))
    );
    
    // Initialize as empty portfolio - user starts fresh but with template block type restrictions
    setAllowedBlockTypes(blockTypes);
    setBlocks([]);
    setActiveTemplateId(template.portfolioId);
    const selectedTemplateIndex = templates.findIndex(
      (item) => item.portfolioId === template.portfolioId,
    );
    const templateVariants = new Set(
      template.blocks.map((block) => block.variant.toUpperCase()),
    );
    const hasTemplateTwoVariantSet =
      templateVariants.size === TEMPLATE_TWO_REQUIRED_VARIANTS.size
      && Array.from(TEMPLATE_TWO_REQUIRED_VARIANTS).every((variant) => templateVariants.has(variant));
    const hasTemplateThreeVariantSet =
      templateVariants.size === TEMPLATE_THREE_REQUIRED_VARIANTS.size
      && Array.from(TEMPLATE_THREE_REQUIRED_VARIANTS).every((variant) => templateVariants.has(variant));
    const hasTemplateFourVariantSet =
      templateVariants.size === TEMPLATE_FOUR_REQUIRED_VARIANTS.size
      && Array.from(TEMPLATE_FOUR_REQUIRED_VARIANTS).every((variant) => templateVariants.has(variant));
    const hasTemplateFiveVariantSet =
      templateVariants.size === TEMPLATE_FIVE_REQUIRED_VARIANTS.size
      && Array.from(TEMPLATE_FIVE_REQUIRED_VARIANTS).every((variant) => templateVariants.has(variant));
    const shouldUseTemplateTwoSlots = selectedTemplateIndex === 1 || hasTemplateTwoVariantSet;
    const shouldUseTemplateThreeSlots = selectedTemplateIndex === 2 || hasTemplateThreeVariantSet;
    const shouldUseTemplateFourSlots = selectedTemplateIndex === 3 || hasTemplateFourVariantSet;
    const shouldUseTemplateFiveSlots = selectedTemplateIndex === 4 || hasTemplateFiveVariantSet;

    if (shouldUseTemplateTwoSlots) {
      setEditorSlotPreset("template2");
      setActiveEditorBlockType(TEMPLATE_TWO_EDITOR_SLOTS[0].type);
      setActiveEditorBlockVariant(TEMPLATE_TWO_EDITOR_SLOTS[0].variant ?? null);
    } else if (shouldUseTemplateThreeSlots) {
      setEditorSlotPreset("template3");
      setActiveEditorBlockType(TEMPLATE_THREE_EDITOR_SLOTS[0].type);
      setActiveEditorBlockVariant(TEMPLATE_THREE_EDITOR_SLOTS[0].variant ?? null);
    } else if (shouldUseTemplateFourSlots) {
      setEditorSlotPreset("template4");
      setActiveEditorBlockType(TEMPLATE_FOUR_EDITOR_SLOTS[0].type);
      setActiveEditorBlockVariant(TEMPLATE_FOUR_EDITOR_SLOTS[0].variant ?? null);
    } else if (shouldUseTemplateFiveSlots) {
      setEditorSlotPreset("template5");
      setActiveEditorBlockType(TEMPLATE_FIVE_EDITOR_SLOTS[0].type);
      setActiveEditorBlockVariant(TEMPLATE_FIVE_EDITOR_SLOTS[0].variant ?? null);
    } else {
      setEditorSlotPreset("default");
      setActiveEditorBlockType("INTRO");
      setActiveEditorBlockVariant(null);
    }
    setSelectedBlockId(null);
    setShowBlockSelector(true);
    setActiveTab("component");
  };

  const addBlockFromCatalog = (type: string, forcedVariant?: string) => {
    const normalizedType = normalizeBlockType(type);
    // In create mode with template, check if block type is allowed
    if (!isEditMode && activeTemplateId && !allowedBlockTypes.has(normalizedType)) {
      setError(`Loại block "${BLOCK_LABELS[normalizedType] || normalizedType}" không được hỗ trợ bởi template này.`);
      return;
    }

    const variant = (forcedVariant?.toUpperCase() || getDefaultVariant(type)).toUpperCase();
    const newBlock: PortfolioBlock = {
      id: allocateTempBlockId(),
      type: normalizedType,
      variant,
      order: blocks.length + 1,
      data: createDefaultBlockData(type, variant),
    };

    if (isExtendedEditorBlockType(normalizedType)) {
      setActiveEditorBlockType(normalizedType);
      setActiveEditorBlockVariant(variant);
    }

    setBlocks((prevBlocks) => sortAndReindexBlocks([...prevBlocks, newBlock]));
    setSelectedBlockId(newBlock.id);
    setShowBlockSelector(false);
    setActiveTab("component");
  };

  const updateSelectedVariant = (nextVariant: string) => {
    if (selectedBlockId === null) {
      return;
    }

    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id !== selectedBlockId) {
          return block;
        }

        const normalizedType = normalizeBlockType(block.type);
        const normalizedVariant = nextVariant.toUpperCase();
        const currentData = deepClone(block.data);
        const nextShouldBeObject = shouldUseObjectData(normalizedType, normalizedVariant);

        if (nextShouldBeObject && (Array.isArray(currentData) || typeof currentData !== "object" || !currentData)) {
          return {
            ...block,
            variant: normalizedVariant,
            data: createDefaultBlockData(normalizedType, normalizedVariant),
          };
        }

        if (!nextShouldBeObject && !Array.isArray(currentData)) {
          return {
            ...block,
            variant: normalizedVariant,
            data: createDefaultBlockData(normalizedType, normalizedVariant),
          };
        }

        return {
          ...block,
          variant: normalizedVariant,
          data: currentData,
        };
      }),
    );
  };


  const handleSave = async () => {
    // Check if user is authenticated
    if (!user || !accessToken) {
      setError("Bạn cần đăng nhập để lưu hồ sơ.");
      navigate("/login");
      return;
    }

    if (blocks.length === 0) {
      setError("Bạn cần thêm ít nhất một block trước khi lưu.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Debug: Log user info
      console.log("👤 Current user object:", user);
      console.log("👤 Employee ID:", user.employeeId);
      console.log("👤 User ID:", user.id);
      console.log("👤 User email:", user.email);

      // Prepare the portfolio data structure
      const portfolioData = {
        employeeId: user.employeeId || user.id,  // Use employeeId, fallback to user.id if null
        name: portfolioName.trim() || "Hồ sơ mới",
        blocks: sortAndReindexBlocks(blocks).map((block) => ({
          id: block.id,
          type: normalizeBlockType(block.type),
          variant: block.variant.toUpperCase(),
          order: block.order,
          data: deepClone(block.data),
        })),
      };

      console.log("💾 Saving portfolio:", portfolioData);

      // Call API to create or update portfolio with files
      // Files are now collected inside the API function itself
      try {
        let result;
        
        if (isEditMode && id) {
          // Update existing portfolio
          const portfolioId = Number(id);
          console.log("📝 Updating portfolio ID:", portfolioId);
          result = await portfolioService.updatePortfolioAPI(
            portfolioId,
            portfolioData,
            accessToken,
          );
          console.log("✅ Portfolio updated successfully:", result);
          notify.success("Hồ sơ đã được cập nhật thành công!");
        } else {
          // Create new portfolio
          console.log("📝 Creating new portfolio");
          result = await portfolioService.createPortfolioAPI(
            portfolioData,
            accessToken,
          );
          console.log("✅ Portfolio created successfully:", result);
          notify.success("Hồ sơ đã được lưu thành công!");
        }

        // Clear stored image files after successful upload
        portfolioService.clearPortfolioImageFiles();
        console.log("📸 Cleared stored image files after successful portfolio save");

        // Navigate to portfolio management page with refetch flag
        navigate("/portfolioManagement?refresh=true", { replace: true });
      } catch (apiError) {
        const errorMessage =
          apiError instanceof Error
            ? apiError.message
            : "Không thể lưu hồ sơ lên máy chủ";
        console.error("❌ API Error:", errorMessage);
        setError(errorMessage);
        notify.error(errorMessage);
      }
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Không thể lưu portfolio.";
      setError(message);
      notify.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleIntroOneSave = (nextDraft: IntroOneDraft) => {
    if (!selectedBlock || !isEditingIntroOne) {
      return;
    }

    updateSelectedBlockData((current) => {
      const nextData = toRecord(current);
      nextData.fullName = nextDraft.fullName;
      nextData.name = nextDraft.fullName; // Also save as 'name' for backend compatibility
      nextData.studyField = nextDraft.studyField;
      nextData.email = nextDraft.email;
      nextData.phone = nextDraft.phone;
      nextData.description = nextDraft.description;
      nextData.avatar = nextDraft.avatar;
      return nextData;
    });
    resetEditorFormAfterSave();
  };

  const handleIntroOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleIntroTwoSave = (nextDraft: IntroTwoDraft) => {
    if (!selectedBlock || !isEditingIntroTwo) {
      return;
    }

    updateSelectedBlockData((current) => {
      const nextData = toRecord(current);
      nextData.fullName = nextDraft.fullName;
      nextData.name = nextDraft.fullName;
      nextData.position = nextDraft.position;
      nextData.title = nextDraft.position;
      nextData.yearOfStudy = nextDraft.yearOfStudy;
      nextData.school = nextDraft.school;
      nextData.studyField = nextDraft.studyField;
      nextData.email = nextDraft.email;
      nextData.phoneNumber = nextDraft.phoneNumber;
      nextData.phone = nextDraft.phoneNumber;
      nextData.avatar = nextDraft.avatar;
      return nextData;
    });
    resetEditorFormAfterSave();
  };

  const handleIntroTwoCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleIntroThreeSave = (nextDraft: IntroThreeDraft) => {
    if (!selectedBlock || !isEditingIntroThree) {
      return;
    }

    updateSelectedBlockData((current) => {
      const nextData = toRecord(current);
      nextData.fullName = nextDraft.fullName;
      nextData.name = nextDraft.fullName;
      nextData.school = nextDraft.school;
      nextData.department = nextDraft.department;
      nextData.studyField = nextDraft.studyField;
      nextData.title = nextDraft.studyField;
      nextData.gpa = nextDraft.gpa;
      nextData.avatar = nextDraft.avatar;
      return nextData;
    });
    resetEditorFormAfterSave();
  };

  const handleIntroThreeCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleIntroFourSave = (nextDraft: IntroFourDraft) => {
    console.log("🔵 [handleIntroFourSave] Called with nextDraft:", nextDraft);
    
    if (!selectedBlock || !isEditingIntroFour) {
      console.log("🔴 [handleIntroFourSave] Early return - selectedBlock:", selectedBlock, "isEditingIntroFour:", isEditingIntroFour);
      return;
    }

    updateSelectedBlockData((current) => {
      console.log("🟡 [handleIntroFourSave] Current block data:", current);
      const nextData = toRecord(current);
      console.log("🟡 [handleIntroFourSave] After toRecord:", nextData);
      
      nextData.fullName = nextDraft.fullName;
      nextData.name = nextDraft.fullName;
      nextData.school = nextDraft.school;
      nextData.department = nextDraft.department;
      nextData.studyField = nextDraft.studyField;
      nextData.title = nextDraft.studyField;
      nextData.gpa = nextDraft.gpa;
      nextData.avatar = nextDraft.avatar;
      
      console.log("🟢 [handleIntroFourSave] Updated block data:", nextData);
      
      return nextData;
    });
    resetEditorFormAfterSave();
  };

  const handleIntroFourCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleIntroFiveSave = (nextDraft: IntroFiveDraft) => {
    console.log("🔵 [handleIntroFiveSave] Called with nextDraft:", nextDraft);
    if (!selectedBlock || !isEditingIntroFive) {
      console.log("🔴 [handleIntroFiveSave] Early return - selectedBlock:", selectedBlock, "isEditingIntroFive:", isEditingIntroFive);
      return;
    }

    console.log("🟡 [handleIntroFiveSave] Before updateSelectedBlockData - selectedBlock.data:", selectedBlock.data);
    
    updateSelectedBlockData((current) => {
      console.log("🟡 [handleIntroFiveSave] Inside updater function - current data:", current);
      const nextData = toRecord(current);
      nextData.fullName = nextDraft.fullName;
      nextData.name = nextDraft.fullName;
      nextData.school = nextDraft.school;
      nextData.department = nextDraft.department;
      nextData.experience = nextDraft.experience;
      nextData.avatar = nextDraft.avatar;
      nextData.studyField = nextDraft.studyField;
      nextData.title = nextDraft.title;
      console.log("🟢 [handleIntroFiveSave] Updated nextData:", nextData);
      return nextData;
    });
    
    console.log("🟢 [handleIntroFiveSave] Calling resetEditorFormAfterSave");
    resetEditorFormAfterSave();
  };

  const handleIntroFiveCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleVariantSelect = (variant: string) => {
    if (!selectedBlockTypeForVariant) return;
    addBlockFromCatalog(selectedBlockTypeForVariant, variant);
    setSelectedBlockTypeForVariant(null);
    setShowVariantSelector(false);
  };

  const handleDeleteBlock = (blockId: number) => {
    setBlocks((current) => {
      const updated = current.filter((block) => block.id !== blockId);
      return sortAndReindexBlocks(updated);
    });

    // Clear selection
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setShowBlockSelector(true);
    }
  };

  const handleSkillOneSave = (nextDraft: SkillOneDraft) => {
    if (!selectedBlock || selectedBlockVariantKey !== "SKILL.SKILLONE") {
      return;
    }

    updateSelectedBlockData(() => {
      return nextDraft.skills.map((skillName) => ({ name: skillName }));
    });
    resetEditorFormAfterSave();
  };

  const handleSkillOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleSkillTwoSave = (nextDraft: SkillTwoDraft) => {
    if (!selectedBlock || selectedBlockVariantKey !== "SKILL.SKILLTWO") {
      return;
    }

    updateSelectedBlockData((current) => {
      const nextData = toRecord(current);
      nextData.languages = nextDraft.languages;
      nextData.frameworks = nextDraft.frameworks;
      nextData.tools = nextDraft.tools;
      return nextData;
    });
    resetEditorFormAfterSave();
  };

  const handleSkillTwoCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleSkillThreeSave = (nextDraft: SkillThreeDraft) => {
    if (!selectedBlock || !isEditingSkillThree) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);

      return [
        ...currentItems,
        {
          name: nextDraft.name,
          description: nextDraft.description,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleSkillThreeCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleEducationOneSave = (nextDraft: EducationOneDraft) => {
    if (!selectedBlock || !isEditingEducationOne) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);

      return [
        ...currentItems,
        {
          schoolName: nextDraft.schoolName,
          school: nextDraft.schoolName,
          time: nextDraft.time,
          department: nextDraft.department,
          major: nextDraft.department,
          certificate: nextDraft.certificate,
          description: nextDraft.description,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleEducationOneListSave = (educationList: EducationOneDraft[]) => {
    if (!selectedBlock || !isEditingEducationOne) {
      return;
    }

    updateSelectedBlockData(() => {
      return educationList.map((education) => ({
        schoolName: education.schoolName,
        school: education.schoolName,
        time: education.time,
        department: education.department,
        major: education.department,
        certificate: education.certificate,
        description: education.description,
      }));
    });
    resetEditorFormAfterSave();
  };

  const handleEducationOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleEducationThreeSave = (nextDraft: EducationThreeDraft) => {
    if (!selectedBlock || !isEditingEducationThree) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);

      return [
        ...currentItems,
        {
          time: nextDraft.time,
          gpa: nextDraft.gpa,
          qualified: nextDraft.qualified,
          description: nextDraft.description,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleEducationThreeCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleEducationTwoSave = (nextDraft: EducationTwoDraft) => {
    if (!selectedBlock || !isEditingEducationTwo) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);

      return [
        ...currentItems,
        {
          time: nextDraft.time,
          department: nextDraft.department,
          schoolName: nextDraft.schoolName,
          description: nextDraft.description,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleEducationTwoCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleExperienceOneSave = (nextDraft: ExperienceOneDraft) => {
    if (!selectedBlock || !isEditingExperienceOne) {
      return;
    }

    const { startDate, endDate } = splitExperienceOneTimeRange(nextDraft.time);

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);

      return [
        ...currentItems,
        {
          jobName: nextDraft.jobName,
          address: nextDraft.address,
          startDate,
          endDate,
          time: nextDraft.time,
          description: nextDraft.description,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleExperienceOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleProjectOneSave = (nextDraft: ProjectOneDraft) => {
    if (!selectedBlock || !isEditingProjectOne) {
      return;
    }

    const projectLinks = [
      { type: "github", link: nextDraft.githubLink.trim() },
      { type: "figma", link: nextDraft.figmaLink.trim() },
      { type: "app", link: nextDraft.appLink.trim() },
      { type: "website", link: nextDraft.websiteLink.trim() },
    ].filter((item) => item.link.length > 0);

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);
      const currentItem = currentItems[0] ?? {};

      return [
        {
          ...currentItem,
          image: nextDraft.image,
          name: nextDraft.name,
          description: nextDraft.description,
          role: nextDraft.role,
          technology: nextDraft.technology,
          projectLinks,
          links: projectLinks,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleProjectOneListSave = (projectList: ProjectOneDraft[]) => {
    if (!selectedBlock || !isEditingProjectOne) {
      return;
    }

    updateSelectedBlockData(() => {
      return projectList.map((project) => {
        const projectLinks = [
          { type: "github", link: project.githubLink.trim() },
          { type: "figma", link: project.figmaLink.trim() },
          { type: "app", link: project.appLink.trim() },
          { type: "website", link: project.websiteLink.trim() },
        ].filter((item) => item.link.length > 0);

        return {
          image: project.image,
          name: project.name,
          description: project.description,
          role: project.role,
          technology: project.technology,
          projectLinks,
          links: projectLinks,
        };
      });
    });
    resetEditorFormAfterSave();
  };

  const handleProjectOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleProjectTwoSave = (nextDraft: ProjectTwoDraft) => {
    if (!selectedBlock || !isEditingProjectTwo) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);
      const normalizedLink = nextDraft.link.trim();
      const linkItems = normalizedLink.length > 0 ? [{ link: normalizedLink }] : [];

      return [
        ...currentItems,
        {
          name: nextDraft.name,
          action: nextDraft.action,
          publisher: nextDraft.publisher,
          description: nextDraft.description,
          projectLinks: linkItems,
          links: linkItems,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleProjectTwoCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleProjectThreeSave = (nextDraft: ProjectThreeDraft) => {
    if (!selectedBlock || !isEditingProjectThree) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);
      const normalizedLink = nextDraft.link.trim();
      const linkItems = normalizedLink.length > 0 ? [{ link: normalizedLink }] : [];

      return [
        ...currentItems,
        {
          name: nextDraft.name,
          action: nextDraft.action,
          publisher: nextDraft.publisher,
          description: nextDraft.description,
          projectLinks: linkItems,
          links: linkItems,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleProjectThreeCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleAwardOneSave = (nextDraft: AwardOneDraft) => {
    if (!selectedBlock || !isEditingAwardOne) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);
      const currentItem = currentItems[0] ?? {};

      return [
        {
          ...currentItem,
          name: nextDraft.name,
          date: nextDraft.date,
          time: nextDraft.date,
          organization: nextDraft.organization,
          issuer: nextDraft.organization,
          description: nextDraft.description,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleAwardOneListSave = (awardList: AwardOneDraft[]) => {
    if (!selectedBlock || !isEditingAwardOne) {
      return;
    }

    updateSelectedBlockData(() => {
      return awardList.map((award) => ({
        name: award.name,
        date: award.date,
        time: award.date,
        organization: award.organization,
        issuer: award.organization,
        description: award.description,
      }));
    });
    resetEditorFormAfterSave();
  };

  const handleAwardOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleActivityOneSave = (nextDraft: ActivityOneDraft) => {
    if (!selectedBlock || !isEditingActivityOne) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);
      const currentItem = currentItems[0] ?? {};

      return [
        {
          ...currentItem,
          name: nextDraft.name,
          date: nextDraft.date,
          time: nextDraft.date,
          description: nextDraft.description,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleActivityOneListSave = (activityList: ActivityOneDraft[]) => {
    if (!selectedBlock || !isEditingActivityOne) {
      return;
    }

    updateSelectedBlockData(() => {
      return activityList.map((activity) => ({
        name: activity.name,
        date: activity.date,
        time: activity.date,
        description: activity.description,
      }));
    });
    resetEditorFormAfterSave();
  };

  const handleActivityOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleOtherInfoOneSave = (nextDraft: OtherInfoOneDraft) => {
    if (!selectedBlock || !isEditingOtherInfoOne) {
      return;
    }

    updateSelectedBlockData(() => {
      return nextDraft.interests.map((interestName) => ({ detail: interestName }));
    });
    resetEditorFormAfterSave();
  };

  const handleOtherInfoOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleOtherInfoTwoSave = (nextDraft: OtherInfoTwoDraft) => {
    if (!selectedBlock || !isEditingOtherInfoTwo) {
      return;
    }

    updateSelectedBlockData((current) => {
      const nextData = toRecord(current);
      nextData.detail = nextDraft.detail;
      return nextData;
    });
    resetEditorFormAfterSave();
  };

  const handleOtherInfoTwoCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleOtherInfoFiveSave = (nextDraft: OtherFiveDraft) => {
    if (!selectedBlock || !isEditingOtherInfoFive) {
      return;
    }

    updateSelectedBlockData(() => {
      return nextDraft.topics.map((topicName) => ({ name: topicName }));
    });
    resetEditorFormAfterSave();
  };

  const handleOtherInfoFiveCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleOtherInfoSixSave = (nextDraft: OtherInfoSixDraft) => {
    if (!selectedBlock || !isEditingOtherInfoSix) {
      return;
    }

    updateSelectedBlockData(() => {
      return nextDraft.softSkills.map((skillName) => ({ name: skillName }));
    });
    resetEditorFormAfterSave();
  };

  const handleOtherInfoSixCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleOtherInfoSevenSave = (nextDraft: OtherSevenDraft) => {
    if (!selectedBlock || !isEditingOtherInfoSeven) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);

      return [
        ...currentItems,
        {
          name: nextDraft.name,
          detail: nextDraft.detail,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleOtherInfoSevenCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleOtherInfoEightSave = (nextDraft: OtherEightDraft) => {
    if (!selectedBlock || !isEditingOtherInfoEight) {
      return;
    }

    updateSelectedBlockData((current) => {
      const nextData = toRecord(current);
      nextData.detail = nextDraft.detail;
      return nextData;
    });
    resetEditorFormAfterSave();
  };

  const handleOtherInfoEightCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleReferenceOneSave = (nextDraft: ReferenceOneDraft) => {
    if (!selectedBlock || !isEditingReferenceOne) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);
      const currentItem = currentItems[0] ?? {};

      return [
        {
          ...currentItem,
          name: nextDraft.name,
          position: nextDraft.position,
          mail: nextDraft.email,
          email: nextDraft.email,
          phone: nextDraft.contactInfo,
          detail: nextDraft.contactInfo,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleReferenceOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleCertificateOneSave = (nextDraft: CertificateOneDraft) => {
    if (!selectedBlock || !isEditingCertificateOne) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);
      const currentItem = currentItems[0] ?? {};

      return [
        {
          ...currentItem,
          name: nextDraft.name,
          issuer: nextDraft.issuer,
          provider: nextDraft.issuer,
          year: nextDraft.year,
          date: nextDraft.year,
          link: nextDraft.link,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleCertificateOneListSave = (certificateList: CertificateOneDraft[]) => {
    if (!selectedBlock || !isEditingCertificateOne) {
      return;
    }

    updateSelectedBlockData(() => {
      return certificateList.map((certificate) => ({
        name: certificate.name,
        issuer: certificate.issuer,
        provider: certificate.issuer,
        year: certificate.year,
        date: certificate.year,
        link: certificate.link,
      }));
    });
    resetEditorFormAfterSave();
  };

  const handleCertificateOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleTeachingOneSave = (nextDraft: TeachingOneDraft) => {
    if (!selectedBlock || !isEditingTeachingOne) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);

      return [
        ...currentItems,
        {
          subject: nextDraft.subject,
          teachingplace: nextDraft.teachingplace,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleTeachingOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleTypicalCaseOneSave = (nextDraft: TypicalCaseOneDraft) => {
    if (!selectedBlock || !isEditingTypicalCaseOne) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);

      return [
        ...currentItems,
        {
          patient: nextDraft.patient,
          age: nextDraft.age,
          caseName: nextDraft.caseName,
          stage: nextDraft.stage,
          regiment: nextDraft.regiment,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleTypicalCaseOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleResearchOneSave = (nextDraft: ResearchOneDraft) => {
    if (!selectedBlock || !isEditingResearchOne) {
      return;
    }

    updateSelectedBlockData((current) => {
      const currentItems = toRecordArray(current);

      return [
        ...currentItems,
        {
          name: nextDraft.title,
          time: nextDraft.date,
          description: nextDraft.conference,
          link: nextDraft.link,
          conference: nextDraft.conference,
        },
      ];
    });
    resetEditorFormAfterSave();
  };

  const handleResearchOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleTeachingOneListSave = (teachingList: TeachingOneDraft[]) => {
    if (!selectedBlock || !isEditingTeachingOne) {
      return;
    }

    updateSelectedBlockData(() => {
      return teachingList.map((teaching) => ({
        subject: teaching.subject,
        teachingplace: teaching.teachingplace,
      }));
    });
    resetEditorFormAfterSave();
  };

  const handleTypicalCaseOneListSave = (caseList: TypicalCaseOneDraft[]) => {
    if (!selectedBlock || !isEditingTypicalCaseOne) {
      return;
    }

    updateSelectedBlockData(() => {
      return caseList.map((typicalCase) => ({
        patient: typicalCase.patient,
        age: typicalCase.age,
        caseName: typicalCase.caseName,
        stage: typicalCase.stage,
        regiment: typicalCase.regiment,
      }));
    });
    resetEditorFormAfterSave();
  };

  const handleResearchOneListSave = (researchList: ResearchOneDraft[]) => {
    if (!selectedBlock || !isEditingResearchOne) {
      return;
    }

    updateSelectedBlockData(() => {
      return researchList.map((research) => ({
        name: research.title,
        time: research.date,
        description: research.conference,
        link: research.link,
        conference: research.conference,
      }));
    });
    resetEditorFormAfterSave();
  };

  const renderFieldInput = (
    field: FieldDefinition,
    value: string,
    onChange: (nextValue: string) => void,
  ) => {
    const sharedClassName =
      "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400";

    if (field.multiline) {
      return (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          className={`${sharedClassName} min-h-20 resize-y`}
        />
      );
    }

    return (
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className={sharedClassName}
      />
    );
  };

  const renderObjectFields = (fields: FieldDefinition[]) => {
    if (!selectedBlock) {
      return null;
    }

    const data = toRecord(selectedBlock.data);

    return (
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {field.label}
            </label>
            {renderFieldInput(field, toText(data[field.key]), (nextValue) => {
              updateSelectedObjectField(field.key, nextValue);
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderArrayFields = (
    fields: FieldDefinition[],
    itemFactory: () => Record<string, unknown>,
    addLabel: string,
    emptyLabel: string,
  ) => {
    if (!selectedBlock) {
      return null;
    }

    const items = toRecordArray(selectedBlock.data);

    return (
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-500">
            {emptyLabel}
          </p>
        )}

        {items.map((item, index) => (
          <div key={`item-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mục {index + 1}
              </p>
              <button
                type="button"
                onClick={() => removeSelectedArrayItem(index)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Xóa mục"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="space-y-2.5">
              {fields.map((field) => (
                <div key={`${field.key}-${index}`} className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {field.label}
                  </label>
                  {renderFieldInput(field, toText(item[field.key]), (nextValue) => {
                    updateSelectedArrayItemField(index, field.key, nextValue);
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addSelectedArrayItem(itemFactory)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
        >
          <Plus size={16} /> {addLabel}
        </button>
      </div>
    );
  };

  const renderProjectEditor = () => {
    if (!selectedBlock) {
      return null;
    }

    const variant = selectedBlock.variant.toUpperCase();
    const projects = toRecordArray(selectedBlock.data);

    return (
      <div className="space-y-3">
        {projects.map((project, index) => {
          const linkValue = getFirstProjectLink(project);

          return (
            <div key={`project-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Dự án {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeSelectedArrayItem(index)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Xóa dự án"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tên dự án</label>
                  <input
                    value={toText(project.name)}
                    onChange={(event) => updateSelectedArrayItemField(index, "name", event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                    placeholder="Nhập tên dự án"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mô tả</label>
                  <textarea
                    value={toText(project.description)}
                    onChange={(event) => updateSelectedArrayItemField(index, "description", event.target.value)}
                    className="min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                    placeholder="Nhập mô tả"
                  />
                </div>

                {variant === "PROJECTONE" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vai trò</label>
                      <input
                        value={toText(project.role)}
                        onChange={(event) => updateSelectedArrayItemField(index, "role", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                        placeholder="Frontend Developer"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Công nghệ</label>
                      <input
                        value={toText(project.technology)}
                        onChange={(event) => updateSelectedArrayItemField(index, "technology", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                        placeholder="React, TypeScript"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ảnh dự án (URL)</label>
                      <input
                        value={toText(project.image)}
                        onChange={(event) => updateSelectedArrayItemField(index, "image", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}

                {variant !== "PROJECTONE" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tổ chức / Nơi xuất bản</label>
                      <input
                        value={toText(project.publisher)}
                        onChange={(event) => updateSelectedArrayItemField(index, "publisher", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                        placeholder="IEEE, VINIF..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vai trò / Trạng thái</label>
                      <input
                        value={toText(project.action)}
                        onChange={(event) => updateSelectedArrayItemField(index, "action", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                        placeholder="Tác giả chính, Đang thực hiện..."
                      />
                    </div>
                  </>
                )}

                {variant === "PROJECTTHREE" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Thời gian</label>
                    <input
                      value={toText(project.time)}
                      onChange={(event) => updateSelectedArrayItemField(index, "time", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                      placeholder="2024"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Link dự án / báo cáo</label>
                  <input
                    value={linkValue}
                    onChange={(event) => {
                      const nextLink = event.target.value.trim();
                      updateSelectedArrayItem(index, (currentItem) => {
                        if (!nextLink) {
                          return {
                            ...currentItem,
                            projectLinks: [],
                            links: [],
                          };
                        }

                        if (variant === "PROJECTONE") {
                          return {
                            ...currentItem,
                            projectLinks: [{ type: "link", link: nextLink }],
                          };
                        }

                        if (variant === "PROJECTTWO") {
                          return {
                            ...currentItem,
                            projectLinks: [{ link: nextLink }],
                          };
                        }

                        return {
                          ...currentItem,
                          links: [{ link: nextLink }],
                        };
                      });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => {
            const variant = selectedBlock.variant.toUpperCase();
            if (variant === "PROJECTTWO") {
              addSelectedArrayItem(() => ({
                name: "",
                description: "",
                action: "",
                publisher: "",
                projectLinks: [],
              }));
              return;
            }

            if (variant === "PROJECTTHREE") {
              addSelectedArrayItem(() => ({
                name: "",
                publisher: "",
                time: "",
                description: "",
                action: "",
              }));
              return;
            }

            addSelectedArrayItem(() => ({
              name: "",
              description: "",
              role: "",
              technology: "",
              image: "",
              projectLinks: [],
            }));
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
        >
          <Plus size={16} /> Thêm dự án
        </button>
      </div>
    );
  };

  const renderIntroOneEditor = () => {
    if (!introOneInitialData) {
      return null;
    }

    return (
      <IntroOneEditor
        key={introOneEditorKey}
        initialData={introOneInitialData}
        onSave={handleIntroOneSave}
        onCancel={handleIntroOneCancel}
      />
    );
  };

  const renderIntroTwoEditor = () => {
    if (!introTwoInitialData) {
      return null;
    }

    return (
      <IntroTwoEditor
        key={introTwoEditorKey}
        initialData={introTwoInitialData}
        onSave={handleIntroTwoSave}
        onCancel={handleIntroTwoCancel}
      />
    );
  };

  const renderIntroThreeEditor = () => {
    if (!introThreeInitialData) {
      return null;
    }

    return (
      <IntroThreeEditor
        key={introThreeEditorKey}
        initialData={introThreeInitialData}
        onSave={handleIntroThreeSave}
        onCancel={handleIntroThreeCancel}
      />
    );
  };

  const renderIntroFourEditor = () => {
    if (!introFourInitialData) {
      return null;
    }

    return (
      <IntroFourEditor
        key={introFourEditorKey}
        initialData={introFourInitialData}
        onSave={handleIntroFourSave}
        onCancel={handleIntroFourCancel}
      />
    );
  };

  const renderIntroFiveEditor = () => {
    if (!introFiveInitialData) {
      return null;
    }

    return (
      <IntroFiveEditor
        key={introFiveEditorKey}
        initialData={introFiveInitialData}
        onSave={handleIntroFiveSave}
        onCancel={handleIntroFiveCancel}
      />
    );
  };

  const renderSkillOneEditor = () => {
    console.log("📝 [renderSkillOneEditor] Called - skillOneInitialData:", skillOneInitialData);
    
    if (!skillOneInitialData) {
      console.log("❌ [renderSkillOneEditor] skillOneInitialData is null/undefined, returning null");
      return null;
    }

    console.log("✅ [renderSkillOneEditor] Rendering component");
    return (
      <SkillOneEditor
        key={skillOneEditorKey}
        initialData={skillOneInitialData}
        onSave={handleSkillOneSave}
        onCancel={handleSkillOneCancel}
      />
    );
  };

  const renderSkillTwoEditor = () => {
    console.log("📝 [renderSkillTwoEditor] Called - skillTwoInitialData:", skillTwoInitialData);
    
    if (!skillTwoInitialData) {
      console.log("❌ [renderSkillTwoEditor] skillTwoInitialData is null/undefined, returning null");
      return null;
    }

    console.log("✅ [renderSkillTwoEditor] Rendering component");
    return (
      <SkillTwoEditor
        key={skillTwoEditorKey}
        initialData={skillTwoInitialData}
        onSave={handleSkillTwoSave}
        onCancel={handleSkillTwoCancel}
      />
    );
  };

  const renderSkillThreeEditor = () => {
    return (
      <SkillThreeEditor
        key={skillThreeEditorKey}
        initialData={createEmptySkillThreeDraft()}
        onSave={handleSkillThreeSave}
        onCancel={handleSkillThreeCancel}
      />
    );
  };

  const renderSkillDedicatedEditor = () => {
    console.log("📝 [renderSkillDedicatedEditor] Called - selectedBlockVariantKey:", selectedBlockVariantKey);
    console.log("  - skillOneInitialData:", skillOneInitialData);
    console.log("  - skillTwoInitialData:", skillTwoInitialData);
    
    switch (selectedBlockVariantKey) {
      case "SKILL.SKILLONE":
        console.log("✅ [renderSkillDedicatedEditor] Rendering SkillOne");
        return renderSkillOneEditor();
      case "SKILL.SKILLTWO":
        console.log("✅ [renderSkillDedicatedEditor] Rendering SkillTwo");
        return renderSkillTwoEditor();
      case "SKILL.SKILLTHREE":
        console.log("✅ [renderSkillDedicatedEditor] Rendering SkillThree");
        return renderSkillThreeEditor();
      default:
        console.log("❌ [renderSkillDedicatedEditor] No match for variant key, returning null");
        return null;
    }
  };

  const renderEducationOneEditor = () => {
    if (!educationOneInitialData) {
      return null;
    }

    return (
      <EducationOneEditor
        key={educationOneEditorKey}
        initialData={educationOneInitialData}
        initialList={educationOneListData}
        onSave={handleEducationOneSave}
        onSaveList={handleEducationOneListSave}
        onCancel={handleEducationOneCancel}
      />
    );
  };

  const renderEducationThreeEditor = () => {
    if (!educationThreeInitialData) {
      return null;
    }

    return (
      <EducationThreeEditor
        key={educationThreeEditorKey}
        initialData={createEmptyEducationThreeDraft()}
        latestData={educationThreeInitialData}
        onSave={handleEducationThreeSave}
        onCancel={handleEducationThreeCancel}
      />
    );
  };

  const renderEducationTwoEditor = () => {
    if (!educationTwoInitialData) {
      return null;
    }

    return (
      <EducationTwoEditor
        key={educationTwoEditorKey}
        initialData={educationTwoInitialData}
        onSave={handleEducationTwoSave}
        onCancel={handleEducationTwoCancel}
      />
    );
  };

  const renderExperienceOneEditor = () => {
    if (!experienceOneInitialData) {
      return null;
    }

    return (
      <ExperienceOneEditor
        key={experienceOneEditorKey}
        initialData={experienceOneInitialData}
        existingItems={experienceOneListData}
        onSave={handleExperienceOneSave}
        onCancel={handleExperienceOneCancel}
        onDeleteItem={(index) => removeSelectedArrayItem(index)}
      />
    );
  };

  const renderProjectOneEditor = () => {
    if (!projectOneInitialData) {
      return null;
    }

    return (
      <ProjectOneEditor
        key={projectOneEditorKey}
        initialData={projectOneInitialData}
        initialList={projectOneListData}
        onSave={handleProjectOneSave}
        onSaveList={handleProjectOneListSave}
        onCancel={handleProjectOneCancel}
      />
    );
  };

  const renderProjectTwoEditor = () => {
    if (!projectTwoInitialData) {
      return null;
    }

    return (
      <ProjectTwoEditor
        key={projectTwoEditorKey}
        initialData={projectTwoInitialData}
        onSave={handleProjectTwoSave}
        onCancel={handleProjectTwoCancel}
      />
    );
  };

  const renderProjectThreeEditor = () => {
    if (!projectThreeInitialData) {
      return null;
    }

    return (
      <ProjectThreeEditor
        key={projectThreeEditorKey}
        initialData={projectThreeInitialData ?? createEmptyProjectThreeDraft()}
        onSave={handleProjectThreeSave}
        onCancel={handleProjectThreeCancel}
      />
    );
  };

  const renderAwardOneEditor = () => {
    if (!awardOneInitialData) {
      return null;
    }

    return (
      <AwardEditor
        key={awardOneEditorKey}
        initialData={awardOneInitialData}
        initialList={awardOneListData}
        onSave={handleAwardOneSave}
        onSaveList={handleAwardOneListSave}
        onCancel={handleAwardOneCancel}
      />
    );
  };

  const renderActivityOneEditor = () => {
    if (!activityOneInitialData) {
      return null;
    }

    return (
      <ActivityOneEditor
        key={activityOneEditorKey}
        initialData={activityOneInitialData}
        initialList={activityOneListData}
        onSave={handleActivityOneSave}
        onSaveList={handleActivityOneListSave}
        onCancel={handleActivityOneCancel}
      />
    );
  };

  const renderOtherInfoOneEditor = () => {
    if (!otherInfoOneInitialData) {
      return null;
    }

    return (
      <OtherInfoOneEditor
        key={otherInfoOneEditorKey}
        initialData={otherInfoOneInitialData}
        onSave={handleOtherInfoOneSave}
        onCancel={handleOtherInfoOneCancel}
      />
    );
  };

  const renderOtherInfoTwoEditor = () => {
    if (!otherInfoTwoInitialData) {
      return null;
    }

    return (
      <OtherInfoTwoEditor
        key={otherInfoTwoEditorKey}
        initialData={otherInfoTwoInitialData}
        onSave={handleOtherInfoTwoSave}
        onCancel={handleOtherInfoTwoCancel}
      />
    );
  };

  const renderOtherInfoFiveEditor = () => {
    if (!otherInfoFiveInitialData) {
      return null;
    }

    return (
      <OtherFiveEditor
        key={otherInfoFiveEditorKey}
        initialData={otherInfoFiveInitialData}
        onSave={handleOtherInfoFiveSave}
        onCancel={handleOtherInfoFiveCancel}
      />
    );
  };

  const renderOtherInfoSixEditor = () => {
    if (!otherInfoSixInitialData) {
      return null;
    }

    return (
      <OtherInfoSixEditor
        key={otherInfoSixEditorKey}
        initialData={otherInfoSixInitialData}
        onSave={handleOtherInfoSixSave}
        onCancel={handleOtherInfoSixCancel}
      />
    );
  };

  const renderOtherInfoSevenEditor = () => {
    if (!otherInfoSevenInitialData) {
      return null;
    }

    return (
      <OtherInfoSevenEditor
        key={otherInfoSevenEditorKey}
        initialData={otherInfoSevenInitialData}
        onSave={handleOtherInfoSevenSave}
        onCancel={handleOtherInfoSevenCancel}
      />
    );
  };

  const renderOtherInfoEightEditor = () => {
    if (!otherInfoEightInitialData) {
      return null;
    }

    return (
      <OtherEightEditor
        key={otherInfoEightEditorKey}
        initialData={otherInfoEightInitialData}
        onSave={handleOtherInfoEightSave}
        onCancel={handleOtherInfoEightCancel}
      />
    );
  };

  const renderReferenceOneEditor = () => {
    if (!referenceOneInitialData) {
      return null;
    }

    return (
      <ReferenceEditor
        key={referenceOneEditorKey}
        initialData={referenceOneInitialData}
        onSave={handleReferenceOneSave}
        onCancel={handleReferenceOneCancel}
      />
    );
  };

  const renderCertificateOneEditor = () => {
    if (!certificateOneInitialData) {
      return null;
    }

    return (
      <CertificateOneEditor
        key={certificateOneEditorKey}
        initialData={certificateOneInitialData}
        initialList={certificateOneListData}
        onSave={handleCertificateOneSave}
        onSaveList={handleCertificateOneListSave}
        onCancel={handleCertificateOneCancel}
      />
    );
  };

  const renderTeachingOneEditor = () => {
    console.log("🔷 [renderTeachingOneEditor]", {
      teachingOneInitialData,
      isEditingTeachingOne,
      selectedBlock: selectedBlock ? { type: selectedBlock.type, variant: selectedBlock.variant } : null,
    });

    if (!teachingOneInitialData) {
      console.log("🔴 [renderTeachingOneEditor] teachingOneInitialData is null, returning null");
      return null;
    }

    return (
      <TeachingOneEditor
        key={teachingOneEditorKey}
        initialData={teachingOneInitialData}
        initialList={teachingOneListData}
        onSave={handleTeachingOneSave}
        onSaveList={handleTeachingOneListSave}
        onCancel={handleTeachingOneCancel}
      />
    );
  };

  const renderTypicalCaseOneEditor = () => {
    console.log("🟪 [renderTypicalCaseOneEditor]", {
      typicalCaseOneInitialData,
      isEditingTypicalCaseOne,
      selectedBlock: selectedBlock ? { type: selectedBlock.type, variant: selectedBlock.variant } : null,
    });

    if (!typicalCaseOneInitialData) {
      console.log("🔴 [renderTypicalCaseOneEditor] typicalCaseOneInitialData is null, returning null");
      return null;
    }

    return (
      <TypicalCaseOneEditor
        key={typicalCaseOneEditorKey}
        initialData={typicalCaseOneInitialData}
        initialList={typicalCaseOneListData}
        onSave={handleTypicalCaseOneSave}
        onSaveList={handleTypicalCaseOneListSave}
        onCancel={handleTypicalCaseOneCancel}
      />
    );
  };

  const renderResearchOneEditor = () => {
    console.log("🟫 [renderResearchOneEditor]", {
      researchOneInitialData,
      isEditingResearchOne,
      selectedBlock: selectedBlock ? { type: selectedBlock.type, variant: selectedBlock.variant } : null,
    });

    if (!researchOneInitialData) {
      console.log("🔴 [renderResearchOneEditor] researchOneInitialData is null, returning null");
      return null;
    }

    return (
      <ResearchOneEditor
        key={researchOneEditorKey}
        initialData={researchOneInitialData}
        initialList={researchOneListData}
        onSave={handleResearchOneSave}
        onSaveList={handleResearchOneListSave}
        onCancel={handleResearchOneCancel}
      />
    );
  };

  const renderEditorForm = () => {
    if (!selectedBlock) {
      return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          Chọn một block để nhập nội dung.
        </div>
      );
    }

    const blockType = normalizeBlockType(selectedBlock.type);
    const variant = selectedBlock.variant.toUpperCase();

    console.log("📝 [renderEditorForm]", { blockType, variant });

    if (blockType === "INTRO" && variant === "INTROONE") {
      return renderIntroOneEditor();
    }

    if (blockType === "TEACHING" && variant === "TEACHINGONE") {
      console.log("✅ [renderEditorForm] Matching TEACHING/TEACHINGONE");
      return renderTeachingOneEditor();
    }

    if (blockType === "INTRO" && variant === "INTROTWO") {
      return renderIntroTwoEditor();
    }

    if (blockType === "INTRO" && variant === "INTROTHREE") {
      return renderIntroThreeEditor();
    }

    if (blockType === "INTRO" && variant === "INTROFOUR") {
      return renderIntroFourEditor();
    }

    if (blockType === "INTRO" && variant === "INTROFIVE") {
      return renderIntroFiveEditor();
    }

    const skillDedicatedEditor = renderSkillDedicatedEditor();
    if (skillDedicatedEditor) {
      return skillDedicatedEditor;
    }

    if (blockType === "EDUCATION" && variant === "EDUCATIONONE") {
      return renderEducationOneEditor();
    }

    if (blockType === "EDUCATION" && variant === "EDUCATIONTWO") {
      return renderEducationTwoEditor();
    }

    if (blockType === "EDUCATION" && variant === "EDUCATIONTHREE") {
      return renderEducationThreeEditor();
    }

    if (blockType === "EXPERIMENT" && variant === "EXPERIMENTONE") {
      return renderExperienceOneEditor();
    }

    if (blockType === "PROJECT" && variant === "PROJECTONE") {
      return renderProjectOneEditor();
    }

    if (blockType === "PROJECT" && variant === "PROJECTTWO") {
      return renderProjectTwoEditor();
    }

    if (blockType === "PROJECT" && variant === "PROJECTTHREE") {
      return renderProjectThreeEditor();
    }

    if (blockType === "AWARD" && variant === "AWARDONE") {
      return renderAwardOneEditor();
    }

    if (blockType === "ACTIVITIES" && variant === "ACTIVITYONE") {
      return renderActivityOneEditor();
    }

    if (blockType === "OTHERINFO" && variant === "OTHERONE") {
      return renderOtherInfoOneEditor();
    }

    if (blockType === "OTHERINFO" && variant === "OTHERTWO") {
      return renderOtherInfoTwoEditor();
    }

    if (blockType === "OTHERINFO" && variant === "OTHERFIVE") {
      return renderOtherInfoFiveEditor();
    }

    if (blockType === "OTHERINFO" && variant === "OTHERSIX") {
      return renderOtherInfoSixEditor();
    }

    if (blockType === "OTHERINFO" && variant === "OTHERSEVEN") {
      return renderOtherInfoSevenEditor();
    }

    if (blockType === "OTHERINFO" && variant === "OTHEREIGHT") {
      return renderOtherInfoEightEditor();
    }

    if (blockType === "REFERENCE" && variant === "REFERENCEONE") {
      return renderReferenceOneEditor();
    }

    if (blockType === "DIPLOMA" && variant === "DIPLOMAONE") {
      return renderCertificateOneEditor();
    }

    if (blockType === "TYPICALCASE" && variant === "TYPICALCASEONE") {
      console.log("✅ [renderEditorForm] Matching TYPICALCASE/TYPICALCASEONE");
      return renderTypicalCaseOneEditor();
    }

    if (blockType === "RESEARCH" && variant === "RESEARCHONE") {
      console.log("✅ [renderEditorForm] Matching RESEARCH/RESEARCHONE");
      return renderResearchOneEditor();
    }

    if (blockType === "INTRO") {
      return renderObjectFields([
        { key: "fullName", label: "Họ và tên" },
        { key: "title", label: "Chức danh" },
        { key: "description", label: "Mô tả", multiline: true },
        { key: "avatar", label: "Avatar (URL)" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Số điện thoại" },
        { key: "school", label: "Trường / Đơn vị" },
        { key: "department", label: "Khoa / Bộ môn" },
        { key: "studyField", label: "Chuyên ngành" },
        { key: "experience", label: "Năm kinh nghiệm" },
        { key: "gpa", label: "GPA" },
      ]);
    }

    if (blockType === "SKILL" && variant === "SKILLTHREE") {
      return renderArrayFields(
        [
          { key: "name", label: "Tên kỹ năng" },
          { key: "description", label: "Mô tả", multiline: true },
        ],
        () => ({ name: "", description: "" }),
        "Thêm kỹ năng",
        "Chưa có mục kỹ năng nào.",
      );
    }

    if (blockType === "SKILL") {
      return renderArrayFields(
        [{ key: "name", label: "Tên kỹ năng" }],
        () => ({ name: "" }),
        "Thêm kỹ năng",
        "Chưa có kỹ năng nào.",
      );
    }

    if (blockType === "EDUCATION") {
      return renderArrayFields(
        [
          { key: "schoolName", label: "Trường / tổ chức" },
          { key: "department", label: "Khoa / ngành" },
          { key: "time", label: "Thời gian" },
          { key: "description", label: "Mô tả", multiline: true },
        ],
        () => ({ schoolName: "", department: "", time: "", description: "" }),
        "Thêm học vấn",
        "Chưa có mục học vấn.",
      );
    }

    if (blockType === "EXPERIMENT") {
      return renderArrayFields(
        [
          { key: "jobName", label: "Vị trí" },
          { key: "address", label: "Công ty / địa điểm" },
          { key: "startDate", label: "Bắt đầu" },
          { key: "endDate", label: "Kết thúc" },
          { key: "description", label: "Mô tả", multiline: true },
        ],
        () => ({
          jobName: "",
          address: "",
          startDate: "",
          endDate: "",
          description: "",
        }),
        "Thêm kinh nghiệm",
        "Chưa có mục kinh nghiệm.",
      );
    }

    if (blockType === "PROJECT") {
      return renderProjectEditor();
    }

    if (blockType === "DIPLOMA") {
      return renderArrayFields(
        [
          { key: "name", label: "Tên chứng chỉ" },
          { key: "issuer", label: "Nơi cấp" },
          { key: "provider", label: "Đơn vị" },
          { key: "date", label: "Ngày cấp" },
          { key: "link", label: "Link chứng chỉ" },
        ],
        () => ({ name: "", issuer: "", provider: "", date: "", link: "" }),
        "Thêm chứng chỉ",
        "Chưa có chứng chỉ.",
      );
    }

    if (blockType === "AWARD") {
      return renderArrayFields(
        [
          { key: "name", label: "Tên giải thưởng" },
          { key: "date", label: "Thời gian" },
          { key: "organization", label: "Tổ chức" },
          { key: "description", label: "Mô tả", multiline: true },
        ],
        () => ({ name: "", date: "", organization: "", description: "" }),
        "Thêm giải thưởng",
        "Chưa có giải thưởng.",
      );
    }

    if (blockType === "ACTIVITIES") {
      return renderArrayFields(
        [
          { key: "name", label: "Tên hoạt động" },
          { key: "date", label: "Thời gian" },
          { key: "description", label: "Mô tả", multiline: true },
        ],
        () => ({ name: "", date: "", description: "" }),
        "Thêm hoạt động",
        "Chưa có hoạt động.",
      );
    }

    if (blockType === "OTHERINFO" && OTHERINFO_OBJECT_VARIANTS.has(variant)) {
      if (variant === "OTHEREIGHT") {
        return renderObjectFields([
          { key: "title", label: "Tiêu đề" },
          { key: "licenseNumber", label: "Số chứng chỉ" },
          { key: "issuer", label: "Nơi cấp" },
          { key: "status", label: "Trạng thái" },
          { key: "detail", label: "Chi tiết phụ" },
        ]);
      }

      return renderObjectFields([{ key: "detail", label: "Nội dung", multiline: true }]);
    }

    if (blockType === "OTHERINFO" && variant === "OTHERONE") {
      return renderArrayFields(
        [{ key: "detail", label: "Sở thích" }],
        () => ({ detail: "" }),
        "Thêm sở thích",
        "Chưa có sở thích nào.",
      );
    }

    if (blockType === "OTHERINFO" && (variant === "OTHERFIVE" || variant === "OTHERSIX")) {
      return renderArrayFields(
        [{ key: "name", label: "Nội dung" }],
        () => ({ name: "" }),
        "Thêm mục",
        "Chưa có mục thông tin.",
      );
    }

    if (blockType === "OTHERINFO") {
      return renderArrayFields(
        [{ key: "detail", label: "Nội dung" }],
        () => ({ detail: "" }),
        "Thêm nội dung",
        "Chưa có nội dung.",
      );
    }

    if (blockType === "REFERENCE") {
      return renderArrayFields(
        [
          { key: "name", label: "Họ tên" },
          { key: "position", label: "Chức vụ" },
          { key: "mail", label: "Email" },
          { key: "phone", label: "Điện thoại" },
        ],
        () => ({ name: "", position: "", mail: "", phone: "" }),
        "Thêm người tham chiếu",
        "Chưa có người tham chiếu.",
      );
    }

    if (blockType === "RESEARCH") {
      return renderArrayFields(
        [
          { key: "name", label: "Tên công bố" },
          { key: "time", label: "Năm" },
          { key: "description", label: "Mô tả", multiline: true },
          { key: "link", label: "Link công bố" },
        ],
        () => ({ name: "", time: "", description: "", link: "" }),
        "Thêm công bố",
        "Chưa có công bố.",
      );
    }

    if (blockType === "TEACHING") {
      return renderArrayFields(
        [
          { key: "subject", label: "Môn học" },
          { key: "teachingplace", label: "Nơi giảng dạy" },
        ],
        () => ({ subject: "", teachingplace: "" }),
        "Thêm mục giảng dạy",
        "Chưa có mục giảng dạy.",
      );
    }

    if (blockType === "TYPICALCASE") {
      return renderArrayFields(
        [
          { key: "patient", label: "Bệnh nhân" },
          { key: "age", label: "Tuổi" },
          { key: "caseName", label: "Tên ca" },
          { key: "stage", label: "Giai đoạn", multiline: true },
          { key: "regiment", label: "Phác đồ", multiline: true },
        ],
        () => ({ patient: "", age: "", caseName: "", stage: "", regiment: "" }),
        "Thêm case",
        "Chưa có case điển hình.",
      );
    }

    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-500">
        Block này chưa có form cấu hình.
      </p>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-slate-500">Đang tải màn tạo hồ sơ...</p>
        </div>
      </div>
    );
  }

  const blockInfoForVariantSelector =
    selectedBlockTypeForVariant ? getBlockInfo(selectedBlockTypeForVariant) : null;

  return (
    <>
    <div className="min-h-[calc(100vh-56px)] bg-slate-100">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              title="Quay lại"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              
              <h1 className="text-lg font-bold text-slate-900">
                {isEditMode ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ"}
              </h1>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-2 min-w-0">
            <input
              value={portfolioName}
              onChange={(event) => setPortfolioName(event.target.value)}
              className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400"
              placeholder="Tên hồ sơ"
            />
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap"
            >
              <Save size={16} /> {saving ? "Đang lưu..." : "Lưu hồ sơ"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full px-3 py-4">
        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
          <aside className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex border-b border-slate-200">
              {!isEditMode && (
                <button
                  type="button"
                  onClick={() => setActiveTab("template")}
                  className={cn(
                    "flex-1 px-3 py-2.5 text-sm font-semibold transition-colors",
                    activeTab === "template"
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50",
                  )}
                >
                  Thiết kế mẫu
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTab("component")}
                className={cn(
                  `${isEditMode ? "w-full" : "flex-1"} px-3 py-2.5 text-sm font-semibold transition-colors`,
                  activeTab === "component"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50",
                )}
              >
                Thành phần
              </button>
            </div>

            <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-3">
              {!isEditMode && activeTab === "template" && (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <button
                      key={template.portfolioId}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className={cn(
                        "w-full overflow-hidden rounded-xl border text-left transition-colors",
                        activeTemplateId === template.portfolioId
                          ? "border-blue-400 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300",
                      )}
                    >
                      <img
                        src={TemplatePreviewImage}
                        alt={getTemplateName(template.portfolioId, templates, TEMPLATE_DISPLAY_NAMES)}
                        className="h-44 w-full object-cover"
                      />
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-slate-800">
                          {getTemplateName(template.portfolioId, templates, TEMPLATE_DISPLAY_NAMES)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {template.blocks.length} block(s)
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "component" && (
                <div className="space-y-2">
                  {getOrderedBlockCatalog().map((blockItem) => {
                    // In create mode with template, filter to allowed block types
                    const isAllowed = isEditMode || !activeTemplateId || allowedBlockTypes.has(blockItem.type);
                    const BlockIcon = blockItem.icon;
                    
                    return (
                      <div key={blockItem.type}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isAllowed) return;
                            setSelectedBlockTypeForVariant(blockItem.type);
                            setShowVariantSelector(true);
                          }}
                          disabled={!isAllowed}
                          className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                            isAllowed
                              ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                              : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                          }`}
                          title={!isAllowed ? `Loại block này không được hỗ trợ bởi template ${getTemplateName(activeTemplateId ?? 0, templates, TEMPLATE_DISPLAY_NAMES)}` : ""}
                        >
                          <div className="mt-0.5 rounded-lg bg-slate-100 p-1.5 text-slate-600">
                            <BlockIcon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800">{blockItem.label}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{blockItem.description}</p>
                          </div>
                        </button>
                        
                        {/* Add specific OTHERINFO variants after certain blocks */}
                        {blockItem.type === "REFERENCE" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                const isAllowed2 = isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO");
                                if (!isAllowed2) return;
                                addBlockFromCatalog("OTHERINFO", "OTHERONE");
                              }}
                              disabled={!isAllowed || (isEditMode === false && !!activeTemplateId && !allowedBlockTypes.has("OTHERINFO")) ? true : false}
                              className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                                (isAllowed && (isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO")))
                                  ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                  : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                              }`}
                              title="Sở thích cá nhân"
                            >
                              <div className="mt-0.5 rounded-lg bg-indigo-100 p-1.5 text-indigo-600">
                                <Lightbulb size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">Sở thích cá nhân</p>
                                <p className="mt-0.5 text-xs text-slate-500">Tag các hoạt động yêu thích</p>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const isAllowed2 = isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO");
                                if (!isAllowed2) return;
                                addBlockFromCatalog("OTHERINFO", "OTHERTWO");
                              }}
                              disabled={!isAllowed || (isEditMode === false && !!activeTemplateId && !allowedBlockTypes.has("OTHERINFO")) ? true : false}
                              className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                                (isAllowed && (isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO")))
                                  ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                  : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                              }`}
                              title="Mục tiêu nghề nghiệp"
                            >
                              <div className="mt-0.5 rounded-lg bg-blue-100 p-1.5 text-blue-600">
                                <Briefcase size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">Mục tiêu nghề nghiệp</p>
                                <p className="mt-0.5 text-xs text-slate-500">Mục tiêu dài hạn mô tả chi tiết</p>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const isAllowed2 = isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO");
                                if (!isAllowed2) return;
                                addBlockFromCatalog("OTHERINFO", "OTHERTHREE");
                              }}
                              disabled={!isAllowed || (isEditMode === false && !!activeTemplateId && !allowedBlockTypes.has("OTHERINFO")) ? true : false}
                              className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                                (isAllowed && (isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO")))
                                  ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                  : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                              }`}
                              title="Tầm nhìn và động lực"
                            >
                              <div className="mt-0.5 rounded-lg bg-purple-100 p-1.5 text-purple-600">
                                <Target size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">Tầm nhìn và động lực</p>
                                <p className="mt-0.5 text-xs text-slate-500">Tầm nhìn dài hạn và động lực</p>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const isAllowed2 = isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO");
                                if (!isAllowed2) return;
                                addBlockFromCatalog("OTHERINFO", "OTHERFIVE");
                              }}
                              disabled={!isAllowed || (isEditMode === false && !!activeTemplateId && !allowedBlockTypes.has("OTHERINFO")) ? true : false}
                              className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                                (isAllowed && (isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO")))
                                  ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                  : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                              }`}
                              title="Lĩnh vực nghiên cứu"
                            >
                              <div className="mt-0.5 rounded-lg bg-purple-100 p-1.5 text-purple-600">
                                <Lightbulb size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">Lĩnh vực nghiên cứu</p>
                                <p className="mt-0.5 text-xs text-slate-500">Các lĩnh vực chuyên môn</p>
                              </div>
                            </button>
                          </>
                        )}
                        
                        {blockItem.type === "RESEARCH" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                const isAllowed2 = isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO");
                                if (!isAllowed2) return;
                                addBlockFromCatalog("OTHERINFO", "OTHERSIX");
                              }}
                              disabled={!isAllowed || (isEditMode === false && !!activeTemplateId && !allowedBlockTypes.has("OTHERINFO")) ? true : false}
                              className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                                (isAllowed && (isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO")))
                                  ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                  : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                              }`}
                              title="Kỹ năng mềm"
                            >
                              <div className="mt-0.5 rounded-lg bg-cyan-100 p-1.5 text-cyan-600">
                                <Users size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">Kỹ năng mềm</p>
                                <p className="mt-0.5 text-xs text-slate-500">Kỹ năng giao tiếp, lãnh đạo...</p>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const isAllowed2 = isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO");
                                if (!isAllowed2) return;
                                addBlockFromCatalog("OTHERINFO", "OTHERSEVEN");
                              }}
                              disabled={!isAllowed || (isEditMode === false && !!activeTemplateId && !allowedBlockTypes.has("OTHERINFO")) ? true : false}
                              className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                                (isAllowed && (isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO")))
                                  ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                  : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                              }`}
                              title="Tài liệu bổ sung"
                            >
                              <div className="mt-0.5 rounded-lg bg-cyan-100 p-1.5 text-cyan-600">
                                <FileText size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">Tài liệu bổ sung</p>
                                <p className="mt-0.5 text-xs text-slate-500">Link, tài liệu tham khảo...</p>
                              </div>
                            </button>
                          </>
                        )}
                        
                        {blockItem.type === "TYPICALCASE" && (
                          <button
                            type="button"
                            onClick={() => {
                              const isAllowed2 = isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO");
                              if (!isAllowed2) return;
                              addBlockFromCatalog("OTHERINFO", "OTHEREIGHT");
                            }}
                            disabled={!isAllowed || (isEditMode === false && !!activeTemplateId && !allowedBlockTypes.has("OTHERINFO")) ? true : false}
                            className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                              (isAllowed && (isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO")))
                                ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                            }`}
                            title="Giấy phép hành nghề"
                          >
                            <div className="mt-0.5 rounded-lg bg-orange-100 p-1.5 text-orange-600">
                              <ScrollText size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800">Giấy phép hành nghề</p>
                              <p className="mt-0.5 text-xs text-slate-500">Số hiệu, nơi cấp, ngày cấp...</p>
                            </div>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          <main className="rounded-2xl border border-slate-200 bg-white p-4">
            {activeTab === "template" ? (
              <>
                {activeTemplateId === null ? (
                  <div className="flex min-h-[70vh] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                    <div className="max-w-sm px-6">
                      <h2 className="text-lg font-bold text-slate-700">Chọn template</h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Bấm chọn một template ở bên trái để xem thông tin chi tiết.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h2 className="text-lg font-bold text-slate-900">
                        {getTemplateName(
                          activeTemplateId,
                          templates,
                          TEMPLATE_DISPLAY_NAMES,
                        )}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Loại block được hỗ trợ ({allowedBlockTypes.size}):
                      </p>
                      <ul className="mt-3 space-y-2">
                        {Array.from(allowedBlockTypes).map((blockType) => (
                          <li
                            key={blockType}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                          >
                            <span className="font-semibold text-slate-700">
                              {BLOCK_LABELS[blockType] || blockType}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("component")}
                      className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      Chỉnh sửa template này
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {blocks.length === 0 ? (
                  <div className="flex min-h-[70vh] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                    <div className="max-w-sm px-6">
                      <h2 className="text-lg font-bold text-slate-700">Portfolio đang trống</h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Chọn một template ở bên trái hoặc thêm block thủ công trong tab Thành phần để bắt đầu.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto max-w-2xl">
                    <PortfolioRenderer blocks={blocks} />
                  </div>
                )}
              </>
            )}
          </main>

          <aside
            className={cn(
              "rounded-2xl border border-slate-200 p-3",
              isUsingDedicatedEditor ? "bg-[#EFF6FF]" : "bg-white",
            )}
          >
            <div className={cn("mb-3", isUsingDedicatedEditor && "hidden")}>
              <h2 className="text-sm font-bold text-slate-900">Chỉnh sửa block</h2>
              <p className="text-xs text-slate-500">
                Chỉ hiển thị form chỉnh sửa cho các block đã hỗ trợ editor riêng.
              </p>
            </div>

            {/* List of added blocks */}
            {activeTab === "component" && blocks.length > 0 && !isUsingDedicatedEditor && (
              <div className={cn("mb-4 pb-4 border-b border-slate-200")}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Các block đã thêm ({blocks.length})
                </h3>
                <div className="space-y-1.5">
                  {blocks.map((block) => {
                    const blockInfo = getBlockInfo(normalizeBlockType(block.type));
                    const BlockIcon = blockInfo?.icon;
                    const variantInfo = blockInfo?.variants.find(
                      (v) => v.variant === block.variant.toUpperCase()
                    );

                    return (
                      <div
                        key={block.id}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors cursor-pointer",
                          selectedBlockId === block.id
                            ? "border-blue-400 bg-blue-50"
                            : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50"
                        )}
                        onClick={() => {
                          setSelectedBlockId(block.id);
                          setActiveEditorBlockType(normalizeBlockType(block.type) as ExtendedEditorBlockType);
                          setActiveEditorBlockVariant(block.variant.toUpperCase());
                          setShowBlockSelector(false);
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {BlockIcon && (
                            <BlockIcon size={14} className="text-slate-600 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">
                              {blockInfo?.label || block.type}
                            </p>
                            {variantInfo && (
                              <p className="text-[10px] text-slate-500 truncate">
                                {variantInfo.label}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlock(block.id);
                          }}
                          className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          title="Xóa block này"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={cn("mb-3 grid grid-cols-3 gap-2", isUsingDedicatedEditor && "hidden")}>
              {editorSlots.map((slot) => {
                const slotVariant = slot.variant?.toUpperCase();
                const hasBlock = blocks.some(
                  (block) =>
                    normalizeBlockType(block.type) === slot.type
                    && (!slotVariant || block.variant.toUpperCase() === slotVariant),
                );

                const isActiveSlot =
                  activeEditorBlockType === slot.type
                  && ((slotVariant ?? null) === activeEditorBlockVariant);

                return (
                  <button
                    key={`${slot.type}.${slotVariant ?? "default"}`}
                    type="button"
                    onClick={() => {
                      setActiveEditorBlockType(slot.type);
                      setActiveEditorBlockVariant(slotVariant ?? null);
                      const targetBlockId = blocks.find(
                        (block) =>
                          normalizeBlockType(block.type) === slot.type
                          && (!slotVariant || block.variant.toUpperCase() === slotVariant),
                      )?.id;

                      if (targetBlockId) {
                        setSelectedBlockId(targetBlockId);
                        setShowBlockSelector(false);
                      } else {
                        setSelectedBlockId(null);
                        setShowBlockSelector(true);
                      }
                    }}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-xs font-semibold transition-colors",
                      isActiveSlot
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50",
                    )}
                  >
                    <div>{slot.label}</div>
                    <div className={cn("mt-0.5 text-[10px]", hasBlock ? "text-emerald-600" : "text-slate-400")}>
                      {hasBlock ? "Đã có" : "Chưa có"}
                    </div>
                  </button>
                );
              })}
            </div>

            {!activeEditorBlock && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4">
                <p className="text-sm font-semibold text-slate-700">
                  Chưa có block {activeEditorLabel}.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Bạn có thể thêm từ tab Thành phần hoặc bấm nút bên dưới.
                </p>
                <button
                  type="button"
                  onClick={() => addBlockFromCatalog(activeEditorBlockType, activeEditorBlockVariant ?? undefined)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={14} /> Thêm {activeEditorLabel}
                </button>
              </div>
            )}

            {activeEditorBlock && (
              <div className={cn(!isUsingDedicatedEditor && "max-h-[calc(100vh-320px)] overflow-y-auto pr-1")}>
                {!isUsingDedicatedEditor && (
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Thông tin {activeEditorLabel}
                    </h3>
                    {selectedBlock && (
                      <select
                        value={selectedBlock.variant.toUpperCase()}
                        onChange={(event) => updateSelectedVariant(event.target.value)}
                        disabled={isTemplateBasedEditorSlots && Boolean(activeEditorBlockVariant)}
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 outline-none focus:border-blue-400"
                      >
                        {((isTemplateBasedEditorSlots && activeEditorBlockVariant)
                          ? [activeEditorBlockVariant]
                          : (BLOCK_VARIANTS[normalizeBlockType(selectedBlock.type)] ?? [selectedBlock.variant])).map((variantOption) => (
                          <option key={variantOption} value={variantOption}>
                            {variantOption}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {isUsingDedicatedEditor ? <div className="-mx-3 -mb-3">{renderEditorForm()}</div> : renderEditorForm()}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>

    {showVariantSelector && blockInfoForVariantSelector && (
      <VariantSelector
        blockInfo={blockInfoForVariantSelector}
        onSelectVariant={handleVariantSelect}
        onClose={() => {
          setShowVariantSelector(false);
          setSelectedBlockTypeForVariant(null);
        }}
      />
    )}
  </>
  );
}
