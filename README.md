# remine

> A simple command line tool for list and quickly update issues

## installation

`npm install -g remine`

on arch linux:

`yay -S remine` (change yay with your favorite aur manager)

### list issues

```bash
# lists all issues sorted by updated date, also allows to search in issues
remine
# same as obove
remine list
# list only issues of the specified project
remine list "My Project Name"
# list only issues of projects which contains the string some in their names
remine list "~some"
```
After selecting an issue all issue details will be displayed
and you can update the status aswell you can add a note.

### updating issues

```bash
# quickly mark an issue as done (you can omit the #)
remine fix #1337
# add a note
remine fix #1337 fixed by commit:4a893e4
# reject an issue
remine reject #1338 not accepting..
```
### creating issues

```bash
# creates an issue with an autocomplete prompt for the project and one for the Tracker
remine create "My Issue Subject"
# add a description
remine create "My Issue Subject" "My description"
```
