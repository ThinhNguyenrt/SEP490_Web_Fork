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
import CertificateOneEditor from "@/components/pages/portfolio/editor/CertificateOneEditor";
import EducationOneEditor from "@/components/pages/portfolio/editor/EducationOneEditor";
import ExperienceOneEditor from "@/components/pages/portfolio/editor/ExperienceOneEditor";
import IntroOneEditor from "@/components/pages/portfolio/editor/IntroOneEditor";
import SkillOneEditor from "@/components/pages/portfolio/editor/SkillOneEditor";
import {
  createCertificateOneDraft,
  type CertificateOneDraft,
} from "@/components/pages/portfolio/editor/certificateOneDraft";
import {
  createEducationOneDraft,
  type EducationOneDraft,
} from "@/components/pages/portfolio/editor/educationOneDraft";
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
  createSkillOneDraft,
  type SkillOneDraft,
} from "@/components/pages/portfolio/editor/skillOneDraft";
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

type EditableBlockType = "INTRO" | "SKILL" | "EDUCATION" | "EXPERIMENT" | "DIPLOMA";

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
  "DIPLOMA",
];

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

const getDefaultVariant = (type: string): string => {
  const normalizedType = normalizeBlockType(type);
  return BLOCK_VARIANTS[normalizedType]?.[0] ?? "INTROONE";
};

