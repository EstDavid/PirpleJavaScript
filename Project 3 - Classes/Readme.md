# Elevator Brain Project

## About
This project is part of the Pirple _Keeping up with the Javascripts_ course. The goal is to design a system of elevators which processes in an efficient manner all the elevator requests created randomly in a building.

In order to achieve this goal, two classes are created. The first one is the Elevator class, which manages the status of single elevator, closes and opens the doors, notifies malfunctions and processes the queue of requested floors. The second class is the ElevatorManager class, which processes the elevator requests from each floor in the building and then passes them to the closest available elevator.

## Elevator class
The elevator class contains all the variables and methods needed for the management of an elevator.

### Elevator class constructor
When instantiating a new object belonging to the Elevator class, we need the following parameters:
* `name` - Name of the elevator. It can be anything, a number, a string... What is important is that this name is unique within an ElevatorManager object
* `lowestFloor` - This parameter must be an integer number stating the lowest floor that the elevator can reach
* `highestFloor` - This parameter must be an interger number stating the highest floor that the elevator can reach
* `currentFloor` - This parameter must be an interger number stating the floor at which the elevator is being installed

Example of Elevator instantiation:

```
const elevatorA = new Elevator("A", -1, 9, 0);
```

In this example we name elevatorA as "A". This elevator goes from the basement (floor -1) up to floor 9 and is installed in floor 0.

### Most relevant Elevator methods
* `queueFloor(floor)` - This method is called when a passenger presses the button inside the elevator, choosing the desired destination.
Also, this method is called by the ElevatorManager class after processing an 'up' or 'down' button request from a floor.
The `queueFloor` method makes sure first that the elevator doesn't have any malfunction. Then if there are no other floors in the elevator queue, it proceeds to go to the floor which was requested. If there are other floors in the queue, it queues the new floor and proceeds to go to the closest floor in the direction of travel.
* `notifyMalfunction()` - This method is the one which must be called by any system that registers a malfunction. The `elevatorMalfunction` variable will be set to true and the elevator won't be able to move, except when the `emergencyButton()` method is called.
* `emergencyButton()` - When the emergency button is pressed, it calls this method. The elevator will open the doors and won't be able to move until the issue is solved and the `resetButton()` method is called.
* `resetButton()` - Once the malfunction issue of the elevator is solved, the reset button must be pressed to call this method. This method sets the `elevatorMalfunction` variable back to false.

### List of Elevator class variables and methods
|Variable|Description|
|--------|-----------|
|name|Name given to the elevator|
|lowestFloor|It's the lowest floor the elevator is able to reach|
|highestFloor|It's the highest floor the elevator is able to reach|
|doorsOpen|Is set to true or false depending on the state open or closed of the doors|
|moving|If true, it indicates that the elevator is currently moving|
|goingUp|It's set to true if the elevator is going in the up direction|
|goingDown|It's set to true if the elevator is going in the down direction|
|elevatorMalfunction|By default is set to false. If there is an emergency, the elevator won't move until the reset button is pushed and isAvailable is set back to false|
|currentFloor|This variable is used to know at which floor the elevator is|
|floorsQueue|It contains all the floors that that the elevator can go to. If their value is set to true, the elevator will move there|

|Method|Description|
|------|-----------|
|openDoors()|Checks that the doors are closed and that the elevator is not moving, and then sets the doorsOpen variable to true|
|closeDoors()|Checks that the doors are open and then sets the doorsOpen variable to false|
|emptyQueue()|Returns true if the queue of floors of the elevator is empty, or false if there is at least one floor in the queue|
|queueFloor(floor)|This method is called by the floor buttons inside the elevator and by the ElevatorManager object. It queues the floor given as a parameter|
|checkReadyToMove()|This check is performed every time before the elevator moves to a floor. It makes sure that there is no malfunction, that the elevator is not moving and that the doors are closed|
|processQueue()|This method is called any time a floor is added to an empty queue. It makes the elevator process each floor in the queue until the queue is empty|
|chooseNextFloor()|It decides which to which floor in the queue the elevator will go. It makes the decision by choosing the closest floor in the direction of movement of the elevator|
|moveToNextFloor()|Once a floor is chosen, the moveToNextFloor() method is called. This method makes all the necessary checks before making the move up or down, closes the doors, makes the move and then opens the doors and console.logs the move |
|moveUp()|It moves the elevator up one floor|
|moveDown()|It moves the elevator down one floor|
|stop()|This method is called every time the elevator has reached the destination floor. It sets the moving variable to false, opens the doors and erases the current floor from the floors queue|
|notifyMalfunction()|This method must be called by any system that presents or detects a malfunction. It sets the elevatorMalfunction variable to true and console.logs the malfunction, along with the name of the elevator and the current floor where it's located|
|emergencyButton()|If elevatorMalfunction is true, this method sends the elevator to the closest floor and opens the doors|
|resetButton()|This method must be called after a malfunction in the elevator has been corrected. It sets the elevatorMalfunction variable back to false|


