module.exports = class User
{
    constructor(username,userNumber)
    {
        this.qm=false;
        this.teamNumber=0;
        this.name=username;
        this.number=userNumber;
    }
    setQM(state)
    {
      this.qm=state;
    }
    getQM()
    {
       return this.qm;
    }
    setTeam(number)
    {
        this.teamNumber=number;
    }
    getTeam()
    {
        return this.teamNumber;
    }
    setName(name)
    {
        this.name=name;
    }
    getName()
    {
        return this.name;
    }

    getNumber()
    {
        return this.number;
    }

    setNumber(userNumber)
    {
        this.number=userNumber;
    }
}