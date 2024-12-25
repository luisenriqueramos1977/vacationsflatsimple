cd vacationsflatsimple (github folder)
mkdir single_flat_api
cd single_flat_api
python -m venv flat_env #create virtual environment
flat_env\Scripts\activate #activa el env
pip install Django 
pip install django_rest_framework
django-admin startproject holiday_flat_project
cd holiday_flat
django-admin startapp flat_api#create application named flat_api

#run app
python manage.py runserver#start the app


1. python manage.py migrate
2. python manage.py makemigrations
3. create superuser:
python manage.py createsuperuser
4. create Owners and Guests group



test endpoints: 

http://127.0.0.1:8000/api/fewoowner/create/; create a new owner
http://127.0.0.1:8000/api/fewoowners/; list all current owners



to recreate database
psql -U postgres
CREATE DATABASE flat_api_db;
CREATE USER luis WITH PASSWORD '12610418';
GRANT ALL PRIVILEGES ON DATABASE flat_api_db TO luis;
GRANT ALL ON SCHEMA public TO luis;
DROP SCHEMA public CASCADE;

GRANT ALL ON DATABASE flat_api_db TO luis;
ALTER DATABASE flat_api_db OWNER TO luis;
GRANT USAGE, CREATE ON SCHEMA public TO luis;