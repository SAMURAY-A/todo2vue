<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

import { createTodo, getTodos, updateTodo, deleteTodo } from '@/composables/dataApi'

// Form state
const todoText = ref('')
const completedStatus = ref<'true' | 'false'>()

// Todos list
const todos = ref<any[]>([])

const fetchTodos = async () => {
  const res = await getTodos(20)
  todos.value = res.todos
}

const handleSubmit = async () => {
  if (!todoText.value || completedStatus.value === undefined) return alert('Maydonlar to‘ldirilishi kerak')

  const newTodo = await createTodo(todoText.value, 5, completedStatus.value === 'true')
  todos.value.unshift(newTodo)
  todoText.value = ''
  completedStatus.value = undefined
}

const handleDelete = async (id: number) => {
  await deleteTodo(id)
  todos.value = todos.value.filter(t => t.id !== id)
}

const handleUpdate = async (todo: any) => {
  const updated = await updateTodo(todo.id, {
    todo: todo.todo,
    completed: todo.completed,
  })
  Object.assign(todo, updated)
}

onMounted(fetchTodos)
</script>

<template>
  <div class="flex flex-col items-center p-6 space-y-10">
    <!-- Form -->
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Create todo</CardTitle>
        <CardDescription>Deploy your new todo in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit">
          <div class="grid gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">Todo</Label>
              <Input id="name" placeholder="name of your todo" v-model="todoText" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="status">Status</Label>
              <Select v-model="completedStatus">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="false">Not Completed</SelectItem>
                  <SelectItem value="true">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <Button variant="outline" @click="todoText = ''; completedStatus = undefined">Cancel</Button>
        <Button @click="handleSubmit">Deploy</Button>
      </CardFooter>
    </Card>

    <!-- Todo list -->
    <div class="w-full max-w-md space-y-4">
      <Card v-for="todo in todos" :key="todo.id">
        <CardContent class="space-y-2 py-4">
          <Input v-model="todo.todo" />
          <Select v-model="todo.completed" :modelValue="String(todo.completed)">
            <SelectTrigger>
              <SelectValue :placeholder="todo.completed ? 'Completed' : 'Not Completed'" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="true">Completed</SelectItem>
              <SelectItem :value="false">Not Completed</SelectItem>
            </SelectContent>
          </Select>
          <div class="flex justify-between pt-2">
            <Button size="sm" @click="handleUpdate(todo)">Update</Button>
            <Button size="sm" variant="destructive" @click="handleDelete(todo.id)">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
