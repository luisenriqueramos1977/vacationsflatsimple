Vacation Flat Simple is an API application that lets you create and administer
vacational flats. 

Owners can create flats, locations, guests, modify reviews and facilities.
Guests can create a booking and add reviews to apartments. 


To run the back end of this application, do the following:

cd single_flat_api

flat_env\Scripts\activate #activa el env
cd holiday_flat
python manage.py runserver # to run with django server

To run this app with Docker:

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

1. Create some locations
2. Create some currencies
3. Create superuser:
docker-compose run web python manage.py createsuperuser
4. Create Owners and Guests group from http://localhost:8000/admin/

To run the front-end with node.js

cd front_end\holiday-apartments

npm start





All right reserved &copy; Luis Ramos & Ismelda Guerra

"# fewoismelda" 
