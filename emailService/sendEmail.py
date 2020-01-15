# Quickstart gudie: https://pypi.org/projectpip/EZGmail/
import ezgmail
import sys

checkList = ["\"","`"]

print("{} {} {}".format(sys.argv[1], sys.argv[2], sys.argv[3]))
if len(sys.argv) == 4:
    if not any(x in str for x in checkList):
        ezgmail.send(sys.argv[1], sys.argv[2], sys.argv[3])
        print("[{}] {} - {}".format(sys.argv[1], sys.argv[2], sys.argv[3]))
else:
    print("Usage: python3 sendEmail.py emailAddress subjectText bodyText")