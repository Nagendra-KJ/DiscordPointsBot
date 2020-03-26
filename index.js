const Discord = require('discord.js');
const bot = new Discord.Client();

const Teams = require('./teams');

const Users = require('./users');

const token = "NjkyMzk3MzQxMTA1NDU1MTM1.XnuASg.i7PzwypQp6hzNFQoUbwJ8ilNm0k";

const ARGS_ERR ="I need more arguments.";

const PREFIX = "$";

var playerNames = [];

var teamSize;

var numPlayers;

var teamList = [];

var userList=[];

var index;

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
        case "init":
            init(msg);
        break;
        case "clear":
            if(!args[1])
            {
                sendError(msg,ARGS_ERR);
            }
            else
            {
                msg.channel.bulkDelete(args[1]);
            }
            break;
        case "remind":
            if(!args[1])
            {
                sendError(msg,ARGS_ERR);
            }
            else
            {
                switch(args[1])
                {
                    case "pounce":
                        startPounce(msg);
                        break;
                    case "bounce":
                        startBounce(msg);
                        break;
                    case "clock":
                        msg.channel.send("Pounce closing in 5.");
                        break;
                    default:
                        sendError(msg,"Those are invalid arguments.");
                }
            }
            break;
        case "randomise":
            if(!args[1])
            {
                sendError(msg,ARGS_ERR);
                return;
            }
            randomise(msg,args[1]);
            break;
        case "team":
            if(!args[1])
            {
                sendError(msg,ARGS_ERR);
                return;
            }
            if(args[1]=="show")
            {
                showTeam(msg);
                return;
            }
            if(!args[2])
            {
                sendError(msg,"I need more arguments");
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
                sendError(msg,ARGS_ERR);
                return;
            }
            if(parseInt(args[1])>teamList.length)
            {
                sendError(msg,"That doesn't exist.");
                return;
            }
            index = parseInt(args[1])-1;
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
                        msg.channel.send(members+" are the members of team "+(index+1));
                    }
                    else
                    {
                        sendError(msg);
                    }
                break;
                case "add":
                    if(!args[4])
                    {
                        sendError(msg,ARGS_ERR);
                        return;
                    }
                    if(args[3] == "points")
                        teamList[index].addPoints(parseInt(args[4]));
                    else if(args[3] == "member")
                    {
                        let pos = userExists(args[4]);
                        if(pos>-1 && userList[pos].getTeam()==0 && !userList[pos].getQM())
                        {
                            teamList[index].addMember(userList[pos].getName());
                            userList[pos].setTeam(index+1);
                        }
                        else
                        {
                            sendError(msg,"That user cannot be in that team.");
                        }
                    }
                    else
                        sendError(msg);
                break;
                case "remove":
                    if(!args[4])
                    {
                        sendError(msg,ARGS_ERR);
                        return;
                    }
                    if(args[3] == "points")
                        teamList[index].addPOints(parseInt(args[4]*-1));
                    else if(args[3] == "member")
                    {
                        let pos = userExists(args[4]);
                        if(pos>-1)
                        {
                            if(teamList[index].members.indexOf(userList[pos].getName(),0)>-1)
                            {
                                userList[index].setTeam(0);
                                teamList[index].removeMember(userList[pos].getName());
                            }
                            else
                            {
                                sendError(msg,"That user cannot me removed from that team.");
                            }
                        }
                        else
                            sendError(msg,"That user doesn't exist");
                    }
                    else
                        sendError(msg);
                break;
                default:
                    sendError(msg);
            }
            break;
        case "user":
            if(!args[1])
            {
                sendError(msg,ARGS_ERR);
                return;
            }
            if(args[1]=="show")
            {
                list(msg);
                return;
            }
            if(!args[2] || !args[3])
            {
                sendError(msg,"I need more arguments");
                return;
            }
            index = parseInt(args[1])-1;
            if(args[2] == "set")
            {
                if(args[3] == "qm")
                {
                    if(userList[index].getTeam() == 0)
                    {
                        userList[index].setQM(true);
                        console.log(userList[index].getTeam());
                    }
                    else
                        sendError(msg,"A QM cannot take part in the quiz. Please remove user from team "+userList[index].getTeam()+" before continuing.");
                    return;
                }
                else if(args[3] == "team")
                {
                    if(!args[4])
                    {
                        sendError(msg,ARGS_ERR);
                        return;
                    }
                    let teamNumber = parseInt(args[4])-1;
                    if(teamNumber>teamList.length)
                    {
                        sendError(msg,"That doesn't exist.");
                        return;
                    }
                    if(userList[index].getTeam == 0)
                    {
                        userList[index].setTeam(teamNumber+1);
                        teamList[teamNumber].addMember(userList[index].getName());
                    }
                    else
                    {
                        sendError(msg,"That user cannot be in that team.");
                    }
                }
            }
            else if(args[2] == "unset")
            {
                if(args[3] == "qm")
                {
                    userList[index].setQM(false);
                    return;
                }
                else if(args[3] == "team")
                {
                    if(!args[4])
                    {
                        sendError(msg,ARGS_ERR);
                        return;
                    }
                    let teamNumber = parseInt(args[4])-1;
                    if(teamNumber>teamList.length)
                    {
                        sendError(msg,"That doesn't exist.");
                        return;
                    }
                    if(teamList[teamNumber].members.indexOf(userList[index].getName(),0)>-1)
                    {
                        userList[index].setTeam(0);
                        teamList[teamNumber].removeMember(userList[index].getName());
                    }
                    else
                    {
                        sendError(msg,"That user cannot me removed from that team.");
                    }
                }
            }
            else
                sendError(msg);
        break;
        case "points":
            if(!args[1])
                sendError(msg,ARGS_ERR);
            else if(args[1]=="show")
                showPoints(msg);
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
    playerNames=[];
    teamList = [];
    teamSize = parseInt(size);
    var teamString="";
    msg.channel.send("Randomising into teams of "+teamSize);
    userList.forEach(user => {
         if(!user.getQM())
            playerNames.push(user.getName());
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
            let results = userList.filter(user => {
                return user.getName()==playerNames[pos+j];
            });
            results[0].setTeam(i+1);

        }
        teamList.push(Team);
   }
   showTeam(msg);
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

