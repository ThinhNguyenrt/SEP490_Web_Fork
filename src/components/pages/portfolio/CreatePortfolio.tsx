import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import TemplatePreviewImage from "@/assets/testImage/testImage.png";
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
import CertificateOneEditor from "@/components/pages/portfolio/editor/CertificateOneEditor";
import EducationOneEditor from "@/components/pages/portfolio/editor/EducationOneEditor";
import EducationThreeEditor from "@/components/pages/portfolio/editor/EducationThreeEditor";
import ExperienceOneEditor from "@/components/pages/portfolio/editor/ExperienceOneEditor";
import IntroOneEditor from "@/components/pages/portfolio/editor/IntroOneEditor";
import IntroFourEditor from "@/components/pages/portfolio/editor/IntroFourEditor";
import IntroFiveEditor from "@/components/pages/portfolio/editor/IntroFiveEditor";
import IntroThreeEditor from "@/components/pages/portfolio/editor/IntroThreeEditor";
import SkillOneEditor from "@/components/pages/portfolio/editor/SkillOneEditor";
import SkillThreeEditor from "@/components/pages/portfolio/editor/SkillThreeEditor";
import SkillTwoEditor from "@/components/pages/portfolio/editor/SkillTwoEditor";
import TeachingOneEditor from "@/components/pages/portfolio/editor/TeachingOneEditor";
import TypicalCaseOneEditor from "@/components/pages/portfolio/editor/TypicalCaseOneEditor";
import ProjectOneEditor from "./editor/ProjectOneEditor";
import ProjectTwoEditor from "./editor/ProjectTwoEditor";
import ProjectThreeEditor from "./editor/ProjectThreeEditor";
import {
  createCertificateOneDraft,
  type CertificateOneDraft,
} from "@/components/pages/portfolio/editor/certificateOneDraft";
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
  createEmptyOtherEightDraft,
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
  createEmptyOtherSevenDraft,
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
} from "@/components/pages/portfolio/editor/educationOneDraft";
import {
  createEducationThreeDraft,
  createEmptyEducationThreeDraft,
  type EducationThreeDraft,
} from "@/components/pages/portfolio/editor/educationThreeDraft";
import {
  createExperienceOneDraft,
  splitExperienceOneTimeRange,
  type ExperienceOneDraft,
} from "@/components/pages/portfolio/editor/experienceOneDraft";
import {
  createIntroOneDraft,
  type IntroOneDraft,
} from "@/components/pages/portfolio/editor/introOneDraft";
import {
  createIntroFourDraft,
  type IntroFourDraft,
} from "@/components/pages/portfolio/editor/introFourDraft";
import {
  createIntroFiveDraft,
  type IntroFiveDraft,
} from "@/components/pages/portfolio/editor/introFiveDraft";
import {
  createIntroThreeDraft,
  type IntroThreeDraft,
} from "@/components/pages/portfolio/editor/introThreeDraft";
import {
  createIntroTwoDraft,
  type IntroTwoDraft,
} from "./editor/introTwoDraft";
import {
  createSkillOneDraft,
  type SkillOneDraft,
} from "@/components/pages/portfolio/editor/skillOneDraft";
import {
  createEmptySkillThreeDraft,
  type SkillThreeDraft,
} from "@/components/pages/portfolio/editor/skillThreeDraft";
import {
  createSkillTwoDraft,
  type SkillTwoDraft,
} from "@/components/pages/portfolio/editor/skillTwoDraft";
import {
  createEmptyTeachingOneDraft,
  type TeachingOneDraft,
} from "@/components/pages/portfolio/editor/teachingOneDraft";
import {
  createEmptyTypicalCaseOneDraft,
  type TypicalCaseOneDraft,
} from "@/components/pages/portfolio/editor/typicalCaseOneDraft";
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

type EditorTab = "template" | "component";

type FieldDefinition = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
};