const isEditableBlockType = (type: string): type is EditableBlockType => {
  return EDITABLE_BLOCK_TYPES.includes(type as EditableBlockType);
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

const toCommaList = (value: unknown): string => {
  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .join(", ");
};

const parseCommaList = (value: string): string[] => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
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

  const [activeTab, setActiveTab] = useState<EditorTab>("template");
  const [templates, setTemplates] = useState<PortfolioResponse[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<number | null>(null);
  const [portfolioNames, setPortfolioNames] = useState<Map<number, string>>(new Map());
  const [portfolioName, setPortfolioName] = useState("Hồ sơ mới");
  const [activeEditorBlockType, setActiveEditorBlockType] =
    useState<EditableBlockType>("INTRO");
  const [blocks, setBlocks] = useState<PortfolioBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextTempBlockIdRef = useRef(-1);

  const isEditMode = Boolean(id);

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
          setActiveEditorBlockType(preferredType);
          setSelectedBlockId(preferredBlockId);
          setShowBlockSelector(false);
          setPortfolioName(
            nextPortfolioNames.get(portfolioId) ?? `Portfolio ${portfolioId}`,
          );
          return;
        }

        setBlocks([]);
        setActiveEditorBlockType("INTRO");
        setSelectedBlockId(null);
        setShowBlockSelector(false);
        setPortfolioName("Hồ sơ mới");
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
      (block) => normalizeBlockType(block.type) === activeEditorBlockType,
    );

    if (preferredBlock) {
      if (selectedBlockId !== preferredBlock.id) {
        setSelectedBlockId(preferredBlock.id);
      }
      return;
    }

    if (selectedBlockId === null || !blocks.some((block) => block.id === selectedBlockId)) {
      setSelectedBlockId(blocks[0].id);
    }
  }, [activeEditorBlockType, blocks, selectedBlockId, showBlockSelector]);

  const selectedBlock = useMemo(
    () => blocks.find((block) => block.id === selectedBlockId) ?? null,
    [blocks, selectedBlockId],
  );

  const activeEditorBlock = useMemo(
    () =>
      blocks.find(
        (block) => normalizeBlockType(block.type) === activeEditorBlockType,
      ) ?? null,
    [activeEditorBlockType, blocks],
  );

  const isEditingIntroOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "INTRO"
      && selectedBlock.variant.toUpperCase() === "INTROONE"
    );
  }, [selectedBlock]);

  const isEditingSkillOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "SKILL"
      && selectedBlock.variant.toUpperCase() === "SKILLONE"
    );
  }, [selectedBlock]);

  const isEditingEducationOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "EDUCATION"
      && selectedBlock.variant.toUpperCase() === "EDUCATIONONE"
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

  const isEditingCertificateOne = useMemo<boolean>(() => {
    if (!selectedBlock) {
      return false;
    }

    return (
      normalizeBlockType(selectedBlock.type) === "DIPLOMA"
      && selectedBlock.variant.toUpperCase() === "DIPLOMAONE"
    );
  }, [selectedBlock]);

  const isUsingDedicatedEditor =
    isEditingIntroOne
    || isEditingSkillOne
    || isEditingEducationOne
    || isEditingExperienceOne
    || isEditingCertificateOne;

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

  const skillOneInitialData = useMemo(() => {
    if (!selectedBlock || !isEditingSkillOne) {
      return null;
    }

    return createSkillOneDraft(selectedBlock.data);
  }, [isEditingSkillOne, selectedBlock]);

  const skillOneEditorKey = useMemo(() => {
    if (!selectedBlock || !isEditingSkillOne) {
      return "skill-one-editor";
    }

    return `skill-one-${selectedBlock.id}-${selectedBlock.variant.toUpperCase()}`;
  }, [isEditingSkillOne, selectedBlock]);

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
    const nextBlocks = sortAndReindexBlocks(template.blocks).map((block) => ({
      ...block,
      id: allocateTempBlockId(),
      type: normalizeBlockType(block.type),
      variant: block.variant.toUpperCase(),
      data: isEditMode
        ? deepClone(block.data)
        : createDefaultBlockData(block.type, block.variant),
    }));

    const preferredType = getPreferredEditableType(nextBlocks);
    const preferredBlockId =
      nextBlocks.find(
        (block) => normalizeBlockType(block.type) === preferredType,
      )?.id ?? nextBlocks[0]?.id ?? null;

    setBlocks(nextBlocks);
    setActiveEditorBlockType(preferredType);
    setSelectedBlockId(preferredBlockId);
    setShowBlockSelector(false);
    setActiveTemplateId(template.portfolioId);
    setActiveTab("template");
  };

  const addBlockFromCatalog = (type: string) => {
    const normalizedType = normalizeBlockType(type);
    const variant = getDefaultVariant(type);
    const newBlock: PortfolioBlock = {
      id: allocateTempBlockId(),
      type: normalizedType,
      variant,
      order: blocks.length + 1,
      data: createDefaultBlockData(type, variant),
    };

    if (isEditableBlockType(normalizedType)) {
      setActiveEditorBlockType(normalizedType);
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

  const handleSkillOneSave = (nextDraft: SkillOneDraft) => {
    if (!selectedBlock || !isEditingSkillOne) {
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

  const renderSkillOneEditor = () => {
    if (!skillOneInitialData) {
      return null;
    }

    return (
      <SkillOneEditor
        key={skillOneEditorKey}
        initialData={skillOneInitialData}
        onSave={handleSkillOneSave}
        onCancel={handleSkillOneCancel}
      />
    );
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

    if (blockType === "SKILL" && variant === "SKILLONE") {
      return renderSkillOneEditor();
    }

    if (blockType === "EDUCATION" && variant === "EDUCATIONONE") {
      return renderEducationOneEditor();
    }

    if (blockType === "EXPERIMENT" && variant === "EXPERIMENTONE") {
      return renderExperienceOneEditor();
    }

    if (blockType === "DIPLOMA" && variant === "DIPLOMAONE") {
      return renderCertificateOneEditor();
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

    if (blockType === "SKILL" && variant === "SKILLTWO") {
      const data = toRecord(selectedBlock.data);
      return (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ngôn ngữ (cách nhau bởi dấu phẩy)
            </label>
            <input
              value={toCommaList(data.languages)}
              onChange={(event) => {
                updateSelectedBlockData((current) => {
                  const nextData = toRecord(current);
                  nextData.languages = parseCommaList(event.target.value);
                  return nextData;
                });
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
              placeholder="JavaScript, TypeScript"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Framework (cách nhau bởi dấu phẩy)
            </label>
            <input
              value={toCommaList(data.frameworks)}
              onChange={(event) => {
                updateSelectedBlockData((current) => {
                  const nextData = toRecord(current);
                  nextData.frameworks = parseCommaList(event.target.value);
                  return nextData;
                });
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
              placeholder="ReactJS, Tailwind CSS"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Công cụ (cách nhau bởi dấu phẩy)
            </label>
            <input
              value={toCommaList(data.tools)}
              onChange={(event) => {
                updateSelectedBlockData((current) => {
                  const nextData = toRecord(current);
                  nextData.tools = parseCommaList(event.target.value);
                  return nextData;
                });
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
              placeholder="Figma, Git, Postman"
            />
          </div>
        </div>
      );
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

    if (blockType === "EDUCATION" && variant === "EDUCATIONTHREE") {
      return renderArrayFields(
        [
          { key: "time", label: "Thời gian" },
          { key: "gpa", label: "GPA" },
          { key: "qualified", label: "Xếp loại" },
          { key: "description", label: "Mô tả", multiline: true },
        ],
        () => ({ time: "", gpa: "", qualified: "", description: "" }),
        "Thêm thành tích",
        "Chưa có thành tích học tập.",
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

    if (blockType === "OTHERINFO" && variant === "OTHERSEVEN") {
      return renderArrayFields(
        [
          { key: "name", label: "Tên tài liệu" },
          { key: "detail", label: "Link tài liệu" },
        ],
        () => ({ name: "", detail: "" }),
        "Thêm tài liệu",
        "Chưa có tài liệu.",
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
              <button
                type="button"
                onClick={() => setActiveTab("component")}
                className={cn(
                  "flex-1 px-3 py-2.5 text-sm font-semibold transition-colors",
                  activeTab === "component"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50",
                )}
              >
                Thành phần
              </button>
            </div>

            <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-3">
              {activeTab === "template" && (
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
                  {COMPONENT_CATALOG.map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => addBlockFromCatalog(item.type)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
                    >
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <main className="rounded-2xl border border-slate-200 bg-white p-4">
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
              {EDITABLE_BLOCK_TYPES.map((type) => {
                const hasBlock = blocks.some(
                  (block) => normalizeBlockType(block.type) === type,
                );

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setActiveEditorBlockType(type);
                      const targetBlockId = blocks.find(
                        (block) => normalizeBlockType(block.type) === type,
                      )?.id;

                      if (targetBlockId) {
                        setSelectedBlockId(targetBlockId);
                        setShowBlockSelector(false);
                      }
                    }}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-xs font-semibold transition-colors",
                      activeEditorBlockType === type
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50",
                    )}
                  >
                    <div>{BLOCK_LABELS[type]}</div>
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
                  Chưa có block {BLOCK_LABELS[activeEditorBlockType]}.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Bạn có thể thêm từ tab Thành phần hoặc bấm nút bên dưới.
                </p>
                <button
                  type="button"
                  onClick={() => addBlockFromCatalog(activeEditorBlockType)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={14} /> Thêm {BLOCK_LABELS[activeEditorBlockType]}
                </button>
              </div>
            )}

            {activeEditorBlock && (
              <div className={cn(!isUsingDedicatedEditor && "max-h-[calc(100vh-320px)] overflow-y-auto pr-1")}>
                {!isUsingDedicatedEditor && (
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Thông tin {BLOCK_LABELS[activeEditorBlockType]}
                    </h3>
                    {selectedBlock && (
                      <select
                        value={selectedBlock.variant.toUpperCase()}
                        onChange={(event) => updateSelectedVariant(event.target.value)}
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 outline-none focus:border-blue-400"
                      >
                        {(BLOCK_VARIANTS[normalizeBlockType(selectedBlock.type)] ?? [selectedBlock.variant]).map((variantOption) => (
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
