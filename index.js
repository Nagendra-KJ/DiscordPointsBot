const Discord = require('discord.js');
const bot = new Discord.Client();

const Teams = require('./teams');

const token = "NjkyMzk3MzQxMTA1NDU1MTM1.XnuASg.i7PzwypQp6hzNFQoUbwJ8ilNm0k";

const PREFIX = "$";

var playerNames = [];

var teamSize;

var numPlayers;

var teamList = [];

bot.login(token);

bot.on('ready', ()=>{
    console.log("Scoreboarder is on!");
});

bot.on('message' ,(msg)=>{
    if(!msg.content.startsWith(PREFIX))
        return;

    let args = msg.content.substring(PREFIX.length).split(" ");
    switch(args[0])
    {
        case "Clear":
            if(!args[1])
            {
                sendError(msg,"I need more arguments.");
            }
            else
            {
                msg.channel.bulkDelete(args[1]);
            }
            break;
        case "Start":
            if(!args[1])
            {
                sendError(msg,"I need more arguments.");
            }
            else
            {
                switch(args[1])
                {
                    case "Pounce":
                        startPounce(msg);
                        break;
                    case "Bounce":
                        startBounce(msg);
                        break;
                    default:
                        sendError(msg,"Those are invalid arguments.");
                }
            }
            break;
        case "Randomise":
            if(!args[1])
            {
                sendError(msg,"I need more arguments.");
                return;
            }
            randomise(msg,args[1]);
            break;
        case "Team":
            if(!args[1] || !args[2])
            {
                sendError(msg,"I need more arguments.");
                return;
            }
            if(args[1]=="create")
            {
                for(let i=0;i<parseInt(args[2]);++i)
                    teamList.push(new Teams(i+1));
                return;
            }
            if(!args[3])
            {
                sendError(msg,"I need more arguments.");
                return;
            }
            if(parseInt(args[1])>teamList.length)
            {
                sendError(msg,"That doesn't exist.");
                return;
            }
            let index = parseInt(args[1])-1;
            switch(args[2])
            {
                case "get":
                    if(args[3] == "points")
                        msg.channel.send("Team "+(index+1)+" has "+teamList[index].getPoints()+" points.");
                    else if(args[3] == "members")
                    {
                        members="";
                        teamList[index].getMembers().forEach(member=>{
                            members=members+member+" ";
                        });
                        msg.channel.send(members+" are the memebers of team "+(index+1));
                    }
                    else
                    {
                        sendError(msg);
                    }
                break;
                case "add":
                    if(!args[4])
                    {
                        sendError(msg,"I need more arguments.");
                        return;
                    }
                    if(args[3] == "points")
                        teamList[index].addPoints(parseInt(args[4]));
                    else if(args[3] == "member")
                        teamList[index].addMember(args[4]);
                    else
                        sendError(msg);
                break;
                case "remove":
                    if(!args[4])
                    {
                        sendError(msg,"I need more arguments.");
                        return;
                    }
                    if(args[3] == "points")
                        teamList[index].addPOints(parseInt(args[4]*-1));
                    else if(args[3] == "member")
                        teamList[index].removeMembers(args[4]);
                    else
                        sendError(msg);
                break;
                default:
                    sendError(msg);
            }
            break;
        case "Points":
            if(!args[1])
                sendPoints(msg);
            else if(args[1]=="podium")
                sendPodium(msg);
            else
                sendError(msg);
        break;
        default:
            sendError(msg);
    }
});

function sendError(msg,err)
{
    if(!err)
        err="";
    msg.channel.send("I'm sorry Dave, I can't let you do that. "+err);
}

function startPounce(msg)
{
    msg.channel.send("Pounce is open. Plese discuss on your respective channels.");
}

function startBounce(msg)
{
    msg.channel.send("Pounce is closed. Please come to general channel to start bounce.");
}

function randomise(msg,size)
{
    playerNames = [];
    teamList = [];
    teamSize = parseInt(size);
    var teamString="";
    msg.channel.send("Randomising into teams of "+teamSize);
    bot.users.cache.forEach(user => {
        // if(!user.bot)
            playerNames.push(user.username);
    });
   numPlayers  = playerNames.length;
   playerNames = shuffle(playerNames);
   for(let i=0; i < Math.ceil(numPlayers/teamSize); i+=teamSize)
   {
        teamString="";
        let pos = (i*teamSize);
        var Team = new Teams(i+1);
        for(let j=0;j+pos<numPlayers && j < teamSize ;++j)
        {
            Team.addMember(playerNames[pos+j]);
        }
        teamList.push(Team);
   }
}

function shuffle(arr)
{
    let newPos,temp;
    for(let i = arr.length -1; i > 0; --i)
    {
        newPos = Math.floor(Math.random() * (i+1));
        temp = arr[i];
        arr[i] = arr[newPos];
        arr[newPos] = temp;
    }
    return arr;
}

function sendPoints(msg)
{
    let pointsTable="";
    teamList.forEach((team,i)=>{
        if(pointsTable!="")
            pointsTable+="\n";
        pointsTable+="Team "+team.getTeamNumber()+" has "+team.getPoints()+" points.";
    });
    msg.channel.send(pointsTable);
}

function sendPodium(msg)
{
    copy = [];
    teamList.forEach(team => {
        copy.push(team);
    })
    copy.sort((team1,team2)=>{
        return parseInt(team2.getPoints()) - parseInt(team1.getPoints());
    });

    let podium = "" ;
    podium = "First Place: Team " + copy[0].getTeamNumber()+" with "+ copy[0].getPoints() +" points\n";
    podium += "Second Place: Team " + copy[1].getTeamNumber()+" with "+ copy[1].getPoints() +" points\n";
    podium += "Third Place: Team " + copy[2].getTeamNumber()+" with "+ copy[2].getPoints() +" points";
    msg.channel.send(podium);
}