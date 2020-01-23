// Max lat, min lng, min, lat, max lng
const GALWAY = [53.345586, -9.202011, 53.264998, -8.909720];

function generateRandomNumInInterval(num1, num2){
    var difference;
    if(num1 < num2){
        difference = num2 - num1;
    }else{
        difference = num1 - num2;
    }
    var difference = upper - lower;
    return (Math.random() * difference) + lower;
}