function showPoints(msg)
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
    if(copy.length>0)
    {
        podium = "First Place: Team " + copy[0].getTeamNumber()+" with "+ copy[0].getPoints() +" points\n";
        if(copy.length>1)
            podium += "Second Place: Team " + copy[1].getTeamNumber()+" with "+ copy[1].getPoints() +" points\n";
        if(copy.length>2)
            podium += "Third Place: Team " + copy[2].getTeamNumber()+" with "+ copy[2].getPoints() +" points";
    }
    else
        podium="No players are ready yet";
    msg.channel.send(podium);
}

function showTeam(msg)
{
    teamInfo="";
    teamList.forEach((team,i)=>{
        if(teamInfo!="")
            teamInfo+="\n";
        teamInfo+="Team "+(i+1)+": "+team.getMembers().toString();
    });
    msg.channel.send(teamInfo);
}

function init(msg)
{
    userList=[];
    teamList=[];
    let i=1;
    msg.guild.members.fetch().then(map=>{
        var vals= map.values();
       for(val of vals)
       {
            if(!val.user.bot && val.user.presence.status =="online")
            {
                userList.push(new Users(val.user.username,i));
                ++i;
            }
       }
    });
}

function list(msg)
{
    users="";
    userList.forEach((user,i)=>
    {
        if(i!=0)
            users+="\n";
        users+=user.getName()+" -number: "+user.getNumber();
    });
    msg.channel.send(users);
}

function userExists(key)
{
  var results= userList.filter(user => {
        return (user.getName() == key || user.getNumber() == key)
    });
    if(results.length!=1)
        return -1;
    return results[0].getNumber()-1;
}