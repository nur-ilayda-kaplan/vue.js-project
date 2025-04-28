<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">Yönetim Paneli</h1>
          </div>
          <div class="flex items-center">
            <button
              @click="logout"
              class="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Veri Ekleme Formu -->
      <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 mb-6">
        <div class="md:grid md:grid-cols-3 md:gap-6">
          <div class="md:col-span-1">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              {{ isEditing ? 'Veriyi Düzenle' : 'Yeni Veri Ekle' }}
            </h3>
          </div>
          <div class="mt-5 md:mt-0 md:col-span-2">
            <form @submit.prevent="handleSubmit">
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6 sm:col-span-4">
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Ürün Adı <span class="text-red-500 ">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="formData.name"
                    id="name"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-500': errors.name }"
                    placeholder="Lütfen ürün adı giriniz"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>
                <div class="col-span-6 sm:col-span-4">
                  <label for="price" class="block text-sm font-medium text-gray-700">
                    Fiyat <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    v-model="formData.price"
                    id="price"
                    step="0.01"
                    min="0"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-500': errors.price }"
                    placeholder="Örn: 10.99"
                  />
                  <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
                </div>
                <div class="col-span-6 sm:col-span-4">
                  <label for="stock" class="block text-sm font-medium text-gray-700">
                    Stok <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    v-model="formData.stock"
                    id="stock"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-500': errors.stock }"
                    placeholder="Lütfen stok giriniz"
                  />
                  <p v-if="errors.stock" class="mt-1 text-sm text-red-600">{{ errors.stock }}</p>
                </div>
                <div class="col-span-6 sm:col-span-4">
                  <label for="categoryName" class="block text-sm font-medium text-gray-700">
                    Kategori Adı <span class="text-red-500">*</span>
                  </label>
                  <div class="form-group relative">
                    <div class="flex items-center relative">
                      <input
                        type="text"
                        id="categoryName"
                        v-model="formData.categoryName"
                        @click.stop="toggleCategoryDropdown"
                        class="form-control pr-10 cursor-pointer"
                        placeholder="Kategori seçmek için tıklayın"
                        readonly
                      />
                      <button 
                        type="button" 
                        @click.stop="toggleCategoryDropdown"
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 pointer-events-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <!-- Kategori önerileri -->
                    <div
                      v-show="showCategorySuggestions"
                      class="suggestions-container"
                      v-click-outside="closeCategoryDropdown"
                    >
                      <div
                        v-for="category in defaultCategories"
                        :key="category.id"
                        class="suggestion-item"
                        @click="selectCategory(category)"
                      >
                        {{ category.name }}
                        <span class="text-gray-400 text-sm ml-2">(ID: {{ category.id }})</span>
                      </div>
                    </div>
                  </div>
                  <p v-if="errors.categoryName" class="mt-1 text-sm text-red-600">{{ errors.categoryName }}</p>
                </div>
                <div class="col-span-6 sm:col-span-4">
                  <label for="categoryId" class="block text-sm font-medium text-gray-700">
                    Kategori ID
                  </label>
                  <input
                    type="number"
                    v-model="formData.categoryId"
                    id="categoryId"
                    disabled
                    class="mt-1 bg-gray-100 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    :class="{ 'border-red-500': errors.categoryId }"
                  />
                  <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600">{{ errors.categoryId }}</p>
                </div>
              </div>
              <div class="mt-5">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {{ isLoading ? 'İşleniyor...' : (isEditing ? 'Güncelle' : 'Ekle') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Veri Listesi -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="item in items" :key="item.id" class="px-4 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
                <p class="mt-1 text-sm text-gray-600">
                  {{ item.price }} TL, {{ item.stock }} adet
                  <span class="ml-2 text-gray-500">
                    Kategori: {{ item.categoryName || 'Belirtilmemiş' }} 
                    <span class="text-gray-400">(ID: {{ item.categoryId || 'Belirtilmemiş' }})</span>
                  </span>
                </p>
              </div>
              <div class="flex space-x-4">
                <button
                  @click="editItem(item)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Düzenle
                </button>
                <button
                  @click="deleteItem(item.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Sil
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBaseUrl
const API_PRODUCTS_URL = config.public.apiProductsUrl

const items = ref([])
const isEditing = ref(false)
const isLoading = ref(false)
const errors = ref({
  name: '',
  price: '',
  stock: '',
  categoryId: '',
  categoryName: ''
})

const formData = ref({
  id: null,
  name: '',
  price: 0,
  stock: 0,
  categoryId: 1,
  categoryName: ''
})

// Kategoriler için state
const categories = ref([])
const showCategorySuggestions = ref(false)
const filteredCategories = ref([])

// Önceden tanımlanmış kategoriler
const defaultCategories = [
  { id: 1, name: 'Giyim' },
  { id: 2, name: 'Elektronik' },
  { id: 3, name: 'Kozmetik' },
  { id: 4, name: 'Kırtasiye' },
  { id: 5, name: 'Ev & Yaşam' },
  { id: 6, name: 'Spor' },
  { id: 7, name: 'Kitap' },
  { id: 8, name: 'Oyuncak' },
  { id: 9, name: 'Mobilya' },
  { id: 10, name: 'Beyaz Eşya' }
];

// Token'ı localStorage'dan al
const getToken = () => {
  return localStorage.getItem('token')
}

// API istekleri için header'ları hazırla
const getHeaders = () => {
  const token = getToken();
  
  if (!token) {
    console.error('Token bulunamadı');
    router.push('/login');
    return {};
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Verileri yükle
const fetchItems = async () => {
  try {
    isLoading.value = true;
    const headers = getHeaders();
    
    if (!headers.Authorization) {
      throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
    }

    const response = await fetch(API_PRODUCTS_URL, { headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.mesaj || 'Veriler yüklenemedi');
    }

    if (!data.basarili || !data.veriler) {
      throw new Error('Veri formatı hatalı');
    }

    // Verileri işle
    items.value = data.veriler.map(item => {
      // Kategori bilgilerini normalize et
      const categoryInfo = item.kategori || item.Category || {};
      return {
        ...item,
        categoryId: categoryInfo.id,
        categoryName: categoryInfo.name,
        Category: categoryInfo,
        kategori: categoryInfo
      };
    });
    
    console.log('Güncellenmiş ürün listesi:', items.value);
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    if (error.message.includes('Oturum') || error.message.includes('Yetki')) {
      localStorage.removeItem('token');
      router.push('/login');
    }
    alert(error.message || 'Veriler yüklenemedi');
  } finally {
    isLoading.value = false;
  }
};

// Kategorileri yükle
const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/kategoriler`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      console.log('Kategori listesi yüklenemedi, varsayılan kategoriler kullanılıyor...');
      categories.value = defaultCategories;
      return;
    }

    const data = await response.json();
    if (data.basarili && data.veriler && data.veriler.length > 0) {
      // Kategorileri ID'ye göre sırala
      categories.value = data.veriler.sort((a, b) => a.id - b.id);
    } else {
      // Veri yoksa veya boşsa varsayılan kategorileri kullan
      categories.value = defaultCategories;
    }
    console.log('Güncel kategoriler:', categories.value);
  } catch (error) {
    console.error('Kategori yükleme hatası:', error);
    // Hata durumunda varsayılan kategorileri göster
    categories.value = defaultCategories;
  }
};

// Kategori dropdown'ını aç/kapa
const toggleCategoryDropdown = () => {
  showCategorySuggestions.value = !showCategorySuggestions.value;
  console.log('Dropdown durumu:', showCategorySuggestions.value);
  console.log('Mevcut kategoriler:', defaultCategories);
};

// Kategori dropdown'ını kapat
const closeCategoryDropdown = () => {
  showCategorySuggestions.value = false;
};

// Kategori seçimi
const selectCategory = (category) => {
  formData.value.categoryId = category.id;
  formData.value.categoryName = category.name;
  console.log('Kategori seçildi:', { id: category.id, name: category.name });
  closeCategoryDropdown();
};

// Sayfa yüklendiğinde kategorileri yükle
onMounted(async () => {
  const token = getToken();
  if (!token) {
    router.push('/login');
    return;
  }
  await fetchCategories(); // Önce kategorileri yükle
  await fetchItems(); // Sonra ürünleri yükle
});

const validateForm = () => {
  let isValid = true
  errors.value = {
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    categoryName: ''
  }

  // Ürün adı validasyonu
  if (!formData.value.name.trim()) {
    errors.value.name = 'Ürün adı zorunludur'
    isValid = false
  } else if (formData.value.name.length < 2 || formData.value.name.length > 50) {
    errors.value.name = 'Ürün adı 2-50 karakter arasında olmalıdır'
    isValid = false
  }

  // Fiyat validasyonu
  const price = parseFloat(formData.value.price)
  if (isNaN(price) || price < 0) {
    errors.value.price = 'Lütfen geçerli bir fiyat giriniz'
    isValid = false
  }

  // Stok validasyonu
  if (formData.value.stock < 0) {
    errors.value.stock = 'Stok 0 veya daha büyük olmalıdır'
    isValid = false
  }

  // Kategori ID validasyonu
  if (formData.value.categoryId < 1) {
    errors.value.categoryId = 'Kategori ID 1 veya daha büyük olmalıdır'
    isValid = false
  }

  // Kategori adı validasyonu
  if (!formData.value.categoryName.trim()) {
    errors.value.categoryName = 'Kategori adı zorunludur'
    isValid = false
  } else if (formData.value.categoryName.length < 2 || formData.value.categoryName.length > 50) {
    errors.value.categoryName = 'Kategori adı 2-50 karakter arasında olmalıdır'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    errors.value = {};

    if (!validateForm()) {
      throw new Error('Lütfen tüm zorunlu alanları doldurun');
    }

    const payload = {
      name: formData.value.name,
      price: Number(parseFloat(formData.value.price).toFixed(2)),
      stock: Number(formData.value.stock),
      kategori: {
        id: Number(formData.value.categoryId),
        name: formData.value.categoryName
      }
    };

    if (isEditing.value) {
      payload.id = formData.value.id;
    }

    console.log('Gönderilen veri:', payload);

    const url = isEditing.value ? `${API_PRODUCTS_URL}/${formData.value.id}` : API_PRODUCTS_URL;
    console.log('İstek URL:', url);

    const response = await fetch(url, {
      method: isEditing.value ? 'PUT' : 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Sunucudan gelen yanıt:', data);

    if (!response.ok) {
      throw new Error(data?.mesaj || 'İşlem başarısız oldu');
    }

    if (data.basarili) {
      if (isEditing.value && data.veri) {
        const updatedItem = {
          ...data.veri,
          categoryId: formData.value.categoryId,
          categoryName: formData.value.categoryName,
          Category: {
            id: formData.value.categoryId,
            name: formData.value.categoryName
          }
        };
        
        const index = items.value.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          items.value[index] = updatedItem;
        }
      } else {
        await fetchItems();
      }

      resetForm();
      alert(isEditing.value ? 'Ürün başarıyla güncellendi' : 'Ürün başarıyla eklendi');
    } else {
      throw new Error(data.mesaj || 'İşlem başarısız oldu');
    }
  } catch (error) {
    console.error('Form gönderme hatası:', error);
    alert(error.message);
  } finally {
    isLoading.value = false;
  }
};

// Ürün düzenleme
const editItem = (item) => {
  console.log('Düzenlenecek ürün:', item);
  isEditing.value = true;
  
  // Kategori bilgilerini doğru şekilde al
  const categoryId = item.Category?.id || item.kategori?.id || item.categoryId;
  const categoryName = item.Category?.name || item.kategori?.name || item.categoryName;
  
  formData.value = {
    id: item.id,
    name: item.name,
    price: item.price,
    stock: item.stock,
    categoryId: Number(categoryId),
    categoryName: categoryName
  };
  
  console.log('Düzenleme için form verisi:', formData.value);
};

const deleteItem = async (id) => {
  try {
    isLoading.value = true
    const response = await fetch(`${API_PRODUCTS_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })

    if (!response.ok) {
      throw new Error('Silme işlemi başarısız oldu')
    }

    // Verileri yeniden yükle
    await fetchItems()
  } catch (error) {
    console.error('Silme işlemi sırasında hata oluştu:', error)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    name: '',
    price: 0,
    stock: 0,
    categoryId: 1,
    categoryName: ''
  };
  isEditing.value = false;
  errors.value = {};
}

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
}

// Click-outside directive for closing suggestions
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside);
  }
};
</script>

<style scoped>
.suggestions-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 4px;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.relative {
  position: relative;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: #fff;
}

.form-control:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 1px #4f46e5;
}
</style> 