mkdir crud_api_project
cd crud_api_project
python -m venv myvenv
myvenv\Scripts\activate
pip install Django 
django-admin startproject holidayapartment
python manage.py startapp crud_api_project
