import ShoppingListDetail from "./components/ShoppingListDetail/ShoppingListDetail";

const currentUser = {
  id: 2,
  name: "Pepa",
};

const initialData = {
  id: 1,
  name: "Nákup na víkend",
  owner: {
    id: 1,
    name: "Alena",
  },
  members: [
    { id: 2, name: "Pepa" },
    { id: 3, name: "Lenka" },
  ],
  items: [
    { id: 1, name: "mléko", done: false },
    { id: 2, name: "chléb", done: false },
  ],
};

function App() {
  return (
    <div>
      <ShoppingListDetail initialData={initialData} currentUser={currentUser} />
    </div>
  );
}

export default App;
