<!-- TodoPage.vue -->
<template>
    <div id="todo">
        <h2 class="title">📝 A Notes App</h2>

        <!-- Search -->
        <div class="input-container">
        <input v-model="searchText" placeholder="🔍 Search notes..." class="text-input" />
        </div>

        <!-- Add Note -->
        <div class="input-container">
        <input v-model="newNote" placeholder="🖊️ Type your note..." class="text-input" />
        <button @click="addNote" class="action-btn add">➕ Add Note</button>
        </div>
        <p v-if="storageLimitReached" class="warning-text">
        ⚠ You've reached the maximum storage limit. Please delete some notes to add more.
        </p>

        <!-- Bulk Actions -->
        <div class="bulk-actions">
        <label class="select-label">
            <input type="checkbox" v-model="allSelected" />
            Select All
        </label>
        <button
            @click="deleteSelected"
            :disabled="selectedNoteIds.length === 0"
            class="action-btn delete"
        >
            🗑 Delete Selected
        </button>
        </div>

        <!-- Notes -->
        <NoteTaking
        v-for="note in paginatedNotes"
        :key="note.id"
        :note="note"
        :is-selected="selectedNoteIds.includes(note.id)"
        @delete="deleteNote"
        @select="handleSelect"
        @toggle-complete="toggleComplete"
        />

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1">⬅ Prev</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next ➡</button>
        </div>
    </div>
</template>
  
<script>
  import NoteTaking from './NoteTaking.vue';
  
  const NOTES_KEY = 'vue-notes';
  const NOTE_ID_KEY = 'vue-nextNoteId';
  
  export default {
    name: 'Todo',
    components: {
      NoteTaking,
    },
    data() {
      return {
        newNote: '',
        notes: [],
        nextNoteId: 1,
        selectedNoteIds: [],
        searchText: '',
        currentPage: 1,
        itemsPerPage: 5,
        storageLimitReached: false
      };
    },
    computed: {
      allSelected: {
        get() {
          return this.notes.length > 0 &&
                 this.selectedNoteIds.length === this.notes.length;
        },
        set(value) {
          this.selectedNoteIds = value ? this.notes.map(note => note.id) : [];
        }
      },
      filteredNotes() {
        const query = this.searchText.toLowerCase();
        return this.notes.filter(note => note.text.toLowerCase().includes(query));
      },
      paginatedNotes() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredNotes.slice(start, start + this.itemsPerPage);
      },
      totalPages() {
        return Math.ceil(this.filteredNotes.length / this.itemsPerPage);
      }
    },
    watch: {
      searchText() {
        this.currentPage = 1;
      }
    },
    methods: {
      addNote() {
        if (this.newNote.trim() === '') return;
  
        const estimatedSize = this.estimateLocalStorageUsage();
        if (estimatedSize > 4800) {
          this.storageLimitReached = true;
          return;
        }
  
        this.notes.push({
          id: this.nextNoteId++,
          text: this.newNote,
          completed: false
        });
  
        this.newNote = '';
        this.storageLimitReached = false;
        this.saveNotes();
      },
      deleteNote(noteId) {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.selectedNoteIds = this.selectedNoteIds.filter(id => id !== noteId);
        this.saveNotes();
      },
      handleSelect(noteId, isSelected) {
        if (isSelected && !this.selectedNoteIds.includes(noteId)) {
          this.selectedNoteIds.push(noteId);
        } else if (!isSelected) {
          this.selectedNoteIds = this.selectedNoteIds.filter(id => id !== noteId);
        }
      },
      deleteSelected() {
        this.notes = this.notes.filter(note => !this.selectedNoteIds.includes(note.id));
        this.selectedNoteIds = [];
        this.saveNotes();
      },
      saveNotes() {
        localStorage.setItem(NOTES_KEY, JSON.stringify(this.notes));
        localStorage.setItem(NOTE_ID_KEY, this.nextNoteId);
      },
      loadNotes() {
        const notes = localStorage.getItem(NOTES_KEY);
        const nextNoteId = localStorage.getItem(NOTE_ID_KEY);
        if (notes) this.notes = JSON.parse(notes);
        if (nextNoteId) this.nextNoteId = parseInt(nextNoteId, 10);
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
      },
      nextPage() {
        if (this.currentPage < this.totalPages) this.currentPage++;
      },
      toggleComplete(noteId) {
        const note = this.notes.find(note => note.id === noteId);
        if (note) {
          note.completed = !note.completed;
          this.saveNotes();
        }
      },
      estimateLocalStorageUsage() {
        return new Blob([JSON.stringify(this.notes)]).size / 1024;
      }
    },
    created() {
      this.loadNotes();
    }
  };
</script>

<style>
#todo {
  max-width: 720px;
  margin: 40px auto;
  padding: 30px;
  background: #f9fcff;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 700;
}

.input-container,
.bulk-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.text-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ccd6dd;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.text-input:focus {
  border-color: #3498db;
}

.action-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn.add {
  background-color: #3498db;
  color: white;
}

.action-btn.add:hover {
  background-color: #2980b9;
}

.action-btn.delete {
  background-color: #e74c3c;
  color: white;
}

.action-btn.delete:hover {
  background-color: #c0392b;
}

.bulk-actions .select-label {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.bulk-actions button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
}

.pagination button {
  padding: 8px 14px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:hover {
  background-color: #27ae60;
}

.pagination button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.warning-text {
  color: #e74c3c;
  font-weight: 600;
  margin-top: -10px;
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  .input-container,
  .bulk-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .action-btn,
  .text-input {
    width: 100%;
  }

  .pagination {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
