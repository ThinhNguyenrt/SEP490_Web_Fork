import { useEffect, useState } from "react";
import { Folder, MoreVertical, Edit2, Trash2, Loader, AlertCircle, Plus, X } from "lucide-react";
import { followCategoryService } from "@/services/followCategory.api";
import { useAppSelector } from "@/store/hook";
import { FollowCategory } from "@/types/followCategory";
import { notify } from "@/lib/toast";

interface FollowCategoriesProps {
  onEdit?: (category: FollowCategory) => void;
  onDelete?: (categoryId: number) => void;
  onCategoryCreated?: (category: FollowCategory) => void;
}

export const SavedFollowCategories = ({ onEdit, onDelete, onCategoryCreated }: FollowCategoriesProps) => {
  const [categories, setCategories] = useState<FollowCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FollowCategory | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<FollowCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!accessToken) {
        notify.error("Vui lòng đăng nhập để xem danh sách theo dõi");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("📡 Fetching follow categories...");
        const data = await followCategoryService.fetchFollowCategories(accessToken);
        console.log("✅ Follow categories:", data);
        setCategories(data);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Lỗi khi tải danh sách theo dõi";
        console.error("❌ Error loading follow categories:", errorMsg);
        notify.error(errorMsg);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [accessToken]);

  const handleEdit = (category: FollowCategory) => {
    setOpenMenuId(null);
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setShowEditModal(true);
    if (onEdit) {
      onEdit(category);
    }
  };

  const handleDelete = (category: FollowCategory) => {
    setOpenMenuId(null);
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete || !accessToken) return;

    try {
      setIsDeleting(true);
      await followCategoryService.deleteFollowCategory(categoryToDelete.id, accessToken);
      notify.success("Xóa danh sách theo dõi thành công");
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
      if (onDelete) {
        onDelete(categoryToDelete.id);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi xóa danh sách theo dõi";
      notify.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      notify.error("Vui lòng nhập tên danh sách theo dõi");
      return;
    }

    if (!accessToken) {
      notify.error("Vui lòng đăng nhập để tạo danh sách");
      return;
    }

    try {
      setIsCreating(true);
      const newCategory = await followCategoryService.createFollowCategory(
        newCategoryName.trim(),
        accessToken
      );
      notify.success("Tạo danh sách theo dõi thành công");
      setCategories((prev) => [...prev, newCategory]);
      setShowCreateModal(false);
      setNewCategoryName("");
      if (onCategoryCreated) {
        onCategoryCreated(newCategory);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi tạo danh sách theo dõi";
      notify.error(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim()) {
      notify.error("Vui lòng nhập tên danh sách theo dõi");
      return;
    }

    if (!editingCategory || !accessToken) return;

    try {
      setIsUpdating(true);
      const updatedCategory = await followCategoryService.updateFollowCategory(
        editingCategory.id,
        { name: editCategoryName.trim() },
        accessToken
      );
      notify.success("Cập nhật danh sách theo dõi thành công");
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? updatedCategory : c))
      );
      setShowEditModal(false);
      setEditingCategory(null);
      setEditCategoryName("");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi cập nhật danh sách theo dõi";
      notify.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-slate-600">Đang tải danh sách theo dõi...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-600">Chưa có danh sách theo dõi</p>
          <p className="text-sm text-gray-500">Tạo danh sách theo dõi mới để bắt đầu</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Tạo danh sách mới
          </button>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCreateModal(false)}
            ></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Tạo danh sách theo dõi</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên danh sách <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !isCreating) {
                          handleCreateCategory();
                        }
                      }}
                      placeholder="Nhập tên danh sách..."
                      disabled={isCreating}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreateCategory}
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Tạo
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Create Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Danh sách mới
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="relative group bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md transition-all"
        >
          {/* Folder Icon */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-800 truncate">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium truncate">
                  {category.code}
                </p>
              </div>
            </div>

            {/* Context Menu Button */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenMenuId(openMenuId === category.id ? null : category.id)
                }
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Tùy chọn"
              >
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {openMenuId === category.id && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-lg shadow-lg z-10 min-w-40">
                  <button
                    onClick={() => handleEdit(category)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors first:rounded-t-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors last:rounded-b-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-medium">Tạo ngày:</span>
              <span className="text-xs text-slate-600 font-semibold">
                {new Date(category.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCreateModal(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Tạo danh sách theo dõi</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên danh sách <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !isCreating) {
                        handleCreateCategory();
                      }
                    }}
                    placeholder="Nhập tên danh sách..."
                    disabled={isCreating}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateCategory}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Tạo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && categoryToDelete && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Xóa danh sách theo dõi</h3>
                <button
                  onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-gray-700 font-medium mb-2">Bạn có chắc chắn muốn xóa danh sách này?</p>
                  <p className="text-sm text-gray-600 mb-4">Tên danh sách: <span className="font-semibold">{categoryToDelete.name}</span></p>
                </div>

                {categoryToDelete.portfolioCount !== undefined && categoryToDelete.portfolioCount > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      ⚠️ Danh sách này đã có ứng cử viên được lưu.
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Khi xóa danh sách, tất cả ứng cử viên trong danh sách sẽ được chuyển vào mục "Không phân loại".
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Xóa
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCategory && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowEditModal(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Chỉnh sửa danh sách theo dõi</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên danh sách <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !isUpdating) {
                        handleUpdateCategory();
                      }
                    }}
                    placeholder="Nhập tên danh sách..."
                    disabled={isUpdating}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateCategory}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} />
                      Cập nhật
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedFollowCategories;
