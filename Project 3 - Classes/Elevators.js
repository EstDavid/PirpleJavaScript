// Defining the basic parameters of the building
const lowestBuildingFloor = -1;
const highestBuildingFloor = 10;
const timeBetweenFloors = 1000; // It takes 1 second for an elevator to travel between floors
const timeToWaitAtFloor = 1500; // The elevator will wait 1.5 seconds when arriving to a floor for the passengers to get in

// Creating a pausing function for controlling the movement of the elevators
function pause(interval) {
    var intervalStart = new Date();
    while ((new Date()) - intervalStart <= interval) {
        // Do nothing
    }
}

// Creating the elevator class
class Elevator {
    constructor(name, lowestFloor, highestFloor, currentFloor) {
        this.name = name;
        this.lowestFloor = lowestFloor;
        this.highestFloor = highestFloor;
        this.doorsOpen = true;
        this.moving = false;
        this.goingUp = false;
        this.goingDown = false;
        this.elevatorMalfunction = false;
        this.currentFloor = currentFloor;
        this.nextFloor = undefined;
        this.floorsQueue = {};
        for(let floor = lowestFloor; floor <= highestFloor; floor++) {
            this.floorsQueue[floor] = false;
        }
    }
    
    // The openDoors() method checks that the doors are closed and that the elevator is not moving,
    // and then sets the doorsOpen variable to true
    openDoors() {
        if(!this.doorsOpen && !this.moving) {
            this.doorsOpen = true;
            console.log(`Elevator ${this.name} opened the doors`);
        }       
    }
    
    // The closeDoors() method checks that the doors are open and then sets the doorsOpen variable to false
    closeDoors() {
        if(this.doorsOpen) {
            console.log(`Elevator ${this.name} closed the doors`);
            this.doorsOpen = false;
        }
    }

    // emptyQueue() returns true if the queue of floors of the elevator is empty,
    // or false if there is at least one floor in the queue
    emptyQueue() {
        let emptyQueue = true;
        for(let floor = this.lowestFloor; floor <= this.highestFloor; floor++) {
            if(this.floorsQueue[floor]) {
                emptyQueue = false;
                break;
            }
        }
        if(emptyQueue) {
            this.goingUp = false;
            this.goingDown = false;
        }
        return emptyQueue;
    }

    // The queueFloor method is called by the floor buttons inside the elevator and by the ElevatorManager object
    // It queues the floor given as a parameter
    queueFloor(floor) {
        // If the elevator has a malfunction, the floor is not queued
        if(this.elevatorMalfunction) {
            return false;
        }

        // Checking that the requested floor is actually within the scope of the elevator
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
            if(this.goingUp && floor > this.currentFloor) {
                this.floorsQueue[floor] = true;
                return true;
            }
            // If the elevator is moving down and the requested floor is below the elevator, it will be added to the target list
            else if(this.goingDown && floor < this.currentFloor) {
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

    // This check is performed every time before the elevator moves to a floor
    // It makes sure that there is no malfunction, that the elevator is not moving and that the doors are closed
    checkReadyToMove() {
        if(!this.doorsOpen && !this.elevatorMalfunction && !this.moving) {
            return true;
        }
        else {
            return false;
        }
    }

    // This method is called any time a floor is added to an empty queue
    // it makes the elevator process each floor in the queue until the queue is empty
    processQueue() {
        while(!this.emptyQueue()) {
            this.chooseNextFloor();
            this.moveToNextFloor();
        }
    }
    // The chooseNextFloor() decides which to which floor in the queue the elevator will go
    // It makes the decision by choosing the closest floor in the direction of movement of the elevator
    chooseNextFloor() {
        let closestFloorDistance = this.highestFloor - this.lowestFloor;
        let floorDistance;
        for(let floor = this.lowestFloor; floor <= this.highestFloor; floor++) {
            if(this.floorsQueue[floor]) {
                // Choosing next floor when moving up
                if(this.goingUp && floor > this.currentFloor) {
                    floorDistance = floor - this.currentFloor;
                    if(floorDistance <= closestFloorDistance) {
                        closestFloorDistance = floorDistance;
                        this.nextFloor = floor;
                    }
                }
                // Choosing next floor when moving down
                else if(this.goingDown && floor < this.currentFloor) {
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
            this.goingUp = true;
            this.goingDown = false;
        }
        else {
            this.goingUp = false;
            this.goingDown = true;
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

    // Once a floor is chosen, the moveToNextFloor() method is called
    // This method makes all the necessary checks before making the move up or down, closes
    // the doors, makes the move and then opens the doors and console.logs the move 
    moveToNextFloor() {
        this.closeDoors();
        if(this.checkReadyToMove()) {
            this.moving = true;
            let startingFloor = this.currentFloor;
            // Going up
            if(this.currentFloor < this.nextFloor) {
                while(this.currentFloor < this.nextFloor) {
                    pause(timeBetweenFloors);
                    this.moveUp();
                }
            }
            // Going down
            else if(this.currentFloor > this.nextFloor) {
                while(this.currentFloor > this.nextFloor) {
                    pause(timeBetweenFloors);
                    this.moveDown();
                }
            }
            this.stop();
            console.log(`Elevator ${this.name} moved from floor ${startingFloor} to floor ${this.currentFloor}`);
        }
    }

    // moveUp() moves the elevator up one floor
    moveUp() {
        this.currentFloor += 1;
    }

    // moveDown() moves the elevator down one floor
    moveDown() {
        this.currentFloor -= 1;
    }

    // The stop() method is called every time the elevator has reached the destination floor
    // It sets the moving variable to false, opens the doors and erases the current floor from the floors queue
    stop() {
        this.moving = false;
        this.openDoors();
        this.floorsQueue[this.currentFloor] = false;
        pause(timeToWaitAtFloor);
    }

    // The notifyMalfunction method must be called by any system that presents or detects a malfunction
    // It sets the elevatorMalfunction variable to true and console.logs the malfunction, along with the name
    // of the elevator and the current floor where it's located
    notifyMalfunction() {
        this.elevatorMalfunction = true;
        console.log(`Elevator ${this.name} has registered a malfunction on floor ${this.currentFloor}`);
    }

    // If elevatorMalfunction is true, this method sends the elevator to the closest floor and opens the doors
    emergencyButton() {
        if(this.elevatorMalfunction) {
            if(this.moving) {
                if(this.goingUp) {
                    this.moveUp();
                }
                else if(this.goingDown) {
                    this.moveDown();

                }
            }
            this.stop();
        }
    }

    // This method must be called after a malfunction in the elevator has been corrected
    // It sets the elevatorMalfunction variable back to false
    resetButton() {
        if(this.doorsOpen && this.elevatorMalfunction) {
            this.elevatorMalfunction = false;
        }
    }
}

// Creating the elevator manager
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

    // addElevator(elevator) allows to add a new Elevator object to the elevatorList array
    addElevator(elevator) {
        this.elevatorList.push(elevator);
    }

    // emptyQueue() returns true if there are no elevator request in the floorsQueue array
    // Otherwise it returns false
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

    // The newElevatorRequest(floor, direction) method is called by the buttons on each floor
    // It adds the request to the floorsQueue array and calls the processQueue() method
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

    // The processQueue() method loops through all the floors and direction requests saved in the 
    // floorsQueue array and calls the processRequest() method
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

    // The processRequest(floor, goingUp, goingDown) method checks if any of the elevators can 
    // attend a request. If both are available, it picks the closest elevator
    processRequest(floor, goingUp, goingDown) {
        let closestFloorDistance = this.highestFloor - this.lowestFloor;
        let floorDistance;
        let elevatorChoice;
        for(let elevator of this.elevatorList) {
            // First it is checked if there is an elevator available, with the doors open at the floor of the request
            if(elevator.currentFloor === floor && elevator.doorsOpen && !elevator.elevatorMalfunction) {
                // If there is an elevator available, then it is checked if its direction of movement 
                // is compatible with the direction of the request
                if(goingUp && elevator.goingUp || goingDown && elevator.goingDown || !elevator.goingUp && !elevator.goingDown) {
                    // If this last condition is met, it means that the passenger can get into the elevator directly, and so
                    // the request is deleted from the queue
                    if(goingUp) {
                        this.floorsQueue[floor].goingUp = false;
                    }
                    else if(goingDown) {
                        this.floorsQueue[floor].goingDown = false;
                    }
                    // break out of the for loop
                    break;
                }
            }

            // If the elevator has a malfunction, the loop is continued and the elevator is not considered for the request
            if(elevator.elevatorMalfunction) {
                continue;
            }

            // If the floor is not in the scope of the elevator, the loop is continued and the elevator is not considered for the request
            if(floor < elevator.lowestFloor || floor > elevator.highestFloor) {
                continue;
            }

            // If the elevator is available, it is considered for queueing the request
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
            if(elevator.goingUp && floor > elevator.currentFloor && goingUp || 
            elevator.goingDown && floor < elevator.currentFloor && GoingDown) {
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
            console.log("No elevator was found, or it was immediately available for the passenger to get in");
        }
    }

    // The checkElevatorStatus() console.logs the status of all the elevators in the building
    // and returns an object with the most relevant information
    checkElevatorsStatus() {
        let status = []
        for(let elevator of this.elevatorList) {
            let elevatorStatus = {
                name: elevator.name,
                malfunction: elevator.malfunction,
                doorsOpen: elevator.doorsOpen,
                currentFloor: elevator.currentFloor,
            }
            status.push(elevatorStatus);
            console.log(`Elevator ${elevator.name} is on floor ${elevator.currentFloor} ` +
            `with the doors ${elevator.doorsOpen ? 'open' : 'closed'} and ` +
            `${elevator.elevatorMalfunction ? 'has a malfunction' : 'is working properly'}`);            
        }
        return status;
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
//elevatorB.notifyMalfunction();
elevatorManager.newElevatorRequest(3, "down");
elevatorA.queueFloor(4);
elevatorManager.newElevatorRequest(10, "down");
//elevatorB.resetButton();
elevatorManager.newElevatorRequest(9, "down");
elevatorManager.newElevatorRequest(-1, "up");
elevatorManager.checkElevatorsStatus();