from django.db import models
from django.utils import timezone

class SoftDeleteModel(models.Model):

    is_active = models.BooleanField(editable = False, default=True)
    created_at = models.DateTimeField( auto_now_add =True)
    updated_at = models.DateTimeField( auto_now=True)
    deleted_at = models.DateTimeField( editable=False,blank=True, null=True)

    def delete(self, **kwargs):
        self.is_active = False
        self.deleted_at = timezone.now()
        self.save()
    def hard_delete (self, **kwargs):
        super(SoftDeleteModel, self).delete(**kwargs)

    class Meta:
        abstract = True

class BaseModelQuerySet(models.QuerySet):
    def delete(self):
        self.update(deleted_at=timezone.now() ,is_active=False)

class BaseManager(models.Manager):
    def get_queryset (self):
        return BaseModelQuerySet( self.model, using=self._db).filter( deleted_at__isnull =True, is_active=True)
    

class Category(SoftDeleteModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Priority(SoftDeleteModel):
    level = models.CharField(max_length=50)

    def __str__(self):
        return self.level


from django.contrib.auth.models import User, Group

class Task(SoftDeleteModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    category = models.ForeignKey(Category, related_name='tasks', on_delete=models.CASCADE)
    priority = models.ForeignKey(Priority, related_name='tasks', on_delete=models.CASCADE)
    prazo = models.DateField(null=True, blank=True, verbose_name="Prazo de Conclusão")
    analista = models.ForeignKey(User, null=True, blank=True, related_name='tasks', on_delete=models.SET_NULL)
    equipe_desenvolvimento = models.ForeignKey(Group, null=True, blank=True, related_name='group_tasks', on_delete=models.SET_NULL)

    def __str__(self):
        return self.title

