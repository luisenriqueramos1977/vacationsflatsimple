cd vacationsflatsimple (github folder)
mkdir single_flat_api
cd single_flat_api
python -m venv flat_env
flat_env\Scripts\activate #activa el env
pip install Django 
pip install django_rest_framework
django-admin startproject holiday_flat_project
cd holiday_flat
django-admin startapp flat_api
python manage.py runserver

endpoints: 
http://127.0.0.1:8000/api/fewoowner/create/; create a new owner
http://127.0.0.1:8000/api/fewoowners/; list all current owners
