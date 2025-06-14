<!-- NoteTaking.vue -->
<template>
    <div class="note-card" :class="{ completed: note.completed }">
      <div class="note-left">
        <input
          type="checkbox"
          :checked="isSelected"
          @change="$emit('select', note.id, $event.target.checked)"
          title="Select Note"
        />
      </div>
  
      <div class="note-content">
        <p>{{ note.text }}</p>
      </div>
  
      <div class="note-actions">
        <button
          v-if="!note.completed"
          @click="$emit('toggle-complete', note.id)"
          class="complete-btn"
        >
          ✅ Complete
        </button>
        <button @click="deleteNote" class="delete-btn" title="Delete Note">🗑</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['note', 'isSelected'],
    methods: {
      deleteNote() {
        this.$emit('delete', this.note.id);
      },
    },
  };
  </script>
  
  <style scoped>
  .note-card {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(to right, #f0f8ff, #e0ffff);
    border: 1px solid #d4d4d4;
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, background 0.3s;
  }
  
  .note-card:hover {
    transform: scale(1.01);
    background: linear-gradient(to right, #e6f7ff, #ccf2ff);
  }
  
  .note-left {
    flex: 0 0 auto;
  }
  
  .note-content {
    flex: 1 1 auto;
    margin: 0 16px;
  }
  
  .note-content p {
    margin: 0;
    font-size: 16px;
    color: #2c3e50;
    word-wrap: break-word;
  }
  
  .note-card.completed .note-content p {
    text-decoration: line-through;
    color: #95a5a6;
  }
  
  .note-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .complete-btn {
    background-color: #27ae60;
    color: #fff;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  }
  
  .complete-btn:hover {
    background-color: #1e8449;
  }
  
  .delete-btn {
    background-color: #e74c3c;
    color: #fff;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  }
  
  .delete-btn:hover {
    background-color: #c0392b;
  }
  
  @media (max-width: 600px) {
    .note-card {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .note-content {
      margin: 12px 0;
      width: 100%;
    }
  
    .note-actions {
      width: 100%;
      justify-content: flex-start;
    }
  }
  </style>
  