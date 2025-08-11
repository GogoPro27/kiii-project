import { useEffect, useState } from "react";

export default function BookForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    publishedDate: "",
    isbn: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        author: initial.author || "",
        price: initial.price ?? "",
        publishedDate: initial.publishedDate
          ? initial.publishedDate.slice(0, 10)
          : "",
        isbn: initial.isbn || "",
      });
    }
  }, [initial]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      price: form.price === "" ? null : Number(form.price),
      publishedDate: form.publishedDate
        ? new Date(form.publishedDate).toISOString()
        : null,
      isbn: form.isbn || null,
    };
    onSave(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
        {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Author</label>
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
        {errors.author && (
          <p className="text-red-600 text-sm">{errors.author}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Price</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Published Date</label>
        <input
          type="date"
          name="publishedDate"
          value={form.publishedDate}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">ISBN</label>
        <input
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 border rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}
