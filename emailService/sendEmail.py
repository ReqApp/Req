# Quickstart gudie: https://pypi.org/project/EZGmail/
import ezgmail
import sys

if len(sys.argv) == 4:
    try:
        ezgmail.send(sys.argv[1], sys.argv[2], sys.argv[3])
        print("[{}] {} - {}".format(sys.argv[1], sys.argv[2], sys.argv[3]))
    except:
        print("Invalid input")
else:
    print("Usage: python3 sendEmail.py emailAddress subjectText bodyText")