<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- <NuxtWelcome /> -->
    
    <NuxtPage />
  </div>
</template>

<script setup>
const router = useRouter()

// Ana sayfaya gelenleri login sayfasına yönlendir
onMounted(() => {
  if (router.currentRoute.value.path === '/') {
    router.push('/login')
  }
})
</script>
