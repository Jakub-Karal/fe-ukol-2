import { useEffect, useState } from "react";
import "./App.css";
import ShoppingListDetail from "./components/ShoppingListDetail/ShoppingListDetail";
import ShoppingListsOverview from "./components/ShoppingListsOverview/ShoppingListsOverview";
import {
  getLists,
  getListDetail,
  createList,
  deleteList,
  updateList,
} from "./api/shoppingApi";
import { useTheme } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import LanguageSwitcher from "./components/LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";

// „přihlášený“ uživatel
const currentUser = {
  id: 1,
  name: "Alena",
};

function App() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [lists, setLists] = useState([]);

  const [overviewStatus, setOverviewStatus] = useState("pending");
  const [overviewError, setOverviewError] = useState(null);
  const [overviewActionError, setOverviewActionError] = useState(null);

  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [detailStatus, setDetailStatus] = useState("ready");
  const [detailError, setDetailError] = useState(null);

  // Set CSS variables for theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg-app-root", theme.mode === "light" ? "#f2f2f2" : "#0d0d0d");
    root.style.setProperty("--bg-phone", theme.background);
    root.style.setProperty("--text-color", theme.text);
    root.style.setProperty("--border-color", theme.border);
    root.style.setProperty("--phone-shadow", `0 8px 24px ${theme.shadow}`);
  }, [theme]);

  // ================================
  // Přehled – načtení (API)
  // ================================
  const loadOverview = async () => {
    setOverviewStatus("pending");
    setOverviewError(null);

    try {
      const data = await getLists();
      setLists(data);
      setOverviewStatus("ready");
    } catch (e) {
      setOverviewError(e?.message ?? "Neznámá chyba");
      setOverviewStatus("error");
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  // ================================
  // Helper pro akce v přehledu
  // ================================
  const runOverviewAction = async (fn) => {
    setOverviewActionError(null);
    try {
      await fn();
    } catch (e) {
      setOverviewActionError(e?.message ?? "Chyba akce");
    }
  };

  // ================================
  // Helper – kontrola vlastnictví
  // ================================
  const isOwnerOfList = (list) => {
    return list?.owner?.id === currentUser.id;
  };

  // ================================
  // Detail – otevření (API)
  // ================================
  const handleOpenList = async (id) => {
    setSelectedListId(id);
    setSelectedList(null);
    setDetailStatus("pending");
    setDetailError(null);

    try {
      const detail = await getListDetail(id);
      setSelectedList(detail);
      setDetailStatus("ready");
    } catch (e) {
      setDetailError(e?.message ?? "Neznámá chyba");
      setDetailStatus("error");
    }
  };

  const handleBackToOverview = () => {
    setSelectedListId(null);
    setSelectedList(null);
    setDetailStatus("ready");
    setDetailError(null);
  };

  // ================================
  // CRUD – přes API
  // ================================
  const handleCreateList = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    await runOverviewAction(async () => {
      await createList({
        name: trimmed,
        owner: currentUser,
        members: [currentUser],
      });
      await loadOverview();
    });
  };

  // Smazání – pouze vlastník
  const handleDeleteList = async (id) => {
    const list = lists.find((l) => l.id === id);

    if (!isOwnerOfList(list)) {
      setOverviewActionError(t("overview.onlyOwnerDelete"));
      return;
    }

    await runOverviewAction(async () => {
      await deleteList(id);
      await loadOverview();
    });
  };

  // Archivace – pouze vlastník
  const handleToggleArchive = async (id) => {
    const list = lists.find((l) => l.id === id);
    if (!list) return;

    if (!isOwnerOfList(list)) {
      setOverviewActionError(t("overview.onlyOwnerArchive"));
      return;
    }

    await runOverviewAction(async () => {
      await updateList(id, { archived: !list.archived });
      await loadOverview();
    });
  };

  // ================================
  // Render
  // ================================
  return (
    <div className="app-root">
      <ThemeToggle />
      <LanguageSwitcher />
      <div className="phone">
        {selectedListId ? (
          detailStatus === "pending" ? (
            <div style={{ padding: 16 }}>{t("detail.loadingDetail")}</div>
          ) : detailStatus === "error" ? (
            <div style={{ padding: 16 }}>
              <button onClick={handleBackToOverview}>← {t("common.back")}</button>
              <div style={{ marginTop: 12 }}>{t("common.error")}: {detailError}</div>
            </div>
          ) : (
            <ShoppingListDetail
              initialData={selectedList}
              currentUser={currentUser}
              onBack={handleBackToOverview}
            />
          )
        ) : overviewStatus === "pending" ? (
          <div style={{ padding: 16 }}>{t("common.loading")}</div>
        ) : overviewStatus === "error" ? (
          <div style={{ padding: 16 }}>
            <div>{t("common.error")}: {overviewError}</div>
            <button onClick={loadOverview} style={{ marginTop: 8 }}>
              {t("common.tryAgain")}
            </button>
          </div>
        ) : (
          <div>
            {overviewActionError && (
              <div style={{ marginBottom: 12, color: theme.danger }}>
                {overviewActionError}
              </div>
            )}

            <ShoppingListsOverview
              lists={lists}
              currentUser={currentUser}
              onOpenList={handleOpenList}
              onCreateList={handleCreateList}
              onDeleteList={handleDeleteList}
              onToggleArchive={handleToggleArchive}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
