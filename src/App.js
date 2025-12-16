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

// „přihlášený“ uživatel
const currentUser = {
  id: 1,
  name: "Alena",
};

function App() {
  const [lists, setLists] = useState([]);

  const [overviewStatus, setOverviewStatus] = useState("pending"); // pending | ready | error
  const [overviewError, setOverviewError] = useState(null);
  const [overviewActionError, setOverviewActionError] = useState(null);

  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [detailStatus, setDetailStatus] = useState("ready"); // pending | ready | error
  const [detailError, setDetailError] = useState(null);

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

  const handleDeleteList = async (id) => {
    await runOverviewAction(async () => {
      await deleteList(id);
      await loadOverview();
    });
  };

  const handleToggleArchive = async (id) => {
    const list = lists.find((l) => l.id === id);
    if (!list) return;

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
      <div className="phone">
        {selectedListId ? (
          detailStatus === "pending" ? (
            <div style={{ padding: 16 }}>Načítám detail…</div>
          ) : detailStatus === "error" ? (
            <div style={{ padding: 16 }}>
              <button onClick={handleBackToOverview}>← Zpět</button>
              <div style={{ marginTop: 12 }}>Chyba: {detailError}</div>
            </div>
          ) : (
            <ShoppingListDetail
              initialData={selectedList}
              currentUser={currentUser}
              onBack={handleBackToOverview}
            />
          )
        ) : overviewStatus === "pending" ? (
          <div style={{ padding: 16 }}>Načítám seznamy…</div>
        ) : overviewStatus === "error" ? (
          <div style={{ padding: 16 }}>
            <div>Chyba: {overviewError}</div>
            <button onClick={loadOverview} style={{ marginTop: 8 }}>
              Zkusit znovu
            </button>
          </div>
        ) : (
          <div>
            {overviewActionError && (
              <div style={{ marginBottom: 12, color: "crimson" }}>
                Chyba akce: {overviewActionError}
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
