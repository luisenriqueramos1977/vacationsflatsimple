# Generated by Django 5.1.3 on 2025-02-01 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flat_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='total_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]
