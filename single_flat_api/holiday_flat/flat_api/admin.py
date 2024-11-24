from django.contrib import admin
from .models import Owner

# Register the Owner model to make it appear in the admin interface
@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ('user',)  # Display the user field in the list view

# You can also register the User model (if you need to link or see more details)
#from django.contrib.auth.models import User
#admin.site.register(User)
