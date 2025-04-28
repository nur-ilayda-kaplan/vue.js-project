import { defineEventHandler, readBody, createError } from 'h3'

// Basit bir veritabanı simülasyonu
let items = []

export default defineEventHandler(async (event) => {
  // GET isteği - Tüm öğeleri listele
  if (event.method === 'GET') {
    return items
  }

  // POST isteği - Yeni öğe ekle
  if (event.method === 'POST') {
    const body = await readBody(event)
    const newItem = {
      id: Date.now(),
      ...body
    }
    items.push(newItem)
    return newItem
  }

  // PUT isteği - Öğe güncelle
  if (event.method === 'PUT') {
    const body = await readBody(event)
    const index = items.findIndex(item => item.id === body.id)
    if (index === -1) {
      throw createError({
        statusCode: 404,
        message: 'Öğe bulunamadı'
      })
    }
    items[index] = body
    return body
  }

  // DELETE isteği - Öğe sil
  if (event.method === 'DELETE') {
    const body = await readBody(event)
    items = items.filter(item => item.id !== body.id)
    return { success: true }
  }
}) 