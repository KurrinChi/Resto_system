# Generated migration for adding ImageField to MenuItem

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='menuitem',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='menu_items/'),
        ),
    ]
