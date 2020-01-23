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
#### `/getTime`
| Request type  | Output |
| ------------- | ------------- | ------------- |
| **POST**  | `{"currentTime":1578497528128}` |
|  **Inputs** |  |
| nothing  |

#### `/createArticleBet`
| Request type  | Output | 
| ------------- | ------------- | 
 **POST**| {"status":"information","body":"42"}| 
| **Inputs** | |
| betType | `article` |
| sitename  |  `BBC, CNN, RT, Guardian`  | 
| directory  |  a valid directory (see docs below for articleScraping)  | 
| month   |  1-12  | 
| year   |  2019/2020  | 
|  searchTerm | **case** sensitive search term   | 
____

## Sending Emails
### `/emailService/sendEmail.py`
* We can send emails to users with the ReqNUIG@gmail.com account through a python module. To call this script cd into the folder and exec this command: `python3 sendEmail.py emailAddress subjectText bodyText`. The login details for the gmail are in the discord if needed.
____
## MongoDB

* MongoDB login details are in the discord.