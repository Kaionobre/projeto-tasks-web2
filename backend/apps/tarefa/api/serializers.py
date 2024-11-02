from rest_framework import serializers
from apps.tarefa import models

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__' 

class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Priority
        fields = '__all__' 

class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    priority_level = serializers.SerializerMethodField()
    class Meta:
        model = models.Task
        fields = ['id', 'title', 'description', 'completed', 'category', 'priority', 'category_name', 'priority_level', 'is_active', 'created_at', 'updated_at', 'deleted_at']
        extra_kwargs = {
        'category': {'write_only': True},
        'priority': {'write_only': True}
            }

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_priority_level(self, obj):
        return obj.priority.level if obj.priority else None