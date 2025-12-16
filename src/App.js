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
  // ================================
  // Přehled seznamů
  // ================================
  const [lists, setLists] = useState([]);
  const [overviewStatus, setOverviewStatus] = useState("pending");
  const [overviewError, setOverviewError] = useState(null);

  // ================================
  // Detail
  // ================================
  const [selectedListId, setSelectedListId] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [detailStatus, setDetailStatus] = useState("ready");
  const [detailError, setDetailError] = useState(null);

  // ================================
  // Načtení přehledu (API)
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
  // Otevření detailu (API)
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
    try {
      await createList({
        name,
        owner: currentUser,
        members: [currentUser],
      });
      await loadOverview();
    } catch (e) {
      alert(e?.message ?? "Chyba při vytváření seznamu");
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await deleteList(id);
      await loadOverview();
    } catch (e) {
      alert(e?.message ?? "Chyba při mazání seznamu");
    }
  };

  const handleToggleArchive = async (id) => {
    const list = lists.find((l) => l.id === id);
    if (!list) return;

    try {
      await updateList(id, { archived: !list.archived });
      await loadOverview();
    } catch (e) {
      alert(e?.message ?? "Chyba při archivaci");
    }
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
          <ShoppingListsOverview
            lists={lists}
            currentUser={currentUser}
            onOpenList={handleOpenList}
            onCreateList={handleCreateList}
            onDeleteList={handleDeleteList}
            onToggleArchive={handleToggleArchive}
          />
        )}
      </div>
    </div>
  );
}

export default App;
