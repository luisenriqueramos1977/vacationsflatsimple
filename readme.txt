Vacation Flat Simple is an API application that lets you create and administrate
vacational flats. 

Owners can create flats, locations, guests, modify reviews and facilities.
Guests can create booking and add reviews to apartments. 


To run the back end of this application do as following:

flat_env\Scripts\activate #activa el env
cd holiday_flat
python manage.py runserver

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
