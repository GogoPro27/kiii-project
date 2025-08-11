import { useEffect, useMemo, useState } from "react";
import { booksApi } from "../api/apiClient";

export default function BooksList({ onAdd, onEdit }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [data, setData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await booksApi.list(q, page, 20);
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    await load();
  }

  const rows = useMemo(() => data.content || [], [data]);

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex gap-2 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title or author"
          className="border rounded px-2 py-1 w-full"
        />
        <button type="submit" className="px-3 py-1 border rounded">
          Search
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Add
        </button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && rows.length === 0 && <p>No books found.</p>}

      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Author</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Published</th>
                <th className="p-2 border">ISBN</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id}>
                  <td className="p-2 border">{b.title}</td>
                  <td className="p-2 border">{b.author}</td>
                  <td className="p-2 border">{b.price ?? ""}</td>
                  <td className="p-2 border">
                    {b.publishedDate
                      ? new Date(b.publishedDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="p-2 border">{b.isbn ?? ""}</td>
                  <td className="p-2 border">
                    <RowActions
                      book={b}
                      onEdit={() => onEdit(b)}
                      onChanged={load}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.totalPages > 1 && (
        <div className="flex gap-2 items-center">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page + 1} / {data.totalPages}
          </span>
          <button
            disabled={page + 1 >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function RowActions({ book, onEdit, onChanged }) {
  const [removing, setRemoving] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${book.title}"?`)) return;
    setRemoving(true);
    try {
      await booksApi.remove(book.id);
      await onChanged();
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button onClick={onEdit} className="px-2 py-1 border rounded">
        Edit
      </button>
      <button
        disabled={removing}
        onClick={handleDelete}
        className="px-2 py-1 border rounded text-red-700"
      >
        Delete
      </button>
    </div>
  );
}
