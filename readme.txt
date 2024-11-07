cd vacationsflatsimple (github folder)
mkdir single_flat_api
cd single_flat_api
python -m venv flat_env
myvenv\Scripts\activate
pip install Django 
pip install django_rest_framework
django-admin startproject holiday_flat_project
cd holiday_flat
django-admin startapp flat_api
python manage.py runserver