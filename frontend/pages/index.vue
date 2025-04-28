<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Veri Yönetimi</h1>
    
    <!-- Veri Ekleme Formu -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">{{ editingItem ? 'Veri Güncelle' : 'Yeni Veri Ekle' }}</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Başlık</label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea
            v-model="formData.description"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          {{ editingItem ? 'Güncelle' : 'Ekle' }}
        </button>
      </form>
    </div>

    <!-- Veri Listesi -->
    <div class="bg-white rounded-lg shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in items" :key="item.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ item.title }}</td>
            <td class="px-6 py-4">{{ item.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="editItem(item)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Düzenle
              </button>
              <button
                @click="deleteItem(item.id)"
                class="text-red-600 hover:text-red-900"
              >
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const items = ref([])
const editingItem = ref(null)
const formData = ref({
  title: '',
  description: ''
})

// Yeni veri ekleme veya güncelleme
const handleSubmit = () => {
  if (editingItem.value) {
    // Güncelleme işlemi
    const index = items.value.findIndex(item => item.id === editingItem.value.id)
    if (index !== -1) {
      items.value[index] = { ...editingItem.value, ...formData.value }
    }
  } else {
    // Yeni veri ekleme
    items.value.push({
      id: Date.now(),
      ...formData.value
    })
  }
  
  // Formu sıfırla
  formData.value = { title: '', description: '' }
  editingItem.value = null
}

// Veri düzenleme
const editItem = (item) => {
  editingItem.value = item
  formData.value = { ...item }
}

// Veri silme
const deleteItem = (id) => {
  items.value = items.value.filter(item => item.id !== id)
}
</script> 