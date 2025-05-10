let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editingId = null;
let quill;

window.onload = function () {
  quill = new Quill("#editor", { theme: "snow" });
  renderNotes();

  document.getElementById("new-note-btn").addEventListener("click", () => {
    editingId = null;
    quill.setText("");
    document.getElementById("note-title").value = "";
    document.getElementById("note-category").value = "";
    document.getElementById("note-tags").value = "";
    $("#noteEditorModal").modal("show");
  });

  document.getElementById("save-note").addEventListener("click", () => {
    const title = document.getElementById("note-title").value.trim();
    const content = quill.root.innerHTML.trim();
    const category = document.getElementById("note-category").value.trim();
    const tags = document
      .getElementById("note-tags")
      .value.trim()
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    if (!title) return alert("Title is required");

    if (editingId) {
      const note = notes.find((n) => n.id === editingId);
      note.title = title;
      note.content = content;
      note.category = category;
      note.tags = tags;
    } else {
      const note = {
        id: Date.now(),
        title,
        content,
        category,
        tags,
      };
      notes.push(note);
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
    $("#noteEditorModal").modal("hide");
  });

  document.getElementById("categories-btn").addEventListener("click", () => {
    const allCategories = [
      ...new Set(notes.map((n) => n.category).filter(Boolean)),
    ];
    const category = prompt("Filter by Category:\n" + allCategories.join(", "));
    if (category) renderNotes(notes.filter((n) => n.category === category));
  });

  document.getElementById("tags-btn").addEventListener("click", () => {
    const tag = prompt("Enter tag to filter by:");
    if (tag) renderNotes(notes.filter((n) => n.tags && n.tags.includes(tag)));
  });

  document.getElementById("themes-btn").addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });
};

function renderNotes(filteredNotes = notes) {
  const container = document.getElementById("notes-container");
  container.innerHTML = "";

  filteredNotes.forEach((note) => {
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";

    noteCard.innerHTML = `
            <h5>${note.title}</h5>
            <div>${note.content}</div>
            <p><strong>Category:</strong> ${note.category || "None"}</p>
            <p><strong>Tags:</strong> ${(note.tags || []).join(", ")}</p>
            <div class="mt-2 d-flex justify-content-between">
                <button class="btn btn-sm btn-primary edit-note" data-id="${note.id}">
                    <img src="images/edit.png" alt="Edit" style="height: 20px; vertical-align: middle; margin-right: 5px;" /> Edit
                </button>
                <button class="btn btn-sm btn-danger delete-note" data-id="${note.id}">
                    <img src="images/delete.png" alt="Delete" style="height: 20px; vertical-align: middle; margin-right: 5px;" /> Delete
                </button>
            </div>
        `;

    container.appendChild(noteCard);
  });

  document.querySelectorAll(".edit-note").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const note = notes.find((n) => n.id === id);
      editingId = id;
      document.getElementById("note-title").value = note.title;
      document.getElementById("note-category").value = note.category;
      document.getElementById("note-tags").value = note.tags.join(", ");
      quill.root.innerHTML = note.content;
      $("#noteEditorModal").modal("show");
    }),
  );

  document.querySelectorAll(".delete-note").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      notes = notes.filter((n) => n.id !== id);
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
    }),
  );
}
