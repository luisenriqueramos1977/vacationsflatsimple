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

To run the front-end 


Shield: [![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg
