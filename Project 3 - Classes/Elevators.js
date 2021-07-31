// Defining the basic parameters of the building
const lowestBuildingFloor = -1;
const highestBuildingFloor = 10;

// Creating a pausing function for controlling the movement of the elevators
function pause(interval) {
    var intervalStart = new Date();
    while ((new Date()) - intervalStart <= interval) {
        // Do nothing
    }
}

// Creating the elevator class
    // The elevator class has the following parameters:
        // [X] lowestFloor - It's the lowest floor the elevator is able to reach
        // [X] highestFloor - It's the highest floor the elevator is able to reach
        // [] currentFloor - This variable is used to know at which floor the elevator is
        // [X] doorsOpen (boolean) - Is set to true or false depending on the state open or closed of the doors
            // The elevator cannot move if this parameter is set to true
        // [X] movingUp (boolean) - Is set to true if the elevator is moving up
        // [X] movingDown (boolean) - Is set to true if the elevator is moving down
        // [X] elevatorMalfunction - By default is set to false. If there is an emergency, the elevator won't move until the reset button is pushed and isAvailable is set back to false
        // [X] floorsQueue {} - It contains all the floors that that the elevator can go to. If their value is set to true, the elevator will move there
        // [X] nextFloor - This variable states the next floor that the elevator will move to
    // The Elevator class has the following methods:
        // [] closeDoors() - If doorsOpen is true, sends a signal to the doors to close 
        // [] openDoors() - If doorsOpen is false, sends a signal to the doors to close
        // [X] setDoorsOpened() - This method is used by the door system to signal that the doors have opened and set doorsOpen to true
            // Once the state of doorsOpen changes, it is console logged
        // [X] setDoorsClosed() - This method is used by the door system to signal that the doors have closed and set doorsOpen to false
            // Once the state of doorsOpen changes, it is console logged
        // [X] checkReadyToMove() - It makes all the necessary checks to make sure the elevator can start moving
        // [X] moveToFloor(floor) - Sends the elevator move to the specified floor, if the floor is beyond the limit of the elevator.
            // the elevator will go to the furthest floor possible
            // After the trip it console.logs the move
        // [X] moveDown() - Makes the elevator go fown one floor and decreases the currentFloor variable by 1
        // [X] moveUp() - Makes the elevator go up and increases the currentFloor variable by 1
        // [X] stop() - Stops the elevator. Sets the variables movingUp and movingDown to false, opens the doors
        // [X] notifyMalfunction() - This method allows any system to set the elevatorMalfunction variable to true, opens the doors and console.logs the problem
        // [] emergencyButton() - If elevatorMalfunction is true, this button sends the elevator to the closest floor and opens the doors
        // [X] resetButton() - If doors are open and elevatorMalfunction is set to true, it sets elevatorMalfunction back to false
    // Elements to be solved
        // [] How does the elevator move again after completing one move?
class Elevator {
    constructor(name, lowestFloor, highestFloor, currentFloor) {
        this.name = name;
        this.lowestFloor = lowestFloor;
        this.highestFloor = highestFloor;
        this.doorsOpen = true;
        this.movingUp = false;
        this.movingDown = false;
        this.elevatorMalfunction = false;
        this.currentFloor = currentFloor;
        this.floorsQueue = {};
        for(let floor = lowestFloor; floor <= highestFloor; floor++) {
            this.floorsQueue[floor] = false;
        }
    }
    
    openDoors() {
        if(!this.doorsOpen) {
            this.doorsOpen = true;
        }       
    }
    
    closeDoors() {
        if(this.doorsOpen) {
            this.doorsOpen = false;
        }
    }

    emptyQueue() {
        let emptyQueue = true;
        for(let floor = this.lowestFloor; floor <= this.highestFloor; floor++) {
            if(this.floorsQueue[floor]) {
                emptyQueue = false;
                break;
            }
        }
        if(emptyQueue) {
            this.movingUp = false;
            this.movingDown = false;
        }
        return emptyQueue;
    }

