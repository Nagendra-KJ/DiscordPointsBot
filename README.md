# Discord Quiz Mod
A simple discord bot that can perform the following tasks for your discord quizzes.

 - Randomise Teams
 - Remind participants about opening and closing of pounce
 - Tabulate points for every team
 - Show top three teams and their scores
 - Clear the channel of previous messages
 
 Following are the list of commands available to control the bot.
- init
- clear
- remind
- randomise
- team
- user
- points


# Useage

## init

Once all your players are in the general text channel. Type the following command to initialise the bot. 
> $init

It is necessary to run this command again, if another player joins the general text channel at a later time and wants to take part in the quiz.

## clear

Used to clear the channel of previous text messages. It takes number of messages (<100) to clear as an argument. 
### Type the following command to clear your screen.
>$clear [number of messages to clear]

## remind

Used to remind players about opening and closing of pounce and bounce. 
- ### To remind people that pounce is open type the following command
	>$remind pounce
- ### To remind people that pounce is about to close type  the following command
	>$remind clock
- ### To remind people that pounce is closed and bounce is open type the following command
	->$remind bounce

## randomise
Used to randomise the existing players into teams. Takes the size of the team as an argument. 
### To randomise players into teams type in the following command.
>$randomise [maximum number of players in each team

## user

Used to make modifications on a player. The following operations can be performed using this command.
- List the different users by their name and user number
- Make or Unmake a certain user QM
- Add a user to a pre-existing team
- Remove user from the team

### To list the different users type in the below given command. 
>$user show

If you find certain users are missing, run  init again and verify.

### To make a certain user as QM, note down the user number given by user show and run the following command.
>$user [user number] set qm

### To remove the user as QM, run the following command.
>$user [user number] unset qm

Please note that this process is to be repeated for each new QM.

### To add a user into a pre-existing team run the following command.
>$user [user number] set team [team number]

Please note that you can add users to already pre-existing teams only.

### To remove a user from the team run the following command.
>$user [user number] unset [team number]

## team
Used to make modifications on a team. The following operations can be performed using this command.
- List already existing teams along with their members
- Create a number of new teams
- Add a new member to a team
- Remove a member from a team
- Add points to a team
- Remove points from a team
### To list the already existing teams along with their members run the following command.
>$team show

### To create a number of new teams, run the following command.
>$team create [number of teams]

### To add a new member to a team run the following command.
>$team [team number] add member [user number or user name]

#### To remove a member from a team run the following command.
>$team [team number] remove member [user number or user name]

### To add points to a team run the following command.
>$team [team number] add points [points to be added]

### To remove points from a team run the following command.
>$team [team number] remove points [points to be removed]

## points
Using this command it is possible to list the points of different teams and get the top three leading teams.

### To get the points of all teams run the following command.
>$points show

### To get the points of top three teams run the following command.
>$points podium

# Running the bot on your local machine

To run the bot on your local machine, download the repository and run the following command.
>node .

Make sure that you are in the folder of the repository and that all dependencies are downloaded.

# Dependencies

- Discordjs


 

