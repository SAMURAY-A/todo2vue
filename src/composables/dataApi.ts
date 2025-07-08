// composables/dataApi.ts
const BASE_URL = 'https://dummyjson.com/todos'

export async function createTodo(todo: string, userId: number, completed = false) {
    const res = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo, completed, userId }),
    })
    return await res.json()
}

export async function getTodos(limit = 20) {
    const res = await fetch(`${BASE_URL}?limit=${limit}`)
    return await res.json()
}

export async function updateTodo(id: number, data: { todo: string; completed: boolean }) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    return await res.json()
}

export async function deleteTodo(id: number) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    return await res.json()
}
