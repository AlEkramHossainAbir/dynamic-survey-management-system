Using mono repo

for backend: 
Auth: JWT
Roles: Admin, Officer
API: REST,
DB: fully normalized relational schema


DB Table:
users
surveys
survey_fields
field_options
submissions
submission_answers



what need to do: 

there will be two type of user (Roles: Admin, Officer)

## Admin
1. Login to the systems
2. create survey forms dynamically. 
3. add multiple fields to a survey form
4. view submitted responses of users


## officer
1. login to the systems
2. view available survey forms
3. submit responses to those surveys


## survey forms requirement  (for admin)
1. survey form consists 
2. Title (req) 
3. Description (optional)
4. multiple fields
   1. field label
   2. field type (input, textarea radio, checkbox, select)
   3. for checkbox, radio, select options must be configured by the admin

## Admin Panel
1. Admin login
2. create a new survey (form)
3. Add/edit/delete fields in a survey
4. view list of surveys (table)
5. view all the submissions for a survey
   
## officer panel
1. officer login
2. view available surveys
3. fill up and submit a survey

## api's
1. Authentication (login only)
2. survey creation
3. field management
4. survey submission
5. viewing submissions


## supabase
cloud-hosted PostgreSQL