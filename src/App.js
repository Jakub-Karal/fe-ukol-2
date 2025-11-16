import { useState } from "react";

// přihlášený uživatel (můžeš si změnit id na 1 nebo 2 a zkoušet chování)
const currentUser = {
  id: 2,
  name: "Pepa"
};

const initialData = {
  id: 1,
  name: "Nákup na víkend",
  owner: {
    id: 1,
    name: "Alena"
  },
  members: [
    { id: 2, name: "Pepa" },
    { id: 3, name: "Lenka" }
  ],
  items: [
    { id: 1, name: "mléko", done: false },
    { id: 2, name: "chléb", done: false }
  ]
};

function App() {
  const [list, setList] = useState(initialData);
  const [newItem, setNewItem] = useState("");
  const [showDone, setShowDone] = useState(false); // false = jen nevyřešené
  const [newMemberName, setNewMemberName] = useState("");

  const isOwner = currentUser.id === list.owner.id;

  // ---- POLOŽKY -------------------------------------------------

  const handleAddItem = () => {
    if (newItem.trim() === "") return;

    const newItemObj = {
      id: Date.now(),
      name: newItem,
      done: false
    };

    setList({
      ...list,
      items: [...list.items, newItemObj]
    });

    setNewItem("");
  };

  const handleToggleDone = (id) => {
    const updatedItems = list.items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );

    setList({
      ...list,
      items: updatedItems
    });
  };

  const handleRemoveItem = (id) => {
    const updatedItems = list.items.filter((item) => item.id !== id);

    setList({
      ...list,
      items: updatedItems
    });
  };

  const filteredItems = showDone
    ? list.items
    : list.items.filter((item) => !item.done);

  // ---- ČLENOVÉ -------------------------------------------------

  const handleAddMember = () => {
    if (!isOwner) return; // bezpečnost, přidávat může jen vlastník
    if (newMemberName.trim() === "") return;

    const newMember = {
      id: Date.now(),
      name: newMemberName
    };

    setList({
      ...list,
      members: [...list.members, newMember]
    });

    setNewMemberName("");
  };

  const handleRemoveMember = (memberId) => {
    if (!isOwner) return; // mazat může jen vlastník

    const updatedMembers = list.members.filter(
      (member) => member.id !== memberId
    );

    setList({
      ...list,
      members: updatedMembers
    });
  };

  const handleLeaveList = () => {
    // člen odejde ze seznamu (smaže sám sebe z members)
    const updatedMembers = list.members.filter(
      (member) => member.id !== currentUser.id
    );

    setList({
      ...list,
      members: updatedMembers
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{list.name}</h1>

      <p>
        Přihlášený uživatel: <strong>{currentUser.name}</strong>{" "}
        {isOwner && "(vlastník seznamu)"}
      </p>

      {/* Vlastník + členové */}
      <section style={{ marginBottom: "20px" }}>
        <h2>Členové seznamu</h2>

        <p>
          <strong>Vlastník:</strong> {list.owner.name}
        </p>

        <p><strong>Členové:</strong></p>
        {list.members.length === 0 ? (
          <p>Žádní členové.</p>
        ) : (
          <ul>
            {list.members.map((member) => (
              <li key={member.id}>
                {member.name}
                {" "}
                {isOwner && (
                  <button onClick={() => handleRemoveMember(member.id)}>
                    Odebrat
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Přidat člena – jen vlastník */}
        {isOwner && (
          <div style={{ marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Jméno nového člena"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
            <button onClick={handleAddMember}>Přidat člena</button>
          </div>
        )}

        {/* Odejít ze seznamu – jen když nejsem vlastník a jsem člen */}
        {!isOwner &&
          list.members.some((m) => m.id === currentUser.id) && (
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleLeaveList}>Odejít z tohoto seznamu</button>
            </div>
          )}
      </section>

      {/* FILTR POLOŽEK */}
      <section style={{ marginBottom: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={showDone}
            onChange={(e) => setShowDone(e.target.checked)}
          />
          {" "}Zobrazit včetně vyřešených
        </label>
      </section>

      {/* POLOŽKY */}
      <section style={{ marginBottom: "20px" }}>
        <h2>Položky seznamu</h2>

        <ul>
          {filteredItems.map((item) => (
            <li key={item.id}>
              <span
                style={{
                  textDecoration: item.done ? "line-through" : "none"
                }}
              >
                {item.name}
              </span>

              {" "}
              <button onClick={() => handleToggleDone(item.id)}>
                {item.done ? "Odznačit" : "Hotovo"}
              </button>

              {" "}
              <button onClick={() => handleRemoveItem(item.id)}>Smazat</button>
            </li>
          ))}
        </ul>

        {/* přidávání položek */}
        <input
          type="text"
          placeholder="Nová položka"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={handleAddItem}>Přidat</button>
      </section>
    </div>
  );
}

export default App;
