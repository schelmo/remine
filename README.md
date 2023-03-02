# rmine

> A simple command line tool for list and quickly update issues

### list issues

```bash
# lists all issues sorted by updated date, also allows to search in issues
rmine
# same as obove
rmine list
# list only issues of the specified project
rmine list "My Project Name"
# list only issues of projects which contains the string some in their names
rmine list "~some"
```
After selecting an issue all issue details will be displayed
and you can update the status aswell you can add a note.

### updating issues

```bash
# quickly mark an issue as done (you can omit the #)
rmine fix #1337
# add a note
rmine fix #1337 fixed by commit:4a893e4
# reject an issue
rmine reject #1338 not accepting..
```
### creating issues

```bash
# creates an issue with an autocomplete prompt for the project and one for the Tracker
rmine create "My Issue Subject"
# add a description
rmine create "My Issue Subject" "My description"
```