type BlockCatalogItem = {
  type: string;
  label: string;
  description: string;
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
  { type: "SKILL", variant: "SKILLTHREE", label: "Kỹ năng lâm sàng" },
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

const COMPONENT_CATALOG: BlockCatalogItem[] = [
  { type: "INTRO", label: "Giới thiệu", description: "Thông tin cá nhân và liên hệ" },
  { type: "SKILL", label: "Kỹ năng", description: "Kỹ năng chuyên môn hoặc nền tảng" },
  { type: "EDUCATION", label: "Học vấn", description: "Trường học và thành tích" },
  { type: "EXPERIMENT", label: "Kinh nghiệm", description: "Quá trình làm việc" },
  { type: "PROJECT", label: "Dự án", description: "Dự án thực hiện" },
  { type: "DIPLOMA", label: "Chứng chỉ", description: "Bằng cấp và chứng nhận" },
  { type: "AWARD", label: "Giải thưởng", description: "Thành tựu nổi bật" },
  { type: "ACTIVITIES", label: "Hoạt động", description: "Hoạt động cộng đồng hoặc CLB" },
  { type: "OTHERINFO", label: "Thông tin bổ sung", description: "Mục tiêu, tài liệu, kỹ năng mềm" },
  { type: "REFERENCE", label: "Người tham chiếu", description: "Thông tin người giới thiệu" },
  { type: "RESEARCH", label: "Nghiên cứu", description: "Công bố khoa học" },
  { type: "TEACHING", label: "Giảng dạy", description: "Kinh nghiệm giảng dạy" },
  { type: "TYPICALCASE", label: "Ca điển hình", description: "Case study chuyên môn" },
];

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
        school: "",
        department: "",
        studyField: "",
        experience: "",
        gpa: "",
      };

    case "SKILL":
      if (normalizedVariant === "SKILLTWO") {
        return {
          languages: [],
          frameworks: [],
          tools: [],
        };
      }

      if (normalizedVariant === "SKILLTHREE") {
        return [{ name: "", description: "" }];
      }

      return [{ name: "" }];

    case "EDUCATION":
      if (normalizedVariant === "EDUCATIONTHREE") {
        return [{ time: "", gpa: "", qualified: "", description: "" }];
      }

      return [{ schoolName: "", time: "", department: "", description: "" }];

    case "EXPERIMENT":
      return [
        {
          jobName: "",
          address: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ];

    case "PROJECT":
      if (normalizedVariant === "PROJECTTWO") {
        return [
          {
            name: "",
            description: "",
            action: "",
            publisher: "",
            projectLinks: [],
          },
        ];
      }

      if (normalizedVariant === "PROJECTTHREE") {
        return [{ name: "", publisher: "", time: "", description: "", action: "" }];
      }

      return [
        {
          name: "",
          description: "",
          role: "",
          technology: "",
          image: "",
          projectLinks: [],
        },
      ];

    case "DIPLOMA":
      return [{ name: "", issuer: "", provider: "", date: "", link: "" }];

    case "AWARD":
      return [{ name: "", date: "", organization: "", description: "" }];

    case "ACTIVITIES":
      return [{ name: "", date: "", description: "" }];

    case "OTHERINFO":
      if (normalizedVariant === "OTHERONE") {
        return [{ detail: "" }];
      }

      if (normalizedVariant === "OTHERTWO" || normalizedVariant === "OTHERTHREE" || normalizedVariant === "OTHERFOUR") {
        return { detail: "" };
      }

      if (normalizedVariant === "OTHERFIVE" || normalizedVariant === "OTHERSIX") {
        return [{ name: "" }];
      }

      if (normalizedVariant === "OTHERSEVEN") {
        return [{ name: "", detail: "" }];
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

      return [{ detail: "" }];

    case "REFERENCE":
      return [{ name: "", position: "", mail: "", phone: "" }];

    case "RESEARCH":
      return [{ name: "", time: "", description: "", link: "" }];

    case "TEACHING":
      return [{ subject: "", teachingplace: "" }];

    case "TYPICALCASE":
      return [{ patient: "", age: "", caseName: "", stage: "", regiment: "" }];

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
  portfolioNames: Map<number, string>,
): string => {
  return portfolioNames.get(templateId) ?? `Template ${templateId}`;
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

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [activeTab, setActiveTab] = useState<EditorTab>(isEditMode ? "component" : "template");
  const [templates, setTemplates] = useState<PortfolioResponse[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<number | null>(null);
  const [allowedBlockTypes, setAllowedBlockTypes] = useState<Set<string>>(new Set());
  const [portfolioNames, setPortfolioNames] = useState<Map<number, string>>(new Map());
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

  const nextTempBlockIdRef = useRef(-1);

  const allocateTempBlockId = (): number => {
    const nextId = nextTempBlockIdRef.current;
    nextTempBlockIdRef.current -= 1;
    return nextId;
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);

        const [templateData, portfolioList] = await Promise.all([
          portfolioService.fetchPortfolioTemplates(),
          portfolioService.fetchMainPortfoliosManagerByUser(2),
        ]);

        setTemplates(templateData.slice(0, 5));

        const nextPortfolioNames = new Map<number, string>();
        portfolioList.forEach((item) => {
          nextPortfolioNames.set(item.portfolioId, item.portfolio.name);
        });
        setPortfolioNames(nextPortfolioNames);

        if (isEditMode && id) {
          const portfolioId = Number(id);
          const detail = await portfolioService.fetchPortfolioById(portfolioId);

          if (!detail) {
            throw new Error("Không tìm thấy portfolio cần chỉnh sửa.");
          }

          const sortedBlocks = sortAndReindexBlocks(detail.blocks).map((block) => ({
            ...block,
            data: deepClone(block.data),
          }));

          const preferredType = getPreferredEditableType(sortedBlocks);
          const preferredBlockId =
            sortedBlocks.find(
              (block) => normalizeBlockType(block.type) === preferredType,
            )?.id ?? sortedBlocks[0]?.id ?? null;

          setBlocks(sortedBlocks);
          setActiveTab("component");
          setActiveEditorBlockType(preferredType);
          setActiveEditorBlockVariant(null);
          setEditorSlotPreset("default");
          setSelectedBlockId(preferredBlockId);
          setShowBlockSelector(false);
          setPortfolioName(
            nextPortfolioNames.get(portfolioId) ?? `Portfolio ${portfolioId}`,
          );
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
  }, [id, isEditMode]);

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
    () => blocks.find((block) => block.id === selectedBlockId) ?? null,
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
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "INTRO"
      && selectedBlock.variant.toUpperCase() === "INTROFIVE"
    );
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

    return createIntroOneDraft(selectedBlock.data);
  }, [isEditingIntroOne, selectedBlock]);

  const introOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingIntroOne) {
      return "intro-one-editor";
    }

    return `intro-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingIntroOne, selectedBlock]);

  const introTwoInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingIntroTwo) {
      return null;
    }

    return createIntroTwoDraft(selectedBlock.data);
  }, [isEditingIntroTwo, selectedBlock]);

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

    return createIntroThreeDraft(selectedBlock.data);
  }, [isEditingIntroThree, selectedBlock]);

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

    return createIntroFourDraft(selectedBlock.data);
  }, [isEditingIntroFour, selectedBlock]);

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

    return createIntroFiveDraft(selectedBlock.data);
  }, [isEditingIntroFive, selectedBlock]);

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

  const experienceOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingExperienceOne) {
      return null;
    }

    return createExperienceOneDraft(selectedBlock.data);
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

  const certificateOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingCertificateOne) {
      return "certificate-one-editor";
    }

    return `certificate-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingCertificateOne, selectedBlock]);

  const skillThreeEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingSkillThree) {
      return "skill-three-editor";
    }

    const entryCount = toRecordArray(selectedBlock.data).length;
    return `skill-three-${selectedBlock.id}-${entryCount}`;
  }, [isEditingSkillThree, selectedBlock]);

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
    if (selectedBlockId === null) {
      return;
    }

    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === selectedBlockId
          ? {
              ...block,
              data: updater(deepClone(block.data)),
            }
          : block,
      ),
    );
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
      setActiveEditorBlockVariant(forcedVariant?.toUpperCase() ?? null);
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
    if (blocks.length === 0) {
      setError("Bạn cần thêm ít nhất một block trước khi lưu.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        userId: 2,
        name: portfolioName.trim() || "Hồ sơ mới",
        status: 0,
        blocks: sortAndReindexBlocks(blocks).map((block) => ({
          ...block,
          type: normalizeBlockType(block.type),
          variant: block.variant.toUpperCase(),
          data: deepClone(block.data),
        })),
      };

      const saved =
        isEditMode && id
          ? await portfolioService.updatePortfolioById(Number(id), payload)
          : await portfolioService.createPortfolio(payload);

      if (!saved) {
        throw new Error("Lưu portfolio thất bại.");
      }

      navigate(`/portfolio/${saved.portfolioId}`);
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Không thể lưu portfolio.";
      setError(message);
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
      nextData.title = nextDraft.title;
      nextData.email = nextDraft.email;
      nextData.phone = nextDraft.phone;
      nextData.description = nextDraft.description;
      nextData.avatar = nextDraft.avatar;
      return nextData;
    });
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
      nextData.school = nextDraft.school;
      nextData.department = nextDraft.department;
      nextData.studyField = nextDraft.studyField;
      nextData.title = nextDraft.studyField;
      nextData.gpa = nextDraft.gpa;
      nextData.avatar = nextDraft.avatar;
      return nextData;
    });
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
  };

  const handleIntroThreeCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleIntroFourSave = (nextDraft: IntroFourDraft) => {
    if (!selectedBlock || !isEditingIntroFour) {
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
  };

  const handleIntroFourCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleIntroFiveSave = (nextDraft: IntroFiveDraft) => {
    if (!selectedBlock || !isEditingIntroFive) {
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
  };

  const handleIntroFiveCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
  };

  const handleSkillOneSave = (nextDraft: SkillOneDraft) => {
    if (!selectedBlock || selectedBlockVariantKey !== "SKILL.SKILLONE") {
      return;
    }

    updateSelectedBlockData(() => {
      return nextDraft.skills.map((skillName) => ({ name: skillName }));
    });
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
      const currentItem = currentItems[0] ?? {};

      return [
        {
          ...currentItem,
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
  };

  const handleEducationThreeCancel = () => {
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
      const currentItem = currentItems[0] ?? {};

      return [
        {
          ...currentItem,
          jobName: nextDraft.jobName,
          address: nextDraft.address,
          startDate,
          endDate,
          time: nextDraft.time,
          description: nextDraft.description,
        },
      ];
    });
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
  };

  const handleResearchOneCancel = () => {
    setSelectedBlockId(null);
    setShowBlockSelector(true);
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
    if (!selectedBlock || selectedBlockVariantKey !== "SKILL.SKILLONE") {
      return null;
    }

    const initialData = createSkillOneDraft(selectedBlock.data);

    return (
      <SkillOneEditor
        key={`skill-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`}
        initialData={initialData}
        onSave={handleSkillOneSave}
        onCancel={handleSkillOneCancel}
      />
    );
  };

  const renderSkillTwoEditor = () => {
    if (!selectedBlock || selectedBlockVariantKey !== "SKILL.SKILLTWO") {
      return null;
    }

    const initialData = createSkillTwoDraft(selectedBlock.data);

    return (
      <SkillTwoEditor
        key={`skill-two-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`}
        initialData={initialData}
        onSave={handleSkillTwoSave}
        onCancel={handleSkillTwoCancel}
      />
    );
  };

  const renderSkillThreeEditor = () => {
    if (!selectedBlock || selectedBlockVariantKey !== "SKILL.SKILLTHREE") {
      return null;
    }

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
    switch (selectedBlockVariantKey) {
      case "SKILL.SKILLONE":
        return renderSkillOneEditor();
      case "SKILL.SKILLTWO":
        return renderSkillTwoEditor();
      case "SKILL.SKILLTHREE":
        return renderSkillThreeEditor();
      default:
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
        onSave={handleEducationOneSave}
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

  const renderExperienceOneEditor = () => {
    if (!experienceOneInitialData) {
      return null;
    }

    return (
      <ExperienceOneEditor
        key={experienceOneEditorKey}
        initialData={experienceOneInitialData}
        onSave={handleExperienceOneSave}
        onCancel={handleExperienceOneCancel}
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
        onSave={handleProjectOneSave}
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
        onSave={handleAwardOneSave}
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
        onSave={handleActivityOneSave}
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
        initialData={createEmptyOtherSevenDraft()}
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
        initialData={otherInfoEightInitialData ?? createEmptyOtherEightDraft()}
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
        onSave={handleCertificateOneSave}
        onCancel={handleCertificateOneCancel}
      />
    );
  };

  const renderTeachingOneEditor = () => {
    if (!isEditingTeachingOne) {
      return null;
    }

    return (
      <TeachingOneEditor
        key={teachingOneEditorKey}
        initialData={createEmptyTeachingOneDraft()}
        onSave={handleTeachingOneSave}
        onCancel={handleTeachingOneCancel}
      />
    );
  };

  const renderTypicalCaseOneEditor = () => {
    if (!isEditingTypicalCaseOne) {
      return null;
    }

    return (
      <TypicalCaseOneEditor
        key={typicalCaseOneEditorKey}
        initialData={createEmptyTypicalCaseOneDraft()}
        onSave={handleTypicalCaseOneSave}
        onCancel={handleTypicalCaseOneCancel}
      />
    );
  };

  const renderResearchOneEditor = () => {
    if (!selectedBlock || !isEditingResearchOne) {
      return null;
    }

    const initialData = createResearchOneDraft(selectedBlock.data);

    return (
      <ResearchOneEditor
        key={researchOneEditorKey}
        initialData={initialData}
        onSave={handleResearchOneSave}
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

    if (blockType === "INTRO" && variant === "INTROONE") {
      return renderIntroOneEditor();
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

    if (blockType === "TEACHING" && variant === "TEACHINGONE") {
      return renderTeachingOneEditor();
    }

    if (blockType === "TYPICALCASE" && variant === "TYPICALCASEONE") {
      return renderTypicalCaseOneEditor();
    }

    if (blockType === "RESEARCH" && variant === "RESEARCHONE") {
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

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-100">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex w-full max-w-425 items-center justify-between gap-3">
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

          <div className="flex w-full max-w-xl items-center gap-2">
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
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={16} /> {saving ? "Đang lưu..." : "Lưu hồ sơ"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-425 px-3 py-4">
        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_360px]">
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
                        alt={getTemplateName(template.portfolioId, portfolioNames)}
                        className="h-44 w-full object-cover"
                      />
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-slate-800">
                          {getTemplateName(template.portfolioId, portfolioNames)}
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
                  {COMPONENT_CATALOG.map((item) => {
                    // In create mode with template, filter to allowed block types
                    const isAllowed = isEditMode || !activeTemplateId || allowedBlockTypes.has(item.type);
                    
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => addBlockFromCatalog(item.type)}
                        disabled={!isAllowed}
                        className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                          isAllowed
                            ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                            : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                        }`}
                        title={!isAllowed ? `Loại block này không được hỗ trợ bởi template ${getTemplateName(activeTemplateId ?? 0, portfolioNames)}` : ""}
                      >
                        <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                      </button>
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
                          portfolioNames,
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
  );
}
