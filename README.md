# miniFridge

miniFridge is a fridge management application that allows users to keep track of the items they have in their fridge. The app allows users to add/update/delete items to a virtual fridge list complete with expiration, location in fridge and quantity information. The app also includes a shopping list that users can add items to to keep track of when shopping. The items in the shopping list can quickly and easily be moved to the fridge list and vice versa. Data storage and authentication is all handled by Firebase.


## Prerequisites for miniFridge

### NodeJS
#### Windows & Mac: 
https://nodejs.org/en/

### Ionic Cordova
```
npm install -g ionic cordova
```

## Installing

In order to install miniFridge onto your computer, clone this repository and then navigate to the folder in your terminal.
```
git clone https://github.com/garykphuang/miniFridge
```

To install all the dependencies for miniFridge, run: 
```
npm install
```

### Deploying locally
To run the app in your browser, enter the following into your terminal while in the miniFridge folder.
```
ionic serve
```
or
```
ionic serve -lab
```
"ionic serve" runs it directly in browser form while "ionic serve -lab" runs it in your browser on multiple platform such as Android or iOS.

When it finishes building, your browser should open automatically with the app. If it doesn't, miniFridge will be running on ```http://localhost:8100``` by default.

### Deploying to a device
First, you will need to add the desired platform to the project. You can do this by running 
```
ionic cordova platform add [platform]
``` 
Where ```[platform]``` can be ```ios``` (primary platform), ```android``` or ```windows```. Then run
```
ionic cordova run [platform]
```
which will run your app and deploy it on your device in debug mode.

## Built With

* [Ionic](https://ionicframework.com/) - Framework
* [Firebase](https://firebase.google.com/) - Database
* [rxjs](http://reactivex.io/) - Asynchronous calls
* [Moment.js](https://momentjs.com/) - Date handling

## Creators

* **Zeka Dizdar**
* **Gary Huang**
* **Abigail Poole**


See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.
