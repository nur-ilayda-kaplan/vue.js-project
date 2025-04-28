<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Giriş Yap
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-2">
          <div class="relative">
            <label for="kullaniciAdi" class="sr-only">Kullanıcı Adı</label>
            <input
              v-model="formData.kullaniciAdi"
              id="kullaniciAdi"
              name="kullaniciAdi"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Kullanıcı Adı"
            />
          </div>
          <div class="relative">
            <label for="sifre" class="sr-only">Şifre</label>
            <input
              v-model="formData.sifre"
              id="sifre"
              name="sifre"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Şifre"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const config = useRuntimeConfig()
const API_LOGIN_URL = config.public.apiLoginUrl

const isLoading = ref(false)
const formData = ref({
  kullaniciAdi: '',
  sifre: ''
})

const handleLogin = async () => {
  try {
    isLoading.value = true
    console.log('Login isteği gönderiliyor:', {
      url: API_LOGIN_URL,
      data: formData.value
    })

    // Form verilerini kontrol et
    if (!formData.value.kullaniciAdi || !formData.value.sifre) {
      throw new Error('Kullanıcı adı ve şifre alanları zorunludur')
    }

    const response = await fetch(API_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        kullaniciAdi: formData.value.kullaniciAdi,
        sifre: formData.value.sifre
      })
    })

    console.log('Login yanıtı:', {
      status: response.status,
      statusText: response.statusText
    })

    if (!response.ok) {
      const errorText = await response.text(); // Önce text olarak alalım
      let errorMessage = 'Giriş başarısız oldu';
      
      try {
        // JSON parse etmeyi deneyelim
        const errorData = JSON.parse(errorText);
        errorMessage = errorData?.mesaj || errorData?.message || errorMessage;
      } catch (e) {
        // Eğer JSON parse edilemezse, gelen text'i kullanalım
        errorMessage = errorText || errorMessage;
      }
      
      console.error('Login hatası:', errorMessage);
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('JSON parse hatası:', e);
      throw new Error('Sunucudan geçersiz yanıt alındı');
    }

    console.log('Login başarılı, yanıt:', data);
    
    if (!data.token) {
      throw new Error('Token alınamadı');
    }
    
    // Token'ı localStorage'a kaydet
    localStorage.setItem('token', data.token)
    
    // Dashboard'a yönlendir
    router.push('/dashboard')
  } catch (error) {
    console.error('Giriş sırasında hata oluştu:', error)
    alert(error.message || 'Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.')
  } finally {
    isLoading.value = false
  }
}
</script> 