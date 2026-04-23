import {
  ArrowLeft,
  Save,
  Trash2,
  Target,
  Lightbulb,
  Users,
  FileText,
  ScrollText,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
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

const normalizeBlockType = (type: string): string => {
  const upper = type.toUpperCase();
  if (upper === "EXPERIENCE") {
    return "EXPERIMENT";
  }
  return upper;
};

const getDefaultVariant = (type: string): string => {
  const normalizedType = normalizeBlockType(type);
  return BLOCK_VARIANTS[normalizedType]?.[0] ?? "INTROONE";
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

const getOrderedBlockCatalog = (): typeof BLOCK_CATALOG => {
  const catalog = [...BLOCK_CATALOG];
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
  return catalog.sort((a, b) => {
    const orderA = blockOrder[a.type] ?? 999;
    const orderB = blockOrder[b.type] ?? 999;
    return orderA - orderB;
  });
};

// ─── Slot key helper ────────────────────────────────────────────────────────
const getSlotKey = (slot: EditorSlot): string =>
  `${slot.type}.${(slot.variant ?? "default").toUpperCase()}`;

// ─── Accordion item component ────────────────────────────────────────────────
function AccordionItem({
  title,
  hasData,
  defaultOpen = false,
  children,
}: {
  title: string;
  hasData: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors",
          open ? "bg-blue-50" : "hover:bg-slate-50",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-slate-800 truncate">{title}</span>
          <span
            className={cn(
              "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              hasData
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500",
            )}
          >
            {hasData ? "Đã có" : "Trống"}
          </span>
        </div>
        {open ? (
          <ChevronUp size={15} className="shrink-0 text-slate-400" />
        ) : (
          <ChevronDown size={15} className="shrink-0 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-[#EFF6FF] p-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { user, accessToken } = useAppSelector((state) => state.auth);

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
  const [_activeEditorBlockType, setActiveEditorBlockType] =
    useState<ExtendedEditorBlockType>("INTRO");
  const [_activeEditorBlockVariant, setActiveEditorBlockVariant] = useState<string | null>(null);
  const [editorSlotPreset, setEditorSlotPreset] = useState<EditorSlotPreset>("default");
  const [blocks, setBlocks] = useState<PortfolioBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [_showBlockSelector, setShowBlockSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track reset keys per slot so each accordion editor resets independently
  const [slotResetKeys, setSlotResetKeys] = useState<Record<string, number>>({});

  const nextTempBlockIdRef = useRef(-1);

  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedBlockTypeForVariant, setSelectedBlockTypeForVariant] = useState<string | null>(null);

  const allocateTempBlockId = (): number => {
    const nextId = nextTempBlockIdRef.current;
    nextTempBlockIdRef.current -= 1;
    return nextId;
  };

  const getUserInfo = useCallback(() => {
    if (!user) return undefined;
    return {
      fullName: employeeProfile?.name || (user as any).fullName || (user as any).name || undefined,
      email: user.email,
      phone: employeeProfile?.phone || (user as any).phone || undefined,
      name: employeeProfile?.name || (user as any).name || undefined,
    };
  }, [user, employeeProfile]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !accessToken) return;
        const profile = await fetchEmployeeProfile(accessToken);
        setEmployeeProfile(profile);
      } catch (error) {
        console.warn("⚠️ Failed to fetch employee profile:", error);
      }
    };
    fetchProfile();
  }, [user, accessToken]);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);

        const templateData = await portfolioService.fetchPortfolioTemplates();
        setTemplates(templateData.slice(0, 5));

        if (isEditMode && id) {
          const portfolioId = Number(id);
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
            sortedBlocks.find((block) => normalizeBlockType(block.type) === preferredType) ??
            sortedBlocks[0] ??
            null;

          setBlocks(sortedBlocks);
          setActiveTab("component");
          setEditorSlotPreset("default");
          setSelectedBlockId(preferredBlock?.id ?? null);
          setPortfolioName(detail.portfolioName || `Portfolio ${portfolioId}`);
          return;
        }

        setBlocks([]);
        setEditorSlotPreset("default");
        setSelectedBlockId(null);
        setPortfolioName("Hồ sơ mới");
        setAllowedBlockTypes(new Set());
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

  // ─── Derived state ───────────────────────────────────────────────────────

  const editorSlots = useMemo<EditorSlot[]>(() => {
  let baseSlots: EditorSlot[] = [];

  // 1. Lấy slots dựa trên Template hiện tại
  if (editorSlotPreset === "template2") baseSlots = [...TEMPLATE_TWO_EDITOR_SLOTS];
  else if (editorSlotPreset === "template3") baseSlots = [...TEMPLATE_THREE_EDITOR_SLOTS];
  else if (editorSlotPreset === "template4") baseSlots = [...TEMPLATE_FOUR_EDITOR_SLOTS];
  else if (editorSlotPreset === "template5") baseSlots = [...TEMPLATE_FIVE_EDITOR_SLOTS];
  else {
    baseSlots = EDITABLE_BLOCK_TYPES.map((type) => ({ type, label: BLOCK_LABELS[type] }));
  }

  // 2. TÌM CÁC BLOCK LẺ: Duyệt qua danh sách `blocks` hiện có, 
  // nếu có block nào chưa nằm trong `baseSlots` thì thêm nó vào cuối Sidebar.
  const extraSlots: EditorSlot[] = [];
  blocks.forEach(block => {
    const isAlreadyInSlots = baseSlots.some(slot => 
      slot.type === normalizeBlockType(block.type) && 
      slot.variant?.toUpperCase() === block.variant.toUpperCase()
    );

    if (!isAlreadyInSlots) {
      extraSlots.push({
        type: normalizeBlockType(block.type) as ExtendedEditorBlockType,
        variant: block.variant,
        label: `${BLOCK_LABELS[normalizeBlockType(block.type)]} (Tùy chỉnh)`
      });
    }
  });

  return [...baseSlots, ...extraSlots];
}, [editorSlotPreset, blocks]); // Thêm blocks vào dependency để cập nhật khi thêm block mới

  // ─── Core block helpers ──────────────────────────────────────────────────

  /**
   * Find the block matching a given slot (type + optional variant).
   */
  const findBlockForSlot = useCallback(
    (slot: EditorSlot): PortfolioBlock | null => {
      const slotVariant = slot.variant?.toUpperCase();
      return (
        blocks.find(
          (b) =>
            normalizeBlockType(b.type) === slot.type &&
            (!slotVariant || b.variant.toUpperCase() === slotVariant),
        ) ?? null
      );
    },
    [blocks],
  );

  /**
   * Update block data by block id.
   */
  const updateBlockDataById = useCallback(
    (blockId: number, updater: (current: unknown) => unknown) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((block) => {
          if (block.id !== blockId) return block;
          const cloned = deepClone(block.data);
          return { ...block, data: updater(cloned) };
        }),
      );
    },
    [],
  );

  const resetSlotKey = useCallback((slotKey: string) => {
    setSlotResetKeys((prev) => ({ ...prev, [slotKey]: (prev[slotKey] ?? 0) + 1 }));
  }, []);

  // ─── addBlockFromCatalog ─────────────────────────────────────────────────

  const addBlockFromCatalog = (type: string, forcedVariant?: string) => {
    const normalizedType = normalizeBlockType(type);
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

    setBlocks((prevBlocks) => sortAndReindexBlocks([...prevBlocks, newBlock]));
    setSelectedBlockId(newBlock.id);
    setActiveTab("component");
  };

  const handleSave = async () => {
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

      const portfolioData = {
        employeeId: user.employeeId || user.id,
        name: portfolioName.trim() || "Hồ sơ mới",
        blocks: sortAndReindexBlocks(blocks).map((block) => ({
          id: block.id,
          type: normalizeBlockType(block.type),
          variant: block.variant.toUpperCase(),
          order: block.order,
          data: deepClone(block.data),
        })),
      };

      try {
        if (isEditMode && id) {
          const portfolioId = Number(id);
          await portfolioService.updatePortfolioAPI(portfolioId, portfolioData, accessToken);
          notify.success("Hồ sơ đã được cập nhật thành công!");
        } else {
          await portfolioService.createPortfolioAPI(portfolioData, accessToken);
          notify.success("Hồ sơ đã được lưu thành công!");
        }

        portfolioService.clearPortfolioImageFiles();
        navigate("/portfolioManagement?refresh=true", { replace: true });
      } catch (apiError) {
        const errorMessage =
          apiError instanceof Error ? apiError.message : "Không thể lưu hồ sơ lên máy chủ";
        setError(errorMessage);
        notify.error(errorMessage);
      }
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Không thể lưu portfolio.";
      setError(message);
      notify.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlock = (blockId: number) => {
    setBlocks((current) => {
      const updated = current.filter((block) => block.id !== blockId);
      return sortAndReindexBlocks(updated);
    });
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      setShowBlockSelector(true);
    }
  };

  const applyTemplate = (template: PortfolioResponse) => {
    const blockTypes = new Set(template.blocks.map((block) => normalizeBlockType(block.type)));
    setAllowedBlockTypes(blockTypes);
    setBlocks([]);
    setActiveTemplateId(template.portfolioId);

    const selectedTemplateIndex = templates.findIndex((item) => item.portfolioId === template.portfolioId);
    const templateVariants = new Set(template.blocks.map((block) => block.variant.toUpperCase()));

    const hasTemplateTwoVariantSet =
      templateVariants.size === TEMPLATE_TWO_REQUIRED_VARIANTS.size &&
      Array.from(TEMPLATE_TWO_REQUIRED_VARIANTS).every((v) => templateVariants.has(v));
    const hasTemplateThreeVariantSet =
      templateVariants.size === TEMPLATE_THREE_REQUIRED_VARIANTS.size &&
      Array.from(TEMPLATE_THREE_REQUIRED_VARIANTS).every((v) => templateVariants.has(v));
    const hasTemplateFourVariantSet =
      templateVariants.size === TEMPLATE_FOUR_REQUIRED_VARIANTS.size &&
      Array.from(TEMPLATE_FOUR_REQUIRED_VARIANTS).every((v) => templateVariants.has(v));
    const hasTemplateFiveVariantSet =
      templateVariants.size === TEMPLATE_FIVE_REQUIRED_VARIANTS.size &&
      Array.from(TEMPLATE_FIVE_REQUIRED_VARIANTS).every((v) => templateVariants.has(v));

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

  const handleVariantSelect = (variant: string) => {
    if (!selectedBlockTypeForVariant) return;
    addBlockFromCatalog(selectedBlockTypeForVariant, variant);
    setSelectedBlockTypeForVariant(null);
    setShowVariantSelector(false);
  };

  // ─── Per-slot editor renderer ─────────────────────────────────────────────

  /**
   * Renders the appropriate Form Editor for a given slot.
   * All save/cancel callbacks are scoped to the specific block for that slot.
   */
  const renderSlotEditor = useCallback(
    (slot: EditorSlot) => {
      const slotKey = getSlotKey(slot);
      const resetKey = slotResetKeys[slotKey] ?? 0;
      const block = findBlockForSlot(slot);
      const blockType = slot.type;
      const variant = (slot.variant ?? getDefaultVariant(slot.type)).toUpperCase();

      // Data to pass to the editor (from existing block or defaults)
      const rawData = block?.data ?? createDefaultBlockData(blockType, variant);

      // Scoped updater: creates block if it doesn't exist, then updates data
      const scopedUpdate = (updater: (current: unknown) => unknown) => {
        if (block) {
          updateBlockDataById(block.id, updater);
        } else {
          // Create the block first, then update
          const newVariant = variant;
          const newBlock: PortfolioBlock = {
            id: allocateTempBlockId(),
            type: blockType,
            variant: newVariant,
            order: blocks.length + 1,
            data: updater(createDefaultBlockData(blockType, newVariant)),
          };
          setBlocks((prev) => sortAndReindexBlocks([...prev, newBlock]));
        }
      };

      const scopedArrayRemover = (index: number) => {
        if (!block) return;
        updateBlockDataById(block.id, (current) => {
          const arr = toRecordArray(current);
          return arr.filter((_, i) => i !== index);
        });
      };

      const handleSaveWrapper = (updatedData: unknown) => {
        if (block) {
          updateBlockDataById(block.id, () => updatedData);
        } else {
          const newBlock: PortfolioBlock = {
            id: allocateTempBlockId(),
            type: blockType,
            variant,
            order: blocks.length + 1,
            data: updatedData,
          };
          setBlocks((prev) => sortAndReindexBlocks([...prev, newBlock]));
        }
        resetSlotKey(slotKey);
      };

      const editorKey = `${slotKey}-${block?.id ?? "new"}-${resetKey}`;

      // ── INTRO variants ──────────────────────────────────────────────────
      if (blockType === "INTRO" && variant === "INTROONE") {
        const initialData = createIntroOneDraft(rawData, getUserInfo());
        return (
          <IntroOneEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: IntroOneDraft) => {
              handleSaveWrapper({
                fullName: draft.fullName,
                name: draft.fullName,
                studyField: draft.studyField,
                email: draft.email,
                phone: draft.phone,
                description: draft.description,
                avatar: draft.avatar,
              });
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "INTRO" && variant === "INTROTWO") {
        const initialData = createIntroTwoDraft(rawData, getUserInfo());
        return (
          <IntroTwoEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: IntroTwoDraft) => {
              handleSaveWrapper({
                fullName: draft.fullName,
                name: draft.fullName,
                position: draft.position,
                title: draft.position,
                yearOfStudy: draft.yearOfStudy,
                school: draft.school,
                studyField: draft.studyField,
                email: draft.email,
                phoneNumber: draft.phoneNumber,
                phone: draft.phoneNumber,
                avatar: draft.avatar,
              });
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "INTRO" && variant === "INTROTHREE") {
        const initialData = createIntroThreeDraft(rawData, getUserInfo());
        return (
          <IntroThreeEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: IntroThreeDraft) => {
              handleSaveWrapper({
                fullName: draft.fullName,
                name: draft.fullName,
                school: draft.school,
                department: draft.department,
                studyField: draft.studyField,
                title: draft.studyField,
                gpa: draft.gpa,
                avatar: draft.avatar,
              });
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "INTRO" && variant === "INTROFOUR") {
        const initialData = createIntroFourDraft(rawData, getUserInfo());
        return (
          <IntroFourEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: IntroFourDraft) => {
              handleSaveWrapper({
                fullName: draft.fullName,
                name: draft.fullName,
                school: draft.school,
                department: draft.department,
                studyField: draft.studyField,
                title: draft.studyField,
                gpa: draft.gpa,
                avatar: draft.avatar,
              });
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "INTRO" && variant === "INTROFIVE") {
        const initialData = createIntroFiveDraft(rawData, getUserInfo());
        return (
          <IntroFiveEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: IntroFiveDraft) => {
              handleSaveWrapper({
                fullName: draft.fullName,
                name: draft.fullName,
                school: draft.school,
                department: draft.department,
                experience: draft.experience,
                avatar: draft.avatar,
                studyField: draft.studyField,
                title: draft.title,
              });
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── SKILL variants ──────────────────────────────────────────────────
      if (blockType === "SKILL" && variant === "SKILLONE") {
        const initialData = createSkillOneDraft(rawData);
        return (
          <SkillOneEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: SkillOneDraft) => {
              handleSaveWrapper(draft.skills.map((name) => ({ name })));
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "SKILL" && variant === "SKILLTWO") {
        const initialData = createSkillTwoDraft(rawData);
        return (
          <SkillTwoEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: SkillTwoDraft) => {
              handleSaveWrapper({
                languages: draft.languages,
                frameworks: draft.frameworks,
                tools: draft.tools,
              });
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "SKILL" && variant === "SKILLTHREE") {
        return (
          <SkillThreeEditor
            key={editorKey}
            initialData={createEmptySkillThreeDraft()}
            onSave={(draft: SkillThreeDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, { name: draft.name, description: draft.description }];
              });
              resetSlotKey(slotKey);
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── EDUCATION variants ──────────────────────────────────────────────
      if (blockType === "EDUCATION" && variant === "EDUCATIONONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createEducationOneDraft(item))
          : [];
        const initialData = createEducationOneDraft(rawData);
        return (
          <EducationOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: EducationOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, {
                  schoolName: draft.schoolName,
                  school: draft.schoolName,
                  time: draft.time,
                  department: draft.department,
                  major: draft.department,
                  certificate: draft.certificate,
                  description: draft.description,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onSaveList={(list: EducationOneDraft[]) => {
              handleSaveWrapper(list.map((e) => ({
                schoolName: e.schoolName,
                school: e.schoolName,
                time: e.time,
                department: e.department,
                major: e.department,
                certificate: e.certificate,
                description: e.description,
              })));
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "EDUCATION" && variant === "EDUCATIONTWO") {
        const initialData = createEducationTwoDraft(rawData);
        return (
          <EducationTwoEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: EducationTwoDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, {
                  time: draft.time,
                  department: draft.department,
                  schoolName: draft.schoolName,
                  description: draft.description,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "EDUCATION" && variant === "EDUCATIONTHREE") {
        const initialData = createEducationThreeDraft(rawData);
        return (
          <EducationThreeEditor
            key={editorKey}
            initialData={createEmptyEducationThreeDraft()}
            latestData={initialData}
            onSave={(draft: EducationThreeDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, {
                  time: draft.time,
                  gpa: draft.gpa,
                  qualified: draft.qualified,
                  description: draft.description,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── EXPERIMENT ──────────────────────────────────────────────────────
      if (blockType === "EXPERIMENT" && variant === "EXPERIMENTONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createExperienceOneDraft(item))
          : [];
        const initialData = createExperienceOneDraft(rawData);
        return (
          <ExperienceOneEditor
            key={editorKey}
            initialData={initialData}
            existingItems={listData}
            onSave={(draft: ExperienceOneDraft) => {
              const { startDate, endDate } = splitExperienceOneTimeRange(draft.time);
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, {
                  jobName: draft.jobName,
                  address: draft.address,
                  startDate,
                  endDate,
                  time: draft.time,
                  description: draft.description,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onCancel={() => {}}
            onDeleteItem={scopedArrayRemover}
          />
        );
      }

      // ── PROJECT variants ────────────────────────────────────────────────
      if (blockType === "PROJECT" && variant === "PROJECTONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createProjectOneDraft(item))
          : [];
        const initialData = createProjectOneDraft(rawData);

        const buildProjectLinks = (p: ProjectOneDraft) =>
          [
            { type: "github", link: p.githubLink.trim() },
            { type: "figma", link: p.figmaLink.trim() },
            { type: "app", link: p.appLink.trim() },
            { type: "website", link: p.websiteLink.trim() },
          ].filter((l) => l.link.length > 0);

        return (
          <ProjectOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: ProjectOneDraft) => {
              const projectLinks = buildProjectLinks(draft);
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [{
                  ...(items[0] ?? {}),
                  image: draft.image,
                  name: draft.name,
                  description: draft.description,
                  role: draft.role,
                  technology: draft.technology,
                  projectLinks,
                  links: projectLinks,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onSaveList={(list: ProjectOneDraft[]) => {
              handleSaveWrapper(list.map((p) => {
                const projectLinks = buildProjectLinks(p);
                return { image: p.image, name: p.name, description: p.description, role: p.role, technology: p.technology, projectLinks, links: projectLinks };
              }));
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "PROJECT" && variant === "PROJECTTWO") {
        const initialData = createProjectTwoDraft(rawData);
        return (
          <ProjectTwoEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: ProjectTwoDraft) => {
              const normalizedLink = draft.link.trim();
              const linkItems = normalizedLink.length > 0 ? [{ link: normalizedLink }] : [];
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, {
                  name: draft.name,
                  action: draft.action,
                  publisher: draft.publisher,
                  description: draft.description,
                  projectLinks: linkItems,
                  links: linkItems,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "PROJECT" && variant === "PROJECTTHREE") {
        const initialData = createProjectThreeDraft(rawData);
        return (
          <ProjectThreeEditor
            key={editorKey}
            initialData={initialData ?? createEmptyProjectThreeDraft()}
            onSave={(draft: ProjectThreeDraft) => {
              const normalizedLink = draft.link.trim();
              const linkItems = normalizedLink.length > 0 ? [{ link: normalizedLink }] : [];
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, {
                  name: draft.name,
                  action: draft.action,
                  publisher: draft.publisher,
                  description: draft.description,
                  projectLinks: linkItems,
                  links: linkItems,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── AWARD ───────────────────────────────────────────────────────────
      if (blockType === "AWARD" && variant === "AWARDONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createAwardOneDraft(item))
          : [];
        const initialData = createAwardOneDraft(rawData);
        return (
          <AwardEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: AwardOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [{
                  ...(items[0] ?? {}),
                  name: draft.name,
                  date: draft.date,
                  time: draft.date,
                  organization: draft.organization,
                  issuer: draft.organization,
                  description: draft.description,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onSaveList={(list: AwardOneDraft[]) => {
              handleSaveWrapper(list.map((a) => ({
                name: a.name,
                date: a.date,
                time: a.date,
                organization: a.organization,
                issuer: a.organization,
                description: a.description,
              })));
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── ACTIVITIES ──────────────────────────────────────────────────────
      if (blockType === "ACTIVITIES") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createActivityOneDraft(item))
          : [];
        const initialData = createActivityOneDraft(rawData);
        return (
          <ActivityOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: ActivityOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [{
                  ...(items[0] ?? {}),
                  name: draft.name,
                  date: draft.date,
                  time: draft.date,
                  description: draft.description,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onSaveList={(list: ActivityOneDraft[]) => {
              handleSaveWrapper(list.map((a) => ({
                name: a.name,
                date: a.date,
                time: a.date,
                description: a.description,
              })));
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── OTHERINFO variants ──────────────────────────────────────────────
      if (blockType === "OTHERINFO" && variant === "OTHERONE") {
        const initialData = createOtherInfoOneDraft(rawData);
        return (
          <OtherInfoOneEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherInfoOneDraft) => {
              handleSaveWrapper(draft.interests.map((name) => ({ detail: name })));
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "OTHERINFO" && (variant === "OTHERTWO" || variant === "OTHERTHREE" || variant === "OTHERFOUR")) {
        const initialData = createOtherInfoTwoDraft(rawData);
        return (
          <OtherInfoTwoEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherInfoTwoDraft) => {
              handleSaveWrapper({ detail: draft.detail });
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "OTHERINFO" && variant === "OTHERFIVE") {
        const initialData = createOtherFiveDraft(rawData);
        return (
          <OtherFiveEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherFiveDraft) => {
              handleSaveWrapper(draft.topics.map((name) => ({ name })));
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "OTHERINFO" && variant === "OTHERSIX") {
        const initialData = createOtherInfoSixDraft(rawData);
        return (
          <OtherInfoSixEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherInfoSixDraft) => {
              handleSaveWrapper(draft.softSkills.map((name) => ({ name })));
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "OTHERINFO" && variant === "OTHERSEVEN") {
        const initialData = createOtherSevenDraft(rawData);
        return (
          <OtherInfoSevenEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherSevenDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, { name: draft.name, detail: draft.detail }];
              });
              resetSlotKey(slotKey);
            }}
            onCancel={() => {}}
          />
        );
      }

      if (blockType === "OTHERINFO" && variant === "OTHEREIGHT") {
        const initialData = createOtherEightDraft(rawData);
        return (
          <OtherEightEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherEightDraft) => {
              handleSaveWrapper({ ...toRecord(rawData), detail: draft.detail });
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── REFERENCE ───────────────────────────────────────────────────────
      if (blockType === "REFERENCE" && variant === "REFERENCEONE") {
        const initialData = createReferenceOneDraft(rawData);
        return (
          <ReferenceEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: ReferenceOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [{
                  ...(items[0] ?? {}),
                  name: draft.name,
                  position: draft.position,
                  mail: draft.email,
                  email: draft.email,
                  phone: draft.contactInfo,
                  detail: draft.contactInfo,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── DIPLOMA ─────────────────────────────────────────────────────────
      if (blockType === "DIPLOMA" && variant === "DIPLOMAONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createCertificateOneDraft(item))
          : [];
        const initialData = createCertificateOneDraft(rawData);
        return (
          <CertificateOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: CertificateOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [{
                  ...(items[0] ?? {}),
                  name: draft.name,
                  issuer: draft.issuer,
                  provider: draft.issuer,
                  year: draft.year,
                  date: draft.year,
                  link: draft.link,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onSaveList={(list: CertificateOneDraft[]) => {
              handleSaveWrapper(list.map((c) => ({
                name: c.name,
                issuer: c.issuer,
                provider: c.issuer,
                year: c.year,
                date: c.year,
                link: c.link,
              })));
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── RESEARCH ────────────────────────────────────────────────────────
      if (blockType === "RESEARCH" && variant === "RESEARCHONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createResearchOneDraft(item))
          : [];
        const initialData = createResearchOneDraft(rawData);
        return (
          <ResearchOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: ResearchOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, {
                  name: draft.title,
                  time: draft.date,
                  description: draft.conference,
                  link: draft.link,
                  conference: draft.conference,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onSaveList={(list: ResearchOneDraft[]) => {
              handleSaveWrapper(list.map((r) => ({
                name: r.title,
                time: r.date,
                description: r.conference,
                link: r.link,
                conference: r.conference,
              })));
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── TEACHING ────────────────────────────────────────────────────────
      if (blockType === "TEACHING" && variant === "TEACHINGONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => {
              if (item && typeof item === "object") {
                const r = item as Record<string, unknown>;
                return { subject: toText(r.subject), teachingplace: toText(r.teachingplace) };
              }
              return createEmptyTeachingOneDraft();
            })
          : [];
        return (
          <TeachingOneEditor
            key={editorKey}
            initialData={createEmptyTeachingOneDraft()}
            initialList={listData}
            onSave={(draft: TeachingOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, { subject: draft.subject, teachingplace: draft.teachingplace }];
              });
              resetSlotKey(slotKey);
            }}
            onSaveList={(list: TeachingOneDraft[]) => {
              handleSaveWrapper(list.map((t) => ({ subject: t.subject, teachingplace: t.teachingplace })));
            }}
            onCancel={() => {}}
          />
        );
      }

      // ── TYPICALCASE ─────────────────────────────────────────────────────
      if (blockType === "TYPICALCASE" && variant === "TYPICALCASEONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => {
              if (item && typeof item === "object") {
                const r = item as Record<string, unknown>;
                return {
                  patient: toText(r.patient),
                  age: toText(r.age),
                  caseName: toText(r.caseName),
                  stage: toText(r.stage),
                  regiment: toText(r.regiment),
                };
              }
              return createEmptyTypicalCaseOneDraft();
            })
          : [];
        return (
          <TypicalCaseOneEditor
            key={editorKey}
            initialData={createEmptyTypicalCaseOneDraft()}
            initialList={listData}
            onSave={(draft: TypicalCaseOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, {
                  patient: draft.patient,
                  age: draft.age,
                  caseName: draft.caseName,
                  stage: draft.stage,
                  regiment: draft.regiment,
                }];
              });
              resetSlotKey(slotKey);
            }}
            onSaveList={(list: TypicalCaseOneDraft[]) => {
              handleSaveWrapper(list.map((c) => ({
                patient: c.patient,
                age: c.age,
                caseName: c.caseName,
                stage: c.stage,
                regiment: c.regiment,
              })));
            }}
            onCancel={() => {}}
          />
        );
      }

      // Fallback: no dedicated editor
      return (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-500">
          Block này chưa có form cấu hình.
        </p>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blocks, slotResetKeys, getUserInfo, findBlockForSlot, updateBlockDataById, resetSlotKey],
  );

  // ─── Loading state ───────────────────────────────────────────────────────

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

  // ─── JSX ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-[calc(100vh-56px)] bg-slate-100">
        {/* Top bar */}
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
              <h1 className="text-lg font-bold text-slate-900">
                {isEditMode ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ"}
              </h1>
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
            {/* ── Left sidebar: template / component catalog ───────────── */}
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
                          <p className="text-xs text-slate-500">{template.blocks.length} block(s)</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === "component" && (
                  <div className="space-y-2">
                    {getOrderedBlockCatalog().map((blockItem) => {
                      const isAllowed =
                        isEditMode || !activeTemplateId || allowedBlockTypes.has(blockItem.type);
                      const BlockIcon = blockItem.icon;

                      return (
                        <div key={blockItem.type}>
                          <button
                            type="button"
                            onClick={() => {
                              if (blockItem.type === "OTHERINFO") {
                                addBlockFromCatalog("OTHERINFO", "OTHERONE");
                              } else {
                                setSelectedBlockTypeForVariant(blockItem.type);
                                setShowVariantSelector(true);
                              }
                            }}
                            disabled={!isAllowed}
                            className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                              isAllowed
                                ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                            }`}
                          >
                            <div className="mt-0.5 rounded-lg bg-slate-100 p-1.5 text-slate-600">
                              <BlockIcon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800">{blockItem.label}</p>
                              <p className="mt-0.5 text-xs text-slate-500">{blockItem.description}</p>
                            </div>
                          </button>

                          {blockItem.type === "REFERENCE" && (
                            <>
                              {[
                                { variant: "OTHERONE", icon: Lightbulb, color: "indigo", label: "Sở thích cá nhân", desc: "Tag các hoạt động yêu thích" },
                                { variant: "OTHERTWO", icon: Briefcase, color: "blue", label: "Mục tiêu nghề nghiệp", desc: "Mục tiêu dài hạn mô tả chi tiết" },
                                { variant: "OTHERTHREE", icon: Target, color: "purple", label: "Tầm nhìn và động lực", desc: "Tầm nhìn dài hạn và động lực" },
                                { variant: "OTHERFIVE", icon: Lightbulb, color: "purple", label: "Lĩnh vực nghiên cứu", desc: "Các lĩnh vực chuyên môn" },
                              ].map(({ variant, icon: Icon, color, label, desc }) => {
                                const otherAllowed = isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO");
                                return (
                                  <button
                                    key={variant}
                                    type="button"
                                    onClick={() => otherAllowed && addBlockFromCatalog("OTHERINFO", variant)}
                                    disabled={!otherAllowed}
                                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                                      otherAllowed
                                        ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                        : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                                    }`}
                                  >
                                    <div className={`mt-0.5 rounded-lg bg-${color}-100 p-1.5 text-${color}-600`}>
                                      <Icon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-slate-800">{label}</p>
                                      <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
                                    </div>
                                  </button>
                                );
                              })}
                            </>
                          )}

                          {blockItem.type === "RESEARCH" && (
                            <>
                              {[
                                { variant: "OTHERSIX", icon: Users, color: "cyan", label: "Kỹ năng mềm", desc: "Kỹ năng giao tiếp, lãnh đạo..." },
                                { variant: "OTHERSEVEN", icon: FileText, color: "cyan", label: "Tài liệu bổ sung", desc: "Link, tài liệu tham khảo..." },
                              ].map(({ variant, icon: Icon, color, label, desc }) => {
                                const otherAllowed = isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO");
                                return (
                                  <button
                                    key={variant}
                                    type="button"
                                    onClick={() => otherAllowed && addBlockFromCatalog("OTHERINFO", variant)}
                                    disabled={!otherAllowed}
                                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                                      otherAllowed
                                        ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                        : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                                    }`}
                                  >
                                    <div className={`mt-0.5 rounded-lg bg-${color}-100 p-1.5 text-${color}-600`}>
                                      <Icon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-slate-800">{label}</p>
                                      <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
                                    </div>
                                  </button>
                                );
                              })}
                            </>
                          )}

                          {blockItem.type === "TYPICALCASE" && (
                            (() => {
                              const otherAllowed = isEditMode || !activeTemplateId || allowedBlockTypes.has("OTHERINFO");
                              return (
                                <button
                                  type="button"
                                  onClick={() => otherAllowed && addBlockFromCatalog("OTHERINFO", "OTHEREIGHT")}
                                  disabled={!otherAllowed}
                                  className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3 ${
                                    otherAllowed
                                      ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                      : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                                  }`}
                                >
                                  <div className="mt-0.5 rounded-lg bg-orange-100 p-1.5 text-orange-600">
                                    <ScrollText size={16} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">Giấy phép hành nghề</p>
                                    <p className="mt-0.5 text-xs text-slate-500">Số hiệu, nơi cấp, ngày cấp...</p>
                                  </div>
                                </button>
                              );
                            })()
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>

            {/* ── Center: preview ──────────────────────────────────────── */}
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
                          {getTemplateName(activeTemplateId, templates, TEMPLATE_DISPLAY_NAMES)}
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

            {/* ── Right sidebar: accordion editors ────────────────────── */}
            <aside className="rounded-2xl border border-slate-200 bg-slate-50">
              {/* Header */}
              <div className="border-b border-slate-200 bg-white px-3 py-2.5 rounded-t-2xl">
                <h2 className="text-sm font-bold text-slate-900">Chỉnh sửa nội dung</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editorSlotPreset !== "default"
                    ? `${editorSlots.length} mục theo template`
                    : "Mở từng mục để nhập liệu"}
                </p>
              </div>

              {/* Blocks added outside of template slots (edit mode) */}
              {isEditMode && blocks.length > 0 && (
                <div className="border-b border-slate-200 bg-white px-3 py-2">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Blocks hiện tại ({blocks.length})
                  </p>
                  <div className="flex flex-col gap-1">
                    {blocks.map((block) => {
                      const blockInfo = getBlockInfo(normalizeBlockType(block.type));
                      const BlockIcon = blockInfo?.icon;
                      return (
                        <div
                          key={block.id}
                          className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {BlockIcon && <BlockIcon size={13} className="text-slate-500 shrink-0" />}
                            <span className="font-semibold text-slate-700 truncate">
                              {blockInfo?.label || block.type}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">
                              {block.variant}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlock(block.id)}
                            className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Accordion editors */}
              <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-3 space-y-2">
                {editorSlots.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-6 text-center">
                    <p className="text-sm text-slate-500">
                      Chọn một template để bắt đầu chỉnh sửa.
                    </p>
                  </div>
                ) : (
                  editorSlots.map((slot, index) => {
                    const slotKey = getSlotKey(slot);
                    const hasBlock = Boolean(findBlockForSlot(slot));

                    return (
                      <AccordionItem
                        key={slotKey}
                        title={slot.label}
                        hasData={hasBlock}
                        defaultOpen={index === 0}
                      >
                        {renderSlotEditor(slot)}
                      </AccordionItem>
                    );
                  })
                )}
              </div>
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