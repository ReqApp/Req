# Req Documentation 
____

If you're using VS Code get [this](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced) extension that lets you easily edit and get a nice live preview of the .md file. This is the same format as the README is in and it's very easy to learn. Open any .md and click the key with the window on the top left of the focused window to open the preview to the side or press Ctrl+K and then (on it's own) V.

## https://danu7.it.nuigalway.ie:8673
____
## Username and password schema
### `/models/users.js`
* ####  Username:
Usernames **must** be a minimum of 1 and a maximum of 23 characters in length
* #### Password:
Passwords **must** be a minimum of 8 characters in length
____

## APIs
### `/routes/index.js`
| Request type  | URL | Return value|  Information |
| ------------- | ------------- | ------------- | ------------- |
| **POST**  | `/getTime` | `{"currentTime":1578497528128}` | Ccurrent time in milliseconds since January 1st 1970.  |
____

# Services

## Sending Emails
### `/emailService/sendEmail.py`
* We can send emails to users with the ReqNUIG@gmail.com account through a python module. To call this script cd into the folder and exec this command: `python3 sendEmail.py emailAddress subjectText bodyText`. The login details for the gmail are in the discord if needed.
____

## Frequency from articleScraper
`/articleStats/articleGetWindows` or `/articleStats/articleGetLinux`
* Returns the **case** sensitive amount of matches of the search term in the article titles of the directory of the sitename chosen.
* Basic usage: `[articleGetWindows or articleGetLinux] -s sitename directory month year searchTerm`
* Any time from 12/2019 to present is in the files. Might add more logs if it's back from 7/2019

| sitename  |  directories |
| ------------- | ------------- | 
| BBC | `world, uk, business, politics, health, education, science_and_environment, technology, entertainment_and_arts, world/africa, world/asia, world/europe, world/latin_america, world/middle_east, world/us_and_canada, england, nothern_ireland, scotland, wales` |
| CNN | `edition_world, edition_africa, edition_americas, edition_asia, edition_europe, edition_space, edition_us, edition_money_news_international, edition_technology, edition_entertainment, edition_sport, edition_football, edition_golf, edition_motorsport, edition_tennis`| 
| RT | `news, usa, uk, sport, russia, business`| 
| Guardian | `all`| 







## MongoDB

* MongoDB login details are in the discord.