    queueFloor(floor) {
        // If the elevator has a nalfunction, the floor is ot queued
        if(this.elevatorMalfunction) {
            return false;
        }

        // Checking that the elevator actually goes to the requested floor
        if(floor < this.lowestFloor || floor > this.highestFloor) {
            return false;
        }

        // If the elevator is at idle, the floor is queued and immediately processed
        if(this.emptyQueue()) {
            this.floorsQueue[floor] =  true;
            this.processQueue();
            return true;
        }

        // If the elevator is moving up or down the floor is queued only if it is in the direction of travel
        if(!this.floorsQueue[floor]) {
            // If the elevator is moving up and the requested floor is above the elevator, it will be added to the target list
            if(this.movingUp && floor > this.currentFloor) {
                this.floorsQueue[floor] = true;
                return true;
            }
            // If the elevator is moving down and the requested floor is below the elevator, it will be added to the target list
            else if(this.movingDown && floor < this.currentFloor) {
                this.floorsQueue[floor] = true;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }

    checkReadyToMove() {
        if(!this.doorsOpen && !this.elevatorMalfunction) {
            return true;
        }
        else {
            return false;
        }
    }

    processQueue() {
        console.log(`This is elevator ${this.name}, processing the request`)
        while(!this.emptyQueue()) {
            this.chooseNextFloor();
            this.moveToNextFloor();
        }
    }

    moveToNextFloor() {
        this.closeDoors();
        if(this.checkReadyToMove()) {
            let startingFloor = this.currentFloor;
            // Going up
            if(this.currentFloor < this.nextFloor) {
                while(this.currentFloor < this.nextFloor) {
                    pause(1000);
                    this.moveUp();
                }
            }
            else if(this.currentFloor > this.nextFloor) {
                while(this.currentFloor > this.nextFloor) {
                    pause(1000);
                    this.moveDown();
                }
            }
            this.stop();
            console.log(`Elevator ${this.name} moved from floor ${startingFloor} to floor ${this.currentFloor}`);
        }
    }

    chooseNextFloor() {
        let closestFloorDistance = this.highestFloor - this.lowestFloor;
        let floorDistance;
        for(let floor = this.lowestFloor; floor <= this.highestFloor; floor++) {
            if(this.floorsQueue[floor]) {
                // Choosing next floor when moving up
                if(this.movingUp && floor > this.currentFloor) {
                    floorDistance = floor - this.currentFloor;
                    if(floorDistance <= closestFloorDistance) {
                        closestFloorDistance = floorDistance;
                        this.nextFloor = floor;
                    }
                }
                // Choosing next floor when moving down
                else if(this.movingDown && floor < this.currentFloor) {
                    floorDistance = this.currentFloor - floor;
                    if(floorDistance <= closestFloorDistance) {
                        closestFloorDistance = floorDistance;
                        this.nextFloor = floor;
                    }
                }
                // Choosing next floor when no queued floors are left in the current direction of travel
                else {
                    floorDistance =  Math.abs(floor - this.currentFloor);
                    if(floorDistance <= closestFloorDistance) {
                        closestFloorDistance = floorDistance;
                        this.nextFloor = floor;
                    }
                }
            }
        }
        // Stablishing moving up or moving down direction
        if(this.nextFloor > this.currentFloor) {
            this.movingUp = true;
            this.movingDown = false;
        }
        else {
            this.movingUp = false;
            this.movingDown = true;
        }
        // Checking that next floor is not beyond the scope of the elevator
        if(this.nextFloor > this.highestFloor) {
            this.nextFloor = this.highestFloor;
        }
        else if (this.nextFloor < this.lowestFloor) {
            this.nextFloor = this.lowestFloor;
        }
        // Console log of the next move
        console.log(`Elevator ${this.name} moving to floor ${this.nextFloor}`);
    }

    moveDown() {
        this.currentFloor -= 1;
    }

    moveUp() {
        this.currentFloor += 1;
    }

    stop() {
        this.openDoors();
        this.floorsQueue[this.currentFloor] = false;
    }

    notifyMalfunction() {
        this.elevatorMalfunction = true;
        this.openDoors();
        console.log(`Elevator ${this.name} has registered a malfunction on floor ${this.currentFloor}`);
    }

    // [] emergencyButton() - If elevatorMalfunction is true, this button sends the elevator to the closest floor and opens the doors
    emergencyButton() {
        if(this.elevatorMalfunction) {
            this.openDoors();
        }
    }

    resetButton() {
        if(this.doorsOpen && this.elevatorMalfunction) {
            this.elevatorMalfunction = false;
        }
    }
}



// Creating the doors class
    // The doors class has the following parameters:
        // [] doorMalfunction - If it's set to true, it triggers the notifyMalfunction() method of the corresponding elevator
        // [] doorsOpen - True if doors are open. It is set to false the moment the order to close the doors is fired
    // The doors class has the following methods:
        // [] openDoors - If doorsOpen is set to false, it commands the doors to open. It takes one second to perform the operation
        // [] closeDoors - If doorOpen is set to true, it commands the doors to close. It takes one second to perform the operation
        // [] resetMalfunction - If doorsMalfunction was set to true, then this method sets it to false and executes the open doors method

// Creating the floor class
    // The Floor class the following parameters:
        // [] floorNumber - Number of the floor
        // [] upButton (boolean) - The floor is provided with an up button
        // [] downButton (boolean) - The floor is provided with a down button
        // [] upButtonOn (boolean) - The up button is on, there is a request to go up
        // [] downButtonOn (boolean) - The down button is on, there is a request to go down
    // Methods of the Floor class:
        // [] goUpRequest 

// Creating the elevator manager
    // The elevator manager has the following functions:
        // [] Checking that elevators are ready to be used
        // [] Receiving elevator requests from floors
        // [] Choosing the closest available elevator when and elevator is requested
        // [] Keeping track of where each elevator is, and setting the currentFloor variable for each elevator as it moves
        // [] Queuing all the elevator requests
        // [] Requesting elevator B when a passenger pushes the up button in the 9th floor or makes a request from the 10 floor
        // [] Requesting elevator A when a passenger pushes the down button in the lobby or makes a request from the basement
class ElevatorManager {
    constructor(elevatorList = [], lowestFloor, highestFloor) {
        this.elevatorList = elevatorList;
        this.highestFloor = highestFloor;
        this.lowestFloor = lowestFloor;
        this.floorsQueue = {};
        for(let floor = lowestFloor; floor <= highestFloor; floor++) {
            if(floor === lowestFloor) {
                this.floorsQueue[floor] = {goingUp: false};
            }
            else if(floor === highestFloor) {
                this.floorsQueue[floor] = {goingDown: false};
            }
            else {
                this.floorsQueue[floor] = {goingUp: false, goingDown: false};
            }
        }
    }

    addElevator(elevator) {
        this.elevatorList.push(elevator);
    }

    emptyQueue() {
        let emptyQueue = true;
        for(let floor = this.lowestFloor; floor <= this.highestFloor; floor++) {
            if(this.floorsQueue[floor].goingUp || this.floorsQueue[floor].goingDown) {
                emptyQueue = false;
                break;
            }
        }
        return emptyQueue;
    }

    newElevatorRequest(floor, direction) {
        if(direction === "up" && !this.floorsQueue[floor].goingUp) {
            this.floorsQueue[floor].goingUp = true;
        }
        else if(direction === "down" && !this.floorsQueue[floor].goingDown) {
            this.floorsQueue[floor].goingDown = true;
        }
        console.log(`Processing request to move to floor ${floor}, direction ${direction}`);
        this.processQueue();
    }

    processQueue() {
        for(let floor = this.lowestFloor; floor <= this.highestFloor; floor++) {
            if(this.floorsQueue[floor].goingUp) {
                this.processRequest(floor, true, false);
            }
            if(this.floorsQueue[floor].goingDown) {
                this.processRequest(floor, false, true);
            }
        }
    }

    processRequest(floor, goingUp, goingDown) {
        let closestFloorDistance = this.highestFloor - this.lowestFloor;
        let floorDistance;
        let elevatorChoice;
        for(let elevator of this.elevatorList) {
            // When a passenger requests an elevator their request might be satisfied immediately or queued.
                // In order to send immediately an elevator to the passenger, the following must happen:
                    // There is no elevator with doors open in that floor
                    // There is an elevator available, with no target floors to go to
                // In order to queue the passenger request, the following must happen
                    // There is no elevator with doors open in that floor
                    // There are no elevators available
            // The request is only registered if there is no elevator with doors open on that floor
            if(elevator.currentFloor !== floor || !elevator.doorsOpen) {

            }

            // If the elevator has a malfunction, the loop is continued and the elevator is not considered for the request
            if(elevator.elevatorMalfunction) {
                continue;
            }

            // If the floor is not in the scope of the elevator, the loop is continued and the elevator is not considered for the request
            if(floor < elevator.lowestFloor || floor > elevator.highestFloor) {
                continue;
            }

            // If the elevator is at idle, it is considered for queueing the request
            if(elevator.emptyQueue()) {
                floorDistance = Math.abs(floor - elevator.currentFloor);
                if(floorDistance <= closestFloorDistance) {
                    closestFloorDistance = floorDistance;
                    elevatorChoice = elevator;
                }
                continue;
            }

            // If the elevator is moving in the direction of the request and the floor is on its way,
            // the elevator is considered
            if(elevator.movingUp && floor > elevator.currentFloor && goingUp || 
            elevator.movingDown && floor < elevator.currentFloor && GoingDown) {
                floorDistance = Math.abs(floor - elevator.currentFloor);
                if(floorDistance <= closestFloorDistance) {
                    closestFloorDistance = floorDistance;
                    elevatorChoice = elevator;
                }
            }
        }
        // If an elevator has been chosen, queue the floor in that elevator and delete the request from the floor queue
        if(elevatorChoice !== undefined) {
            console.log(`Choosing elevator ${elevatorChoice.name}`);
            if(elevatorChoice.queueFloor(floor)) {
                if(goingUp) {
                    this.floorsQueue[floor].goingUp = false;
                }
                else if(goingDown) {
                    this.floorsQueue[floor].goingDown = false;
                }
            }
        }
        else {
            console.log("No elevator was found :(")
        }
    }
}

// Creating the Passenger class
    // The Passenger class contains the following variables:
        // [] number - Number of the passenger
        // [] startingFloor - Floor from which they request an elevator
        // [] destinationFloor - Floor which they intend to go to
        // [] startTimestamp - Time at which they start their journey
        // [] endTimestamp - Time at which they end their journey
    // The Passenger class has the following methods:
        // [] getTotalTime - It gives the total time between startTimestamp and endTimestamp
class Passenger {
    constructor(number, startingFloor, destinationFloor, startTimestamp) {
        this.number = number;
        this.startingFloor = startingFloor;
        this.destinationFloor = destinationFloor;
        this.startTimestamp = startTimestamp;
        this.endTimestamp = undefined;
    }

    getTotalTime() {
        if(this.endTimestamp === undefined) {
            console.log(`Passenger ${this.number} hasn't started the journey yet`);
        } 
        else {
            console.log(`The total time for passenger ${this.number} was ${this.endTimestamp - this.endTimestamp} seconds`);
        }
    }
}

// Initial tests

const elevatorA = new Elevator("A", -1, 9, 0);
const elevatorB = new Elevator("B", 0, 10, 0);

const elevatorManager = new ElevatorManager([], lowestBuildingFloor, highestBuildingFloor);

elevatorManager.addElevator(elevatorA);
elevatorManager.addElevator(elevatorB);

elevatorManager.newElevatorRequest(5, "up");
elevatorB.queueFloor(7);
//elevatorB.elevatorMalfunction = true;
elevatorManager.newElevatorRequest(3, "down");
elevatorManager.newElevatorRequest(10, "down");
//elevatorB.resetButton();
elevatorManager.newElevatorRequest(9, "down");
elevatorManager.newElevatorRequest(-1, "up");
// Creating the testing manager
    // The testing manager has the following functions:
        // [] Create all 100 passengers which request elevators at random times
        // [] Send elevator requests to the elevator manager
        // [] Create random malFunction events (1 out of every 20 trips)
        // [] Call the resetButton() method when a malFunction happens
        // [] console.log the time of the passengers and also create an object which registers all the trips

// Creating the array of passengers for the test
const numberOfPassengers = 100;
const simulationTime = 180;
const passengerArray = [];
for(let passengerNumber = 0; passengerNumber < numberOfPassengers; passengerNumber++) {
    let startFloor = Math.floor((Math.random()*(highestBuildingFloor - lowestBuildingFloor + 1) - 1));
    let destFloor = Math.floor((Math.random()*(highestBuildingFloor - lowestBuildingFloor + 1) - 1));
    let startTime = Math.floor((Math.random()*(simulationTime) + 1));
    let passenger = new Passenger(passengerNumber,startFloor, destFloor, startTime);
    passengerArray.push(passenger);  
}

// Starting the test
const testStartTime = new Date();
for(passenger of passengerArray) {
    let direction;
    if(passenger.destinationFloor > passenger.startingFloor) {
        direction = "up";
    }
    else if(passenger.destinationFloor < passenger.startingFloor) {
        direction = "down";
    }
    if(passenger.destinationFloor !== passenger.startingFloor) {
        let passengerInterval = testStartTime + (passenger.startTimeStamp * 1000) - new Date();
        setTimeout(elevatorManager.newElevatorRequest, passengerInterval, passenger.destinationFloor, direction);
    }
    else {
        passenger.endTimestamp = passenger.startTimestamp;
    }
}