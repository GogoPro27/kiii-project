import { useState } from "react";
import BooksList from "./components/BooksList.jsx";
import BookForm from "./components/BookForm.jsx";
import { booksApi } from "./api/apiClient.js";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(book) {
    setEditing(book);
    setModalOpen(true);
  }
  async function handleSave(payload) {
    if (editing) await booksApi.update(editing.id, payload);
    else await booksApi.create(payload);
    setModalOpen(false);
    setEditing(null);
    setReloadFlag((x) => x + 1);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Books TEST?</h1>
      <BooksList key={reloadFlag} onAdd={openAdd} onEdit={openEdit} />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded p-4 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-2">
              {editing ? "Edit Book" : "Add Book"}
            </h2>
            <BookForm
              initial={editing}
              onCancel={() => setModalOpen(false)}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
