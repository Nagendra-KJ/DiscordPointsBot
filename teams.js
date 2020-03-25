module.exports = class Team
{
    constructor(number)
    {
        this.points=0;
        this.pounceState=false;
        this.members=[];
        this.teamSize=0;
        this.teamNumber=number;
    }
    addMember(member)
    {
        this.members.push(member);
        this.teamSize+=1;
    }
    removeMember(member)
    {
        let index = this.members.indexOf(member,1);
        if(index > -1)
        {
            this.members.splice(index,1);
            this.teamSize-=1;
        }
    }
    setPounceState(pounce)
    {
        this.pounceState = pounce;
    }
    setPoints(points)
    {
        this.points=points;
    }
    addPoints(points)
    {
        this.points+=points;
    }
    getPoints()
    {
        return this.points;
    }
    getMembers()
    {
        return this.members;
    }
    getPounceState()
    {
        return this.pounceState;
    }

    getTeamNumber()
    {
        return this.teamNumber;
    }
}