## ElevatorManager class
The ElevatorClass receives the requests from the different floors, it queues them and then proceeds to pass each request to the closest elevator with a direction of travel compatible with the request.

### ElevatorManager class constructor
When instantiating a new object belonging to the ElevatorManager class, we need the following parameters:
* `elevatorList` - (optional) This parameter must be an array containing the Elevator class objects that the building will have. The elevators can be later added by calling the `addElevator` method.
* `lowestFloor` - This parameter must be an integer number stating the lowest floor in the building
* `highestFloor` - This parameter must be an interger number stating the highest in the building

Example of ElevatorManager instantiation:

```
const elevatorManager = new ElevatorManager([], -1, 10);
```

In this example we are creating an Elevator Manager with an empty list of elevators. The lowest floor in the building is the basement (-1), and the highest is the 10th floor.

### Most relevant ElevatorManager methods
* `addElevator(elevator)` - This method takes an Elevator object as parameter and adds it to the `elevatorList` array variable of the ElevatorManager object.
* `newElevatorRequest(floor, direction)` - This method is called by the buttons on each floor. The request is queued and processed once there is an elevator available.
* `checkElevatorsStatus()` - By calling this method we get an array with as many objects as elevators in the ElevatorManager. Each object contains the most relevant information about the status of the corresponding elevator (name, current floor, doors open or closed, malfunction). Also, this status is shown in the console.


### List of ElevatorManager class variables and methods
|Variable|Description|
|--------|-----------|
|elevatorList|This variable is an array containing all the Elevator objects of the building|
|highestFloor|This parameter must be an integer number stating the lowest floor in the building|
|lowestFloor|This parameter must be an interger number stating the highest in the building|
|floorsQueue|This variable is an object containing object for each floor in the building. Each floor object contains a boolean key for each direction (goingUp and goingDown). If any of these keys is true, it means that there is a request on that floor to go on the direction of the key. The highest floor only has the goingDown key, and the lowest floor only has the goingUp key|

|Method|Description|
|------|-----------|
|addElevator(elevator)|This method allows to add a new Elevator object to the elevatorList array|
|emptyQueue()|It returns true if there are no elevator request in the floorsQueue array, otherwise it returns false|
|newElevatorRequest(floor, direction)|This method is called by the buttons on each floor. It adds the request to the floorsQueue array and calls the processQueue() method|
|processQueue()|This method loops through all the floors and direction requests saved in the floorsQueue array and calls the processRequest() method|
|processRequest(floor, goingUp, goingDown)|It checks if any of the elevators can attend a request. If both are available, it picks the closest elevator|
|checkElevatorsStatus()|This method console.logs the status of all the elevators in the building and returns an object with the most relevant information|

## Possible areas for further development
In order to design this system closer to reality, it would be a good idea to create new classes to manage other subsystems:
* Doors - A Foors class would manage the orders to open and close doors and would notify any malfunction. It could also detect the presence of persons or objects in the trajectory of the door
* Floor - This class would allow to model the buttons on each floor and would allow to create the elevator requests on a more realistic manner. It would also allow to manage the indicators on each floor, showing the floor and direction of each elevator and turning on the up or down button if a passenger has requested an elevator. This class would also allow to monitor the actual presence of the elevator on the floor

Also, the simulation of the system could be improved. In order to do this, the creation of custom events and event handles would be a very sound approach to handle all possible situations, simplify the code and make it more realistic. Probably a Passenger class and a PassengerManager class would need to be created to carry out this simulation.