from rest_framework.routers import DefaultRouter
from apps.tarefa.api.viewsets import TaskViewSet, CategoryViewSet, PriorityViewSet

router = DefaultRouter()
router.register('tasks', TaskViewSet)
router.register('categories', CategoryViewSet)
router.register('priorities', PriorityViewSet)