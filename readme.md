Vacation Flat Simple is an API application that lets you create and administrate
vacational flats. 

Owners can create flats, locations, guests, modify reviews and facilities.
Guests can create booking and add reviews to apartments. 


To run the back end of this application do as following:

cd single_flat_api

flat_env\Scripts\activate #activa el env
cd holiday_flat
python manage.py runserver # to run with django server

to run this app with docker:

docker-compose build
docker-compose up

in case of db corrupted:
docker-compose run web python manage.py migrate
docker-compose run web python manage.py makemigrations
docker-compose up --force-recreate


endpoints: 
/api/locations/ locations where apartments are located
/api/apartments/ apartments that can be booked
/api/pictures/ pictures of the apartments
/api/groups/owners/ owners of the apartments
/api/groups/guests/ guests who book apartments 
/api/reviews/ reviews done to apartments by guests 
/api/bookings/ let guests make bookings
 /api/facilities/ Facilities provided by apartemtns
/api/currencies/ currency of prices

1. create some locations
2. create some currencies
3. create superuser:
docker-compose run web python manage.py createsuperuser
4. create Owners and Guests group from http://localhost:8000/admin/

To run the front-end with node.js

cd front_end\holiday-apartments

npm start





All right reserved &copy; Luis Ramos & Ismelda Guerra

"# fewoismelda" 
