from rest_framework.test import APITestCase
from rest_framework import status
from .models import Task, Category, Priority

class TaskViewSetTests(APITestCase):
    def setUp(self):
        # Configura o ambiente de teste
        self.category = Category.objects.create(name='Work')
        self.priority = Priority.objects.create(level='High')
        self.task_data = {
            'title': 'Test Task',
            'description': 'Test description',
            'completed': False,
            'category': self.category.id,
            'priority': self.priority.id,
        }
        self.url = '/api/tasks/'  # URL da API que você deseja testar

    def test_create_task(self):
        response = self.client.post(self.url, self.task_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.get().title, 'Test Task')

    def test_list_tasks(self):
        Task.objects.create(**self.task_data)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Task')